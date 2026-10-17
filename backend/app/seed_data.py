from datetime import datetime, timedelta
from backend.app.models.schema import Report, Assessment, Incident, TimelineSegment, ModalityScore
from backend.app.db.database import db_store
from backend.app.services.clustering_engine import clustering_engine

def seed_database():
    """Populates the database with rich multi-source disaster reports and incidents."""
    db_store.clear()

    now = datetime.now()

    sample_reports = [
        # Incident 1 - Critical Bridge & Flood Zone
        Report(
            id="REP-1001",
            latitude=13.0827,
            longitude=80.2707,
            location_name="Anna Salai Bridge, Chennai Central",
            media_type="video",
            media_path="/uploads/sample_video_flood.mp4",
            description="30-second field video showing submerged vehicles and bridge structural cracking near Anna Salai.",
            disaster_type="flood",
            timestamp=(now - timedelta(minutes=45)).isoformat()
        ),
        Report(
            id="REP-1002",
            latitude=13.0835,
            longitude=80.2715,
            location_name="Anna Salai Bridge, Chennai Central",
            media_type="image",
            media_path="/uploads/sample_image_bridge.jpg",
            description="High-resolution image of submerged cars and cracked bridge pillar.",
            disaster_type="flood",
            timestamp=(now - timedelta(minutes=30)).isoformat()
        ),
        Report(
            id="REP-1003",
            latitude=13.0820,
            longitude=80.2698,
            location_name="Anna Salai Bridge, Chennai Central",
            media_type="audio",
            media_path="/uploads/sample_audio_report.mp3",
            description="Voice recording from field officer reporting trapped citizens and impassable road.",
            disaster_type="flood",
            timestamp=(now - timedelta(minutes=15)).isoformat()
        ),

        # Incident 2 - Severe Residential Flooding
        Report(
            id="REP-2001",
            latitude=13.0400,
            longitude=80.2333,
            location_name="T. Nagar Commercial & Residential Hub",
            media_type="image",
            media_path="/uploads/sample_tnagar_flood.jpg",
            description="Flooded street with waist-deep water and fallen electric power poles.",
            disaster_type="flood",
            timestamp=(now - timedelta(hours=2)).isoformat()
        ),
        Report(
            id="REP-2002",
            latitude=13.0412,
            longitude=80.2345,
            location_name="T. Nagar Commercial & Residential Hub",
            media_type="video",
            media_path="/uploads/sample_tnagar_video.mp4",
            description="Video of rising water level affecting ground floor shops.",
            disaster_type="flood",
            timestamp=(now - timedelta(hours=1, minutes=40)).isoformat()
        ),

        # Incident 3 - Moderate Waterlogging
        Report(
            id="REP-3001",
            latitude=13.0067,
            longitude=80.2578,
            location_name="Adyar River Bridge Approach",
            media_type="image",
            media_path="/uploads/sample_adyar.jpg",
            description="Knee-deep water on main road, 2 stalled hatchback cars.",
            disaster_type="flood",
            timestamp=(now - timedelta(hours=3)).isoformat()
        ),

        # Incident 4 - Low Severity Canal Overflow
        Report(
            id="REP-4001",
            latitude=13.1200,
            longitude=80.2100,
            location_name="Madhavaram Canal Link Road",
            media_type="image",
            media_path="/uploads/sample_madhavaram.jpg",
            description="Minor canal overflow on sidewalk, main road traffic flowing slowly.",
            disaster_type="flood",
            timestamp=(now - timedelta(hours=4)).isoformat()
        ),
    ]

    # Detailed Assessments matching sample reports
    sample_assessments = [
        Assessment(
            id="ASM-1001",
            report_id="REP-1001",
            damage_type="FLOOD_AND_INFRASTRUCTURE",
            severity_level="CRITICAL",
            severity_score=88.5,
            confidence=92.0,
            water_level_pct=85.0,
            road_blockage_pct=92.0,
            vehicle_count=6,
            person_count=4,
            infrastructure_damage_score=85.0,
            modality_scores=[
                ModalityScore(modality="video", score=88.5, confidence=92.0, details={"fps": 2, "keyframes": 60})
            ],
            video_timeline=[
                TimelineSegment(start_sec=0.0, end_sec=30.0, event_type="flood_water", confidence=0.95),
                TimelineSegment(start_sec=2.0, end_sec=26.0, event_type="vehicle_obstruction", confidence=0.88),
                TimelineSegment(start_sec=6.0, end_sec=30.0, event_type="road_blockage", confidence=0.92),
                TimelineSegment(start_sec=10.0, end_sec=28.0, event_type="infrastructure_damage", confidence=0.86),
                TimelineSegment(start_sec=4.0, end_sec=18.0, event_type="person_detected", confidence=0.79),
            ]
        ),
        Assessment(
            id="ASM-1002",
            report_id="REP-1002",
            damage_type="STRUCTURAL_COLLAPSE",
            severity_level="SEVERE",
            severity_score=84.0,
            confidence=91.0,
            water_level_pct=80.0,
            road_blockage_pct=88.0,
            vehicle_count=4,
            person_count=2,
            infrastructure_damage_score=88.0,
            modality_scores=[
                ModalityScore(modality="image", score=84.0, confidence=91.0, details={"resolution": "1920x1080"})
            ]
        ),
        Assessment(
            id="ASM-1003",
            report_id="REP-1003",
            damage_type="BRIDGE_COLLAPSE",
            severity_level="CRITICAL",
            severity_score=90.0,
            confidence=84.0,
            water_level_pct=85.0,
            road_blockage_pct=95.0,
            vehicle_count=5,
            person_count=4,
            infrastructure_damage_score=92.0,
            transcription="The main bridge near Anna Salai is cracking under heavy flood waters. Road is completely blocked. At least 6 vehicles are stranded and 4 people are trapped on top of cars.",
            extracted_entities={
                "event_type": "BRIDGE_COLLAPSE",
                "road_status": "BLOCKED",
                "location_hint": "Anna Salai Bridge",
                "stranded_people": 4,
                "stranded_vehicles": 6,
                "urgency": "CRITICAL"
            },
            modality_scores=[
                ModalityScore(modality="audio", score=90.0, confidence=84.0, details={"stt_engine": "Whisper-v3"})
            ]
        ),
        Assessment(
            id="ASM-2001",
            report_id="REP-2001",
            damage_type="FLOOD_WATER",
            severity_level="SEVERE",
            severity_score=72.0,
            confidence=89.0,
            water_level_pct=68.0,
            road_blockage_pct=78.0,
            vehicle_count=3,
            person_count=2,
            infrastructure_damage_score=65.0,
            modality_scores=[
                ModalityScore(modality="image", score=72.0, confidence=89.0, details={"resolution": "1280x720"})
            ]
        ),
        Assessment(
            id="ASM-2002",
            report_id="REP-2002",
            damage_type="FLOOD_WATER",
            severity_level="SEVERE",
            severity_score=70.5,
            confidence=86.0,
            water_level_pct=64.0,
            road_blockage_pct=74.0,
            vehicle_count=2,
            person_count=1,
            infrastructure_damage_score=60.0,
            modality_scores=[
                ModalityScore(modality="video", score=70.5, confidence=86.0, details={"duration": 15})
            ],
            video_timeline=[
                TimelineSegment(start_sec=0.0, end_sec=15.0, event_type="flood_water", confidence=0.90),
                TimelineSegment(start_sec=3.0, end_sec=12.0, event_type="road_blockage", confidence=0.82),
            ]
        ),
        Assessment(
            id="ASM-3001",
            report_id="REP-3001",
            damage_type="FLOOD_WATER",
            severity_level="MODERATE",
            severity_score=52.0,
            confidence=87.0,
            water_level_pct=45.0,
            road_blockage_pct=50.0,
            vehicle_count=2,
            person_count=0,
            infrastructure_damage_score=35.0,
            modality_scores=[
                ModalityScore(modality="image", score=52.0, confidence=87.0, details={"resolution": "1920x1080"})
            ]
        ),
        Assessment(
            id="ASM-4001",
            report_id="REP-4001",
            damage_type="FLOOD_WATER",
            severity_level="LOW",
            severity_score=28.5,
            confidence=85.0,
            water_level_pct=25.0,
            road_blockage_pct=20.0,
            vehicle_count=0,
            person_count=0,
            infrastructure_damage_score=15.0,
            modality_scores=[
                ModalityScore(modality="image", score=28.5, confidence=85.0, details={"resolution": "1280x720"})
            ]
        ),
    ]

    for r in sample_reports:
        db_store.add_report(r)
    for a in sample_assessments:
        db_store.add_assessment(a)

    # Perform clustering & add incidents
    assessments_dict = {a.report_id: a for a in sample_assessments}
    incidents = clustering_engine.cluster_reports_into_incidents(sample_reports, assessments_dict)

    for inc in incidents:
        db_store.add_incident(inc)

    print(f"Successfully seeded database with {len(sample_reports)} reports and {len(incidents)} incidents.")

if __name__ == "__main__":
    seed_database()
