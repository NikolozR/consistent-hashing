"use client";

import React from 'react';
import { Server } from '@/lib/consistent-hashing/Server';
import { motion, AnimatePresence } from 'framer-motion';
import { Server as ServerIcon, Database } from 'lucide-react';

interface ServerInventoryProps {
  servers: Server[];
}

export const ServerInventory: React.FC<ServerInventoryProps> = ({ servers }) => {
  // Simple hash-to-color for consistency (duplicated helper for now)
  const getServerColor = (id: number) => {
    const hue = (id * 137.508) % 360;
    return `hsl(${hue}, 70%, 50%)`;
  };

  return (
    <div className="bg-slate-900 rounded-xl shadow-lg shadow-black/20 border border-slate-800 p-6 h-full flex flex-col">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
        <ServerIcon className="w-4 h-4 text-cyan-500" /> System Stats
      </h3>
      
      <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
        <AnimatePresence>
          {servers.length === 0 && (
             <div className="flex flex-col items-center justify-center h-40 text-slate-500 space-y-2">
                <Database className="w-8 h-8 opacity-20" />
                <p className="text-xs italic">System offline</p>
             </div>
          )}
          {servers.map((server) => (
            <motion.div
              key={server.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-slate-950/50 rounded-lg p-3 border border-slate-800/50 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" 
                    style={{ backgroundColor: getServerColor(server.id), color: getServerColor(server.id) }} 
                  />
                  <span className="font-bold text-sm text-slate-200">Node {server.id}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                   {server.blobs.length} Items
                </span>
              </div>
              
              {server.blobs.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {server.blobs.map((blob) => (
                    <motion.span 
                        key={blob.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center px-1.5 py-1 rounded text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-300 truncate max-w-[100px] hover:border-slate-600 transition-colors cursor-default"
                        title={blob.id}
                    >
                      {blob.id}
                    </motion.span>
                  ))}
                </div>
              ) : (
                <div className="text-[10px] text-slate-500 italic pl-5 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-slate-600"></span> Idle
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
