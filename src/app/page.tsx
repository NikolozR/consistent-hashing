"use client";

import { useConsistentHashing } from "@/hooks/useConsistentHashing";
import { RingVisualization } from "@/components/RingVisualization";
import { Controls } from "@/components/Controls";
import { EducationalContent } from "@/components/EducationalContent";

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
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Consistent Hashing <span className="text-indigo-600">Simulator</span>
          </h1>
          <p className="mt-2 text-gray-500">
            Interactive visualization of distributed hashing rings, virtual nodes, and data rebalancing.
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Visualization & Controls (Sticky) */}
          <div className="lg:col-span-5 space-y-8">
             <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-6 sticky top-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-6 text-center">Ring Topology</h2>
                
                <RingVisualization 
                    servers={servers} 
                    virtualNodes={virtualNodes} 
                />
                
                <div className="mt-8">
                    <Controls 
                        onAddServer={addServer}
                        onRemoveServer={removeServer}
                        onAddBlob={addBlob}
                        onRemoveBlob={removeBlob}
                        serverList={servers}
                    />
                </div>
             </div>
          </div>

          {/* Right Column: Educational Content */}
          <div className="lg:col-span-7">
             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 lg:p-12">
                <EducationalContent />
             </div>
          </div>
        </div>
      </div>
    </main>
  );
}
