import React, { useEffect } from 'react';
import { FolderOpen } from 'lucide-react';
import { FileExplorerTree } from './FileExplorerTree';
import { useWorkspaceStore } from '../stores/workspaceStore';

export const FileExplorerPane: React.FC = () => {
  const { rootNode, isLoading, openFolder } = useWorkspaceStore();

  // Auto-initialize real workspace on mount
  useEffect(() => {
    if (!rootNode && !isLoading) {
      openFolder();
    }
  }, [rootNode, isLoading, openFolder]);

  return (
    <div className="h-full flex flex-col bg-bg-sidebar select-none text-xs">
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
