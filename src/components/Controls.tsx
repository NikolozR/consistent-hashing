"use client";

import React, { useState } from 'react';
import { Plus, Trash2, Server as ServerIcon, Database } from 'lucide-react';

interface ControlsProps {
  onAddServer: (id: number, weight: number) => void;
  onRemoveServer: (id: number) => void;
  onAddBlob: (data: string) => void;
  onRemoveBlob: (data: string) => void;
  serverList: { id: number }[];
}

export const Controls: React.FC<ControlsProps> = ({ 
    onAddServer, onRemoveServer, onAddBlob, onRemoveBlob, serverList 
}) => {
  const [serverId, setServerId] = useState<number | ''>('');
  const [weight, setWeight] = useState(1);
  const [blobData, setBlobData] = useState('');

  const handleAddServer = (e: React.FormEvent) => {
    e.preventDefault();
    if (serverId === '') return;
    onAddServer(serverId, weight);
    setServerId('');
    setWeight(1);
  };

  const handleAddBlob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blobData) return;
    onAddBlob(blobData);
    setBlobData('');
  };

  return (
    <div id="simulation-controls" className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-800 p-6">
      
      {/* Add Server Section */}
      <section className="flex-1 md:pr-6 md:pb-0 pb-6">
        <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <ServerIcon className="w-4 h-4" /> Add Node
        </h3>
        <form onSubmit={handleAddServer} className="space-y-3">
            <div>
                <input 
                    type="number" 
                    placeholder="Server ID (e.g. 1)" 
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm p-2.5 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none placeholder:text-slate-600 transition-all"
                    value={serverId}
                    onChange={e => setServerId(parseInt(e.target.value) || '')}
                />
            </div>
            
            <div className="space-y-3">
                 <div className="flex items-center gap-3">
                    <label className="text-xs text-slate-500 whitespace-nowrap">Weight</label>
                    <input 
                        type="number" 
                        min="1" max="10"
                        className="w-20 bg-slate-950 border border-slate-800 text-slate-200 text-sm p-2 rounded-lg text-center"
                        value={weight}
                        onChange={e => setWeight(parseInt(e.target.value))}
                    />
                    <div className="text-[10px] text-slate-600 leading-tight">
                        Virtual nodes per server
                    </div>
                </div>

                {serverId !== '' && (
                    <div className="text-xs font-mono bg-slate-950 text-cyan-400 p-3 rounded-lg border border-slate-700/50 flex justify-between items-center shadow-inner">
                            <span className="text-slate-400 font-medium">({serverId} * <span title="Golden Ratio" className="text-cyan-500 cursor-help border-b border-dotted border-cyan-500/50">φ</span>) % 360</span>
                            <span className="font-bold text-cyan-300">= {calculateSimpleHash(serverId)}°</span>
                    </div>
                )}
            </div>

            <button 
                type="submit" 
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold tracking-wide py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/40 hover:shadow-cyan-500/20 active:scale-[0.98]"
            >
                <Plus className="w-4 h-4" /> Add Node
            </button>
        </form>
      </section>

      {/* Add Blob Section */}
      <section className="flex-1 md:px-6 md:py-0 py-6">
        <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Database className="w-4 h-4" /> Add Data
        </h3>
        <form onSubmit={handleAddBlob} className="space-y-3">
            <div>
                <input 
                    type="text" 
                    placeholder="Data content (e.g. photo.jpg)" 
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none placeholder:text-slate-500 transition-all font-medium"
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

       {/* List of Servers (Deletion) */}
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
  );
};

// Helper functions for preview (must match backend logic roughly for education)
function calculateSimpleHash(id: number): number {
    const hash = (id * 2654435761) % 4294967296; 
    return Math.floor((Math.abs(hash) / 4294967296) * 360);
}

function calculateStringHash(input: string): number {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return Math.abs(hash) % 360;
}
