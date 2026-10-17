import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import DisasterMap from './components/DisasterMap';
import PriorityQueue from './components/PriorityQueue';
import MultimodalFusionViewer from './components/MultimodalFusionViewer';
import SeverityTrendChart from './components/SeverityTrendChart';
import ResearchBenchmarkTable from './components/ResearchBenchmarkTable';
import ReportUploadModal from './components/ReportUploadModal';
import { ShieldAlert, RefreshCw, AlertTriangle, Layers } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('map');
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [incRes, anaRes] = await Promise.all([
        axios.get('/api/incidents'),
        axios.get('/api/analytics/summary')
      ]);

      setIncidents(incRes.data);
      setAnalytics(anaRes.data);

      if (incRes.data.length > 0 && !selectedIncident) {
        setSelectedIncident(incRes.data[0]);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSelectIncident = (inc) => {
    setSelectedIncident(inc);
  };

  const handleViewFusion = (inc) => {
    setSelectedIncident(inc);
    setActiveTab('fusion');
  };

  const handleUploadSuccess = () => {
    fetchDashboardData();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUpload={() => setIsUploadOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center h-96 text-slate-400 space-x-3">
            <RefreshCw className="w-6 h-6 animate-spin text-rose-500" />
            <span>Initializing Disaster Intelligence Platform...</span>
          </div>
        ) : (
          <>
            {activeTab === 'map' && (
              <DisasterMap
                incidents={incidents}
                selectedIncident={selectedIncident}
                onSelectIncident={handleSelectIncident}
                onViewFusion={handleViewFusion}
              />
            )}

            {activeTab === 'priority' && (
              <PriorityQueue
                incidents={incidents}
                onSelectIncident={handleSelectIncident}
                onViewFusion={handleViewFusion}
              />
            )}

            {activeTab === 'fusion' && (
              <MultimodalFusionViewer
                incident={selectedIncident}
              />
            )}

            {activeTab === 'analytics' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                <SeverityTrendChart data={analytics?.severity_trends} />
                <ResearchBenchmarkTable benchmarkData={analytics?.benchmark_comparison} />
              </div>
            )}
          </>
        )}
      </main>

      {/* Evidence Upload Modal */}
      <ReportUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

    </div>
  );
}
