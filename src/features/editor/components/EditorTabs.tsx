import React, { useState } from 'react';
import { X, Plus, Edit2, Play, Cpu } from 'lucide-react';
import { useEditorStore } from '../stores/editorStore';
import { useWorkspaceStore } from '../../workspace/stores/workspaceStore';
import { useTerminalStore } from '../../terminal/stores/terminalStore';
import { createFileItem } from '../../../services/fileSystemService';
import { saveFile } from '../../../services/fileService';
import { FileIcon } from '../../../components/ui/FileIcon';
import { CodeVisualizerModal } from '../../../components/ui/CodeVisualizerModal';

export const EditorTabs: React.FC = () => {
  const { tabs, activeTabId, setActiveTab, closeTab, newUntitledTab, renameTab, getActiveTab, markTabSaved } =
    useEditorStore();
  const { currentFolderPath, renameItem, refreshWorkspace } = useWorkspaceStore();
  const { runCodeFile } = useTerminalStore();

  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState<string>('');
  const [isVisualizerOpen, setIsVisualizerOpen] = useState<boolean>(false);

  const activeTab = getActiveTab();

  if (tabs.length === 0) return null;

  const handleStartRename = (tabId: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTabId(tabId);
    setRenameValue(currentName);
  };

  const handleRenameSubmit = async (tab: (typeof tabs)[0], e: React.FormEvent) => {
    e.preventDefault();
    const newName = renameValue.trim();
    if (!newName || newName === tab.fileName) {
      setEditingTabId(null);
      return;
    }

    const folder = currentFolderPath || '/Volumes/Personal Space/Cross Platform Apps/code-editor';

    if (tab.filePath && tab.filePath.startsWith('/')) {
      await renameItem(tab.filePath, newName);
    } else {
      const newPath = `${folder}/${newName}`.replace(/\/+/g, '/');
      await createFileItem(folder, newName);
      renameTab(tab.id, newPath, newName);
      await refreshWorkspace();
    }

    setEditingTabId(null);
  };

  const handleRunFile = async () => {
    if (!activeTab || !activeTab.filePath) return;

    await saveFile(activeTab.filePath, activeTab.content);
    markTabSaved(activeTab.id);

    const ext = activeTab.fileName.split('.').pop()?.toLowerCase();
    let cmd = `node "${activeTab.filePath}"`;

    if (ext === 'py') {
      cmd = `python3 "${activeTab.filePath}"`;
    } else if (ext === 'ts' || ext === 'tsx') {
      cmd = `npx tsx "${activeTab.filePath}"`;
    } else if (ext === 'rs') {
      cmd = `cargo run`;
    } else if (ext === 'go') {
      cmd = `go run "${activeTab.filePath}"`;
    } else if (ext === 'sh' || ext === 'bash') {
      cmd = `bash "${activeTab.filePath}"`;
    }

    runCodeFile(cmd);
  };

  return (
    <>
      <CodeVisualizerModal
        isOpen={isVisualizerOpen}
        onClose={() => setIsVisualizerOpen(false)}
        code={activeTab?.content || ''}
      />

      <div className="h-10 bg-bg-sidebar border-b border-border-subtle flex items-center justify-between px-2 gap-2 select-none shrink-0 w-full">
        <div className="flex items-center gap-0.5 overflow-x-auto flex-1">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            const isEditing = editingTabId === tab.id;
            const langBadge = tab.language ? tab.language.slice(0, 3).toUpperCase() : null;

            return (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                onDoubleClick={(e) => handleStartRename(tab.id, tab.fileName, e)}
                className={`group relative flex items-center gap-2 px-3 py-1.5 cursor-pointer text-xs transition-all rounded-t min-w-[130px] max-w-[210px] justify-between ${
                  isActive
                    ? 'bg-bg-main text-text-main font-medium'
                    : 'bg-bg-surface/40 text-text-muted hover:bg-bg-hover hover:text-text-main'
                }`}
                style={isActive ? {
                  borderTop: '2px solid transparent',
                  borderImage: 'linear-gradient(90deg, #6366f1, #8b5cf6) 1',
                  borderRight: '1px solid var(--border-subtle)',
                } : {
                  borderTop: '2px solid transparent',
                  borderRight: '1px solid var(--border-subtle)',
                }}
                title="Double-click tab to rename file"
              >
                {isEditing ? (
                  <form
                    onSubmit={(e) => handleRenameSubmit(tab, e)}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1"
                  >
                    <input
                      type="text"
                      autoFocus
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={(e) => handleRenameSubmit(tab, e)}
                      className="w-full bg-bg-surface text-xs text-text-main outline-none px-1 rounded border border-accent"
                    />
                  </form>
                ) : (
                  <>
                    <div className="flex items-center gap-1.5 truncate">
                      <FileIcon fileName={tab.fileName} className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{tab.fileName}</span>
                      {isActive && langBadge && (
                        <span className="text-[8px] font-mono font-bold px-1 py-0 rounded bg-accent/15 text-accent/80 shrink-0 border border-accent/20">
                          {langBadge}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {tab.isDirty && (
                        <span
                          className="w-2 h-2 rounded-full bg-amber-400 group-hover:hidden"
                          title="Unsaved changes"
                        />
                      )}
                      <button
                        type="button"
                        onClick={(e) => handleStartRename(tab.id, tab.fileName, e)}
                        className="p-0.5 rounded hover:bg-bg-active text-text-subtle hover:text-text-main opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Rename File"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          closeTab(tab.id);
                        }}
                        className={`p-0.5 rounded hover:bg-bg-active text-text-subtle hover:text-text-main ${
                          tab.isDirty ? 'hidden group-hover:block' : ''
                        }`}
                        title="Close (⌘W)"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}

          <button
            type="button"
            onClick={newUntitledTab}
            className="p-1 rounded text-text-subtle hover:text-text-main hover:bg-bg-hover transition-colors mr-1 shrink-0"
            title="New File (⌘N)"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons: Visualize Logic & Run Code */}
        {activeTab && (
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsVisualizerOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-accent/15 text-accent border border-accent/30 hover:bg-accent/25 transition-colors font-semibold cursor-pointer shrink-0 text-xs"
              title="Visualize step-by-step machine code execution logic"
            >
              <Cpu className="w-3.5 h-3.5 text-accent" />
              <span>Visualize Logic</span>
            </button>

            <button
              type="button"
              onClick={handleRunFile}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors font-semibold cursor-pointer shrink-0 text-xs"
              title={`Run ${activeTab.fileName} in Terminal`}
            >
              <Play className="w-3.5 h-3.5 fill-emerald-400" />
              <span>Run Code</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};
