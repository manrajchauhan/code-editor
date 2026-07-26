import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { ActivityBar } from '../features/activity-bar/ActivityBar';
import { Sidebar } from '../features/sidebar/Sidebar';
import { PanelResizer } from '../components/ui/PanelResizer';
import { EditorWorkspace } from '../features/editor/EditorWorkspace';
import { DiagnosticsPanel } from '../features/diagnostics/components/DiagnosticsPanel';
import { StatusBar } from '../features/status-bar/StatusBar';
import { CommandPaletteModal } from '../features/command-palette/components/CommandPaletteModal';
import { DeveloperModal } from '../components/ui/DeveloperModal';
import { useLayoutStore } from '../stores/layoutStore';
import { useEditorStore } from '../features/editor/stores/editorStore';
import { useCommandStore } from '../features/command-palette/stores/commandStore';
import { useTerminalStore } from '../features/terminal/stores/terminalStore';
import { saveFile } from '../services/fileService';

export const App: React.FC = () => {
  const { toggleSidebar } = useLayoutStore();
  const { getActiveTab, markTabSaved, closeTab, newUntitledTab, toggleSplitView } = useEditorStore();
  const { toggleCommandPalette } = useCommandStore();
  const { toggleTerminal } = useTerminalStore();
  const [isDevModalOpen, setIsDevModalOpen] = useState(false);

  // Global keyboard shortcuts (⌘B, ⌘S, ⌘W, ⌘N, ⌘K, ⌘P, ⌘T, ⌘J, ⌘\)
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return;

      const key = e.key.toLowerCase();

      if (e.key === '\\') {
        e.preventDefault();
        toggleSplitView();
      } else if (key === 't' || key === 'j' || key === '`') {
        e.preventDefault();
        toggleTerminal();
      } else if (key === 'k' || key === 'p') {
        e.preventDefault();
        toggleCommandPalette();
      } else if (key === 'b') {
        e.preventDefault();
        toggleSidebar();
      } else if (key === 's') {
        e.preventDefault();
        const activeTab = getActiveTab();
        if (activeTab) {
          const res = await saveFile(activeTab.filePath, activeTab.content);
          if (res.success) {
            markTabSaved(activeTab.id);
          }
        }
      } else if (key === 'w') {
        e.preventDefault();
        const activeTab = getActiveTab();
        if (activeTab) {
          closeTab(activeTab.id);
        }
      } else if (key === 'n') {
        e.preventDefault();
        newUntitledTab();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    toggleSidebar,
    toggleCommandPalette,
    toggleTerminal,
    toggleSplitView,
    getActiveTab,
    markTabSaved,
    closeTab,
    newUntitledTab,
  ]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-bg-main font-sans">
      {/* Command Palette & Developer Modals */}
      <CommandPaletteModal />
      <DeveloperModal isOpen={isDevModalOpen} onClose={() => setIsDevModalOpen(false)} />

      {/* Integrated Window Titlebar (Aligned with Native Traffic Light Buttons) */}
      <header
        data-tauri-drag-region
        className="h-8 bg-bg-surface border-b border-border-subtle flex items-center justify-between pl-[76px] pr-3 text-xs text-text-muted select-none shrink-0"
      >
        {/* Left: Window App Title */}
        <div className="flex items-center gap-1.5 font-semibold text-text-main text-[11px] tracking-tight pointer-events-none" data-tauri-drag-region>
        </div>

        {/* Top-Right: Developer Attribution Badge */}
        <button
          type="button"
          onClick={() => setIsDevModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent/15 text-accent transition-colors cursor-pointer text-[11px] font-medium shadow-sm"
          title="Click to view developer info"
        >
          <Sparkles className="w-3 h-3 text-accent animate-pulse" />
          <span>Developed by <strong className="font-semibold text-text-main">Manraj Chauhan</strong></span>
        </button>
      </header>

      {/* Main Workspace (ActivityBar + Sidebar + Resizer + Editor Area) */}
      <div className="flex flex-1 overflow-hidden">
        <ActivityBar />
        <Sidebar />
        <PanelResizer />
        <div className="flex-1 flex flex-col overflow-hidden">
          <EditorWorkspace />
          <DiagnosticsPanel />
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar />
    </div>
  );
};

export default App;
