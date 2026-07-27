import React, { useEffect, useState } from 'react';
import { ActivityBar } from '../features/activity-bar/ActivityBar';
import { Sidebar } from '../features/sidebar/Sidebar';
import { PanelResizer } from '../components/ui/PanelResizer';
import { EditorWorkspace } from '../features/editor/EditorWorkspace';
import { DiagnosticsPanel } from '../features/diagnostics/components/DiagnosticsPanel';
import { StatusBar } from '../features/status-bar/StatusBar';
import { CommandPaletteModal } from '../features/command-palette/components/CommandPaletteModal';
import { DeveloperModal } from '../components/ui/DeveloperModal';
import { TopMenuBar } from '../components/ui/TopMenuBar';
import { useLayoutStore } from '../stores/layoutStore';
import { useEditorStore } from '../features/editor/stores/editorStore';
import { useSettingsStore, FONT_FAMILY_MAP } from '../features/settings/stores/settingsStore';
import { useCommandStore } from '../features/command-palette/stores/commandStore';
import { useTerminalStore } from '../features/terminal/stores/terminalStore';
import { saveFile } from '../services/fileService';

export const App: React.FC = () => {
  const { toggleSidebar } = useLayoutStore();
  const { getActiveTab, markTabSaved, closeTab, newUntitledTab, toggleSplitView } = useEditorStore();
  const { fontFamily } = useSettingsStore();
  const { toggleCommandPalette } = useCommandStore();
  const { toggleTerminal } = useTerminalStore();
  const [isDevModalOpen, setIsDevModalOpen] = useState(false);

  // Sync font family across entire application document & body
  useEffect(() => {
    const fontCss = FONT_FAMILY_MAP[fontFamily]?.css || FONT_FAMILY_MAP['jetbrains-mono'].css;
    document.documentElement.style.setProperty('--app-font-family', fontCss);
    document.body.style.fontFamily = fontCss;
  }, [fontFamily]);

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
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-bg-main">
      {/* Command Palette & Developer Modals */}
      <CommandPaletteModal />
      <DeveloperModal isOpen={isDevModalOpen} onClose={() => setIsDevModalOpen(false)} />

      {/* Integrated Window Titlebar with File / Edit / View / Recent Menus */}
      <TopMenuBar onOpenDevModal={() => setIsDevModalOpen(true)} />

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
