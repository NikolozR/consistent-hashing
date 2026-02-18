export class Node<T> {
    key: number;
    value: T;
    left: Node<T> | null = null;
    right: Node<T> | null = null;

    constructor(key: number, value: T) {
        this.key = key;
        this.value = value;
    }
}

export class BST<T> {
    root: Node<T> | null = null;

    insert(key: number, value: T): void {
        const newNode = new Node(key, value);
        if (!this.root) {
            this.root = newNode;
            return;
        }
        this.insertNode(this.root, newNode);
    }

    private insertNode(node: Node<T>, newNode: Node<T>): void {
        if (newNode.key < node.key) {
            if (!node.left) {
                node.left = newNode;
            } else {
                this.insertNode(node.left, newNode);
            }
        } else {
            if (!node.right) {
                node.right = newNode;
            } else {
                this.insertNode(node.right, newNode);
            }
        }
    }

    delete(key: number): void {
        this.root = this.deleteNode(this.root, key);
    }

    private deleteNode(node: Node<T> | null, key: number): Node<T> | null {
        if (!node) return null;

        if (key < node.key) {
            node.left = this.deleteNode(node.left, key);
            return node;
        } else if (key > node.key) {
            node.right = this.deleteNode(node.right, key);
            return node;
        }

        if (!node.left && !node.right) {
            return null;
        }

        if (!node.left) {
            return node.right;
        }

        if (!node.right) {
            return node.left;
        }

        const minRight = this.findMinNode(node.right);
        node.key = minRight.key;
        node.value = minRight.value;
        node.right = this.deleteNode(node.right, minRight.key);
        return node;
    }

    findMinNode(node: Node<T>): Node<T> {
        let current = node;
        while (current.left) {
            current = current.left;
        }
        return current;
    }

    findMaxNode(node: Node<T>): Node<T> {
        let current = node;
        while (current.right) {
            current = current.right;
        }
        return current;
    }

    findSuccessor(key: number): Node<T> | null {
        let successor: Node<T> | null = null;
        let current = this.root;

        while (current) {
            if (current.key >= key) {
                successor = current;
                current = current.left;
            } else {
                current = current.right;
            }
        }
        return successor;
    }

    findMin(): Node<T> | null {
        if (!this.root) return null;
        return this.findMinNode(this.root);
    }

    inOrderTraversal(): Node<T>[] {
        const result: Node<T>[] = [];
        this.inOrder(this.root, result);
        return result;
    }

    private inOrder(node: Node<T> | null, result: Node<T>[]): void {
        if (node) {
            this.inOrder(node.left, result);
            result.push(node);
            this.inOrder(node.right, result);
        }
    }
}
