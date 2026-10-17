import React from 'react';
import { Film, Clock, AlertCircle } from 'lucide-react';

export default function VideoTimelineViewer({ timeline = [], durationSec = 30.0 }) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-center text-xs text-slate-500">
        No video keyframe timeline available for this evidence item.
      </div>
    );
  }

  // Define unique tracks
  const tracks = [
    { key: 'flood_water', label: 'Flood Water Detected', color: 'bg-sky-500 border-sky-400' },
    { key: 'vehicle_obstruction', label: 'Vehicles Obstruction', color: 'bg-purple-500 border-purple-400' },
    { key: 'road_blockage', label: 'Road Blockage', color: 'bg-amber-500 border-amber-400' },
    { key: 'infrastructure_damage', label: 'Infrastructure Damage', color: 'bg-rose-500 border-rose-400' },
    { key: 'person_detected', label: 'Human Presence Detected', color: 'bg-emerald-500 border-emerald-400' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-purple-400">
          <Film className="w-5 h-5" />
          <h3 className="font-bold text-sm text-white">Video Temporal Evidence Timeline (00:00 - 00:{Math.round(durationSec)})</h3>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
          <Clock className="w-3.5 h-3.5" />
          <span>Frame Sampling: 2 fps</span>
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800/80">
        
        {/* Time Marker Header */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pb-2 border-b border-slate-800">
          <span>00:00</span>
          <span>00:05</span>
          <span>00:10</span>
          <span>00:15</span>
          <span>00:20</span>
          <span>00:25</span>
          <span>00:{Math.round(durationSec)}</span>
        </div>

        {/* Tracks */}
        {tracks.map((track) => {
          const events = timeline.filter(t => t.event_type === track.key);

          return (
            <div key={track.key} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">{track.label}</span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {events.length > 0 ? `${Math.round(events[0].confidence * 100)}% confidence` : 'Absent'}
                </span>
              </div>

              <div className="relative w-full bg-slate-900 h-6 rounded-lg overflow-hidden border border-slate-800/60">
                {events.map((ev, i) => {
                  const leftPct = (ev.start_sec / durationSec) * 100;
                  const widthPct = ((ev.end_sec - ev.start_sec) / durationSec) * 100;

                  return (
                    <div
                      key={i}
                      className={`absolute top-0 bottom-0 ${track.color} opacity-85 rounded border-l border-r shadow-md transition-all hover:opacity-100 flex items-center justify-center text-[9px] font-bold text-white`}
                      style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                      title={`${track.label}: ${ev.start_sec}s - ${ev.end_sec}s`}
                    >
                      {widthPct > 12 && `${Math.round(ev.start_sec)}s - ${Math.round(ev.end_sec)}s`}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

      </div>

      <p className="text-[11px] text-slate-400">
        Temporal aggregation compiles frame-by-frame presence windows into actionable evidence tracks for disaster monitoring.
      </p>

    </div>
  );
}
