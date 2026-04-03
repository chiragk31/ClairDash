from fastapi import APIRouter, HTTPException, status,Query
from typing import Optional
from app.models.complaint import ComplaintIngest, ComplaintResponse
from app.services.complaint_service import ingest_complaint
from app.core.database import supabase
router = APIRouter()


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