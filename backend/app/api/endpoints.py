import os
import uuid
from typing import List, Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from backend.app.models.schema import Report, Assessment, Incident
from backend.app.db.database import db_store
from backend.app.services.image_analyzer import image_analyzer
from backend.app.services.video_analyzer import video_analyzer
from backend.app.services.audio_analyzer import audio_analyzer
from backend.app.services.fusion_engine import fusion_engine
from backend.app.services.priority_engine import priority_engine
from backend.app.services.clustering_engine import clustering_engine

router = APIRouter()

UPLOADS_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "static", "uploads")
os.makedirs(UPLOADS_DIR, exist_ok=True)

@router.get("/incidents", response_model=List[Incident])
def get_incidents(disaster_type: Optional[str] = None, min_priority: Optional[float] = None):
    incidents = db_store.get_all_incidents()
    if disaster_type:
        incidents = [i for i in incidents if i.disaster_type.lower() == disaster_type.lower()]
    if min_priority is not None:
        incidents = [i for i in incidents if i.priority_score >= min_priority]
    # Sort by priority score descending
    incidents.sort(key=lambda x: x.priority_score, reverse=True)
    return incidents

@router.get("/incidents/{incident_id}", response_model=Incident)
def get_incident_detail(incident_id: str):
    for inc in db_store.get_all_incidents():
        if inc.id == incident_id:
            return inc
    raise HTTPException(status_code=404, detail="Incident not found")

@router.get("/reports", response_model=List[Report])
def get_reports():
    return db_store.get_all_reports()

@router.post("/reports/upload")
async def upload_evidence(
    file: Optional[UploadFile] = File(None),
    media_type: str = Form("image"),
    latitude: float = Form(13.0827),
    longitude: float = Form(80.2707),
    location_name: str = Form("Anna Salai, Chennai"),
    description: Optional[str] = Form(""),
    disaster_type: Optional[str] = Form("flood")
):
    report_id = f"REP-{uuid.uuid4().hex[:6].upper()}"
    saved_file_path = f"/uploads/sample_{media_type}.png"
    
    if file:
        file_ext = os.path.splitext(file.filename)[1] or ".bin"
        local_filename = f"{report_id}{file_ext}"
        full_local_path = os.path.join(UPLOADS_DIR, local_filename)
        with open(full_local_path, "wb") as f:
            content = await file.read()
            f.write(content)
        saved_file_path = f"/uploads/{local_filename}"

    report = Report(
        id=report_id,
        latitude=latitude,
        longitude=longitude,
        location_name=location_name,
        media_type=media_type,
        media_path=saved_file_path,
        description=description,
        disaster_type=disaster_type
    )

    # Execute Modality Analyzer
    if media_type == "video":
        analysis_raw = video_analyzer.analyze(saved_file_path)
    elif media_type == "audio":
        analysis_raw = audio_analyzer.analyze(saved_file_path, custom_text=description)
    else:
        analysis_raw = image_analyzer.analyze(saved_file_path)

    # Perform single-source fusion & priority scoring for this report
    fused = fusion_engine.fuse([analysis_raw])
    priority_res = priority_engine.calculate(fused)

    assessment = Assessment(
        id=f"ASM-{uuid.uuid4().hex[:6].upper()}",
        report_id=report_id,
        damage_type=fused["damage_type"],
        severity_level=fused["severity_level"],
        severity_score=fused["severity_score"],
        confidence=fused["confidence"],
        water_level_pct=fused["water_level_pct"],
        road_blockage_pct=fused["road_blockage_pct"],
        vehicle_count=fused["vehicle_count"],
        person_count=fused["person_count"],
        infrastructure_damage_score=fused["infrastructure_damage_score"],
        transcription=fused.get("transcription"),
        extracted_entities=fused.get("extracted_entities", {}),
        modality_scores=fused.get("modality_scores", []),
        video_timeline=fused.get("video_timeline", [])
    )

    db_store.add_report(report)
    db_store.add_assessment(assessment)

    # Re-cluster all reports into Incidents
    all_reports = db_store.get_all_reports()
    all_assessments = {a.report_id: a for a in list(db_store.assessments.values())}
    new_incidents = clustering_engine.cluster_reports_into_incidents(all_reports, all_assessments)

    db_store.incidents.clear()
    for inc in new_incidents:
        db_store.add_incident(inc)

    # Find the assigned incident for this report
    assigned_incident = next((i for i in new_incidents if any(r.id == report_id for r in i.reports)), None)

    return {
        "status": "success",
        "message": "Disaster evidence uploaded and analyzed successfully",
        "report": report,
        "assessment": assessment,
        "assigned_incident": assigned_incident
    }

@router.get("/analytics/summary")
def get_analytics_summary():
    reports = db_store.get_all_reports()
    incidents = db_store.get_all_incidents()

    # Modality counts
    img_cnt = sum(1 for r in reports if r.media_type == "image")
    vid_cnt = sum(1 for r in reports if r.media_type == "video")
    aud_cnt = sum(1 for r in reports if r.media_type == "audio")

    # Priority counts
    critical_cnt = sum(1 for i in incidents if i.priority_level == "CRITICAL")
    high_cnt = sum(1 for i in incidents if i.priority_level == "HIGH")
    moderate_cnt = sum(1 for i in incidents if i.priority_level == "MODERATE")
    low_cnt = sum(1 for i in incidents if i.priority_level == "LOW")

    # Severity trends over time
    severity_trends = [
        {"time": "10:00 AM", "flood_severity": 40.0, "reports_count": 3},
        {"time": "11:00 AM", "flood_severity": 62.0, "reports_count": 8},
        {"time": "12:00 PM", "flood_severity": 81.0, "reports_count": 15},
        {"time": "01:00 PM", "flood_severity": 93.0, "reports_count": 24},
    ]

    # Benchmark comparison
    benchmark = fusion_engine.evaluate_benchmark_comparison()

    return {
        "total_reports": len(reports),
        "total_incidents": len(incidents),
        "modality_counts": {
            "image": img_cnt,
            "video": vid_cnt,
            "audio": aud_cnt
        },
        "priority_counts": {
            "CRITICAL": critical_cnt,
            "HIGH": high_cnt,
            "MODERATE": moderate_cnt,
            "LOW": low_cnt
        },
        "severity_trends": severity_trends,
        "benchmark_comparison": benchmark
    }
