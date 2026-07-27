import React, { useState } from 'react';
import { Files, Search, Settings, PanelLeft, GitBranch, Puzzle, Package, Bug } from 'lucide-react';
import { useLayoutStore } from '../../stores/layoutStore';
import { ActivityView } from '../../types/layout.types';
import { useGitStore } from '../git/stores/gitStore';

interface NavItem {
  id: ActivityView;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export const ActivityBar: React.FC = () => {
  const { activeView, isSidebarOpen, setActiveView, toggleSidebar } = useLayoutStore();
  const { modifiedFiles } = useGitStore();
  const [hovered, setHovered] = useState<string | null>(null);

  const uncommitted = modifiedFiles.length;

  const topItems: NavItem[] = [
    { id: 'explorer', label: 'Explorer', icon: <Files className="w-5 h-5" /> },
    { id: 'search', label: 'Search', icon: <Search className="w-5 h-5" /> },
    { id: 'git', label: 'Git', icon: <GitBranch className="w-5 h-5" />, badge: uncommitted },
    { id: 'debug', label: 'Debug', icon: <Bug className="w-5 h-5" /> },
    { id: 'snippets', label: 'Snippets', icon: <Puzzle className="w-5 h-5" /> },
    { id: 'extensions', label: 'Extensions', icon: <Package className="w-5 h-5" /> },
  ];

  const renderItem = (item: NavItem) => {
    const isActive = activeView === item.id && isSidebarOpen;
    return (
      <div key={item.id} className="relative w-full flex items-center justify-center" onMouseEnter={() => setHovered(item.id)} onMouseLeave={() => setHovered(null)}>
        <button
          type="button"
          onClick={() => setActiveView(item.id)}
          className={`relative p-2.5 rounded-lg transition-all duration-150 ${
            isActive
              ? 'bg-accent/20 text-accent'
              : 'text-text-subtle hover:text-text-main hover:bg-bg-hover'
          }`}
        >
          {item.icon}
          {/* Badge */}
          {item.badge !== undefined && item.badge > 0 && (
            <span className="absolute top-1 right-1 min-w-[14px] h-3.5 px-0.5 rounded-full bg-amber-400 text-[8px] text-black font-bold flex items-center justify-center leading-none">
              {item.badge > 99 ? '99+' : item.badge}
            </span>
          )}
          {/* Active indicator */}
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent rounded-r" />
          )}
        </button>
        {/* Tooltip */}
        {hovered === item.id && !isSidebarOpen && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-bg-active border border-border-strong rounded text-[11px] text-text-main whitespace-nowrap z-50 shadow-lg pointer-events-none">
            {item.label}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className="w-14 bg-bg-surface border-r border-border-subtle flex flex-col justify-between items-center py-2 select-none z-20 shrink-0"
      aria-label="Activity Bar"
    >
      <div className="flex flex-col gap-0.5 w-full items-center">
        {/* Sidebar toggle */}
        <div className="relative w-full flex items-center justify-center" onMouseEnter={() => setHovered('toggle')} onMouseLeave={() => setHovered(null)}>
          <button
            type="button"
            onClick={toggleSidebar}
            title={isSidebarOpen ? 'Collapse Sidebar (⌘B)' : 'Expand Sidebar (⌘B)'}
            className={`p-2.5 rounded-lg transition-all duration-150 ${
              isSidebarOpen ? 'text-text-main hover:bg-bg-hover' : 'text-text-muted hover:bg-bg-hover hover:text-text-main'
            }`}
          >
            <PanelLeft className="w-5 h-5" />
          </button>
          {hovered === 'toggle' && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-bg-active border border-border-strong rounded text-[11px] text-text-main whitespace-nowrap z-50 shadow-lg pointer-events-none">
              {isSidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
            </div>
          )}
        </div>

        <div className="w-6 h-px bg-border-subtle my-1" />

        {topItems.map(renderItem)}
      </div>

      {/* Bottom: Settings */}
      <div className="flex flex-col gap-0.5 w-full items-center">
        <div className="relative w-full flex items-center justify-center" onMouseEnter={() => setHovered('settings')} onMouseLeave={() => setHovered(null)}>
          <button
            type="button"
            onClick={() => setActiveView('settings')}
            className={`relative p-2.5 rounded-lg transition-all duration-150 ${
              activeView === 'settings' && isSidebarOpen
                ? 'bg-accent/20 text-accent'
                : 'text-text-subtle hover:text-text-main hover:bg-bg-hover'
            }`}
          >
            <Settings className="w-5 h-5" />
            {activeView === 'settings' && isSidebarOpen && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent rounded-r" />
            )}
          </button>
          {hovered === 'settings' && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-bg-active border border-border-strong rounded text-[11px] text-text-main whitespace-nowrap z-50 shadow-lg pointer-events-none">
              Settings
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
