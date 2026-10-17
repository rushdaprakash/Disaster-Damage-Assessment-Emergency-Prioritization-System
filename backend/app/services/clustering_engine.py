import math
from typing import List, Dict
from backend.app.models.schema import Report, Assessment, Incident
from backend.app.services.fusion_engine import fusion_engine
from backend.app.services.priority_engine import priority_engine

def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates distance between two lat/lon coordinates in kilometers."""
    R = 6371.0  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

class GeospatialClusteringEngine:
    def __init__(self, max_distance_km: float = 2.5):
        self.max_distance_km = max_distance_km

    def cluster_reports_into_incidents(self, reports: List[Report], assessments: Dict[str, Assessment]) -> List[Incident]:
        """
        Clusters duplicate or nearby citizen reports into unified Incident zones.
        """
        if not reports:
            return []

        clusters: List[List[Report]] = []

        for report in reports:
            assigned = False
            for cluster in clusters:
                # Compare with cluster centroid (first report in cluster for simplicity)
                ref_rep = cluster[0]
                dist = haversine_distance_km(report.latitude, report.longitude, ref_rep.latitude, ref_rep.longitude)
                
                # Check if within spatial radius and matching disaster type
                if dist <= self.max_distance_km and report.disaster_type == ref_rep.disaster_type:
                    cluster.append(report)
                    assigned = True
                    break
            
            if not assigned:
                clusters.append([report])

        incidents: List[Incident] = []

        for idx, cluster in enumerate(clusters, start=1):
            avg_lat = sum(r.latitude for r in cluster) / len(cluster)
            avg_lon = sum(r.longitude for r in cluster) / len(cluster)
            loc_name = cluster[0].location_name

            # Collect assessments for reports in this cluster
            cluster_assessments = []
            for r in cluster:
                asm = assessments.get(r.id)
                if asm:
                    # Convert assessment back to format expected by fusion engine
                    cluster_assessments.append({
                        "modality": r.media_type,
                        "severity_score": asm.severity_score,
                        "confidence": asm.confidence,
                        "water_level_pct": asm.water_level_pct,
                        "road_blockage_pct": asm.road_blockage_pct,
                        "vehicle_count": asm.vehicle_count,
                        "person_count": asm.person_count,
                        "infrastructure_damage_score": asm.infrastructure_damage_score,
                        "transcription": asm.transcription,
                        "extracted_entities": asm.extracted_entities,
                        "video_timeline": [t.model_dump() for t in asm.video_timeline]
                    })

            # Perform Multimodal Evidence Fusion for the entire Incident Cluster
            fused = fusion_engine.fuse(cluster_assessments)
            p_res = priority_engine.calculate(fused)

            # Build consolidated assessment model
            consolidated_asm = Assessment(
                report_id=cluster[0].id,
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

            incidents.append(Incident(
                id=f"INC-{idx:04d}",
                title=f"{cluster[0].disaster_type.title()} Incident at {loc_name}",
                latitude=round(avg_lat, 5),
                longitude=round(avg_lon, 5),
                location_name=loc_name,
                disaster_type=cluster[0].disaster_type,
                severity=fused["severity_level"],
                severity_score=fused["severity_score"],
                priority_score=p_res["priority_score"],
                priority_level=p_res["priority_level"],
                report_count=len(cluster),
                first_reported=min(r.timestamp for r in cluster),
                last_updated=max(r.timestamp for r in cluster),
                status="ACTIVE" if p_res["priority_score"] > 40 else "INVESTIGATING",
                reports=cluster,
                consolidated_assessment=consolidated_asm
            ))

        return incidents

clustering_engine = GeospatialClusteringEngine()
