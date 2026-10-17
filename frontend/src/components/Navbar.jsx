import React from 'react';
import { ShieldAlert, Map, AlertTriangle, Cpu, TrendingUp, PlusCircle } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenUpload }) {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* System Brand */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-500">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white leading-tight">
                AegisDisaster <span className="text-rose-500 font-extrabold">AI</span>
              </h1>
              <p className="text-xs text-slate-400">
                Multimedia Disaster Intelligence & Priority System
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-800/60 p-1 rounded-xl border border-slate-700/50">
            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'map'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>Disaster Map</span>
            </button>

            <button
              onClick={() => setActiveTab('priority')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'priority'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Priority Queue</span>
            </button>

            <button
              onClick={() => setActiveTab('fusion')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'fusion'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Multimodal Fusion & Timeline</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Research & Trends</span>
            </button>
          </nav>

          {/* Upload Button */}
          <button
            onClick={onOpenUpload}
            className="flex items-center space-x-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-rose-600/25 transition-all transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Upload Field Evidence</span>
          </button>

        </div>
      </div>
    </header>
  );
}
