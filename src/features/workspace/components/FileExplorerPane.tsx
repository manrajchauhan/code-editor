import React, { useEffect, useState } from 'react';
import { FolderOpen, FilePlus, FolderPlus, RefreshCw, Layers, History, Clock } from 'lucide-react';
import { FileExplorerTree } from './FileExplorerTree';
import { useWorkspaceStore } from '../stores/workspaceStore';

export const FileExplorerPane: React.FC = () => {
  const {
    currentFolderPath,
    currentFolderName,
    rootNode,
    isLoading,
    recentFolders,
    openFolder,
    refreshWorkspace,
    createFile,
    createFolder,
  } = useWorkspaceStore();

  const [showRecentMenu, setShowRecentMenu] = useState(false);

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

        <div className="flex items-center gap-0.5 text-text-subtle relative">
          <button
            type="button"
            onClick={() => setShowRecentMenu(!showRecentMenu)}
            className={`p-1 rounded hover:bg-bg-hover transition-colors ${
              showRecentMenu ? 'text-accent bg-bg-hover' : 'hover:text-text-main'
            }`}
            title="Recent Folders History"
          >
            <History className="w-3.5 h-3.5" />
          </button>

          {currentFolderPath && (
            <>
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
            </>
          )}

          {/* Recent Folders Dropdown Menu */}
          {showRecentMenu && (
            <div className="absolute right-0 top-7 w-64 bg-[#12141a] border border-border-subtle rounded-lg shadow-xl z-50 p-2 flex flex-col gap-1">
              <div className="flex items-center justify-between px-2 py-1 text-[11px] font-semibold text-text-muted border-b border-border-subtle">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-accent" /> Recent Workspaces
                </span>
                <button
                  type="button"
                  onClick={() => openFolder()}
                  className="text-accent hover:underline text-[10px]"
                >
                  Browse...
                </button>
              </div>

              <div className="flex flex-col gap-0.5 max-h-48 overflow-y-auto">
                {recentFolders.length === 0 ? (
                  <span className="text-[11px] text-text-subtle px-2 py-2">No recent folders.</span>
                ) : (
                  recentFolders.map((path) => {
                    const name = path.split('/').pop() || path;
                    const isCurrent = path === currentFolderPath;
                    return (
                      <button
                        key={path}
                        type="button"
                        onClick={() => {
                          setShowRecentMenu(false);
                          openFolder(path);
                        }}
                        className={`flex flex-col text-left px-2 py-1.5 rounded transition-colors ${
                          isCurrent
                            ? 'bg-accent/15 text-accent font-medium'
                            : 'hover:bg-bg-hover text-text-main'
                        }`}
                      >
                        <span className="text-xs truncate">{name}</span>
                        <span className="text-[10px] text-text-subtle truncate">{path}</span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
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
