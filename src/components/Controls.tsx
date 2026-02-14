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
    <div className="flex flex-col gap-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
      
      {/* Add Server Section */}
      <section>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <ServerIcon className="w-4 h-4" /> Add Node (Server)
        </h3>
        <form onSubmit={handleAddServer} className="space-y-2">
            <input 
                type="number" 
                placeholder="Server ID (e.g. 1)" 
                className="w-full text-sm p-2 border rounded-md"
                value={serverId}
                onChange={e => setServerId(parseInt(e.target.value) || '')}
            />
            <div className="flex items-center gap-2">
                <div className="flex-1">
                    <label className="text-xs text-gray-600 block mb-1">Weight</label>
                    <input 
                        type="number" 
                        min="1" max="10"
                        className="w-full text-sm p-2 border rounded-md"
                        value={weight}
                        onChange={e => setWeight(parseInt(e.target.value))}
                    />
                </div>
                {serverId !== '' && (
                    <div className="flex-1">
                        <label className="text-xs text-xs text-gray-500 block mb-1">Hash Position</label>
                        <div className="text-xs font-mono bg-indigo-50 text-indigo-700 p-2 rounded border border-indigo-100 truncate shadow-sm">
                             <span className="opacity-50">
                                 ({serverId} * <abbr title="Golden Ratio Constant (2654435761) used to spread sequential IDs" className="no-underline cursor-help font-bold">φ</abbr>) % 360 = 
                             </span>
                             <span className="font-bold">{calculateSimpleHash(serverId)}°</span>
                        </div>
                    </div>
                )}
            </div>
            <button 
                type="submit" 
                className="w-full bg-indigo-600 text-white text-sm py-2 rounded-md hover:bg-indigo-700 flex items-center justify-center gap-2"
            >
                <Plus className="w-4 h-4" /> Add Server
            </button>
        </form>
      </section>

      <div className="h-px bg-gray-100"></div>

      {/* Add Blob Section */}
      <section>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Database className="w-4 h-4" /> Add Data (Blob)
        </h3>
        <form onSubmit={handleAddBlob} className="space-y-2">
            <input 
                type="text" 
                placeholder="Data content" 
                className="w-full text-sm p-2 border rounded-md"
                value={blobData}
                onChange={e => setBlobData(e.target.value)}
            />
            {blobData && (
                 <div className="text-xs font-mono text-emerald-600 mt-1 flex justify-end gap-1 px-1">
                    <span className="text-emerald-400">hash("{blobData}") % 360 = </span>
                    <span className="font-bold">{calculateStringHash(blobData)}°</span>
                 </div>
            )}
            <button 
                type="submit" 
                className="w-full bg-emerald-600 text-white text-sm py-2 rounded-md hover:bg-emerald-700 flex items-center justify-center gap-2"
            >
                <Plus className="w-4 h-4" /> Add Blob
            </button>
        </form>
      </section>

      <div className="h-px bg-gray-100"></div>

       {/* List of Servers (Deletion) */}
       <section>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Active Nodes</h3>
        <ul className="space-y-2 max-h-40 overflow-y-auto">
            {serverList.length === 0 && <li className="text-xs text-gray-400 italic">No active servers</li>}
            {serverList.map((s) => (
                <li key={s.id} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded-md">
                    <span className="font-medium truncate">Server {s.id}</span>
                    <button 
                        onClick={() => onRemoveServer(s.id)}
                        className="text-red-500 hover:bg-red-50 p-1 rounded"
                    >
                        <Trash2 className="w-3 h-3" />
                    </button>
                </li>
            ))}
        </ul>
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
