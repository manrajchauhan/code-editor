import React, { useState } from 'react';
import { X, Plus, Edit2 } from 'lucide-react';
import { useEditorStore } from '../stores/editorStore';
import { useWorkspaceStore } from '../../workspace/stores/workspaceStore';
import { createFileItem } from '../../../services/fileSystemService';
import { FileIcon } from '../../../components/ui/FileIcon';

export const EditorTabs: React.FC = () => {
  const { tabs, activeTabId, setActiveTab, closeTab, newUntitledTab, renameTab } = useEditorStore();
  const { currentFolderPath, renameItem, refreshWorkspace } = useWorkspaceStore();

  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState<string>('');

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
      // Existing file on disk: perform filesystem rename
      await renameItem(tab.filePath, newName);
    } else {
      // Untitled tab: create real file on disk
      const newPath = `${folder}/${newName}`.replace(/\/+/g, '/');
      await createFileItem(folder, newName);
      renameTab(tab.id, newPath, newName);
      await refreshWorkspace();
    }

    setEditingTabId(null);
  };

  return (
    <div className="h-9 bg-bg-sidebar border-b border-border-subtle flex items-center px-1 gap-1 overflow-x-auto select-none shrink-0">
      <div className="flex items-center gap-1 overflow-x-auto flex-1">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const isEditing = editingTabId === tab.id;

          return (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              onDoubleClick={(e) => handleStartRename(tab.id, tab.fileName, e)}
              className={`group relative flex items-center gap-2 px-3 py-1.5 cursor-pointer text-xs transition-colors rounded-t border-r border-border-subtle min-w-[130px] max-w-[210px] justify-between ${
                isActive
                  ? 'bg-bg-main text-text-main font-medium border-t-2 border-t-accent'
                  : 'bg-bg-surface/40 text-text-muted hover:bg-bg-hover hover:text-text-main'
              }`}
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
      </div>

      <button
        type="button"
        onClick={newUntitledTab}
        className="p-1 rounded text-text-subtle hover:text-text-main hover:bg-bg-hover transition-colors mr-1 shrink-0"
        title="New File (⌘N)"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};
