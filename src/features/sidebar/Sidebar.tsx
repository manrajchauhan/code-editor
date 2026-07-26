import React from 'react';
import { useLayoutStore } from '../../stores/layoutStore';
import { FileExplorerTree } from '../workspace/components/FileExplorerTree';
import { WorkspaceSearchPane } from '../search/components/WorkspaceSearchPane';
import { SettingsPane } from '../settings/components/SettingsPane';

export const Sidebar: React.FC = () => {
  const { activeView, isSidebarOpen, sidebarWidth } = useLayoutStore();

  if (!isSidebarOpen) return null;

  return (
    <aside
      className="bg-bg-sidebar border-r border-border-subtle flex flex-col select-none shrink-0 h-full overflow-hidden"
      style={{ width: `${sidebarWidth}px` }}
      aria-label="Sidebar Panel"
    >
      <div className="h-9 px-3 border-b border-border-subtle flex items-center justify-between bg-bg-surface/50">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          {activeView}
        </span>
      </div>

      <div className="flex-1 p-2 overflow-y-auto">
        {activeView === 'explorer' && <FileExplorerTree />}
        {activeView === 'search' && <WorkspaceSearchPane />}
        {activeView === 'settings' && <SettingsPane />}
      </div>
    </aside>
  );
};
