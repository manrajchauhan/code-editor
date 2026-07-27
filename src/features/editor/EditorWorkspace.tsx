import React from 'react';
import { Columns } from 'lucide-react';
import { EditorTabs } from './components/EditorTabs';
import { MonacoEditorContainer } from './components/MonacoEditorContainer';
import { useEditorStore } from './stores/editorStore';
import { useWorkspaceStore } from '../workspace/stores/workspaceStore';
import { useCommandStore } from '../command-palette/stores/commandStore';
import { saveFile } from '../../services/fileService';

export const EditorWorkspace: React.FC = () => {
  const { tabs, isSplitView, getActiveTab, getSecondaryTab, markTabSaved, newUntitledTab, toggleSplitView } =
    useEditorStore();
  const { openFolder } = useWorkspaceStore();
  const { openCommandPalette } = useCommandStore();

  const activeTab = getActiveTab();
  const secondaryTab = getSecondaryTab();

  const handleSaveActiveTab = async () => {
    if (!activeTab) return;
    const result = await saveFile(activeTab.filePath, activeTab.content);
    if (result.success) {
      markTabSaved(activeTab.id);
    }
  };

  return (
    <main className="flex-1 bg-bg-main flex flex-col h-full overflow-hidden select-none relative">
      {tabs.length > 0 && (
        <div className="flex items-center justify-between bg-bg-sidebar pr-2 border-b border-border-subtle shrink-0">
          <div className="flex-1 overflow-x-auto">
            <EditorTabs />
          </div>
          <button
            type="button"
            onClick={toggleSplitView}
            className={`p-1.5 rounded transition-colors ml-2 ${
              isSplitView
                ? 'bg-accent text-white'
                : 'text-text-subtle hover:text-text-main hover:bg-bg-hover'
            }`}
            title="Toggle Split View (⌘\)"
          >
            <Columns className="w-4 h-4" />
          </button>
        </div>
      )}

      {tabs.length > 0 && activeTab ? (
        <div className="flex-1 w-full h-full flex flex-col overflow-hidden">
          {isSplitView && secondaryTab ? (
            <div className="flex-1 w-full h-full flex overflow-hidden">
              <div className="flex-1 flex flex-col h-full border-r border-border-subtle overflow-hidden relative">
                <MonacoEditorContainer tabId="primary" onSaveRequested={handleSaveActiveTab} />
              </div>
              <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                <MonacoEditorContainer tabId="secondary" onSaveRequested={handleSaveActiveTab} />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
              <MonacoEditorContainer onSaveRequested={handleSaveActiveTab} />
            </div>
          )}
        </div>
      ) : (
        /* ── MINIMAL WATERMARK WELCOME SCREEN ────────────────────────── */
        <div className="flex-1 flex flex-col items-center justify-center select-none bg-bg-main">
          <div className="flex flex-col items-center gap-10">
            {/* Logo Name Only */}
            <h1 className="text-2xl font-bold tracking-wider text-text-main font-mono opacity-90">
              Code Editor
            </h1>

            {/* 3 Clean Shortcuts with Generous Spacing */}
            <div className="flex flex-col gap-4 w-72 text-xs font-mono">
              <button
                type="button"
                onClick={openCommandPalette}
                className="flex items-center justify-between text-text-muted hover:text-text-main transition-colors px-1 py-0.5"
              >
                <span>Show All Commands</span>
                <span className="text-text-subtle font-mono ml-8">⌘K</span>
              </button>

              <button
                type="button"
                onClick={() => openFolder()}
                className="flex items-center justify-between text-text-muted hover:text-text-main transition-colors px-1 py-0.5"
              >
                <span>Open Folder</span>
                <span className="text-text-subtle font-mono ml-8">⌘O</span>
              </button>

              <button
                type="button"
                onClick={newUntitledTab}
                className="flex items-center justify-between text-text-muted hover:text-text-main transition-colors px-1 py-0.5"
              >
                <span>New File</span>
                <span className="text-text-subtle font-mono ml-8">⌘N</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
