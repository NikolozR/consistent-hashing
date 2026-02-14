"use client";

import React from 'react';
import { Server } from '@/lib/consistent-hashing/Server';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-full flex flex-col">
      <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
        Server Statistics
      </h3>
      
      <div className="space-y-4 overflow-y-auto flex-1 pr-2">
        <AnimatePresence>
          {servers.length === 0 && (
             <p className="text-xs text-gray-400 italic text-center py-4">No active servers</p>
          )}
          {servers.map((server) => (
            <motion.div
              key={server.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-50 rounded-lg p-3 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: getServerColor(server.id) }} 
                  />
                  <span className="font-medium text-sm text-gray-700">Server {server.id}</span>
                </div>
                <span className="text-xs font-mono text-gray-500 bg-white px-2 py-0.5 rounded border">
                   {server.blobs.length} items
                </span>
              </div>
              
              {server.blobs.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {server.blobs.map((blob) => (
                    <motion.span 
                        key={blob.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-white border border-gray-200 text-gray-600 truncate max-w-[100px]"
                        title={blob.id}
                    >
                      {blob.id}
                    </motion.span>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-gray-400 italic pl-5">Empty</p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
