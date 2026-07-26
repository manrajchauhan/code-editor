import React from 'react';
import { Cpu, CheckCircle2, AlertCircle, Command, Terminal } from 'lucide-react';
import { useEditorStore } from '../editor/stores/editorStore';
import { useSettingsStore } from '../settings/stores/settingsStore';
import { useCommandStore } from '../command-palette/stores/commandStore';
import { useDiagnosticsStore } from '../diagnostics/stores/diagnosticsStore';

export const StatusBar: React.FC = () => {
  const { getActiveTab } = useEditorStore();
  const { tabSize } = useSettingsStore();
  const { openCommandPalette } = useCommandStore();
  const { toggleDiagnostics, isOpen: isDiagOpen } = useDiagnosticsStore();

  const activeTab = getActiveTab();

  return (
    <footer
      className="h-6 bg-bg-surface border-t border-border-subtle px-3 flex items-center justify-between text-[11px] text-text-muted select-none z-20 shrink-0"
      aria-label="Status Bar"
    >
      <div className="flex items-center gap-3">
        {activeTab?.isDirty ? (
          <div className="flex items-center gap-1 text-amber-400 font-medium">
            <AlertCircle className="w-3 h-3" />
            <span>Unsaved Changes</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3 h-3" />
            <span>Saved</span>
          </div>
        )}
        <span className="text-border-strong">|</span>
        <span className="truncate max-w-[200px]">{activeTab ? activeTab.fileName : 'No file'}</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleDiagnostics}
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors border ${
            isDiagOpen
              ? 'bg-bg-active text-text-main border-accent'
              : 'bg-bg-hover text-text-muted border-border-subtle hover:text-text-main'
          }`}
          title="Toggle Problems / Diagnostics (⌘J)"
        >
          <Terminal className="w-3 h-3 text-accent" />
          <span>Problems (⌘J)</span>
        </button>

        <button
          type="button"
          onClick={openCommandPalette}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-bg-hover text-text-muted hover:text-text-main transition-colors border border-border-subtle"
          title="Command Palette (⌘K / ⌘P)"
        >
          <Command className="w-3 h-3 text-accent" />
          <span className="font-mono text-[10px]">⌘K</span>
        </button>

        <span className="text-border-strong">|</span>
        <span>Spaces: {tabSize}</span>
        <span>UTF-8</span>
        <span className="uppercase font-mono">{activeTab ? activeTab.language : 'Plain Text'}</span>
        <div className="flex items-center gap-1 text-text-subtle">
          <Cpu className="w-3 h-3 text-accent" />
          <span>Tauri 2</span>
        </div>
      </div>
    </footer>
  );
};
