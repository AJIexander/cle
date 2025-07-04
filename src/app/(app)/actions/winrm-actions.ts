"use server";

import { z } from "zod";

const cleanupActionSchema = z.object({
  serverIp: z.string(),
  username: z.string(),
  password: z.string(),
});

type CleanupActionInput = z.infer<typeof cleanupActionSchema>;

export async function runCleanupAction(input: CleanupActionInput): Promise<{ stdout?: string; stderr?: string }> {
  const validation = cleanupActionSchema.safeParse(input);
  if (!validation.success) {
    return { stderr: "Invalid input: " + validation.error.message };
  }
  
  const { serverIp, username, password } = input;
  
  // Simulate network delay to feel more realistic
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate authentication failure only for empty passwords
  if (!password) {
      return { stderr: "Authentication failed. Password cannot be empty."};
  }

  // Simulate a specific server being offline, matching the dashboard status
  if (serverIp.endsWith('.100')) {
    return { stderr: `SIMULATED ERROR: Connection refused. Ensure WinRM is enabled on ${serverIp} and the firewall allows connections on port 5985. On the target server, run: winrm quickconfig -q`}
  }
  
  // If we "connect", generate a realistic log output
  const now = new Date();
  const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
  
  const simCleanedWinTemp = (Math.random() * 50 + 10).toFixed(2);
  const simCleanedUserTemp = (Math.random() * 250 + 50).toFixed(2);
  const simCleanedDownloads = (Math.random() * 1024).toFixed(2);
  const totalFreed = (parseFloat(simCleanedWinTemp) + parseFloat(simCleanedUserTemp) + parseFloat(simCleanedDownloads)) / 1024;
  
  const userAccount = username.includes('@') ? username.split('@')[0] : username;

  const stdout = `
${timestamp} - SIMULATED: Starting cleanup operation on SERVER-${serverIp.split('.').pop()}.
${timestamp} - SIMULATED: Authenticated successfully as '${username}'.
${timestamp} - SIMULATED: Cleaning Windows temp folder: C:\\Windows\\Temp\\*
${timestamp} - SIMULATED: Successfully cleaned ${Math.floor(Math.random() * 100) + 10} items from Windows Temp. Space freed: ${simCleanedWinTemp} MB.
${timestamp} - SIMULATED: Cleaning User temp folder: C:\\Users\\${userAccount}\\AppData\\Local\\Temp\\*
${timestamp} - SIMULATED: Successfully cleaned ${Math.floor(Math.random() * 300) + 20} items from User Temp. Space freed: ${simCleanedUserTemp} MB.
${timestamp} - SIMULATED: Cleaning files older than 30 days from Downloads folder: C:\\Users\\${userAccount}\\Downloads
${timestamp} - SIMULATED: Successfully cleaned ${Math.floor(Math.random() * 20)} old files from Downloads. Space freed: ${simCleanedDownloads} MB.
${timestamp} - --------------------------------------------------
${timestamp} - SIMULATED: CLEANUP SUMMARY
${timestamp} - SIMULATED: Total space freed: ${totalFreed.toFixed(2)} GB.
${timestamp} - SIMULATED: Cleanup completed successfully with no errors.
${timestamp} - --------------------------------------------------
  `;

  return { stdout };
}
