import React, { useState } from 'react';
import axios from 'axios';
import { X, UploadCloud, Image as ImageIcon, FileVideo, Mic, MapPin, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function ReportUploadModal({ isOpen, onClose, onUploadSuccess }) {
  const [mediaType, setMediaType] = useState('image');
  const [file, setFile] = useState(null);
  const [latitude, setLatitude] = useState('13.0827');
  const [longitude, setLongitude] = useState('80.2707');
  const [locationName, setLocationName] = useState('Anna Salai Bridge, Chennai');
  const [description, setDescription] = useState('');
  const [disasterType, setDisasterType] = useState('flood');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      }
      formData.append('media_type', mediaType);
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
      formData.append('location_name', locationName);
      formData.append('description', description);
      formData.append('disaster_type', disasterType);

      const res = await axios.post('/api/reports/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.status === 'success') {
        onUploadSuccess(res.data);
        onClose();
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.detail || "Failed to submit disaster evidence report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-2 text-rose-500">
            <UploadCloud className="w-5 h-5" />
            <h2 className="font-bold text-base text-white">Submit Field Disaster Evidence</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Modality Selection */}
          <div>
            <label className="block text-slate-300 font-semibold mb-2">Evidence Modality Source</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setMediaType('image')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${
                  mediaType === 'image'
                    ? 'bg-rose-600/20 border-rose-500 text-rose-400 font-bold'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <ImageIcon className="w-5 h-5" />
                <span>📷 Image File</span>
              </button>

              <button
                type="button"
                onClick={() => setMediaType('video')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${
                  mediaType === 'video'
                    ? 'bg-purple-600/20 border-purple-500 text-purple-400 font-bold'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <FileVideo className="w-5 h-5" />
                <span>🎥 30s Video</span>
              </button>

              <button
                type="button"
                onClick={() => setMediaType('audio')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${
                  mediaType === 'audio'
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400 font-bold'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Mic className="w-5 h-5" />
                <span>🎙️ Voice Note</span>
              </button>
            </div>
          </div>

          {/* File Input */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Upload Media File (Optional for simulation)</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-300 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700"
            />
          </div>

          {/* Location Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Latitude (GPS)</label>
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-rose-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Longitude (GPS)</label>
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-rose-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Location Landmark / Zone</label>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-rose-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Optional Field Description / Audio Note Transcript</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Flood water rising fast near school, bridge damaged, 3 vehicles submerged..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-rose-600 hover:bg-rose-500 text-white font-semibold px-6 py-2.5 rounded-xl transition-all flex items-center space-x-2 shadow-lg shadow-rose-600/25 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Multimodal Fusion...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Analyze & Classify Evidence</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
