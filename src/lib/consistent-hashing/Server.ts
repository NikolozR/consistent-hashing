export type BlobData = {
    id: string; // The data/value of the blob
    hash: number; // The hash value (0-359)
};

export class Server {
    id: number;
    weight: number;
    blobs: BlobData[];
    baseHash: number; // The hash of the server itself (0-359)

    constructor(id: number, weight: number = 1) {
        this.id = id;
        this.weight = weight;
        this.blobs = [];
        this.baseHash = this.calculateHash();
    }

    // Simple hash function using the ID directly
    // We can just use the ID modulo 360 if the user enters a number 0-360, 
    // or hash it if they enter a larger number.
    // To keep it predictable for education: let's treat the Input ID as the "Raw Value"
    // and hash it. For simplicity in visualization, we can just use (id * 97) % 360 
    // or something that spreads them out but is deterministic and simple.
    // OR: User inputs the ANGLE directly? 
    // "Sevre naming only done by a number input" -> likely implies ID=1, ID=2.
    private calculateHash(): number {
        // Simple mixing integer hash to spread 1, 2, 3... around the ring
        // defined as (id * 2654435761) % 2^32, then mapped to 360.
        // Knuth's multiplicative hash.
        const hash = (this.id * 2654435761) % 4294967296;
        return Math.floor((Math.abs(hash) / 4294967296) * 360);
    }

    addBlob(blob: BlobData) {
        this.blobs.push(blob);
    }

    removeBlob(blobId: string): BlobData | undefined {
        // Blobs might still use string IDs? "data content"? 
        // The prompt only said "Server naming". Let's keep blobs as string data for now.
        const index = this.blobs.findIndex((b) => b.id === blobId);
        if (index !== -1) {
            return this.blobs.splice(index, 1)[0];
        }
        return undefined;
    }
}
