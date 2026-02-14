"use client";

import React, { useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { Server, BlobData } from '@/lib/consistent-hashing/Server';

interface RingVisualizationProps {
  servers: Server[];
  virtualNodes: { hash: number, serverId: number }[];
}

export const RingVisualization: React.FC<RingVisualizationProps> = ({ servers, virtualNodes }) => {
  const radius = 180; // Increased radius
  const center = 250; // Adjusted center for 500x500
  
  // Helper to convert degree to cartesian
  const getCoordinates = (degree: number, r: number) => {
    const radian = (degree - 90) * (Math.PI / 180); // -90 to start at top
    return {
      x: center + r * Math.cos(radian),
      y: center + r * Math.sin(radian),
    };
  };

  // Traveling blobs state
  const [travelingBlobs, setTravelingBlobs] = React.useState<(BlobData & { serverId: number, targetHash: number })[]>([]);
  const prevBlobsRef = React.useRef(new Set<string>());

  // Collect all current blobs
  const allBlobs = useMemo(() => {
     return servers.flatMap(s => s.blobs.map(b => ({ ...b, serverId: s.id })));
  }, [servers]);

  // Detect new blobs and trigger animation
  React.useEffect(() => {
    const newBlobs = allBlobs.filter(b => !prevBlobsRef.current.has(b.id));
    
    if (newBlobs.length > 0) {
        // Find target hash for each blob (the hash of the node it ended up on)
        // We know the serverId, so we can look up the virtual nodes for that server
        // and find the one that is "closest" clockwise from the blob hash.
        // HOWEVER, the backend already assigned it. We can just animate to the blob's CURRENT calculated target.
        // But `virtualNodes` has all nodes.
        
        const blobsWithTarget = newBlobs.map(blob => {
             // Find the specific virtual node this blob mapped to.
             // The backend logic is: find first node where node.hash >= blob.hash.
             // If not found, wrap around to first node.
             // Since we have the serverId, we technically know where it went, but for visual accuracy
             // we want the exact virtual node degree.
             
             let targetNode = virtualNodes.find(vn => vn.hash >= blob.hash && vn.serverId === blob.serverId);
             
             // If not found directly clockwise (wrap around case), find the first node of this server (smallest hash)
             // But valid ring logic might have mapped it to a different server if we are inconsistent.
             // Assuming consistent state:
             if (!targetNode) {
                 // Try finding ANY node for this server that acts as the wrap-around handler
                 // Actually, if it wrapped around, it must be the node with the smallest hash on the ring that belongs to this server?
                 // Wait, strict Consistent Hashing:
                 // 1. Sort all virtual nodes.
                 // 2. Find first one > blob.hash.
                 // That checks out.
                 const sortedNodes = [...virtualNodes].sort((a, b) => a.hash - b.hash);
                 const found = sortedNodes.find(vn => vn.hash >= blob.hash);
                 targetNode = found || sortedNodes[0];
             }

            return { ...blob, targetHash: targetNode?.hash || 0 };
        });

        setTravelingBlobs(prev => [...prev, ...blobsWithTarget]);
        newBlobs.forEach(b => prevBlobsRef.current.add(b.id));
    }
  }, [allBlobs, virtualNodes]);

  const removeTravelingBlob = (id: string) => {
    setTravelingBlobs(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div className="relative w-[500px] h-[500px] mx-auto scale-90 sm:scale-100 transition-transform">
      <svg width="500" height="500" viewBox="0 0 500 500" className="overflow-visible">
        {/* Ring Background */}
        <circle cx={center} cy={center} r={radius} stroke="#1e293b" strokeWidth="6" fill="transparent" />
        <circle cx={center} cy={center} r={radius} stroke="#334155" strokeWidth="1" strokeDasharray="4 4" fill="transparent" opacity="0.5" />

        {/* Center label */}
        <text x={center} y={center} textAnchor="middle" dy=".3em" fontSize="14" fill="#64748b" letterSpacing="0.2em" className="font-mono font-bold opacity-50">
            HASH RING
        </text>

        {/* Virtual Nodes */}
        <AnimatePresence>
          {virtualNodes.map((vn) => {
            const { x, y } = getCoordinates(vn.hash, radius);
            const color = getServerColor(vn.serverId);
            
            return (
              <motion.g
                key={`${vn.serverId}-${vn.hash}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                style={{ originX: "50%", originY: "50%" }}
              >
                {/* Connection line to center (subtle) */}
                <line x1={center} y1={center} x2={x} y2={y} stroke={color} strokeWidth="1" strokeDasharray="2 4" opacity="0.2" />
                
                {/* Node Point */}
                <circle cx={x} cy={y} r="8" fill={color} stroke="#0f172a" strokeWidth="3" />
                
                {/* Label */}
                <text x={x} y={y - 20} textAnchor="middle" fontSize="12" 
                      fill="#cbd5e1" fontWeight="bold" className="font-mono">{vn.hash}°</text>
              </motion.g>
            );
          })}
        </AnimatePresence>

        {/* Traveling Blobs Animation */}
        <AnimatePresence>
            {travelingBlobs.map((blob) => (
                <TravelingBlob 
                    key={blob.id}
                    blob={blob}
                    radius={radius}
                    center={center}
                    onComplete={() => removeTravelingBlob(blob.id)}
                />
            ))}
        </AnimatePresence>
      </svg>
      
      {/* Legend / Stats overlay if needed */}
    </div>
  );
};

// Simple hash-to-color for consistent visualization
function getServerColor(id: number) {
    // Generate neon-ish colors for dark mode
    const hue = (id * 137.508) % 360; 
    return `hsl(${hue}, 85%, 60%)`;
}

// Traveling Blob Component
// Traveling Blob Component
const TravelingBlob: React.FC<{
    blob: BlobData & { serverId: number, targetHash: number };
    radius: number;
    center: number;
    onComplete: () => void;
}> = ({ blob, radius, center, onComplete }) => {
    
    // We animate a value "degree" from startHash to endHash
    // and map that degree to x/y coordinates.
    // This avoids all SVG rotation origin complexity.

    const startAngle = blob.hash;
    let endAngle = blob.targetHash;
    
    // Ensure clockwise movement
    if (endAngle < startAngle) {
        endAngle += 360;
    }

    // Motion values for the animation
    const degree = useMotionValue(startAngle);
    const opacity = useMotionValue(0);
    const scale = useMotionValue(0);

    // Coordinate transforms
    // Note: radian = (degree - 90) * PI / 180
    const x = useTransform(degree, (d: number) => center + (radius - 35) * Math.cos((d - 90) * (Math.PI / 180)));
    const y = useTransform(degree, (d: number) => center + (radius - 35) * Math.sin((d - 90) * (Math.PI / 180)));
    
    // Text is slightly above the blob
    const textY = useTransform(y, (currY: number) => currY - 14);

    React.useEffect(() => {
        // Sequence: Appear -> Wait -> Move -> Disappear
        const sequence = async () => {
            // 1. Appear
            await Promise.all([
                animate(opacity, 1, { duration: 0.3 }),
                animate(scale, 1, { duration: 0.3, type: "spring" })
            ]);
            
            // 2. Wait
            await new Promise(resolve => setTimeout(resolve, 300));

            // 3. Travel
            await animate(degree, endAngle, { 
                duration: 2, 
                ease: "easeInOut" 
            });

            // 4. Disappear (shrink into node)
            await Promise.all([
                animate(opacity, 0, { duration: 0.2 }),
                animate(scale, 0.5, { duration: 0.2 })
            ]);

            onComplete();
        };

        sequence();
    }, []); // Run once on mount

    return (
        <motion.g>
             <motion.circle 
                cx={x} 
                cy={y} 
                r="6" 
                fill="#10b981" 
                stroke="white" 
                strokeWidth="2" 
                style={{ opacity, scale }}
             />
             
             <motion.text 
                x={x} 
                y={textY} 
                textAnchor="middle" 
                fontSize="12" 
                fill="#10b981" 
                fontWeight="bold"
                style={{ opacity, scale }}
             >
                {blob.id}
             </motion.text>
        </motion.g>
    );
};
