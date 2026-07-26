import React from 'react';
import { FileCode, X, Plus } from 'lucide-react';
import { useEditorStore } from '../stores/editorStore';

export const EditorTabs: React.FC = () => {
  const { tabs, activeTabId, setActiveTab, closeTab, newUntitledTab } = useEditorStore();

  if (tabs.length === 0) return null;

  return (
    <div className="h-9 bg-bg-sidebar border-b border-border-subtle flex items-center px-1 gap-1 overflow-x-auto select-none shrink-0">
      <div className="flex items-center gap-1 overflow-x-auto flex-1">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group relative flex items-center gap-2 px-3 py-1.5 cursor-pointer text-xs transition-colors rounded-t border-r border-border-subtle min-w-[120px] max-w-[200px] justify-between ${
                isActive
                  ? 'bg-bg-main text-text-main font-medium border-t-2 border-t-accent'
                  : 'bg-bg-surface/40 text-text-muted hover:bg-bg-hover hover:text-text-main'
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                <FileCode className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-accent' : 'text-text-subtle'}`} />
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
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={newUntitledTab}
        className="p-1 rounded text-text-subtle hover:text-text-main hover:bg-bg-hover transition-colors mr-1"
        title="New File (⌘N)"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};
