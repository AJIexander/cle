"use client";
    
import { useState, useEffect } from "react";
import type { Server } from "@/lib/mock-data";
import { initialServers } from "@/lib/mock-data";

const STORAGE_KEY = "sentinel_servers";

export function useServers() {
  const [servers, setServers] = useState<Server[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedServers = localStorage.getItem(STORAGE_KEY);
      let loadedServers: Server[];
      if (storedServers) {
        loadedServers = JSON.parse(storedServers);
      } else {
        loadedServers = initialServers;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialServers));
      }
      
      const updatedServersWithStatus = loadedServers.map(server => {
        if (server.ipAddress === '192.168.1.100') {
          return { ...server, status: 'Offline' };
        }
        const isOnline = Math.random() > 0.1;
        const originalStatus = server.status;
        const newStatus = isOnline ? 'Online' : 'Offline';
        
        const usagePercent = (server.usedDisk / server.totalDisk) * 100;
        let finalStatus: Server['status'] = newStatus;
        if (newStatus === 'Online' && usagePercent > 85) {
            finalStatus = 'Warning';
        } else if (newStatus === 'Online') {
            finalStatus = 'Online';
        }

        return { ...server, status: finalStatus };
      });

      setServers(updatedServersWithStatus);

    } catch (error) {
      console.error("Failed to load servers from localStorage", error);
      setServers(initialServers); 
    }
    setIsLoaded(true);
  }, []);

  const updateStorage = (updatedServers: Server[]) => {
    try {
      setServers(updatedServers);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedServers));
    } catch (error) {
      console.error("Failed to save servers to localStorage", error);
    }
  };

  const addServer = (server: { name: string; ipAddress: string; totalDisk: number; usedDisk: number }) => {
    const usagePercent = (server.usedDisk / server.totalDisk) * 100;
    const status: Server['status'] = usagePercent > 85 ? 'Warning' : 'Online';
    
    const newServer: Server = {
        id: `srv-${new Date().getTime()}-${Math.random().toString(36).substring(2, 7)}`,
        status: status,
        name: server.name,
        ipAddress: server.ipAddress,
        totalDisk: server.totalDisk,
        usedDisk: server.usedDisk,
    };
    const updatedServers = [...servers, newServer];
    updateStorage(updatedServers);
  };

  const deleteServer = (serverId: string) => {
    const updatedServers = servers.filter((server) => server.id !== serverId);
    updateStorage(updatedServers);
  };

  return { servers, addServer, deleteServer, isLoaded };
}
