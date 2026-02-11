import { BST, Node } from './BST';
import { Server, BlobData } from './Server';

export class ConsistentHashing {
    serverBST: BST<Server>;
    servers: Map<number, Server>; // Keep track of all real servers by ID
    virtualNodesMap: Map<number, Server>; // Map hash to real server instance

    constructor() {
        this.serverBST = new BST<Server>();
        this.servers = new Map();
        this.virtualNodesMap = new Map();
    }

    // Helper hash function for arbitrary strings to 0-359
    hash(input: string): number {
        let hash = 0;
        for (let i = 0; i < input.length; i++) {
            const char = input.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash;
        }
        return Math.abs(hash) % 360;
    }

    addServer(server: Server): void {
        if (this.servers.has(server.id)) {
            throw new Error(`Server with ID ${server.id} already exists.`);
        }

        this.servers.set(server.id, server);

        // Add virtual nodes
        for (let i = 0; i < server.weight; i++) {
            // Create a unique identifier for the virtual node to hash
            const virtualNodeId = `${server.id}-VN-${i}`;
            const hash = this.hash(virtualNodeId);

            // Handle collision resolution simply for simulation: linear probe
            let finalHash = hash;
            while (this.virtualNodesMap.has(finalHash)) {
                finalHash = (finalHash + 1) % 360;
            }

            this.virtualNodesMap.set(finalHash, server);
            this.serverBST.insert(finalHash, server);

            this.rebalanceAfterAdd(finalHash, server);
        }
    }

    removeServer(serverId: number): void {
        const server = this.servers.get(serverId);
        if (!server) return;

        // Remove all virtual nodes
        // We need to find all keys in virtualNodesMap that point to this server
        const hashesToRemove: number[] = [];
        this.virtualNodesMap.forEach((s, hash) => {
            if (s.id === serverId) {
                hashesToRemove.push(hash);
            }
        });

        hashesToRemove.forEach(hash => {
            // Before removing, redistribute blobs
            this.rebalanceBeforeRemove(hash, server);

            this.virtualNodesMap.delete(hash);
            this.serverBST.delete(hash);
        });

        this.servers.delete(serverId);
    }

    addBlob(data: string): void {
        const hash = this.hash(data);
        const blob: BlobData = { id: data, hash };

        // Check if duplicate blob data already exists to prevent confusion? 
        // Or just allow it. Consistent hashing usually handles identical keys identically.

        const targetServer = this.getServerForHash(hash);
        if (targetServer) {
            targetServer.addBlob(blob);
        } else {
            // No servers in the ring
            console.warn("No servers available to store blob");
        }
    }

    removeBlob(data: string): void {
        const hash = this.hash(data);
        const targetServer = this.getServerForHash(hash);
        if (targetServer) {
            targetServer.removeBlob(data);
        }
    }

    // Core logic: Find the server for a given hash
    getServerForHash(hash: number): Server | null {
        if (this.serverBST.root === null) return null;

        // Find successor
        let node = this.serverBST.findSuccessor(hash);

        // Wrap around: if no successor (hash > all node hashes), use min
        if (!node) {
            node = this.serverBST.findMin();
        }

        return node ? node.value : null;
    }

    // Helper to find the specific Node (not just Server value) responsible
    private getResponsibleNode(hash: number): Node<Server> | null {
        if (this.serverBST.root === null) return null;
        let node = this.serverBST.findSuccessor(hash);
        if (!node) node = this.serverBST.findMin();
        return node;
    }

    private rebalanceAfterAdd(newNodeHash: number, newServer: Server) {
        // Find successor of the new node (which is actually the node that currently holds the keys that might need to move)
        // Since we just inserted newNode, finding successor of newNodeHash will return newNode itself.
        // We need the NEXT node in the ring.
        let successorNode = this.serverBST.findSuccessor((newNodeHash + 1) % 360);
        if (!successorNode) successorNode = this.serverBST.findMin();

        if (!successorNode || successorNode.value === newServer) return; // Only one server or same server

        const successorServer = successorNode.value;
        const blobsToMove: BlobData[] = [];
        const keptBlobs: BlobData[] = [];

        // We need to check all blobs in the successor server
        // And move those that should now belong to the new node
        successorServer.blobs.forEach(blob => {
            // Calculate which server this blob *should* belong to now
            // We can use getServerForHash, effectively simulating the "new state" logic
            const responsibleNode = this.getResponsibleNode(blob.hash);
            if (responsibleNode && responsibleNode.value === newServer) {
                blobsToMove.push(blob);
            } else {
                keptBlobs.push(blob);
            }
        });

        successorServer.blobs = keptBlobs;
        blobsToMove.forEach(b => newServer.addBlob(b));
    }

    private rebalanceBeforeRemove(nodeHashToRemove: number, serverToRemove: Server) {
        // "Move the BLOBs from theta into its successor server."
        // We are removing a specific Virtual Node (VN) at `nodeHashToRemove`.
        // The blobs that mapped to this specific VN now need to go to the successor of this VN.

        let successorNode = this.serverBST.findSuccessor((nodeHashToRemove + 1) % 360);
        if (!successorNode) successorNode = this.serverBST.findMin();

        // If the successor is the same node (only 1 node left), user is clearing the last node.
        if (!successorNode) return;

        const targetServer = successorNode.value;

        if (targetServer !== serverToRemove) {
            const newBlobs: BlobData[] = [];
            const movingBlobs: BlobData[] = [];

            serverToRemove.blobs.forEach(blob => {
                // Check if this blob was actually mapping to the VN we are removing.
                const responsibleNode = this.getResponsibleNode(blob.hash);

                // If the blob maps to the VN we are removing, it must move.
                // Note: getResponsibleNode runs against the BST. The node `nodeHashToRemove` is STILL in the BST.
                // So if the blob belongs to it, `responsibleNode.key` will equal `nodeHashToRemove`.
                if (responsibleNode && responsibleNode.key === nodeHashToRemove) {
                    movingBlobs.push(blob);
                } else {
                    newBlobs.push(blob);
                }
            });

            serverToRemove.blobs = newBlobs;
            movingBlobs.forEach(b => targetServer.addBlob(b));
        }
    }

    // Getters for UI
    getAllServers(): Server[] {
        return Array.from(this.servers.values());
    }

    getAllVirtualNodes(): { hash: number, serverId: number }[] {
        const nodes: { hash: number, serverId: number }[] = [];
        const traversal = this.serverBST.inOrderTraversal();
        traversal.forEach(node => {
            nodes.push({ hash: node.key, serverId: node.value.id });
        });
        return nodes;
    }
}
