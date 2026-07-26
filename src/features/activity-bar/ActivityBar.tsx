import React from 'react';
import { Files, Search, Settings, PanelLeft } from 'lucide-react';
import { useLayoutStore } from '../../stores/layoutStore';
import { ActivityView } from '../../types/layout.types';

export const ActivityBar: React.FC = () => {
  const { activeView, isSidebarOpen, setActiveView, toggleSidebar } = useLayoutStore();

  const navItems: Array<{ id: ActivityView; label: string; icon: React.ReactNode }> = [
    { id: 'explorer', label: 'Explorer', icon: <Files className="w-5 h-5" /> },
    { id: 'search', label: 'Search', icon: <Search className="w-5 h-5" /> },
  ];

  return (
    <aside
      className="w-12 bg-bg-surface border-r border-border-subtle flex flex-col justify-between items-center py-2 select-none z-20 shrink-0"
      aria-label="Activity Bar"
    >
      <div className="flex flex-col gap-1 w-full items-center">
        <button
          type="button"
          onClick={toggleSidebar}
          title={isSidebarOpen ? 'Collapse Sidebar (⌘B)' : 'Expand Sidebar (⌘B)'}
          className={`p-2 rounded-md transition-colors ${
            isSidebarOpen
              ? 'text-text-main hover:bg-bg-hover'
              : 'text-text-muted hover:bg-bg-hover hover:text-text-main'
          }`}
        >
          <PanelLeft className="w-5 h-5" />
        </button>

        <div className="w-6 h-[1px] bg-border-subtle my-1" />

        {navItems.map((item) => {
          const isActive = activeView === item.id && isSidebarOpen;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveView(item.id)}
              title={item.label}
              className={`relative p-2.5 rounded-md transition-colors ${
                isActive
                  ? 'text-text-main bg-bg-hover'
                  : 'text-text-muted hover:text-text-main hover:bg-bg-hover'
              }`}
            >
              {item.icon}
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-accent rounded-r" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-1 w-full items-center">
        <button
          type="button"
          onClick={() => setActiveView('settings')}
          title="Settings"
          className={`relative p-2.5 rounded-md transition-colors ${
            activeView === 'settings' && isSidebarOpen
              ? 'text-text-main bg-bg-hover'
              : 'text-text-muted hover:text-text-main hover:bg-bg-hover'
          }`}
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
};
