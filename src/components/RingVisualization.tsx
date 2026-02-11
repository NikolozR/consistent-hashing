"use client";

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, BlobData } from '@/lib/consistent-hashing/Server';

interface RingVisualizationProps {
  servers: Server[];
  virtualNodes: { hash: number, serverId: number }[];
}

export const RingVisualization: React.FC<RingVisualizationProps> = ({ servers, virtualNodes }) => {
  const radius = 150;
  const center = 200;
  
  // Helper to convert degree to cartesian
  const getCoordinates = (degree: number, r: number) => {
    const radian = (degree - 90) * (Math.PI / 180); // -90 to start at top
    return {
      x: center + r * Math.cos(radian),
      y: center + r * Math.sin(radian),
    };
  };

  // Collect all blobs to render them
  // We want to render blobs "near" their hash, or linked to their server
  // Actually, standard viz places blobs at their hash on the ring.
  const allBlobs = useMemo(() => {
     return servers.flatMap(s => s.blobs.map(b => ({ ...b, serverId: s.id })));
  }, [servers]);

  return (
    <div className="relative w-[400px] h-[400px] mx-auto">
      <svg width="400" height="400" viewBox="0 0 400 400" className="overflow-visible">
        {/* Ring Background */}
        <circle cx={center} cy={center} r={radius} stroke="#e5e7eb" strokeWidth="4" fill="transparent" />

        {/* Virtual Nodes */}
        <AnimatePresence>
          {virtualNodes.map((vn) => {
            const { x, y } = getCoordinates(vn.hash, radius);
            // Deterministic color based on serverId
            const color = getServerColor(vn.serverId);
            
            return (
              <motion.g
                key={`${vn.serverId}-${vn.hash}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                style={{ originX: "50%", originY: "50%" }}
              >
                <circle cx={x} cy={y} r="8" fill={color} stroke="white" strokeWidth="2" />
                <line x1={center} y1={center} x2={x} y2={y} stroke={color} strokeWidth="1" strokeDasharray="4" opacity="0.3" />
                <text x={x} y={y - 15} textAnchor="middle" fontSize="10" fill="#6b7280">{vn.hash}°</text>
              </motion.g>
            );
          })}
        </AnimatePresence>

        {/* Blobs */}
        <AnimatePresence>
            {allBlobs.map((blob) => {
                const { x, y } = getCoordinates(blob.hash, radius - 20); // Slightly inside
                const color = getServerColor(blob.serverId);

                return (
                    <motion.g
                        key={blob.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }} // We calculate position in SVG props, but framer requires initial logic
                        exit={{ opacity: 0, scale: 0 }}
                    >
                         {/* Link line to server? Maybe too cluttered. Let's just color match. */}
                        <circle cx={x} cy={y} r="5" fill={color} stroke="black" strokeWidth="1" />
                        <text x={x} y={y + 12} textAnchor="middle" fontSize="8" fill="#374151">{blob.id}</text>
                    </motion.g>
                )
            })}
        </AnimatePresence>
      </svg>
      
      {/* Legend / Stats overlay if needed */}
    </div>
  );
};

// Simple hash-to-color for consistent visualization
function getServerColor(id: number) {
    // Generate color from number
    // We can use HSL with the ID as hue to get distinct colors
    // id * constant to spread hues
    const hue = (id * 137.508) % 360; // Golden angle approx
    return `hsl(${hue}, 70%, 50%)`;
}
