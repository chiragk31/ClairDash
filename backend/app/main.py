from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.routes.complaints import router as complaints_router
from app.core.config import settings

# -------------------------
# App Instance
# -------------------------
app = FastAPI(
    title="Complaint Dashboard API",
    description="Unified Customer Complaint Communication Dashboard powered by Gen-AI",
    version="1.0.0",
    docs_url="/docs",         # Swagger UI at http://127.0.0.1:8000/docs
    redoc_url="/redoc"        # ReDoc UI at http://127.0.0.1:8000/redoc
)

# -------------------------
# CORS Middleware
# Allows React dashboard to talk to this API later
# -------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # Tighten this when going to production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# -------------------------
# Routers
# -------------------------
app.include_router(
    complaints_router,
    prefix="/api/v1/complaints",
    tags=["Complaints"]
)

# -------------------------
# Root health check
# -------------------------
@app.get("/", tags=["Health"])
def root():
    return {
        "status": "ok",
        "app": "Complaint Dashboard API",
        "version": "1.0.0",
        "environment": settings.APP_ENV,
        "docs": "/docs"
    }