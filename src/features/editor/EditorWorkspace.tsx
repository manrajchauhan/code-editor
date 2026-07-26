import React from 'react';
import { Plus, Columns, FolderOpen, Clock, Sparkles } from 'lucide-react';
import { EditorTabs } from './components/EditorTabs';
import { MonacoEditorContainer } from './components/MonacoEditorContainer';
import { BreadcrumbsBar } from './components/BreadcrumbsBar';
import { useEditorStore } from './stores/editorStore';
import { useWorkspaceStore } from '../workspace/stores/workspaceStore';
import { saveFile } from '../../services/fileService';

export const EditorWorkspace: React.FC = () => {
  const { tabs, isSplitView, getActiveTab, getSecondaryTab, markTabSaved, newUntitledTab, toggleSplitView } =
    useEditorStore();
  const { openFolder, recentFolders } = useWorkspaceStore();

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
              {/* Primary Pane */}
              <div className="flex-1 flex flex-col h-full border-r border-border-subtle overflow-hidden">
                <BreadcrumbsBar tabId="primary" />
                <div className="flex-1 relative">
                  <MonacoEditorContainer tabId="primary" onSaveRequested={handleSaveActiveTab} />
                </div>
              </div>

              {/* Secondary Pane */}
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                <BreadcrumbsBar tabId="secondary" />
                <div className="flex-1 relative">
                  <MonacoEditorContainer tabId="secondary" onSaveRequested={handleSaveActiveTab} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <BreadcrumbsBar />
              <div className="flex-1 relative">
                <MonacoEditorContainer onSaveRequested={handleSaveActiveTab} />
              </div>
            </div>
          )}
        </div>
      ) : (
        /* React Workspace Welcome Screen Dashboard */
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none overflow-y-auto">
          <div className="flex flex-col items-center gap-6 max-w-lg w-full">
            {/* React Atom Badge */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-sky-500/20 border border-accent/30 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 animate-[spin_12s_linear_infinite]" viewBox="0 0 24 24" fill="none">
                  <ellipse cx="12" cy="12" rx="7" ry="3.2" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(30 12 12)" />
                  <ellipse cx="12" cy="12" rx="7" ry="3.2" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(90 12 12)" />
                  <ellipse cx="12" cy="12" rx="7" ry="3.2" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(150 12 12)" />
                  <circle cx="12" cy="12" r="1.8" fill="#61DAFB" />
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <h1 className="text-xl font-bold text-text-main tracking-tight flex items-center gap-2">
                  React Code Workspace
                  <span className="px-2 py-0.5 text-[10px] rounded bg-accent/20 text-accent font-medium">v1.0.0</span>
                </h1>
                <p className="text-xs text-text-subtle">High-performance desktop IDE with Monaco & Tauri 2</p>
              </div>
            </div>

            {/* Quick Action Grid */}
            <div className="grid grid-cols-2 gap-3 w-full text-left">
              <button
                type="button"
                onClick={newUntitledTab}
                className="p-3.5 rounded-xl bg-bg-surface/80 border border-border-subtle hover:border-accent/50 hover:bg-bg-hover transition-all flex items-center gap-3 group shadow-sm"
              >
                <div className="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center text-accent group-hover:scale-105 transition-transform">
                  <Plus className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-text-main">New File</span>
                  <span className="text-[10px] text-text-subtle">Shortcut ⌘N</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => openFolder()}
                className="p-3.5 rounded-xl bg-bg-surface/80 border border-border-subtle hover:border-accent/50 hover:bg-bg-hover transition-all flex items-center gap-3 group shadow-sm"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-text-main">Open Folder</span>
                  <span className="text-[10px] text-text-subtle">Browse filesystem</span>
                </div>
              </button>
            </div>

            {/* Recent Workspaces Card */}
            {recentFolders.length > 0 && (
              <div className="w-full p-4 rounded-xl bg-bg-surface/50 border border-border-subtle text-left flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-semibold text-text-muted border-b border-border-subtle pb-2">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-accent" /> Recent Workspaces
                  </span>
                  <span className="text-[10px] text-text-subtle">{recentFolders.length} saved</span>
                </div>

                <div className="flex flex-col gap-1 max-h-36 overflow-y-auto">
                  {recentFolders.slice(0, 4).map((path) => {
                    const name = path.split('/').pop() || path;
                    return (
                      <button
                        key={path}
                        type="button"
                        onClick={() => openFolder(path)}
                        className="flex items-center justify-between p-2 rounded hover:bg-bg-hover transition-colors text-left group"
                      >
                        <div className="flex flex-col truncate">
                          <span className="text-xs font-medium text-text-main group-hover:text-accent truncate">{name}</span>
                          <span className="text-[10px] text-text-subtle truncate">{path}</span>
                        </div>
                        <Sparkles className="w-3.5 h-3.5 text-text-subtle group-hover:text-accent opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};
