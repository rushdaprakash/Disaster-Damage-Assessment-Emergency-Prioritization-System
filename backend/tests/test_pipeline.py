import pytest
from backend.app.services.image_analyzer import image_analyzer
from backend.app.services.video_analyzer import video_analyzer
from backend.app.services.audio_analyzer import audio_analyzer
from backend.app.services.fusion_engine import fusion_engine
from backend.app.services.priority_engine import priority_engine
from backend.app.services.clustering_engine import clustering_engine
from backend.app.models.schema import Report

def test_image_analyzer():
    res = image_analyzer.analyze("non_existent.jpg")
    assert "water_level_pct" in res
    assert "severity_score" in res
    assert res["modality"] == "image"

def test_video_analyzer():
    res = video_analyzer.analyze("sample.mp4", duration_sec=30.0)
    assert len(res["video_timeline"]) > 0
    assert res["modality"] == "video"
    assert res["severity_score"] > 0

def test_audio_analyzer():
    res = audio_analyzer.analyze("sample.mp3", custom_text="Bridge near school collapsed, road blocked with trapped people.")
    assert res["damage_type"] == "BRIDGE_COLLAPSE"
    assert res["extracted_entities"]["road_status"] == "BLOCKED"
    assert res["person_count"] > 0

def test_multimodal_fusion():
    img_res = image_analyzer.analyze("sample.jpg")
    vid_res = video_analyzer.analyze("sample.mp4")
    aud_res = audio_analyzer.analyze("sample.mp3")

    fused = fusion_engine.fuse([img_res, vid_res, aud_res])
    assert fused["confidence"] >= 90.0
    assert len(fused["modality_scores"]) == 3

def test_priority_engine():
    assessment = {
        "severity_score": 85.0,
        "road_blockage_pct": 90.0,
        "person_count": 5,
        "vehicle_count": 4,
        "infrastructure_damage_score": 80.0
    }
    res = priority_engine.calculate(assessment)
    assert res["priority_score"] >= 80.0
    assert res["priority_level"] == "CRITICAL"

def test_clustering_engine():
    r1 = Report(id="R1", latitude=13.0827, longitude=80.2707, location_name="Loc A", media_type="image", media_path="p1")
    r2 = Report(id="R2", latitude=13.0830, longitude=80.2710, location_name="Loc A", media_type="video", media_path="p2")
    incidents = clustering_engine.cluster_reports_into_incidents([r1, r2], {})
    assert len(incidents) == 1
    assert incidents[0].report_count == 2
