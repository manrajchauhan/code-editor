import React from 'react';
import { useLayoutStore } from '../../stores/layoutStore';
import { FileExplorerPane } from '../workspace/components/FileExplorerPane';
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
      <div className="flex-1 overflow-y-auto">
        {activeView === 'explorer' && <FileExplorerPane />}
        {activeView === 'search' && (
          <div className="p-2">
            <WorkspaceSearchPane />
          </div>
        )}
        {activeView === 'settings' && (
          <div className="p-2">
            <SettingsPane />
          </div>
        )}
      </div>
    </aside>
  );
};
