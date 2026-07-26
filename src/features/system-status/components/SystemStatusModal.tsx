import React from 'react';
import { Cpu, HardDrive, Layers, Clock, Activity, X, CheckCircle2 } from 'lucide-react';
import { useSystemMetrics } from '../hooks/useSystemMetrics';

interface SystemStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemStatusModal: React.FC<SystemStatusModalProps> = ({ isOpen, onClose }) => {
  const metrics = useSystemMetrics();

  if (!isOpen) return null;

  const formatUptime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}m ${remainingSecs}s`;
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-bg-sidebar border border-border-strong rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="h-10 px-4 bg-bg-surface border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="font-semibold text-xs text-text-main">System Running Status</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-bg-hover text-text-subtle hover:text-text-main transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 flex flex-col gap-4 text-xs text-text-muted">
          {/* Native Host & IPC Status Card */}
          <div className="p-3 bg-bg-surface border border-border-subtle rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Cpu className="w-5 h-5 text-accent" />
              <div className="flex flex-col">
                <span className="font-semibold text-text-main">{metrics.platform}</span>
                <span className="text-[10px] text-text-subtle">Tauri {metrics.tauriVersion} Core Engine</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" />
              <span>{metrics.ipcStatus}</span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Memory Usage */}
            <div className="p-3 bg-bg-surface border border-border-subtle rounded-lg flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-text-subtle">
                <HardDrive className="w-3.5 h-3.5 text-accent" />
                <span className="text-[11px] font-medium">Heap Memory</span>
              </div>
              <span className="text-base font-bold text-text-main">{metrics.memoryUsedMB} MB</span>
              <div className="w-full h-1.5 bg-bg-main rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all"
                  style={{ width: `${Math.min(100, (metrics.memoryUsedMB / 256) * 100)}%` }}
                />
              </div>
            </div>

            {/* Session Uptime */}
            <div className="p-3 bg-bg-surface border border-border-subtle rounded-lg flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-text-subtle">
                <Clock className="w-3.5 h-3.5 text-accent" />
                <span className="text-[11px] font-medium">Session Uptime</span>
              </div>
              <span className="text-base font-bold text-text-main">{formatUptime(metrics.uptimeSeconds)}</span>
              <span className="text-[10px] text-text-subtle">Active Runtime</span>
            </div>

            {/* Editor Workspace Stats */}
            <div className="p-3 bg-bg-surface border border-border-subtle rounded-lg flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-text-subtle">
                <Layers className="w-3.5 h-3.5 text-accent" />
                <span className="text-[11px] font-medium">Active Tabs</span>
              </div>
              <span className="text-base font-bold text-text-main">{metrics.activeTabsCount} Tabs</span>
              <span className="text-[10px] text-amber-400 font-medium">
                {metrics.dirtyFilesCount} Unsaved File{metrics.dirtyFilesCount === 1 ? '' : 's'}
              </span>
            </div>

            {/* Total Workspace Files */}
            <div className="p-3 bg-bg-surface border border-border-subtle rounded-lg flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-text-subtle">
                <Activity className="w-3.5 h-3.5 text-accent" />
                <span className="text-[11px] font-medium">Workspace Items</span>
              </div>
              <span className="text-base font-bold text-text-main">{metrics.totalWorkspaceFiles} Files</span>
              <span className="text-[10px] text-text-subtle">Loaded in Tree</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2 bg-bg-surface border-t border-border-subtle flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-accent hover:bg-accent-hover text-white rounded text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
