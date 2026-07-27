import React from 'react';
import { Files, Search, Settings, GitBranch, Puzzle, Package, Bug } from 'lucide-react';
import { useLayoutStore } from '../../stores/layoutStore';
import { FileExplorerPane } from '../workspace/components/FileExplorerPane';
import { WorkspaceSearchPane } from '../search/components/WorkspaceSearchPane';
import { SettingsPane } from '../settings/components/SettingsPane';
import { GitPanel } from '../git/components/GitPanel';
import { SnippetsPane } from '../snippets/components/SnippetsPane';
import { ExtensionsPane } from '../extensions/components/ExtensionsPane';
import { DebugPanel } from '../debugger/components/DebugPanel';

const PANEL_TITLES: Record<string, { label: string; icon: React.ReactNode }> = {
  explorer: { label: 'Explorer', icon: <Files className="w-3.5 h-3.5" /> },
  search: { label: 'Search', icon: <Search className="w-3.5 h-3.5" /> },
  git: { label: 'Source Control', icon: <GitBranch className="w-3.5 h-3.5" /> },
  debug: { label: 'Run & Debug', icon: <Bug className="w-3.5 h-3.5" /> },
  snippets: { label: 'Snippets', icon: <Puzzle className="w-3.5 h-3.5" /> },
  extensions: { label: 'Extensions', icon: <Package className="w-3.5 h-3.5" /> },
  settings: { label: 'Preferences', icon: <Settings className="w-3.5 h-3.5" /> },
};

export const Sidebar: React.FC = () => {
  const { activeView, isSidebarOpen, sidebarWidth } = useLayoutStore();

  if (!isSidebarOpen) return null;

  const panel = PANEL_TITLES[activeView];

  return (
    <aside
      className="bg-bg-sidebar border-r border-border-subtle flex flex-col select-none shrink-0 h-full overflow-hidden transition-all duration-150"
      style={{ width: `${sidebarWidth}px` }}
      aria-label="Sidebar Panel"
    >
      {/* Panel Title Bar */}
      {panel && (
        <div className="px-3 py-2 border-b border-border-subtle flex items-center gap-2 shrink-0">
          <span className="text-accent">{panel.icon}</span>
          <span className="text-[10px] font-semibold text-text-subtle uppercase tracking-wider">{panel.label}</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {activeView === 'explorer' && <FileExplorerPane />}
        {activeView === 'search' && (
          <div className="p-2 h-full">
            <WorkspaceSearchPane />
          </div>
        )}
        {activeView === 'git' && <GitPanel />}
        {activeView === 'debug' && <DebugPanel />}
        {activeView === 'snippets' && <SnippetsPane />}
        {activeView === 'extensions' && <ExtensionsPane />}
        {activeView === 'settings' && (
          <div className="p-2">
            <SettingsPane />
          </div>
        )}
      </div>
    </aside>
  );
};
