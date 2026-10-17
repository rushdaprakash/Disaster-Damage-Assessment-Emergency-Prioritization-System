import React from 'react';
import { AlertTriangle, ShieldCheck, Navigation, Users, Building, Activity, ChevronRight } from 'lucide-react';

export default function PriorityQueue({ incidents, onSelectIncident, onViewFusion }) {
  // Sort incidents by priority score descending
  const sortedIncidents = [...incidents].sort((a, b) => b.priority_score - a.priority_score);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-rose-500 mb-1">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
            <span className="text-xs font-extrabold uppercase tracking-wider">Emergency Dispatch Decision Support</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Emergency Resource Priority Queue</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Incidents are mathematically ranked using the priority formula: 
            <span className="font-mono text-slate-300 ml-1">Priority = 0.35(D) + 0.25(R) + 0.20(P) + 0.20(I)</span>
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
          <div className="text-center px-3 border-r border-slate-700">
            <span className="block text-2xl font-black text-rose-500">
              {incidents.filter(i => i.priority_level === 'CRITICAL').length}
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-400">Critical</span>
          </div>
          <div className="text-center px-3 border-r border-slate-700">
            <span className="block text-2xl font-black text-orange-400">
              {incidents.filter(i => i.priority_level === 'HIGH').length}
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-400">High</span>
          </div>
          <div className="text-center px-3">
            <span className="block text-2xl font-black text-amber-400">
              {incidents.filter(i => i.priority_level === 'MODERATE').length}
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-400">Moderate</span>
          </div>
        </div>
      </div>

      {/* Priority List */}
      <div className="space-y-4">
        {sortedIncidents.map((incident, index) => {
          const asm = incident.consolidated_assessment;

          return (
            <div
              key={incident.id}
              className={`bg-slate-900 border rounded-2xl p-6 transition-all duration-200 hover:border-slate-700 shadow-xl ${
                incident.priority_level === 'CRITICAL' ? 'border-rose-500/40 shadow-rose-950/20' :
                incident.priority_level === 'HIGH' ? 'border-orange-500/30' :
                'border-slate-800'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* Rank & Title */}
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg border shadow-lg ${
                    incident.priority_level === 'CRITICAL' ? 'bg-rose-600/20 text-rose-400 border-rose-500/40' :
                    incident.priority_level === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' :
                    incident.priority_level === 'MODERATE' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                    'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  }`}>
                    #{index + 1}
                  </div>

                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                        incident.priority_level === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                        incident.priority_level === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                        incident.priority_level === 'MODERATE' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                        'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {incident.priority_level} PRIORITY
                      </span>
                      <span className="text-xs text-slate-400 font-mono">ID: {incident.id}</span>
                      <span className="text-xs text-slate-400">Reports: {incident.report_count}</span>
                    </div>

                    <h3 className="text-lg font-bold text-white">{incident.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{incident.location_name}</p>
                  </div>
                </div>

                {/* Score & Component Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-800/50 border border-slate-800 p-3.5 rounded-xl lg:w-[480px]">
                  
                  <div className="space-y-1">
                    <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                      <Activity className="w-3 h-3 text-rose-400" />
                      <span>Severity (D)</span>
                    </span>
                    <span className="block text-sm font-bold text-white">{incident.severity_score}%</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                      <Navigation className="w-3 h-3 text-amber-400" />
                      <span>Road Block (R)</span>
                    </span>
                    <span className="block text-sm font-bold text-white">{asm?.road_blockage_pct || 0}%</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                      <Users className="w-3 h-3 text-purple-400" />
                      <span>People (P)</span>
                    </span>
                    <span className="block text-sm font-bold text-white">{asm?.person_count || 0} trapped</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                      <Building className="w-3 h-3 text-sky-400" />
                      <span>Infra (I)</span>
                    </span>
                    <span className="block text-sm font-bold text-white">{asm?.infrastructure_damage_score || 0}%</span>
                  </div>

                </div>

                {/* Priority Score Gauge & Action */}
                <div className="flex items-center justify-between lg:justify-end space-x-6 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Priority Score</span>
                    <span className={`text-2xl font-extrabold font-mono ${
                      incident.priority_level === 'CRITICAL' ? 'text-rose-500' :
                      incident.priority_level === 'HIGH' ? 'text-orange-400' :
                      'text-amber-400'
                    }`}>
                      {incident.priority_score}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      onSelectIncident(incident);
                      onViewFusion(incident);
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all"
                  >
                    <span>View Evidence</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
