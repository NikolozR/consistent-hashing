"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Server as ServerIcon, Database, AlertTriangle, X } from 'lucide-react';
import { ErrorInfo } from '@/hooks/useConsistentHashing';

interface ControlsProps {
  onAddServer: (id: number) => void;
  onRemoveServer: (id: number) => void;
  onAddBlob: (data: string) => void;
  onRemoveBlob: (data: string) => void;
  onSetWeight: (weight: number) => void;
  serverList: { id: number }[];
  globalWeight: number;
  error: ErrorInfo | null;
  onClearError: () => void;
}

export const Controls: React.FC<ControlsProps> = ({ 
    onAddServer, onRemoveServer, onAddBlob, onRemoveBlob, onSetWeight, serverList, globalWeight,
    error, onClearError
}) => {
  const [serverId, setServerId] = useState<number | ''>('');
  const [blobData, setBlobData] = useState('');

  const [visibleError, setVisibleError] = useState<ErrorInfo | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (error) {
      setIsExiting(false);
      setVisibleError(error);
    } else if (visibleError) {
      setIsExiting(true);
      const timer = setTimeout(() => setVisibleError(null), 300);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      setVisibleError(null);
      onClearError();
    }, 300);
  };

  const handleAddServer = (e: React.FormEvent) => {
    e.preventDefault();
    if (serverId === '') return;
    onAddServer(serverId);
    setServerId('');
  };

  const handleAddBlob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blobData) return;
    onAddBlob(blobData);
    setBlobData('');
  };

  return (
    <div id="simulation-controls">
      {visibleError && (
        <div 
          className={`transition-all duration-300 ease-out overflow-hidden ${
            isExiting 
              ? 'max-h-0 opacity-0' 
              : 'max-h-20 opacity-100'
          }`}
        >
          <div className={`flex items-center gap-3 px-5 py-3 border-b ${
            visibleError.type === 'node' 
              ? 'bg-amber-950/50 border-amber-800/40' 
              : 'bg-rose-950/50 border-rose-800/40'
          }`}>
            <AlertTriangle className={`w-4 h-4 flex-shrink-0 ${
              visibleError.type === 'node' ? 'text-amber-400' : 'text-rose-400'
            }`} />
            <span className={`text-sm font-medium flex-1 ${
              visibleError.type === 'node' ? 'text-amber-200' : 'text-rose-200'
            }`}>
              {visibleError.message}
            </span>
            <button 
              onClick={handleDismiss}
              className={`p-1 rounded transition-colors flex-shrink-0 ${
                visibleError.type === 'node' 
                  ? 'text-amber-500 hover:text-amber-300 hover:bg-amber-800/50' 
                  : 'text-rose-500 hover:text-rose-300 hover:bg-rose-800/50'
              }`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-800 p-6">
      
        <section className="flex-1 md:pr-6 md:pb-0 pb-6">
          <div className="mb-6 pb-6 border-b border-slate-800">
               <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  Settings
              </h3>
              <div className="flex items-center gap-3">
                  <label className="text-xs text-slate-500 whitespace-nowrap">Virtual Nodes</label>
                  <input 
                      type="number" 
                      min="1" max="50"
                      className="w-20 bg-slate-950 border border-slate-800 text-slate-200 text-sm p-2 rounded-lg text-center focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      value={globalWeight}
                      onChange={e => onSetWeight(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                  <div className="text-[10px] text-slate-600 leading-tight">
                      per server
                  </div>
              </div>
          </div>

          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ServerIcon className="w-4 h-4" /> Add Node
          </h3>
          <form onSubmit={handleAddServer} className="space-y-3">
              <div>
                  <input 
                      type="number" 
                      placeholder="Server ID (e.g. 1)" 
                      className={`w-full bg-slate-950 border text-slate-200 text-sm p-2.5 rounded-lg focus:ring-1 outline-none placeholder:text-slate-600 transition-all ${
                        visibleError?.type === 'node' 
                          ? 'border-amber-600/60 focus:ring-amber-500 focus:border-amber-500' 
                          : 'border-slate-800 focus:ring-cyan-500 focus:border-cyan-500'
                      }`}
                      value={serverId}
                      onChange={e => setServerId(parseInt(e.target.value) || '')}
                  />
              </div>
              
              <div className="space-y-3">
              </div>

              <button 
                  type="submit" 
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold tracking-wide py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/40 hover:shadow-cyan-500/20 active:scale-[0.98]"
              >
                  <Plus className="w-4 h-4" /> Add Node
              </button>
          </form>
        </section>

        <section className="flex-1 md:px-6 md:py-0 py-6">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Database className="w-4 h-4" /> Add Data
          </h3>
          <form onSubmit={handleAddBlob} className="space-y-3">
              <div>
                  <input 
                      type="text" 
                      placeholder="Data content (e.g. photo.jpg)" 
                      className={`w-full bg-slate-950 border text-slate-200 text-sm p-2.5 rounded-lg focus:ring-2 outline-none placeholder:text-slate-500 transition-all font-medium ${
                        visibleError?.type === 'data' 
                          ? 'border-rose-600/60 focus:ring-rose-500/50 focus:border-rose-500' 
                          : 'border-slate-700 focus:ring-emerald-500/50 focus:border-emerald-500'
                      }`}
                      value={blobData}
                      onChange={e => setBlobData(e.target.value)}
                  />
              </div>

              <div className="min-h-[46px] flex items-center">
                   {blobData ? (
                      <div className="w-full text-xs font-mono bg-slate-950 text-emerald-400 p-3 rounded-lg border border-slate-700/50 flex justify-between items-center shadow-inner">
                          <span className="text-slate-400 font-medium">hash("<span className="text-emerald-300">{blobData}</span>")</span>
                          <span className="font-bold text-emerald-300">= {calculateStringHash(blobData)}°</span>
                      </div>
                   ) : (
                      <div className="text-xs text-slate-500 italic px-1 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                          Enter data to see hash preview...
                      </div>
                   )}
              </div>

              <button 
                  type="submit" 
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold tracking-wide py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 hover:shadow-emerald-500/20 active:scale-[0.98]"
              >
                  <Plus className="w-4 h-4" /> Add Data
              </button>
          </form>
        </section>

         <section className="flex-1 md:pl-6 md:pt-0 pt-6 flex flex-col h-full min-h-[200px]">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Active Nodes</h3>
          <div className="flex-1 bg-slate-950/50 rounded-lg border border-slate-800 p-2 overflow-hidden">
              <ul className="space-y-1 h-full overflow-y-auto pr-2 custom-scrollbar">
                  {serverList.length === 0 && (
                      <li className="h-full flex items-center justify-center text-xs text-slate-600 italic">
                          No active servers
                      </li>
                  )}
                  {serverList.map((s) => (
                      <li key={s.id} className="group flex items-center justify-between text-xs text-slate-300 bg-slate-900 hover:bg-slate-800 p-2 rounded transition-colors border border-transparent hover:border-slate-700">
                          <span className="font-medium font-mono">Node <span className="text-cyan-400">#{s.id}</span></span>
                          <button 
                              onClick={() => onRemoveServer(s.id)}
                              className="text-slate-600 hover:text-red-400 hover:bg-red-500/10 p-1.5 rounded transition-all opacity-0 group-hover:opacity-100"
                              title="Remove Node"
                          >
                              <Trash2 className="w-3 h-3" />
                          </button>
                      </li>
                  ))}
              </ul>
          </div>
        </section>

      </div>
    </div>
  );
};

function calculateStringHash(input: string): number {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return Math.abs(hash) % 360;
}
