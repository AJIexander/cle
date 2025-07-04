"use server";

import { z } from "zod";

const cleanupActionSchema = z.object({
  serverIp: z.string(),
  username: z.string(),
  password: z.string(),
});

type CleanupActionInput = z.infer<typeof cleanupActionSchema>;

// This is a high-fidelity SIMULATION. The real 'node-winrm' package cannot be installed
// in the current environment due to network restrictions. This simulation allows the
// application to be installed and run for development and testing purposes.
export async function runCleanupAction(input: CleanupActionInput): Promise<{ stdout?: string; stderr?: string }> {
  const validation = cleanupActionSchema.safeParse(input);
  if (!validation.success) {
    return { stderr: "Invalid input: " + validation.error.message };
  }

  const { serverIp, username, password } = input;

  // Simulate authentication failure for empty password
  if (!password) {
    return { stderr: "Authentication failed. Password cannot be empty." };
  }

  // Simulate connection error for a specific "offline" server
  if (serverIp === '192.168.1.100') {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    return { stderr: `Connection or Script Error: connect ETIMEDOUT ${serverIp}:5985` };
  }
  
  // Simulate successful execution
  await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate script execution time

  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const freedSpace = (Math.random() * 5 + 1).toFixed(2); // Random freed space between 1 and 6 GB
  const winTempFreed = (Math.random() * 500).toFixed(2);
  const userTempFreed = (Math.random() * 2000).toFixed(2);
  const downloadsFreed = (parseFloat(freedSpace) * 1024 - parseFloat(winTempFreed) - parseFloat(userTempFreed)).toFixed(2);
  
  const stdout = `
${timestamp} - Starting simulated cleanup operation on server at ${serverIp}.
${timestamp} - Authenticated as user: ${username}.
${timestamp} - Cleaning Windows temp folder...
${timestamp} - Cleaning User temp folder...
${timestamp} - Cleaning files older than 30 days from Downloads...
${timestamp} - --------------------------------------------------
${timestamp} - CLEANUP SUMMARY
${timestamp} - Space freed from Windows Temp: ${winTempFreed} MB
${timestamp} - Space freed from User Temp: ${userTempFreed} MB
${timestamp} - Space freed from Downloads: ${downloadsFreed} MB
${timestamp} - Total space freed: ${freedSpace} GB.
${timestamp} - Cleanup completed successfully.
${timestamp} - --------------------------------------------------
  `;

  return { stdout, stderr: "" };
}