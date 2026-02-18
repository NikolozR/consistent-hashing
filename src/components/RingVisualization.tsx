"use client";

import React, { useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { Server, BlobData } from '@/lib/consistent-hashing/Server';

interface RingVisualizationProps {
  servers: Server[];
  virtualNodes: { hash: number, serverId: number }[];
  animationEpoch?: number;
}

export const RingVisualization: React.FC<RingVisualizationProps> = ({ servers, virtualNodes, animationEpoch = 0 }) => {
  const radius = 180;
  const center = 250;
  
  const getCoordinates = (degree: number, r: number) => {
    const radian = (degree - 90) * (Math.PI / 180);
    return {
      x: center + r * Math.cos(radian),
      y: center + r * Math.sin(radian),
    };
  };

  const prevBlobsMapRef = React.useRef(new Map<string, { serverId: number, targetHash: number }>());
  const [travelingBlobs, setTravelingBlobs] = React.useState<(BlobData & { serverId: number, targetHash: number, startHash?: number })[]>([]);

  const allBlobs = useMemo(() => {
     return servers.flatMap(s => s.blobs.map(b => ({ ...b, serverId: s.id })));
  }, [servers]);

  const getTargetHash = (blobHash: number, sId: number) => {
      let targetNode = virtualNodes.find(vn => vn.hash >= blobHash && vn.serverId === sId);
      if (!targetNode) {
          const sortedNodes = [...virtualNodes].sort((a, b) => a.hash - b.hash);
          const found = sortedNodes.find(vn => vn.hash >= blobHash);
          targetNode = found || sortedNodes[0];
      }
      return targetNode?.hash || 0;
  };

  const prevEpochRef = React.useRef(animationEpoch);

  React.useEffect(() => {
    const currentBlobsMap = new Map<string, { serverId: number, targetHash: number }>();

    const suppressAnimation = prevEpochRef.current !== animationEpoch;
    prevEpochRef.current = animationEpoch;

    const newTravelingBlobs: (BlobData & { serverId: number, targetHash: number, startHash?: number })[] = [];

    allBlobs.forEach(blob => {
        const targetHash = getTargetHash(blob.hash, blob.serverId);
        currentBlobsMap.set(blob.id, { serverId: blob.serverId, targetHash });

        if (!suppressAnimation) {
            const prevData = prevBlobsMapRef.current.get(blob.id);

            if (!prevData) {
                newTravelingBlobs.push({ ...blob, targetHash });
            } else if (prevData.serverId !== blob.serverId) {
                newTravelingBlobs.push({ 
                    ...blob, 
                    targetHash, 
                    startHash: prevData.targetHash 
                });
            }
        }
    });

    if (newTravelingBlobs.length > 0) {
        setTravelingBlobs(prev => [...prev, ...newTravelingBlobs]);
    }
    
    prevBlobsMapRef.current = currentBlobsMap;
  }, [allBlobs, virtualNodes, animationEpoch]);

  const removeTravelingBlob = (id: string) => {
    setTravelingBlobs(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div className="relative w-[500px] h-[500px] mx-auto scale-90 sm:scale-100 transition-transform">
      <svg width="500" height="500" viewBox="0 0 500 500" className="overflow-visible">
        <circle cx={center} cy={center} r={radius} stroke="#1e293b" strokeWidth="6" fill="transparent" />
        <circle cx={center} cy={center} r={radius} stroke="#334155" strokeWidth="1" strokeDasharray="4 4" fill="transparent" opacity="0.5" />

        <text x={center} y={center} textAnchor="middle" dy=".3em" fontSize="14" fill="#64748b" letterSpacing="0.2em" className="font-mono font-bold opacity-50">
            HASH RING
        </text>

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
                <line x1={center} y1={center} x2={x} y2={y} stroke={color} strokeWidth="1" strokeDasharray="2 4" opacity="0.2" />
                <circle cx={x} cy={y} r="8" fill={color} stroke="#0f172a" strokeWidth="3" />
                <text x={x} y={y - 20} textAnchor="middle" fontSize="12" 
                      fill="#cbd5e1" fontWeight="bold" className="font-mono">#{vn.serverId}</text>
              </motion.g>
            );
          })}
        </AnimatePresence>

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
    </div>
  );
};

function getServerColor(id: number) {
    const hue = (id * 137.508) % 360; 
    return `hsl(${hue}, 85%, 60%)`;
}

const TravelingBlob: React.FC<{
    blob: BlobData & { serverId: number, targetHash: number, startHash?: number };
    radius: number;
    center: number;
    onComplete: () => void;
}> = ({ blob, radius, center, onComplete }) => {
    
    const startAngle = blob.startHash ?? blob.hash;
    let endAngle = blob.targetHash;
    
    if (endAngle < startAngle) {
        endAngle += 360;
    }

    const degree = useMotionValue(startAngle);
    const opacity = useMotionValue(0);
    const scale = useMotionValue(0);

    const x = useTransform(degree, (d: number) => center + (radius - 35) * Math.cos((d - 90) * (Math.PI / 180)));
    const y = useTransform(degree, (d: number) => center + (radius - 35) * Math.sin((d - 90) * (Math.PI / 180)));
    const textY = useTransform(y, (currY: number) => currY - 14);

    React.useEffect(() => {
        const sequence = async () => {
            await Promise.all([
                animate(opacity, 1, { duration: 0.3 }),
                animate(scale, 1, { duration: 0.3, type: "spring" })
            ]);
            
            await new Promise(resolve => setTimeout(resolve, 300));

            await animate(degree, endAngle, { 
                duration: 2, 
                ease: "easeInOut" 
            });

            await Promise.all([
                animate(opacity, 0, { duration: 0.2 }),
                animate(scale, 0.5, { duration: 0.2 })
            ]);

            onComplete();
        };

        sequence();
    }, []);

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
