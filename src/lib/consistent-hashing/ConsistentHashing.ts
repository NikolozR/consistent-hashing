import { BST, Node } from './BST';
import { Server, BlobData } from './Server';

export class ConsistentHashing {
    serverBST: BST<Server>;
    servers: Map<number, Server>;
    virtualNodesMap: Map<number, Server>;

    globalWeight: number = 1;

    constructor() {
        this.serverBST = new BST<Server>();
        this.servers = new Map();
        this.virtualNodesMap = new Map();
    }

    hash(input: string): number {
        let hash = 2166136261;
        for (let i = 0; i < input.length; i++) {
            hash ^= input.charCodeAt(i);
            hash = Math.imul(hash, 16777619);
        }
        return (hash >>> 0) % 360;
    }

    addServer(server: Server): void {
        if (this.servers.has(server.id)) {
            throw new Error(`Server with ID ${server.id} already exists.`);
        }

        server.weight = this.globalWeight;
        this.servers.set(server.id, server);
        this.redistributeAllNodes();
    }

    removeServer(serverId: number): void {
        const server = this.servers.get(serverId);
        if (!server) return;

        this.servers.delete(serverId);
        this.redistributeAllNodes();
    }

    addBlob(data: string): void {
        for (const server of this.servers.values()) {
            if (server.blobs.some(b => b.id === data)) {
                throw new Error(`Data "${data}" already exists in the ring.`);
            }
        }

        const hash = this.hash(data);
        const blob: BlobData = { id: data, hash };

        const targetServer = this.getServerForHash(hash);
        if (targetServer) {
            targetServer.addBlob(blob);
        } else {
            throw new Error("No servers available. Add a node first.");
        }
    }

    removeBlob(data: string): void {
        const hash = this.hash(data);
        const targetServer = this.getServerForHash(hash);
        if (targetServer) {
            targetServer.removeBlob(data);
        }
    }

    getServerForHash(hash: number): Server | null {
        if (this.serverBST.root === null) return null;

        let node = this.serverBST.findSuccessor(hash);

        if (!node) {
            node = this.serverBST.findMin();
        }

        return node ? node.value : null;
    }

    private getResponsibleNode(hash: number): Node<Server> | null {
        if (this.serverBST.root === null) return null;
        let node = this.serverBST.findSuccessor(hash);
        if (!node) node = this.serverBST.findMin();
        return node;
    }

    private rebalanceAfterAdd(newNodeHash: number, newServer: Server) {
        let successorNode = this.serverBST.findSuccessor((newNodeHash + 1) % 360);
        if (!successorNode) successorNode = this.serverBST.findMin();

        if (!successorNode || successorNode.value === newServer) return;

        const successorServer = successorNode.value;
        const blobsToMove: BlobData[] = [];
        const keptBlobs: BlobData[] = [];

        successorServer.blobs.forEach(blob => {
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
        let successorNode = this.serverBST.findSuccessor((nodeHashToRemove + 1) % 360);
        if (!successorNode) successorNode = this.serverBST.findMin();

        if (!successorNode) return;

        const targetServer = successorNode.value;

        if (targetServer !== serverToRemove) {
            const newBlobs: BlobData[] = [];
            const movingBlobs: BlobData[] = [];

            serverToRemove.blobs.forEach(blob => {
                const responsibleNode = this.getResponsibleNode(blob.hash);

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

    setGlobalWeight(weight: number): void {
        if (weight < 1) return;
        this.globalWeight = weight;

        this.servers.forEach(server => {
            server.weight = weight;
        });

        this.redistributeAllNodes();
    }

    private redistributeAllNodes(): void {
        const allBlobs: string[] = [];
        this.servers.forEach(server => {
            server.blobs.forEach(b => allBlobs.push(b.id));
            server.blobs = [];
        });

        this.virtualNodesMap.clear();
        this.serverBST = new BST<Server>();

        const sortedServers = Array.from(this.servers.values()).sort((a, b) => a.id - b.id);
        if (sortedServers.length === 0) return;

        const weight = this.globalWeight;
        const totalVirtualNodes = sortedServers.length * weight;
        const slotSize = 360 / totalVirtualNodes;

        for (let i = 0; i < totalVirtualNodes; i++) {
            const hash = Math.round(i * slotSize) % 360;
            const server = sortedServers[i % sortedServers.length];

            this.virtualNodesMap.set(hash, server);
            this.serverBST.insert(hash, server);
        }

        allBlobs.forEach(data => {
            this.addBlob(data);
        });
    }
}
