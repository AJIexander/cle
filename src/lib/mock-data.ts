export type Server = {
  id: string;
  name: string;
  status: 'Online' | 'Offline' | 'Warning';
  totalDisk: number;
  usedDisk: number;
  ipAddress: string;
};

export type Recommendation = {
  id: string;
  server: string;
  name: string;
  path: string;
  size: number;
  type: 'File' | 'Folder';
  lastModified: string;
  reason: string;
};

export type LogEntry = {
  id: number;
  timestamp: string;
  message: string;
  level: 'INFO' | 'WARNING' | 'ERROR';
};

// This is now the initial default list if localStorage is empty.
export const initialServers: Server[] = [
  { id: 'srv-001', name: 'PROD-WEB-01', status: 'Online', totalDisk: 500, usedDisk: 450, ipAddress: '192.168.1.10' },
  { id: 'srv-002', name: 'PROD-DB-01', status: 'Online', totalDisk: 1024, usedDisk: 800, ipAddress: '192.168.1.11' },
  { id: 'srv-003', name: 'DEV-APP-01', status: 'Warning', totalDisk: 250, usedDisk: 220, ipAddress: '10.0.0.5' },
  { id: 'srv-004', name: 'STAGING-CACHE', status: 'Online', totalDisk: 100, usedDisk: 30, ipAddress: '10.0.0.21' },
  { id: 'srv-005', name: 'BACKUP-01', status: 'Offline', totalDisk: 5120, usedDisk: 4800, ipAddress: '192.168.1.100' },
];

export const recommendations: Recommendation[] = [
  { id: 'rec-001', server: 'PROD-WEB-01', name: 'old_installer.exe', path: 'C:\\Users\\admin\\Downloads\\old_installer.exe', size: 157286400, type: 'File', lastModified: '2022-01-15', reason: 'Old/Forgotten File' },
  { id: 'rec-002', server: 'PROD-WEB-01', name: 'temp_logs', path: 'C:\\temp\\logs', size: 5368709120, type: 'Folder', lastModified: '2023-05-20', reason: 'Large Temp Folder' },
  { id: 'rec-003', server: 'DEV-APP-01', name: 'project_archive.zip', path: 'C:\\Users\\dev\\Desktop\\project_archive.zip', size: 2147483648, type: 'File', lastModified: '2023-08-01', reason: 'Old/Forgotten File' },
  { id: 'rec-004', server: 'PROD-DB-01', name: 'Safe Browse Cache', path: 'C:\\Users\\svc_db\\AppData\\...\\Safe Browse', size: 8589934592, type: 'Folder', lastModified: '2024-05-01', reason: 'Large Safe Browse data' },
  { id: 'rec-005', server: 'DEV-APP-01', name: 'inactive_profile_j.doe', path: 'C:\\Users\\j.doe', size: 12884901888, type: 'Folder', lastModified: '2023-02-11', reason: 'Inactive User Profile' }
];

export const logs: LogEntry[] = [
  { id: 1, timestamp: '2024-05-21 10:00:15', message: 'Started disk space analysis on all servers.', level: 'INFO' },
  { id: 2, timestamp: '2024-05-21 10:01:05', message: 'Low disk space warning for DEV-APP-01 (88% used).', level: 'WARNING' },
  { id: 3, timestamp: '2024-05-21 10:02:30', message: 'Failed to connect to BACKUP-01: Connection timed out.', level: 'ERROR' },
  { id: 4, timestamp: '2024-05-21 10:03:00', message: 'Analysis complete. Found 5 new recommendations.', level: 'INFO' },
  { id: 5, timestamp: '2024-05-21 11:30:00', message: 'User initiated cleanup for 2 selected items.', level: 'INFO' },
  { id: 6, timestamp: '2024-05-21 11:30:45', message: 'Successfully deleted: C:\\Users\\admin\\Downloads\\old_installer.exe on PROD-WEB-01', level: 'INFO' },
  { id: 7, timestamp: '2024-05-21 11:31:12', message: 'Cleanup operation finished.', level: 'INFO' },
];
