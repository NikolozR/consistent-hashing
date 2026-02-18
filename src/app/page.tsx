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
    removeBlob,
    globalWeight,
    setGlobalWeight,
    error,
    clearError,
    animationEpoch
  } = useConsistentHashing();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 flex flex-col">
      
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
          <a 
            href="https://github.com/NikolozR" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs font-mono text-slate-500 border border-slate-800 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 hover:text-slate-300 hover:border-slate-700 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
            GitHub
          </a>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        
        <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-8 backdrop-blur-sm">
            <EducationalContent />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-12">
          
          <div className="lg:col-span-8 flex flex-col gap-6">
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
                    animationEpoch={animationEpoch}
                />
             </div>

             <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <Controls 
                    onAddServer={addServer}
                    onRemoveServer={removeServer}
                    onAddBlob={addBlob}
                    onRemoveBlob={removeBlob}
                    onSetWeight={setGlobalWeight}
                    globalWeight={globalWeight}
                    serverList={servers}
                    error={error}
                    onClearError={clearError}
                />
             </div>
          </div>

          <div className="lg:col-span-4 h-full">
             <ServerInventory servers={servers} />
          </div>
        </div>

      </div>

      <footer className="border-t border-slate-800/60 bg-slate-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">CH</span>
            </div>
            <p className="text-xs text-slate-500">
              Built by <a href="https://github.com/NikolozR" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors font-medium">Nikoloz Rusishvili</a>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com/NikolozR/consistent-hashing" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
              Source Code
            </a>
            <span className="text-slate-800">·</span>
            <span className="text-xs text-slate-600">
              Next.js · TypeScript · Framer Motion
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
