"use client";

import { useState, useCallback, useEffect } from 'react';
import { ConsistentHashing } from '@/lib/consistent-hashing/ConsistentHashing';
import { Server, BlobData } from '@/lib/consistent-hashing/Server';

// We need a wrapper to force React re-renders since the CH class manages its own state
export function useConsistentHashing() {
    const [ch] = useState(() => new ConsistentHashing());
    const [servers, setServers] = useState<Server[]>([]);
    const [virtualNodes, setVirtualNodes] = useState<{ hash: number, serverId: number }[]>([]);
    const [version, setVersion] = useState(0); // Tick to force update

    const refreshState = useCallback(() => {
        setServers([...ch.getAllServers()]); // Spread to create new reference
        setVirtualNodes(ch.getAllVirtualNodes());
        setVersion(v => v + 1);
    }, [ch]);

    const addServer = useCallback((id: number, weight?: number) => {
        try {
            ch.addServer(new Server(id, weight));
            refreshState();
        } catch (e: any) {
            alert(e.message);
        }
    }, [ch, refreshState]);

    const removeServer = useCallback((id: number) => {
        ch.removeServer(id);
        refreshState();
    }, [ch, refreshState]);

    const addBlob = useCallback((data: string) => {
        ch.addBlob(data);
        refreshState();
    }, [ch, refreshState]);

    const removeBlob = useCallback((data: string) => {
        ch.removeBlob(data);
        refreshState();
    }, [ch, refreshState]);

    return {
        servers,
        virtualNodes,
        addServer,
        removeServer,
        addBlob,
        removeBlob,
        version
    };
}
