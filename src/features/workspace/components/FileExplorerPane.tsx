import React, { useEffect } from 'react';
import { FolderOpen, FilePlus, FolderPlus, RefreshCw, Layers } from 'lucide-react';
import { FileExplorerTree } from './FileExplorerTree';
import { useWorkspaceStore } from '../stores/workspaceStore';

export const FileExplorerPane: React.FC = () => {
  const {
    currentFolderPath,
    currentFolderName,
    rootNode,
    isLoading,
    openFolder,
    refreshWorkspace,
    createFile,
    createFolder,
  } = useWorkspaceStore();

  // Auto-initialize real workspace on mount
  useEffect(() => {
    if (!rootNode && !isLoading) {
      openFolder();
    }
  }, [rootNode, isLoading, openFolder]);

  const handleCreateFile = async () => {
    if (!currentFolderPath) return;
    const name = prompt('Enter new file name:');
    if (name?.trim()) {
      await createFile(currentFolderPath, name.trim());
    }
  };

  const handleCreateFolder = async () => {
    if (!currentFolderPath) return;
    const name = prompt('Enter new folder name:');
    if (name?.trim()) {
      await createFolder(currentFolderPath, name.trim());
    }
  };

  return (
    <div className="h-full flex flex-col bg-bg-sidebar border-r border-border-subtle select-none text-xs">
      {/* Pane Header */}
      <div className="h-9 px-3 border-b border-border-subtle flex items-center justify-between bg-bg-surface shrink-0">
        <div className="flex items-center gap-1.5 font-semibold text-text-main tracking-tight truncate">
          <Layers className="w-4 h-4 text-accent shrink-0" />
          <span className="truncate">{currentFolderName ? currentFolderName.toUpperCase() : 'EXPLORER'}</span>
        </div>

        {currentFolderPath && (
          <div className="flex items-center gap-0.5 text-text-subtle">
            <button
              type="button"
              onClick={handleCreateFile}
              className="p-1 rounded hover:bg-bg-hover hover:text-text-main transition-colors"
              title="New File..."
            >
              <FilePlus className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleCreateFolder}
              className="p-1 rounded hover:bg-bg-hover hover:text-text-main transition-colors"
              title="New Folder..."
            >
              <FolderPlus className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => refreshWorkspace()}
              className={`p-1 rounded hover:bg-bg-hover hover:text-text-main transition-colors ${
                isLoading ? 'animate-spin text-accent' : ''
              }`}
              title="Refresh Explorer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Explorer Body */}
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading && !rootNode ? (
          <div className="p-4 text-center text-text-subtle">Loading workspace directory...</div>
        ) : rootNode ? (
          <FileExplorerTree />
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-4 text-center text-text-muted">
            <p className="text-xs mb-3">No project folder opened.</p>
            <button
              type="button"
              onClick={() => openFolder()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-accent hover:bg-accent-hover text-white rounded text-xs font-medium transition-colors"
            >
              <FolderOpen className="w-4 h-4" />
              <span>Open Folder...</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
