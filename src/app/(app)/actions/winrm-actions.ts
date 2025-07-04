"use server";

import { z } from "zod";
import { initialServers } from "@/lib/mock-data";

const cleanupActionSchema = z.object({
  serverIp: z.string(),
  username: z.string(),
  password: z.string(),
});

type CleanupActionInput = z.infer<typeof cleanupActionSchema>;

/**
 * SIMULATED cleanup script execution.
 * This simulates connecting to a server and running cleanup tasks.
 * The actual `node-winrm` package could not be installed due to network/environment issues.
 */
export async function runCleanupAction(input: CleanupActionInput): Promise<{ stdout?: string; stderr?: string }> {
  const validation = cleanupActionSchema.safeParse(input);
  if (!validation.success) {
    return { stderr: "Invalid input: " + validation.error.message };
  }

  const { serverIp, username, password } = input;

  // Simulate authentication failure
  if (!password) {
    return { stderr: "[SIMULATION MODE] Authentication failed. Password cannot be empty." };
  }
  
  // Find server to check its status from the mock data, as we can't fetch it live.
  const server = initialServers.find(s => s.ipAddress === serverIp);

  // Simulate connection failure for offline servers
  if (server && server.status === 'Offline') {
    return { stderr: `[SIMULATION MODE] Network error connecting to ${serverIp}:5985. Server is offline.` };
  }

  // Simulate a successful execution with dynamic output
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const freedWinTemp = (Math.random() * 500).toFixed(2);
  const freedUserTemp = (Math.random() * 200).toFixed(2);
  const freedDownloads = (Math.random() * 5000).toFixed(2);
  const totalFreed = ((parseFloat(freedWinTemp) + parseFloat(freedUserTemp) + parseFloat(freedDownloads)) / 1024).toFixed(2);

  const stdout = `
[SIMULATION MODE] - This is not a real execution.

${now} - Starting simulated cleanup on server ${serverIp}.
${now} - Authenticating user: ${username}.
${now} - Cleaning Windows system temp folder...
${now} - Cleaning user temp folder...
${now} - Cleaning files older than 30 days from Downloads folder...
${now} - --------------------------------------------------
${now} - CLEANUP SUMMARY
${now} - Freed in Windows Temp: ${freedWinTemp} MB
${now} - Freed in User Temp: ${freedUserTemp} MB
${now} - Freed in Downloads: ${freedDownloads} MB
${now} - Total space freed: ${totalFreed} GB.
${now} - Cleanup completed successfully.
${now} - --------------------------------------------------
  `.trim();

  return new Promise((resolve) => {
    setTimeout(() => {
        resolve({ stdout: stdout, stderr: "" });
    }, 1500); // Simulate network and script execution delay
  });
}
