import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { AlertCircle, FileVideo, Mic, Image as ImageIcon, ShieldAlert, Clock, ChevronRight } from 'lucide-react';

// Custom Leaflet Marker Generator
const createCustomMarker = (priorityLevel, priorityScore) => {
  let colorClass = "bg-emerald-500 border-emerald-300";
  let pulseClass = "";

  if (priorityLevel === 'CRITICAL') {
    colorClass = "bg-rose-600 border-rose-400";
    pulseClass = "animate-ping opacity-75 bg-rose-500";
  } else if (priorityLevel === 'HIGH') {
    colorClass = "bg-orange-500 border-orange-300";
  } else if (priorityLevel === 'MODERATE') {
    colorClass = "bg-amber-500 border-amber-300";
  }

  const html = `
    <div class="relative flex items-center justify-center w-8 h-8">
      <span class="absolute inline-flex h-full w-full rounded-full ${pulseClass}"></span>
      <div class="relative inline-flex rounded-full h-7 w-7 ${colorClass} border-2 text-white font-extrabold text-[10px] items-center justify-center shadow-lg">
        ${Math.round(priorityScore)}
      </div>
    </div>
  `;

  return L.divIcon({
    html: html,
    className: 'custom-leaflet-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

export default function DisasterMap({ incidents, selectedIncident, onSelectIncident, onViewFusion }) {
  const center = [13.0600, 80.2450]; // Default Chennai center

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-slate-950 flex flex-col md:flex-row">
      
      {/* Map Viewport */}
      <div className="flex-1 h-full relative">
        <MapContainer center={center} zoom={12} scrollWheelZoom={true} className="z-10">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {incidents.map((incident) => (
            <Marker
              key={incident.id}
              position={[incident.latitude, incident.longitude]}
              icon={createCustomMarker(incident.priority_level, incident.priority_score)}
              eventHandlers={{
                click: () => onSelectIncident(incident),
              }}
            >
              <Popup>
                <div className="p-1 max-w-xs text-slate-100">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      incident.priority_level === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                      incident.priority_level === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                      incident.priority_level === 'MODERATE' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {incident.priority_level} PRIORITY
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Score: {incident.priority_score}</span>
                  </div>

                  <h3 className="font-bold text-sm text-white">{incident.title}</h3>
                  <p className="text-xs text-slate-300 mt-1">{incident.location_name}</p>

                  <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Reports: {incident.report_count}</span>
                    <button
                      onClick={() => {
                        onSelectIncident(incident);
                        onViewFusion(incident);
                      }}
                      className="text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
                    >
                      <span>Analyze Fusion</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Floating Map Legend */}
        <div className="absolute bottom-6 left-6 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3.5 rounded-xl shadow-2xl text-xs space-y-2">
          <h4 className="font-bold text-slate-300 text-[11px] uppercase tracking-wider">Priority Legend</h4>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-600 border border-rose-400"></span>
              <span className="text-slate-300">Critical (81-100)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-orange-500 border border-orange-300"></span>
              <span className="text-slate-300">High (61-80)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-300"></span>
              <span className="text-slate-300">Moderate (31-60)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-300"></span>
              <span className="text-slate-300">Low (0-30)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Incident Detail Drawer Panel */}
      <div className="w-full md:w-96 bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800 p-4 overflow-y-auto flex flex-col justify-between">
        {selectedIncident ? (
          <div className="space-y-4">
            
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  selectedIncident.priority_level === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                  selectedIncident.priority_level === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                  selectedIncident.priority_level === 'MODERATE' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {selectedIncident.priority_level} PRIORITY
                </span>
                <span className="text-xs font-mono text-slate-400">ID: {selectedIncident.id}</span>
              </div>
              <h2 className="text-lg font-bold text-white">{selectedIncident.title}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{selectedIncident.location_name}</p>
            </div>

            {/* Priority Score Gauge */}
            <div className="bg-slate-800/70 border border-slate-700/60 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold">Calculated Priority Score</span>
                <span className="font-mono font-bold text-rose-400 text-sm">{selectedIncident.priority_score} / 100</span>
              </div>
              <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 h-full transition-all duration-500"
                  style={{ width: `${selectedIncident.priority_score}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-400">
                Formula: P = 0.35(D) + 0.25(R) + 0.20(P_affected) + 0.20(I)
              </p>
            </div>

            {/* Assessment Breakdown */}
            {selectedIncident.consolidated_assessment && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Assessment Metrics</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-800/40 border border-slate-800 p-2.5 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">Water Level</span>
                    <span className="font-bold text-sky-400 text-sm">{selectedIncident.consolidated_assessment.water_level_pct}%</span>
                  </div>
                  <div className="bg-slate-800/40 border border-slate-800 p-2.5 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">Road Blockage</span>
                    <span className="font-bold text-amber-400 text-sm">{selectedIncident.consolidated_assessment.road_blockage_pct}%</span>
                  </div>
                  <div className="bg-slate-800/40 border border-slate-800 p-2.5 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">Vehicles Stranded</span>
                    <span className="font-bold text-purple-400 text-sm">{selectedIncident.consolidated_assessment.vehicle_count}</span>
                  </div>
                  <div className="bg-slate-800/40 border border-slate-800 p-2.5 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">People Affected</span>
                    <span className="font-bold text-rose-400 text-sm">{selectedIncident.consolidated_assessment.person_count}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Evidence Sources */}
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Evidence Modalities ({selectedIncident.report_count})</h4>
              <div className="space-y-1.5">
                {selectedIncident.reports.map((rep) => (
                  <div key={rep.id} className="flex items-center justify-between p-2.5 bg-slate-800/40 border border-slate-800 rounded-lg text-xs">
                    <div className="flex items-center space-x-2">
                      {rep.media_type === 'video' && <FileVideo className="w-4 h-4 text-purple-400" />}
                      {rep.media_type === 'image' && <ImageIcon className="w-4 h-4 text-sky-400" />}
                      {rep.media_type === 'audio' && <Mic className="w-4 h-4 text-emerald-400" />}
                      <span className="font-medium text-slate-200 capitalize">{rep.media_type} Report</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{rep.id}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3">
              <button
                onClick={() => onViewFusion(selectedIncident)}
                className="w-full bg-rose-600 hover:bg-rose-500 text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-rose-600/20"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Open Multimodal Fusion & Timeline</span>
              </button>
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 py-12">
            <AlertCircle className="w-10 h-10 mb-2 opacity-50" />
            <p className="text-sm">Select an incident marker on the map to view detailed evidence assessment and priority scores.</p>
          </div>
        )}
      </div>

    </div>
  );
}
