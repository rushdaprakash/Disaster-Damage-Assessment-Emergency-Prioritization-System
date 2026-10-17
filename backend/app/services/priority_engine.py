from typing import Dict, Any

class DisasterPriorityEngine:
    """
    Emergency Resource Prioritization Engine.
    Calculates Priority Score: P = w1*D + w2*R + w3*P_affected + w4*I
    Produces actionable priority level (LOW, MODERATE, HIGH, CRITICAL) for emergency dispatchers.
    """
    def __init__(self, w1: float = 0.35, w2: float = 0.25, w3: float = 0.20, w4: float = 0.20):
        self.w1 = w1  # Damage Severity weight
        self.w2 = w2  # Road Accessibility / Blockage weight
        self.w3 = w3  # People Affected weight
        self.w4 = w4  # Infrastructure Risk weight

    def calculate(self, assessment: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculates priority score from assessment data.
        """
        D = float(assessment.get("severity_score", 50.0))
        R = float(assessment.get("road_blockage_pct", 50.0))
        
        person_cnt = int(assessment.get("person_count", 0))
        vehicle_cnt = int(assessment.get("vehicle_count", 0))
        
        # Calculate affected population risk index P (0 to 100)
        P_affected = min(100.0, (person_cnt * 18.0 + vehicle_cnt * 10.0 + (D * 0.3)))
        
        I = float(assessment.get("infrastructure_damage_score", 50.0))

        priority_score = round(self.w1 * D + self.w2 * R + self.w3 * P_affected + self.w4 * I, 1)
        priority_score = min(100.0, max(0.0, priority_score))

        if priority_score >= 81.0:
            priority_level = "CRITICAL"
        elif priority_score >= 61.0:
            priority_level = "HIGH"
        elif priority_score >= 31.0:
            priority_level = "MODERATE"
        else:
            priority_level = "LOW"

        return {
            "priority_score": priority_score,
            "priority_level": priority_level,
            "components": {
                "damage_severity_D": D,
                "road_blockage_R": R,
                "people_affected_P": round(P_affected, 1),
                "infrastructure_risk_I": I
            },
            "weights": {
                "w1_damage": self.w1,
                "w2_road": self.w2,
                "w3_people": self.w3,
                "w4_infra": self.w4
            }
        }

priority_engine = DisasterPriorityEngine()
