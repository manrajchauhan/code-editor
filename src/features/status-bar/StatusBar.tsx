import React, { useState } from 'react';
import { Cpu, CheckCircle2, AlertCircle, Command, Terminal, Activity, GitBranch } from 'lucide-react';
import { useEditorStore } from '../editor/stores/editorStore';
import { useSettingsStore } from '../settings/stores/settingsStore';
import { useCommandStore } from '../command-palette/stores/commandStore';
import { useTerminalStore } from '../terminal/stores/terminalStore';
import { useSystemMetrics } from '../system-status/hooks/useSystemMetrics';
import { useGitStore } from '../git/stores/gitStore';
import { useLayoutStore } from '../../stores/layoutStore';
import { SystemStatusModal } from '../system-status/components/SystemStatusModal';
import { PerformanceModal } from '../../components/ui/PerformanceModal';

export const StatusBar: React.FC = () => {
  const { getActiveTab, cursorPosition } = useEditorStore();
  const { tabSize } = useSettingsStore();
  const { openCommandPalette } = useCommandStore();
  const { toggleTerminal, isTerminalOpen } = useTerminalStore();
  const metrics = useSystemMetrics();
  const { branch, modifiedFiles } = useGitStore();
  const { setActiveView } = useLayoutStore();

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const activeTab = getActiveTab();

  const Chip = ({ children, onClick, active, className = '' }: {
    children: React.ReactNode;
    onClick?: () => void;
    active?: boolean;
    className?: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border transition-colors font-mono ${
        active
          ? 'bg-accent/15 text-accent border-accent/30 hover:bg-accent/25'
          : 'bg-bg-hover/50 text-text-muted border-border-subtle hover:text-text-main hover:bg-bg-hover'
      } ${className}`}
    >
      {children}
    </button>
  );

  return (
    <>
      <SystemStatusModal isOpen={isStatusModalOpen} onClose={() => setIsStatusModalOpen(false)} />
      <PerformanceModal />

      <footer
        className="h-7 bg-bg-surface border-t border-border-subtle px-2 flex items-center justify-between text-[10px] text-text-muted select-none z-20 shrink-0 gap-2"
        aria-label="Status Bar"
      >
        {/* Left */}
        <div className="flex items-center gap-1.5">
          {/* Git branch */}
          {branch && (
            <Chip
              onClick={() => setActiveView('git')}
              className="!rounded-sm"
            >
              <GitBranch className="w-3 h-3 text-accent" />
              <span>{branch}</span>
              {modifiedFiles.length > 0 && (
                <span className="text-amber-400">{modifiedFiles.length}↑</span>
              )}
            </Chip>
          )}

          {/* Save status */}
          {activeTab?.isDirty ? (
            <Chip className="!border-amber-500/30">
              <AlertCircle className="w-3 h-3 text-amber-400" />
              <span className="text-amber-400">Unsaved</span>
            </Chip>
          ) : (
            <Chip className="!border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Saved</span>
            </Chip>
          )}

          {/* File name */}
          {activeTab && (
            <span className="text-text-subtle truncate max-w-[160px] font-mono">
              {activeTab.fileName}
            </span>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-1.5">
          {/* RAM */}
          <Chip onClick={() => setIsStatusModalOpen(true)}>
            <Activity className="w-3 h-3 text-accent animate-pulse" />
            <span>RAM: {metrics.memoryUsedMB}MB</span>
          </Chip>

          {/* Terminal */}
          <Chip onClick={toggleTerminal} active={isTerminalOpen}>
            <Terminal className="w-3 h-3 text-accent" />
            <span>Terminal</span>
          </Chip>

          {/* Command palette */}
          <Chip onClick={openCommandPalette}>
            <Command className="w-3 h-3 text-accent" />
            <span>⌘K</span>
          </Chip>

          <span className="text-border-strong mx-0.5">|</span>

          {/* Cursor position */}
          <span className="font-mono">Ln {cursorPosition.line} Col {cursorPosition.column}</span>
          <span>Sp:{tabSize}</span>
          <span>UTF-8</span>

          {/* Language */}
          {activeTab && (
            <span className="uppercase font-mono px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent text-[9px]">
              {activeTab.language || 'text'}
            </span>
          )}

          {/* Tauri badge */}
          <div className="flex items-center gap-1 text-text-subtle">
            <Cpu className="w-3 h-3 text-accent" />
            <span>Tauri 2</span>
          </div>
        </div>
      </footer>
    </>
  );
};
