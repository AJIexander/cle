"use server";

import { z } from "zod";

const cleanupActionSchema = z.object({
  serverIp: z.string(),
  username: z.string(),
  password: z.string(),
});

type CleanupActionInput = z.infer<typeof cleanupActionSchema>;

function getCurrentTimestamp() {
    return new Date().toISOString().replace('T', ' ').substring(0, 19);
}

/**
 * Simulates running a cleanup script on a remote Windows server.
 * This is a placeholder until a WinRM package can be successfully installed.
 */
export async function runCleanupAction(input: CleanupActionInput): Promise<{ stdout?: string; stderr?: string }> {
  const validation = cleanupActionSchema.safeParse(input);
  if (!validation.success) {
    return { stderr: "Invalid input: " + validation.error.message };
  }

  const { serverIp, username, password } = input;

  if (serverIp === "192.168.1.100") {
      const errorMsg = `${getCurrentTimestamp()} - [SIMULATION MODE] Error: Connection to ${serverIp} failed. The server appears to be offline.`;
      return { stderr: errorMsg };
  }

  if (!password) {
    const errorMsg = `${getCurrentTimestamp()} - [SIMULATION MODE] Error: Authentication failed for user '${username}'. Password cannot be empty.`;
    return { stderr: errorMsg };
  }
  
  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const freedWindowsTemp = (Math.random() * 500 + 100).toFixed(2);
  const freedUserTemp = (Math.random() * 200 + 50).toFixed(2);
  const freedDownloads = (Math.random() * 5000 + 1000).toFixed(2);
  const totalFreed = ((parseFloat(freedWindowsTemp) + parseFloat(freedUserTemp) + parseFloat(freedDownloads)) / 1024).toFixed(2);

  const output = [
    `${getCurrentTimestamp()} - [SIMULATION MODE] Starting simulated cleanup operation on server at ${serverIp}.`,
    `${getCurrentTimestamp()} - [SIMULATION MODE] Authenticated as user: ${username}.`,
    `${getCurrentTimestamp()} - [SIMULATION MODE] Cleaning Windows temp folder...`,
    `${getCurrentTimestamp()} - [SIMULATION MODE] Cleaning User temp folder...`,
    `${getCurrentTimestamp()} - [SIMULATION MODE] Cleaning files older than 30 days from Downloads...`,
    `${getCurrentTimestamp()} - [SIMULATION MODE] --------------------------------------------------`,
    `${getCurrentTimestamp()} - [SIMULATION MODE] CLEANUP SUMMARY`,
    `${getCurrentTimestamp()} - [SIMULATION MODE] Space freed from Windows Temp: ${freedWindowsTemp} MB`,
    `${getCurrentTimestamp()} - [SIMULATION MODE] Space freed from User Temp: ${freedUserTemp} MB`,
    `${getCurrentTimestamp()} - [SIMULATION MODE] Space freed from Downloads: ${freedDownloads} MB`,
    `${getCurrentTimestamp()} - [SIMULATION MODE] Total space freed: ${totalFreed} GB.`,
    `${getCurrentTimestamp()} - [SIMULATION MODE] Cleanup completed successfully.`,
    `${getCurrentTimestamp()} - [SIMULATION MODE] --------------------------------------------------`,
  ].join('\n');

  return { stdout: output };
}
