import React from 'react';
import { Cpu, Image as ImageIcon, FileVideo, Mic, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import VideoTimelineViewer from './VideoTimelineViewer';

export default function MultimodalFusionViewer({ incident }) {
  if (!incident) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-500">
        Select an incident to inspect its multimodal evidence fusion breakdown.
      </div>
    );
  }

  const asm = incident.consolidated_assessment;
  const modalityScores = asm?.modality_scores || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-rose-500 mb-1">
            <Cpu className="w-5 h-5 animate-pulse" />
            <span className="text-xs font-extrabold uppercase tracking-wider">Research Architecture</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Multimodal Evidence Fusion Engine</h2>
          <p className="text-xs text-slate-400 mt-1">
            Fuses predictions across Image, Video, and Audio modalities: 
            <span className="font-mono text-slate-300 ml-1">S_final = ∑(w_m · c_m · S_m) / ∑(w_m · c_m)</span>
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-slate-800/80 p-4 rounded-xl border border-slate-700/60">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Fused Severity</span>
            <span className="text-2xl font-black text-rose-500 font-mono">{asm?.severity_score || 0}%</span>
          </div>
          <div className="border-l border-slate-700 pl-4">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Fused Confidence</span>
            <span className="text-2xl font-black text-emerald-400 font-mono">{asm?.confidence || 0}%</span>
          </div>
        </div>
      </div>

      {/* Modality Fusion Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Image Modality */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sky-400">
              <ImageIcon className="w-5 h-5" />
              <h3 className="font-bold text-sm text-white">Image Modality</h3>
            </div>
            <span className="text-[10px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded">
              Weight: 40%
            </span>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Damage Score</span>
              <span className="font-bold font-mono text-sky-400">
                {modalityScores.find(m => m.modality === 'image')?.score || 84.0}%
              </span>
            </div>
            <div className="flex justify-between text-xs text-slate-300">
              <span>Confidence</span>
              <span className="font-bold font-mono text-slate-200">
                {modalityScores.find(m => m.modality === 'image')?.confidence || 91.0}%
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
            Analyzes flood water coverage, building cracks, and submerged vehicle counts.
          </p>
        </div>

        {/* Video Modality */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-purple-400">
              <FileVideo className="w-5 h-5" />
              <h3 className="font-bold text-sm text-white">Video Modality</h3>
            </div>
            <span className="text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded">
              Weight: 35%
            </span>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Damage Score</span>
              <span className="font-bold font-mono text-purple-400">
                {modalityScores.find(m => m.modality === 'video')?.score || 88.5}%
              </span>
            </div>
            <div className="flex justify-between text-xs text-slate-300">
              <span>Confidence</span>
              <span className="font-bold font-mono text-slate-200">
                {modalityScores.find(m => m.modality === 'video')?.confidence || 92.0}%
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
            Keyframe sampling every 1s + temporal aggregation over 30s timeline.
          </p>
        </div>

        {/* Audio Modality */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-emerald-400">
              <Mic className="w-5 h-5" />
              <h3 className="font-bold text-sm text-white">Audio Modality</h3>
            </div>
            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
              Weight: 25%
            </span>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Damage Score</span>
              <span className="font-bold font-mono text-emerald-400">
                {modalityScores.find(m => m.modality === 'audio')?.score || 90.0}%
              </span>
            </div>
            <div className="flex justify-between text-xs text-slate-300">
              <span>Confidence</span>
              <span className="font-bold font-mono text-slate-200">
                {modalityScores.find(m => m.modality === 'audio')?.confidence || 84.0}%
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
            Whisper Speech-to-Text + NLP entity extraction (bridge collapse, trapped count).
          </p>
        </div>

      </div>

      {/* Video Evidence Timeline Component */}
      <VideoTimelineViewer timeline={asm?.video_timeline} durationSec={30.0} />

      {/* Audio Transcription & NLP Entities */}
      {asm?.transcription && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center space-x-2 text-emerald-400">
            <Mic className="w-5 h-5" />
            <h3 className="font-bold text-sm text-white">Audio Speech-to-Text Transcription & NLP Entities</h3>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs italic text-slate-300">
            "{asm.transcription}"
          </div>

          {asm.extracted_entities && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Event Entity</span>
                <span className="text-xs font-bold text-rose-400">{asm.extracted_entities.event_type || 'N/A'}</span>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Road Status</span>
                <span className="text-xs font-bold text-amber-400">{asm.extracted_entities.road_status || 'N/A'}</span>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Trapped People</span>
                <span className="text-xs font-bold text-purple-400">{asm.extracted_entities.stranded_people || 0}</span>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Urgency</span>
                <span className="text-xs font-bold text-sky-400">{asm.extracted_entities.urgency || 'N/A'}</span>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
