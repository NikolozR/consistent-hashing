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
                <label className="text-xs text-gray-600">Weight (Virtual Nodes):</label>
                <input 
                    type="number" 
                    min="1" max="10"
                    className="w-20 text-sm p-2 border rounded-md"
                    value={weight}
                    onChange={e => setWeight(parseInt(e.target.value))}
                />
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
