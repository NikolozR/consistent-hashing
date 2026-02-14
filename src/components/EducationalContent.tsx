import React from 'react';

export const EducationalContent: React.FC = () => {
  return (
    <div className="prose prose-slate max-w-none">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Guide</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
        <section>
          <h3 className="font-semibold text-gray-800 mb-2">The Ring</h3>
          <p className="text-gray-600">
            Servers and Data are mapped to a 360° circle. Data belongs to the first server found moving <strong>clockwise</strong>.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-gray-800 mb-2">Dynamic Scaling</h3>
          <p className="text-gray-600">
            <strong>Adding/Removing</strong> a server only affects its immediate neighbors. Most data stays put, making it efficient for distributed systems.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-gray-800 mb-2">The Golden Ratio (φ)</h3>
          <p className="text-gray-600">
             We multiply IDs by a large constant derived from the Golden Ratio (<strong>φ</strong>). This scatters sequential numbers (1, 2, 3...) far apart on the ring, preventing clustering.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-gray-800 mb-2">Virtual Nodes</h3>
          <p className="text-gray-600">
            To prevent uneven load ("hotspots"), each server appears multiple times on the ring (Virtual Nodes). More virtual nodes = more even distribution.
          </p>
        </section>
      </div>
    </div>
  );
};
