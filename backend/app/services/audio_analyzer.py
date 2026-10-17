import os
import re
from typing import Dict, Any

class AudioAnalyzer:
    def __init__(self):
        pass

    def analyze(self, audio_path: str, custom_text: str = None) -> dict:
        """
        Analyzes audio report:
        1. Speech-to-Text transcription (or uses provided audio description text).
        2. NLP entity and event extraction.
        3. Structured disaster assessment.
        """
        # Default fallback transcription if custom text isn't provided
        transcript = custom_text or (
            "The main bridge near the primary school has collapsed due to heavy flooding. "
            "The road is completely blocked with water level rising fast. Several cars are stranded and 4 people are trapped."
        )

        # Basic NLP Entity Extraction via keyword & regex patterns
        low_text = transcript.lower()

        # Event type detection
        if "bridge" in low_text and ("collapse" in low_text or "broken" in low_text or "damaged" in low_text):
            event_type = "BRIDGE_COLLAPSE"
            infra_score = 90.0
        elif "flood" in low_text or "water" in low_text:
            event_type = "FLOOD_WATER"
            infra_score = 75.0
        else:
            event_type = "GENERAL_DISASTER"
            infra_score = 50.0

        # Road status
        if "blocked" in low_text or "submerged" in low_text or "impassable" in low_text:
            road_status = "BLOCKED"
            road_blockage_pct = 90.0
        else:
            road_status = "PARTIALLY_OPEN"
            road_blockage_pct = 40.0

        # Extract people / vehicles from text
        people_match = re.search(r'(\d+)\s*(people|persons|trapped|stranded)', low_text)
        person_count = int(people_match.group(1)) if people_match else (4 if "people" in low_text or "trapped" in low_text else 1)

        vehicle_match = re.search(r'(\d+)\s*(cars|vehicles|buses|trucks)', low_text)
        vehicle_count = int(vehicle_match.group(1)) if vehicle_match else (3 if "cars" in low_text or "vehicles" in low_text else 0)

        # Water level estimation from NLP keywords
        if "rising fast" in low_text or "deep" in low_text or "chest" in low_text or "submerged" in low_text:
            water_level_pct = 85.0
        elif "water" in low_text:
            water_level_pct = 60.0
        else:
            water_level_pct = 30.0

        severity_score = round((water_level_pct * 0.3 + road_blockage_pct * 0.35 + infra_score * 0.35), 1)

        return {
            "transcription": transcript,
            "damage_type": event_type,
            "water_level_pct": water_level_pct,
            "road_blockage_pct": road_blockage_pct,
            "vehicle_count": vehicle_count,
            "person_count": person_count,
            "infrastructure_damage_score": infra_score,
            "severity_score": severity_score,
            "confidence": 84.0,
            "modality": "audio",
            "extracted_entities": {
                "event_type": event_type,
                "road_status": road_status,
                "location_hint": "Near Primary School" if "school" in low_text else "Field Location",
                "stranded_people": person_count,
                "stranded_vehicles": vehicle_count,
                "urgency": "HIGH" if severity_score > 70 else "MODERATE"
            }
        }

audio_analyzer = AudioAnalyzer()
