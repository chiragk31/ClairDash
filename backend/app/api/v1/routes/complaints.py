from fastapi import APIRouter, HTTPException, status,Query
from typing import Optional
from app.models.complaint import ComplaintIngest, ComplaintResponse
from app.services.complaint_service import ingest_complaint
from app.core.database import supabase
router = APIRouter()



@router.get(
    "/health",
    summary="Health check for complaint service"
)
def health_check():
    """
    Simple health check endpoint.
    Use this to verify the complaint service is running.
    """
    return {
        "status": "ok",
        "service": "complaints"
    }
@router.post(
    "/ingest",
    response_model=ComplaintResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Ingest a new complaint from n8n",
    description="Receives email data from n8n, processes it through AI, and stores in Supabase"
)
def ingest_complaint_route(payload: ComplaintIngest):
    """
    Called by n8n HTTP node whenever a new email arrives.

    Expects:
    - email_id: sender's email address
    - subject: email subject line
    - body: raw email body text

    Returns:
    - complaint_id: UUID of saved complaint
    - severity: AI determined severity
    - sla_deadline: deadline timestamp based on severity
    """
    try:
        result = ingest_complaint(payload)
        return result

    except RuntimeError as e:
        # Database failures — return 500
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

    except Exception as e:
        # Unexpected failures
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error during complaint ingestion: {str(e)}"
        )




@router.get("/")
def get_all_complaints(
    status: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    sentiment: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, le=100)
):
    """
    Returns paginated list of complaints with optional filters.
    Used by /complaints page in Next.js
    """
    try:
        query = supabase.table("complaints").select("*")

        # Apply filters if provided
        if status:
            query = query.eq("status", status)
        if category:
            query = query.eq("category", category)
        if severity:
            query = query.eq("severity", severity)
        if sentiment:
            query = query.eq("sentiment", sentiment)

        if search:
            import re
            clean_search = search.lstrip("#").strip()

            # UUID pattern check
            uuid_pattern = re.compile(
                r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
                re.IGNORECASE
            )

            if uuid_pattern.match(clean_search):
                # Valid UUID → search id + subject + email
                query = query.or_(
                    f"subject.ilike.%{clean_search}%,"
                    f"email_id.ilike.%{clean_search}%,"
                    f"id.eq.{clean_search}"
                )
            else:
                # Partial search → subject + email only
                query = query.or_(
                    f"subject.ilike.%{clean_search}%,"
                    f"email_id.ilike.%{clean_search}%"
                )

        # Pagination
        offset = (page - 1) * limit
        query = query.order("created_at", desc=True).range(offset, offset + limit - 1)

        response = query.execute()

        # Get total count
        count_response = supabase.table("complaints").select("id", count="exact").execute()

        return {
            "data": response.data,
            "total": count_response.count,
            "page": page,
            "limit": limit,
            "total_pages": -(-count_response.count // limit)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@router.get("/stats")
def get_complaint_stats():
    """
    Returns KPI numbers for dashboard cards.
    Total, open, resolved today, SLA breached.
    """
    try:
        from datetime import datetime, timezone

        total = supabase.table("complaints").select("id", count="exact").execute()
        open_count = supabase.table("complaints").select("id", count="exact").eq("status", "open").execute()
        resolved = supabase.table("complaints").select("id", count="exact").eq("status", "resolved").execute()
        breached = supabase.table("complaints").select("id", count="exact").lt(
            "sla_deadline", datetime.now(timezone.utc).isoformat()
        ).neq("status", "resolved").execute()

        return {
            "total": total.count,
            "open": open_count.count,
            "resolved": resolved.count,
            "sla_breached": breached.count
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@router.get("/analytics/summary")
def get_analytics():
    """
    Returns data for all analytics charts.
    Used by /analytics page in Next.js.
    """
    try:
        all_complaints = supabase.table("complaints").select(
            "category, severity, sentiment, status, created_at, sla_deadline"
        ).execute()

        data = all_complaints.data or []

        # Category breakdown
        category_counts = {}
        severity_counts = {"low": 0, "medium": 0, "high": 0, "critical": 0}
        sentiment_counts = {"positive": 0, "neutral": 0, "negative": 0, "angry": 0}

        for c in data:
            cat = c.get("category", "general")
            category_counts[cat] = category_counts.get(cat, 0) + 1

            sev = c.get("severity", "medium")
            if sev in severity_counts:
                severity_counts[sev] += 1

            sent = c.get("sentiment", "neutral")
            if sent in sentiment_counts:
                sentiment_counts[sent] += 1

        return {
            "category_breakdown": category_counts,
            "severity_distribution": severity_counts,
            "sentiment_analysis": sentiment_counts,
            "total": len(data)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




@router.get("/{complaint_id}")
def get_complaint_by_id(complaint_id: str):
    """
    Returns single complaint with full details.
    Used by /complaints/[id] page in Next.js
    """
    try:
        response = supabase.table("complaints").select("*").eq("id", complaint_id).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Complaint not found")

        complaint = response.data[0]

        # Fetch similar/duplicate complaints
        duplicates = supabase.table("duplicate_links").select(
            "related_complaint_id, similarity_score"
        ).eq("complaint_id", complaint_id).execute()

        complaint["similar_complaints"] = duplicates.data or []

        return complaint

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/{complaint_id}")
def update_complaint(complaint_id: str, updates: dict):
    """
    Updates complaint status, assigned_to, etc.
    Called when agent changes status or assigns complaint.
    """
    try:
        allowed_fields = ["status", "assigned_to", "category", "severity"]
        filtered = {k: v for k, v in updates.items() if k in allowed_fields}

        if not filtered:
            raise HTTPException(status_code=400, detail="No valid fields to update")

        response = supabase.table("complaints").update(filtered).eq("id", complaint_id).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Complaint not found")

        return {"success": True, "data": response.data[0]}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

