import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.app.api.endpoints import router as api_router
from backend.app.db.database import db_store
from backend.app.seed_data import seed_database

app = FastAPI(
    title="Multimedia Disaster Damage Assessment & Emergency Prioritization API",
    description="Multimodal Evidence Fusion and Disaster Priority Intelligence Engine",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving for uploads
UPLOADS_DIR = os.path.join(os.path.dirname(__file__), "..", "static", "uploads")
os.makedirs(UPLOADS_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

app.include_router(api_router, prefix="/api")

@app.on_event("startup")
def startup_event():
    if not db_store.reports:
        print("Empty database detected. Seeding sample disaster incidents...")
        seed_database()

@app.get("/")
def root():
    return {
        "status": "online",
        "system": "Multimedia Disaster Assessment & Emergency Prioritization API",
        "documentation": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
