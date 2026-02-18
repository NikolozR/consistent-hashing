export type BlobData = {
    id: string;
    hash: number;
};

export class Server {
    id: number;
    weight: number;
    blobs: BlobData[];
    baseHash: number;

    constructor(id: number, weight: number = 1) {
        this.id = id;
        this.weight = weight;
        this.blobs = [];
        this.baseHash = this.calculateHash();
    }

    private calculateHash(): number {
        const hash = (this.id * 2654435761) % 4294967296;
        return Math.floor((Math.abs(hash) / 4294967296) * 360);
    }

    addBlob(blob: BlobData) {
        this.blobs.push(blob);
    }

    removeBlob(blobId: string): BlobData | undefined {
        const index = this.blobs.findIndex((b) => b.id === blobId);
        if (index !== -1) {
            return this.blobs.splice(index, 1)[0];
        }
        return undefined;
    }
}
