export interface SystemMetrics {
  memoryUsedMB: number;
  memoryLimitMB: number;
  activeTabsCount: number;
  dirtyFilesCount: number;
  totalWorkspaceFiles: number;
  uptimeSeconds: number;
  platform: string;
  tauriVersion: string;
  ipcStatus: 'Connected' | 'Web Preview Mode';
}
