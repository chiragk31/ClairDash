from datetime import datetime, timezone, timedelta
from app.core.database import supabase
from app.models.complaint import ComplaintIngest, AIAnalysisResult, ComplaintResponse
from app.utils.text_cleaner import clean_email_body, is_auto_reply
from app.services.gemini_service import analyze_complaint
from app.services.embedding_service import (
    generate_embedding,
    store_embedding,
    find_similar_complaints,
    store_duplicate_links
)


# SLA deadlines based on severity
# How many hours before a complaint must be resolved
SLA_HOURS = {
    "critical": 4,
    "high":     24,
    "medium":   48,
    "low":      72
}


def calculate_sla_deadline(severity: str) -> datetime:
    """
    Returns the SLA deadline timestamp based on severity.
    """
    hours = SLA_HOURS.get(severity, 48)
    return datetime.now(timezone.utc) + timedelta(hours=hours)


def ingest_complaint(data: ComplaintIngest) -> ComplaintResponse:
    """
    Main orchestrator function.
    Called by the route when n8n posts a new email.

    Flow:
    1. Check if auto-reply → skip if yes
    2. Clean email body
    3. Analyze with Gemini
    4. Calculate SLA deadline
    5. Save complaint to Supabase
    6. Generate and store embedding
    7. Find similar/duplicate complaints
    8. Store duplicate links
    9. Return response to n8n
    """

    # -------------------------
    # Step 1 — Auto reply check
    # -------------------------
    if is_auto_reply(data.subject, data.body):
        print(f"[ComplaintService] Skipping auto-reply from {data.email_id}")
        return ComplaintResponse(
            success=True,
            complaint_id="skipped",
            message="Auto-reply detected — skipped processing",
            severity="low",
            sla_deadline=datetime.now(timezone.utc)
        )

    # -------------------------
    # Step 2 — Clean email body
    # -------------------------
    cleaned_body = clean_email_body(data.body)

    # If cleaning strips everything, fall back to original body
    if not cleaned_body.strip():
        cleaned_body = data.body

    # -------------------------
    # Step 3 — Gemini AI analysis
    # -------------------------
    ai_result: AIAnalysisResult = analyze_complaint(
        cleaned_body=cleaned_body,
        subject=data.subject
    )

    # -------------------------
    # Step 4 — Calculate SLA
    # -------------------------
    sla_deadline = calculate_sla_deadline(ai_result.severity)

    # -------------------------
    # Step 5 — Save to Supabase
    # -------------------------
    complaint_row = {
        "email_id":      data.email_id,
        "subject":       data.subject,
        "body":          data.body,
        "cleaned_body":  cleaned_body,
        "category":      ai_result.category,
        "severity":      ai_result.severity,
        "sentiment":     ai_result.sentiment,
        "key_issues":    ai_result.key_issues,
        "draft_response": ai_result.draft_response,
        "status":        "open",
        "sla_deadline":  sla_deadline.isoformat(),
        "channel":       "email",
    }

    try:
        db_response = supabase.table("complaints").insert(complaint_row).execute()
        complaint_id = db_response.data[0]["id"]
        print(f"[ComplaintService] Saved complaint {complaint_id}")

    except Exception as e:
        print(f"[ComplaintService] Failed to save complaint: {e}")
        raise RuntimeError(f"Database insert failed: {e}")

    # -------------------------
    # Step 6 — Generate & store embedding
    # -------------------------
    try:
        embedding = generate_embedding(cleaned_body)

        if embedding:
            store_embedding(complaint_id, embedding)
            print(f"[ComplaintService] Stored embedding for {complaint_id}")

            # ---------------------
            # Step 7 — Find similar
            # ---------------------
            similar = find_similar_complaints(
                embedding=embedding,
                current_complaint_id=complaint_id
            )

            # ---------------------
            # Step 8 — Store links
            # ---------------------
            if similar:
                store_duplicate_links(complaint_id, similar)
                print(f"[ComplaintService] Found {len(similar)} similar complaints")

    except Exception as e:
        # Embedding failure should NEVER stop the complaint from being saved
        # Complaint is already in DB at this point — just log and continue
        print(f"[ComplaintService] Embedding step failed (non-critical): {e}")

    # -------------------------
    # Step 9 — Return response
    # -------------------------
    return ComplaintResponse(
        success=True,
        complaint_id=str(complaint_id),
        message="Complaint received and processed successfully",
        severity=ai_result.severity,
        sla_deadline=sla_deadline
    )