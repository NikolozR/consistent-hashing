"use client";

import { useState, useCallback, useRef } from 'react';
import { ConsistentHashing } from '@/lib/consistent-hashing/ConsistentHashing';
import { Server } from '@/lib/consistent-hashing/Server';

export type ErrorInfo = {
    message: string;
    type: 'node' | 'data';
};

export function useConsistentHashing() {
    const [ch] = useState(() => new ConsistentHashing());
    const [servers, setServers] = useState<Server[]>([]);
    const [virtualNodes, setVirtualNodes] = useState<{ hash: number, serverId: number }[]>([]);
    const [globalWeight, setGlobalWeightState] = useState(1);
    const [version, setVersion] = useState(0);
    const [error, setError] = useState<ErrorInfo | null>(null);
    const [animationEpoch, setAnimationEpoch] = useState(0);
    const errorTimerRef = useRef<NodeJS.Timeout | null>(null);

    const showError = useCallback((message: string, type: 'node' | 'data') => {
        if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
        setError({ message, type });
        errorTimerRef.current = setTimeout(() => setError(null), 4000);
    }, []);

    const clearError = useCallback(() => {
        if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
        setError(null);
    }, []);

    const refreshState = useCallback(() => {
        setServers([...ch.getAllServers()]);
        setVirtualNodes(ch.getAllVirtualNodes());
        setGlobalWeightState(ch.globalWeight);
        setVersion(v => v + 1);
    }, [ch]);

    const setGlobalWeight = useCallback((weight: number) => {
        ch.setGlobalWeight(weight);
        setAnimationEpoch(e => e + 1);
        refreshState();
    }, [ch, refreshState]);

    const addServer = useCallback((id: number) => {
        try {
            ch.addServer(new Server(id));
            refreshState();
        } catch (e: any) {
            showError(e.message, 'node');
        }
    }, [ch, refreshState, showError]);

    const removeServer = useCallback((id: number) => {
        ch.removeServer(id);
        refreshState();
    }, [ch, refreshState]);

    const addBlob = useCallback((data: string) => {
        try {
            ch.addBlob(data);
            refreshState();
        } catch (e: any) {
            showError(e.message, 'data');
        }
    }, [ch, refreshState, showError]);

    const removeBlob = useCallback((data: string) => {
        ch.removeBlob(data);
        refreshState();
    }, [ch, refreshState]);

    return {
        servers,
        virtualNodes,
        globalWeight,
        addServer,
        removeServer,
        addBlob,
        removeBlob,
        setGlobalWeight,
        version,
        error,
        clearError,
        animationEpoch
    };
}
