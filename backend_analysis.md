# Backend Architecture Analysis

Based on the analysis of the backend codebase, here is the breakdown of the database tables and active API routes:

## 🗄️ Database Tables
Looking at the models in `backend/app/models/complaint.py`, there is one primary table in the Supabase database defined by the `ComplaintRecord` model. It stores the full complaint details.

### 1. Complaints Table (Implied by `ComplaintRecord`)
This table contains the following fields:
- `id` (String/UUID) - Unique identifier
- `email_id` (String) - Sender's email address
- `subject` (String) - The email's subject
- `body` (String) - Raw email body text
- `cleaned_body` (String) - Cleaned version of the email body provided by AI
- `category` (String) - Generated categorization
- `severity` (String) - Generated severity level (e.g., low / medium / high / critical)
- `sentiment` (String) - Generated sentiment analysis (e.g., positive / neutral / negative / angry)
- `key_issues` (String) - A summary of the key issues
- `status` (String) - Action status (Defaults to "open")
- `sla_deadline` (Datetime) - The deadline timestamp based on the severity
- `channel` (String) - Origin channel (Defaults to "email")
- `assigned_to` (String) - Who the ticket is assigned to
- `created_at` (Datetime) - Record creation timestamp

---

## 🌐 Active Routes
Based on the routing configuration in `backend/app/main.py` and `backend/app/api/v1/routes/complaints.py`, here are the active endpoints:

### 1. Root Health Check
- **Method:** `GET`
- **Route:** `/`
- **Role:** Checks if the parent FastAPI application is running successfully.
- **Data Action:** Takes no input. Returns a simple JSON response containing the status, app name, and environment details.

### 2. Complaints Service Health Check
- **Method:** `GET`
- **Route:** `/api/v1/complaints/health`
- **Role:** Specifically verifies that the complaints service module is up and running.
- **Data Action:** Takes no input. Returns a simple dictionary indicating the complaint service is "ok".

### 3. Ingest Complaint
- **Method:** `POST`
- **Route:** `/api/v1/complaints/ingest`
- **Role:** Central ingest webhook. Receives new email data (usually sent by the n8n workflow), routes it to the AI for analysis (severity, sentiment, cleaning), and stores the resulting structured data into the Supabase database.
- **Data Action (Input):** Expects a JSON payload containing the sender's data:
  - `email_id`: The sender's email address (String)
  - `subject`: The email subject line (String)
  - `body`: The raw email body text (String)
- **Data Action (Output):** Returns a JSON confirmation to the caller (n8n) containing:
  - `success`: Boolean indicating if ingestion worked
  - `complaint_id`: The UUID of the newly stored complaint
  - `message`: Confirmation message
  - `severity`: AI-determined severity scale
  - `sla_deadline`: Automatically calculated deadline timestamp based on severity
