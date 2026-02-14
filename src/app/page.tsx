"use client";

import { useConsistentHashing } from "@/hooks/useConsistentHashing";
import { RingVisualization } from "@/components/RingVisualization";
import { Controls } from "@/components/Controls";
import { EducationalContent } from "@/components/EducationalContent";
import { ServerInventory } from "@/components/ServerInventory";

export default function Home() {
  const { 
    servers, 
    virtualNodes, 
    addServer, 
    removeServer, 
    addBlob, 
    removeBlob 
  } = useConsistentHashing();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800/60 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Consistent</span> Hashing
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Distributed System Simulator
            </p>
          </div>
          <div className="text-xs font-mono text-slate-500 border border-slate-800 px-2 py-1 rounded bg-slate-900">
             v1.0.0
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Top: Concise Education */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-8 backdrop-blur-sm">
            <EducationalContent />
        </section>

        {/* Main Content: Visualization + Inventory */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-12">
          
          {/* Left: Visualization & Controls */}
          <div className="lg:col-span-8 flex flex-col gap-6">
             {/* Ring Viz */}
             <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col items-center shadow-2xl shadow-black/20">
                <div className="flex w-full justify-between items-center mb-8">
                    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Topology</h2>
                    <div className="flex gap-2">
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-cyan-500"></span> Active Node
                        </span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-slate-700 border border-slate-600"></span> Virtual Node
                        </span>
                    </div>
                </div>
                <RingVisualization 
                    servers={servers} 
                    virtualNodes={virtualNodes} 
                />
             </div>

             {/* Controls Area */}
             <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <Controls 
                    onAddServer={addServer}
                    onRemoveServer={removeServer}
                    onAddBlob={addBlob}
                    onRemoveBlob={removeBlob}
                    serverList={servers}
                />
             </div>
          </div>

          {/* Right: Server Inventory */}
          <div className="lg:col-span-4 h-full">
             <ServerInventory servers={servers} />
          </div>
        </div>

      </div>
    </main>
  );
}
