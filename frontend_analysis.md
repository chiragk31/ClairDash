# Frontend Architecture Analysis

Based on the analysis of the frontend codebase in `e:\Master\ClairDash\frontend` (ignoring the legacy `.html` files), here is the breakdown of your application's architecture, folder structure, and active pages:

## 💻 Tech Stack & Configuration
The frontend is a modern React application utilizing the latest tools:
- **Framework:** Next.js 16 utilizing the App Router (`app/` directory).
- **Core Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (configured with PostCSS)
- **Data Visualization:** `recharts` for rendering analytics dashboards.

---

## 📂 Folder Structure
The source code separates routing logic from UI components to keep the structure clean:

### `app/(dashboard)/`
This is your main routing directory. It utilizes Route Groups `(dashboard)` to share a common dashboard layout without affecting the URL path.
- **`/` (Root):** Handled by `app/(dashboard)/page.tsx`. This serves as the main overview page of your customer operations dashboard.
- **`/analytics`:** Handled by `app/(dashboard)/analytics/page.tsx`. This view is dedicated to data visualizations and statistics (using Recharts).
- **`/complaints`:** Handled by `app/(dashboard)/complaints/page.tsx`. Displays the inbox-style list of all incoming customer complaints with pagination and filtering. 
- **`/complaints/[id]`:** Handled by `app/(dashboard)/complaints/[id]/page.tsx`. A dynamic route that shows the detailed view of a specific complaint (e.g., `#CD-9281`) including AI analysis, sender details, and resolution actions.

### `components/`
Contains modular, reusable UI components categorized by feature:
- `analytics/`: Components specific to charts and data widgets.
- `complaint/`: Components for rendering individual complaint details or timelines.
- `dashboard/`: Shared components for the main views like `FilterBar`, `ComplaintTable`, and `Pagination`.
- `layout/`: Foundational structural components (e.g., Sidebar, Header).
- `ui/`: Generic reusable interactive elements (e.g., `FloatingActionButton`).

---

## 🔌 Data State: Mock Data Locations & Backend Requirements
The application currently relies heavily on hardcoded UI Mock Data. To fully integrate this with your FastAPI/Supabase backend, the following endpoints and data queries need to be developed:

### 1. Dashboard Overview (`app/(dashboard)/page.tsx`)
- **Mock Data Found:**
  - `STAT_CARDS`: Static array defining Total Complaints, Open Tickets, Resolved Today, and SLA Breached metrics.
  - `MOCK_TICKETS`: Array of basic ticket details (subject, sentiment, status).
- **Backend Requirement:** 
  - An endpoint like `GET /api/v1/metrics/summary` returning calculated counts from the `ComplaintsRecord` table.
  - An endpoint like `GET /api/v1/complaints/recent` returning the 5-10 most recent complaints to display in the table preview.

### 2. Complaints List (`app/(dashboard)/complaints/page.tsx`)
- **Mock Data Found:** 
  - `MOCK_TICKETS`: Static array representing the inbox lines (id, senderEmail, subject, category, severity, sentiment, etc).
- **Backend Requirement:**
  - An endpoint like `GET /api/v1/complaints` supporting query parameters for pagination (`?page=1&size=15`) and filtering (e.g., `?status=open`). It should return the `ComplaintRecord` columns mapped to the frontend's ticket scheme.

### 3. Complaint Details (`app/(dashboard)/complaints/[id]/page.tsx`)
- **Mock Data Found:**
  - `MOCK_COMPLAINT`: An extremely detailed object encompassing the `originalMessage`, the `aiDraft` response, AI metrics (`category`, `keyIssues`), `sla` timestamps, available `agents`, and `similarCases`.
  - `MOCK_THREAD`: An array of messages between the agent and customer.
- **Backend Requirement:**
  - An endpoint like `GET /api/v1/complaints/{id}` returning the specified row from the `ComplaintRecord` table and formatting it exactly how the UI expects (merging AI results and SLAs).
  - An endpoint returning the interaction history/thread for that complaint.
  - An endpoint `GET /api/v1/complaints/{id}/similar` utilizing semantic search or category matching to return similar past tickets.

### 4. Analytics Data (`components/analytics/analyticsData.ts`)
- **Mock Data Found:**
  - `SUMMARY_STATS`: High-level metrics for resolution time and CSAT.
  - `complaintVolumeData`: Timeseries data array mapping dates to ticket counts.
  - `categoryData` / `severityData` / `sentimentData`: Segmented percent/count data specifically formatting for Recharts (Pie/Bar graphs).
  - `topIssuesData`: Arrays for a table list detailing issue names and trending percentages.
  - `heatmapData`: A 2D array matrix simulating load times over weekdays.
- **Backend Requirement:**
  - A dedicated analytics endpoint or a series of endpoints like `GET /api/v1/analytics/charts`. The backend must group and aggregate the data. For example, it needs to query Supabase applying a `GROUP BY date(created_at)` for volume charts, or `GROUP BY category` for the donut chart. It should ideally return data already shaped for the charts (e.g. `[{ name: "Billing", value: 42 }]`).
