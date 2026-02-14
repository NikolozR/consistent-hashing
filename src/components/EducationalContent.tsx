"use client";
import React from 'react';

export const EducationalContent: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <span className="w-1 h-5 bg-cyan-500 rounded-full"></span> Quick Guide
        </h2>
        <button 
            onClick={() => document.getElementById('simulation-controls')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-xs bg-cyan-900/30 text-cyan-400 border border-cyan-800/50 px-3 py-1.5 rounded-full hover:bg-cyan-900/50 transition-colors flex items-center gap-2"
        >
            Try Simulation &darr;
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
        <section>
          <h3 className="font-semibold text-cyan-400 mb-2 uppercase tracking-wider text-xs">The Ring</h3>
          <p className="text-slate-400 leading-relaxed">
            Servers and Data are mapped to a 360° circle. Data belongs to the first server found moving <strong className="text-slate-200">clockwise</strong>.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-cyan-400 mb-2 uppercase tracking-wider text-xs">Dynamic Scaling</h3>
          <p className="text-slate-400 leading-relaxed">
            <strong className="text-slate-200">Adding/Removing</strong> a server only affects its immediate neighbors. Most data stays put, making it efficient for distributed systems.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-cyan-400 mb-2 uppercase tracking-wider text-xs">The Golden Ratio (φ)</h3>
          <p className="text-slate-400 leading-relaxed">
             We multiply IDs by a large constant derived from the Golden Ratio (<strong className="text-slate-200">φ</strong>). This scatters sequential numbers (1, 2, 3...) far apart on the ring, preventing clustering.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-cyan-400 mb-2 uppercase tracking-wider text-xs">Virtual Nodes</h3>
          <p className="text-slate-400 leading-relaxed">
            To prevent uneven load ("hotspots"), each server appears multiple times on the ring (Virtual Nodes). More virtual nodes = more even distribution.
          </p>
        </section>
      </div>
    </div>
  );
};
