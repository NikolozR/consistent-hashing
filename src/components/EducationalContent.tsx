import React from 'react';

export const EducationalContent: React.FC = () => {
  return (
    <div className="prose prose-slate max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">How Consistent Hashing Works</h2>
      
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">The Problem: Web Scale</h3>
        <p className="text-gray-600 leading-relaxed">
          Imagine you need to store millions of photos (or "blobs") across multiple servers. You want to distribute them evenly so no single server gets overwhelmed. 
          The challenge is: <strong>how do you know which server holds which photo?</strong>
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">The Solution: The Ring</h3>
        <p className="text-gray-600 leading-relaxed mb-4">
          Consistent Hashing places everything on a <strong>360° circle</strong> (or "ring").
        </p>
        <ul className="list-disc pl-5 space-y-3 text-gray-600">
            <li>
                <strong>Servers</strong> are placed on the ring based on their numeric ID (e.g., Server 1, Server 2).
            </li>
            <li>
                <strong>Data (Blobs)</strong> are also placed on the ring based on their content.
            </li>
        </ul>
        <p className="text-gray-600 leading-relaxed mt-4 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
           <strong>The Rule:</strong> To find where a piece of data lives, you simply go 
           <strong> clockwise</strong> around the ring from the data's position until you hit a server. That server is the owner.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">What happens when servers change?</h3>
        <div className="space-y-4">
            <div>
                <h4 className="font-medium text-gray-900">Adding a Server</h4>
                <p className="text-gray-600 text-sm mt-1">
                    When you add a new server, it places itself on the ring. It then "steals" some data from the server directly ahead of it. 
                    Crucially, <strong>only a small amount of data needs to move</strong>. The rest of the ring is unaffected.
                </p>
            </div>
            <div>
                <h4 className="font-medium text-gray-900">Removing a Server</h4>
                <p className="text-gray-600 text-sm mt-1">
                    If a server crashes or is removed, its data isn't lost. The standard rule applies: 
                    the data that used to hit this server now just keeps going clockwise to the <strong>next available server</strong>.
                </p>
            </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Why "Virtual Nodes"?</h3>
        <p className="text-gray-600 leading-relaxed">
            In the real world, random placement can be unlucky. You might get three servers bunched up close together, leaving a huge gap (and a huge load) for one poor server.
        </p>
        <p className="text-gray-600 leading-relaxed mt-2">
            To fix this, we use <strong>Virtual Nodes</strong>. Instead of placing a server on the ring once, we place it 10 or 100 times at different random spots. 
            This statistically guarantees the load is spread out evenly, even if you only have a few physical servers.
        </p>
      </section>
    </div>
  );
};
