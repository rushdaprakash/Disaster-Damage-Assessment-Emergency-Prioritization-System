import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class ReportBase(BaseModel):
    latitude: float
    longitude: float
    location_name: str
    media_type: str  # "image", "video", "audio"
    media_path: str
    description: Optional[str] = ""
    disaster_type: Optional[str] = "flood"

class ReportCreate(ReportBase):
    timestamp: Optional[str] = None

class Report(ReportBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: str = Field(default_factory=lambda: datetime.now().isoformat())
    incident_id: Optional[str] = None

    class Config:
        from_attributes = True

class TimelineSegment(BaseModel):
    start_sec: float
    end_sec: float
    event_type: str
    confidence: float

class ModalityScore(BaseModel):
    modality: str
    score: float
    confidence: float
    details: Dict[str, Any] = {}

class Assessment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    report_id: str
    damage_type: str = "FLOOD_WATER"
    severity_level: str = "MODERATE"  # LOW, MODERATE, SEVERE, CRITICAL
    severity_score: float = 50.0      # 0 to 100
    confidence: float = 85.0          # 0 to 100
    water_level_pct: float = 0.0
    road_blockage_pct: float = 0.0
    vehicle_count: int = 0
    person_count: int = 0
    infrastructure_damage_score: float = 0.0
    modality_scores: List[ModalityScore] = []
    video_timeline: List[TimelineSegment] = []
    transcription: Optional[str] = None
    extracted_entities: Dict[str, Any] = {}

class Incident(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    latitude: float
    longitude: float
    location_name: str
    disaster_type: str = "flood"
    severity: str = "MODERATE"
    severity_score: float = 50.0
    priority_score: float = 50.0       # 0 to 100
    priority_level: str = "MODERATE"   # LOW, MODERATE, HIGH, CRITICAL
    report_count: int = 1
    first_reported: str = Field(default_factory=lambda: datetime.now().isoformat())
    last_updated: str = Field(default_factory=lambda: datetime.now().isoformat())
    status: str = "ACTIVE"              # ACTIVE, DISPATCHED, RESOLVED
    reports: List[Report] = []
    consolidated_assessment: Optional[Assessment] = None
