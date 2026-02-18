# Consistent Hashing — Interactive Simulator

An interactive visualization of **Consistent Hashing**, the algorithm behind distributed systems like DynamoDB, Cassandra, and load balancers.

Add servers, insert data, and watch the hash ring rebalance in real-time with smooth animations.

## Features

- **Hash Ring Visualization** — 360° ring with animated node placement and data routing
- **Live Redistribution** — See data migrate between servers when nodes are added or removed
- **Virtual Nodes** — Configurable virtual node count for even load distribution
- **FNV-1a Hashing** — Data points are hashed using an FNV-1a variant for uniform distribution
- **Even Node Placement** — Server nodes are deterministically spread at equal intervals
- **Error Handling** — Inline toast notifications for duplicate entries
- **Responsive Design** — Works on desktop and mobile

## Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** — Ring animations and blob travel effects
- **Custom BST** — Binary Search Tree for efficient hash lookups

## Architecture

```
src/
├── lib/consistent-hashing/
│   ├── BST.ts                 # Binary Search Tree for the hash ring
│   ├── ConsistentHashing.ts   # Core algorithm (add/remove servers, hash, rebalance)
│   └── Server.ts              # Server and BlobData models
├── hooks/
│   └── useConsistentHashing.ts # React state wrapper around the CH engine
├── components/
│   ├── RingVisualization.tsx   # SVG ring with animated nodes and traveling blobs
│   ├── Controls.tsx            # Add server/data inputs with error toasts
│   ├── ServerInventory.tsx     # Real-time server stats panel
│   └── EducationalContent.tsx  # Quick guide section
└── app/
    ├── layout.tsx              # Root layout with meta tags
    └── page.tsx                # Main page composition
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## How It Works

1. **The Ring**: A 360° circle where both servers and data are mapped
2. **Adding a Server**: Virtual nodes are placed at evenly-spaced positions around the ring
3. **Adding Data**: Data is hashed (FNV-1a) to a position on the ring, then assigned to the first server node found clockwise
4. **Rebalancing**: When servers are added/removed, only affected data migrates — most data stays put

## License

MIT
