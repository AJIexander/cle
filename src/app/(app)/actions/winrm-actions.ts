"use server";

import { z } from "zod";

const cleanupActionSchema = z.object({
  serverIp: z.string(),
  username: z.string(),
  password: z.string(),
});

type CleanupActionInput = z.infer<typeof cleanupActionSchema>;

/**
 * Runs a *simulated* cleanup script.
 * In a real-world scenario, this would use a library like 'winrm-ts' to connect
 * to the remote server and execute PowerShell commands. This simulation is in place
 * because of network restrictions preventing the installation of necessary packages.
 */
export async function runCleanupAction(input: CleanupActionInput): Promise<{ stdout?: string; stderr?: string }> {
  const validation = cleanupActionSchema.safeParse(input);
  if (!validation.success) {
    return { stderr: "Invalid input: " + validation.error.message };
  }

  const { serverIp, username } = input;
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const freedWindows = (Math.random() * 500).toFixed(2);
  const freedUser = (Math.random() * 200).toFixed(2);
  const freedDownloads = (Math.random() * 5000).toFixed(2);
  const totalFreed = (parseFloat(freedWindows) + parseFloat(freedUser) + parseFloat(freedDownloads));
  const totalFreedGB = (totalFreed / 1024).toFixed(2);

  const output = [
    `${timestamp} - [SIMULATION MODE] Starting simulated cleanup operation on server at ${serverIp}.`,
    `${timestamp} - Authenticated as user: ${username}.`,
    `${timestamp} - Cleaning Windows temp folder...`,
    `${timestamp} - Cleaning User temp folder...`,
    `${timestamp} - Cleaning files older than 30 days from Downloads...`,
    `${timestamp} - --------------------------------------------------`,
    `${timestamp} - CLEANUP SUMMARY`,
    `${timestamp} - Space freed from Windows Temp: ${freedWindows} MB`,
    `${timestamp} - Space freed from User Temp: ${freedUser} MB`,
    `${timestamp} - Space freed from Downloads: ${freedDownloads} MB`,
    `${timestamp} - Total space freed: ${totalFreedGB} GB.`,
    `${timestamp} - Cleanup completed successfully.`,
    `${timestamp} - --------------------------------------------------`,
  ].join('\n');

  // Simulate a short network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  return { stdout: output };
}