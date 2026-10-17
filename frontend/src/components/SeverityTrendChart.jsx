import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TrendingUp, Clock } from 'lucide-react';

export default function SeverityTrendChart({ data = [] }) {
  const chartData = data.length > 0 ? data : [
    { time: "10:00 AM", flood_severity: 40.0, reports_count: 3 },
    { time: "11:00 AM", flood_severity: 62.0, reports_count: 8 },
    { time: "12:00 PM", flood_severity: 81.0, reports_count: 15 },
    { time: "01:00 PM", flood_severity: 93.0, reports_count: 24 },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-rose-500 mb-1">
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs font-extrabold uppercase tracking-wider">Temporal Situation Monitoring</span>
          </div>
          <h3 className="font-bold text-lg text-white">Disaster Severity Trend Over Time</h3>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <Clock className="w-4 h-4" />
          <span>Real-time Hourly Progression</span>
        </div>
      </div>

      <div className="h-64 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSeverity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
              formatter={(val) => [`${val}%`, 'Severity Score']}
            />
            <Area type="monotone" dataKey="flood_severity" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorSeverity)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-slate-400">
        Monitors rising water levels and disaster progression to assist emergency teams with proactive evacuation planning.
      </p>
    </div>
  );
}
