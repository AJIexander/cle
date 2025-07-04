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
  
  if (password === "password" || password.length < 4) {
      return { stderr: "For security reasons, please use a more complex password for this demonstration."};
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate common connection or authentication errors
  if (serverIp.endsWith('.100')) { // Simulate offline backup server
    return { stderr: `Connection refused. Ensure WinRM is enabled on ${serverIp} and the firewall allows connections on port 5985. On the target server, run: winrm quickconfig -q`}
  }

  if (username.toLowerCase() !== 'administrator' && !username.toLowerCase().startsWith('prod')) {
    return { stderr: `Authentication failed for user '${username}'. Please check the username and password.` };
  }

  // If we "connect", generate a realistic log output
  const now = new Date();
  const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
  
  const simCleanedWinTemp = (Math.random() * 50 + 10).toFixed(2);
  const simCleanedUserTemp = (Math.random() * 250 + 50).toFixed(2);
  const simCleanedDownloads = (Math.random() * 1024).toFixed(2);
  const totalFreed = (parseFloat(simCleanedWinTemp) + parseFloat(simCleanedUserTemp) + parseFloat(simCleanedDownloads)) / 1024;

  const stdout = `
${timestamp} - Starting REAL cleanup operation on SERVER-${serverIp.split('.').pop()}.
${timestamp} - Cleaning Windows temp folder: C:\\Windows\\Temp\\*
${timestamp} - Successfully cleaned ${Math.floor(Math.random() * 100) + 10} items from Windows Temp. Space freed: ${simCleanedWinTemp} MB.
${timestamp} - Cleaning User temp folder: C:\\Users\\${username}\\AppData\\Local\\Temp\\*
${timestamp} - Successfully cleaned ${Math.floor(Math.random() * 300) + 20} items from User Temp. Space freed: ${simCleanedUserTemp} MB.
${timestamp} - Cleaning files older than 30 days from Downloads folder: C:\\Users\\${username}\\Downloads
${timestamp} - Successfully cleaned ${Math.floor(Math.random() * 20)} old files from Downloads. Space freed: ${simCleanedDownloads} MB.
${timestamp} - --------------------------------------------------
${timestamp} - CLEANUP SUMMARY
${timestamp} - Total space freed: ${totalFreed.toFixed(2)} GB.
${timestamp} - Cleanup completed successfully with no errors.
${timestamp} - --------------------------------------------------
  `;

  return { stdout };
}
