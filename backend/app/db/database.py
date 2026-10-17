import json
import os
from typing import Dict, List, Optional
from backend.app.models.schema import Report, Assessment, Incident

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data")
DB_FILE = os.path.join(DATA_DIR, "db_store.json")

class DatabaseStore:
    def __init__(self):
        os.makedirs(DATA_DIR, exist_ok=True)
        self.reports: Dict[str, Report] = {}
        self.assessments: Dict[str, Assessment] = {}
        self.incidents: Dict[str, Incident] = {}
        self.load()

    def save(self):
        data = {
            "reports": {k: v.model_dump() for k, v in self.reports.items()},
            "assessments": {k: v.model_dump() for k, v in self.assessments.items()},
            "incidents": {k: v.model_dump() for k, v in self.incidents.items()}
        }
        with open(DB_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

    def load(self):
        if os.path.exists(DB_FILE):
            try:
                with open(DB_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    for k, v in data.get("reports", {}).items():
                        self.reports[k] = Report(**v)
                    for k, v in data.get("assessments", {}).items():
                        self.assessments[k] = Assessment(**v)
                    for k, v in data.get("incidents", {}).items():
                        self.incidents[k] = Incident(**v)
            except Exception as e:
                print(f"Error loading database file: {e}")

    def add_report(self, report: Report):
        self.reports[report.id] = report
        self.save()

    def add_assessment(self, assessment: Assessment):
        self.assessments[assessment.id] = assessment
        self.save()

    def add_incident(self, incident: Incident):
        self.incidents[incident.id] = incident
        self.save()

    def get_report(self, report_id: str) -> Optional[Report]:
        return self.reports.get(report_id)

    def get_assessment_for_report(self, report_id: str) -> Optional[Assessment]:
        for asm in self.assessments.values():
            if asm.report_id == report_id:
                return asm
        return None

    def get_all_incidents(self) -> List[Incident]:
        return list(self.incidents.values())

    def get_all_reports(self) -> List[Report]:
        return list(self.reports.values())

    def clear(self):
        self.reports.clear()
        self.assessments.clear()
        self.incidents.clear()
        self.save()

db_store = DatabaseStore()
