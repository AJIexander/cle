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
        // Set initial data if nothing is in localStorage
        loadedServers = initialServers;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialServers));
      }
      
      // Simulate live status check on load
      const updatedServersWithStatus = loadedServers.map(server => {
        if (server.ipAddress === '192.168.1.100') { // Keep backup server offline
          return { ...server, status: 'Offline' };
        }
        // Give other servers a random chance to be "offline" to simulate network issues
        const isOnline = Math.random() > 0.1; // 90% chance to be online
        const originalStatus = server.status;
        const newStatus = isOnline ? 'Online' : 'Offline';
        
        // If status changes, use the new one, otherwise respect warning/other states
        return { ...server, status: originalStatus === 'Warning' ? 'Warning' : newStatus };
      });

      setServers(updatedServersWithStatus);

    } catch (error) {
      console.error("Failed to load servers from localStorage", error);
      setServers(initialServers); // Fallback to initial data
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

  const addServer = (server: Omit<Server, 'id' | 'status'>) => {
    // Let's create a more unique ID and default status
    const newServer: Server = { 
        ...server, 
        id: `srv-${new Date().getTime()}-${Math.random().toString(36).substring(2, 7)}`,
        status: 'Online' 
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
