from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# What n8n sends TO your API
class ComplaintIngest(BaseModel):
    email_id: str
    subject: str
    body: str

# What Gemini returns after analysis
class AIAnalysisResult(BaseModel):
    category: str
    severity: str        # low / medium / high / critical
    sentiment: str       # positive / neutral / negative / angry
    key_issues: str
    draft_response: str
    cleaned_body: str

# Full complaint as stored in Supabase
class ComplaintRecord(BaseModel):
    id: Optional[str] = None
    email_id: str
    subject: str
    body: str
    cleaned_body: Optional[str] = None
    category: Optional[str] = None
    severity: Optional[str] = None
    sentiment: Optional[str] = None
    key_issues: Optional[str] = None
    status: str = "open"
    sla_deadline: Optional[datetime] = None
    channel: str = "email"
    assigned_to: Optional[str] = None
    created_at: Optional[datetime] = None

# What your API sends back to n8n after processing
class ComplaintResponse(BaseModel):
    success: bool
    complaint_id: str
    message: str
    severity: str
    sla_deadline: datetime