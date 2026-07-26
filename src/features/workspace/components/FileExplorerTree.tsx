import React, { useState } from 'react';
import {
  FolderOpen,
  FilePlus,
  FolderPlus,
  RefreshCw,
} from 'lucide-react';
import { useWorkspaceStore } from '../stores/workspaceStore';
import { FileTreeItem } from './FileTreeItem';

export const FileExplorerTree: React.FC = () => {
  const {
    currentFolderName,
    currentFolderPath,
    rootNode,
    isLoading,
    openFolder,
    refreshWorkspace,
    createFile,
    createFolder,
  } = useWorkspaceStore();

  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newItemName, setNewItemName] = useState('');

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !currentFolderPath) return;

    if (isCreatingFile) {
      await createFile(currentFolderPath, newItemName.trim());
      setIsCreatingFile(false);
    } else if (isCreatingFolder) {
      await createFolder(currentFolderPath, newItemName.trim());
      setIsCreatingFolder(false);
    }
    setNewItemName('');
  };

  if (!currentFolderPath || !rootNode) {
    return (
      <div className="flex flex-col items-center justify-center p-4 border border-dashed border-border-strong rounded-md text-center gap-2 text-text-muted">
        <FolderOpen className="w-8 h-8 text-text-subtle" />
        <p className="font-medium text-text-main text-xs">No Folder Opened</p>
        <p className="text-[11px] text-text-subtle">
          Open a local project directory to start editing.
        </p>
        <button
          type="button"
          onClick={() => openFolder()}
          className="mt-1 px-3 py-1.5 bg-accent hover:bg-accent-hover text-white rounded font-medium text-xs transition-colors"
        >
          Open Folder
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden select-none">
      {/* Explorer Toolbar */}
      <div className="flex items-center justify-between py-1 px-2 mb-1 border-b border-border-subtle text-xs text-text-muted">
        <span className="font-semibold text-text-main truncate max-w-[120px]" title={currentFolderPath}>
          {currentFolderName}
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsCreatingFile(true)}
            className="p-1 rounded hover:bg-bg-hover text-text-subtle hover:text-text-main"
            title="New File"
          >
            <FilePlus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsCreatingFolder(true)}
            className="p-1 rounded hover:bg-bg-hover text-text-subtle hover:text-text-main"
            title="New Folder"
          >
            <FolderPlus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => refreshWorkspace()}
            className={`p-1 rounded hover:bg-bg-hover text-text-subtle hover:text-text-main ${
              isLoading ? 'animate-spin' : ''
            }`}
            title="Refresh Explorer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Inline Create Input Form */}
      {(isCreatingFile || isCreatingFolder) && (
        <form onSubmit={handleCreateSubmit} className="px-2 py-1 bg-bg-surface border border-accent rounded mb-2">
          <input
            type="text"
            autoFocus
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onBlur={() => {
              setIsCreatingFile(false);
              setIsCreatingFolder(false);
            }}
            placeholder={isCreatingFile ? 'file-name.ts' : 'folder-name'}
            className="w-full bg-transparent text-xs text-text-main outline-none"
          />
        </form>
      )}

      {/* File Tree List */}
      <div className="flex-1 overflow-y-auto">
        <FileTreeItem node={rootNode} />
      </div>
    </div>
  );
};
