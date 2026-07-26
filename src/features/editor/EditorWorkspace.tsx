import React from 'react';
import { Code2, Plus, Columns } from 'lucide-react';
import { EditorTabs } from './components/EditorTabs';
import { MonacoEditorContainer } from './components/MonacoEditorContainer';
import { BreadcrumbsBar } from './components/BreadcrumbsBar';
import { useEditorStore } from './stores/editorStore';
import { saveFile } from '../../services/fileService';

export const EditorWorkspace: React.FC = () => {
  const { tabs, isSplitView, getActiveTab, getSecondaryTab, markTabSaved, newUntitledTab, toggleSplitView } =
    useEditorStore();

  const activeTab = getActiveTab();
  const secondaryTab = getSecondaryTab();

  const handleSaveActiveTab = async () => {
    if (!activeTab) return;
    const result = await saveFile(activeTab.filePath, activeTab.content);
    if (result.success) {
      markTabSaved(activeTab.id);
    }
  };

  return (
    <main className="flex-1 bg-bg-main flex flex-col h-full overflow-hidden select-none relative">
      <div className="flex items-center justify-between bg-bg-sidebar pr-2 border-b border-border-subtle shrink-0">
        <div className="flex-1 overflow-x-auto">
          <EditorTabs />
        </div>
        {tabs.length > 0 && (
          <button
            type="button"
            onClick={toggleSplitView}
            className={`p-1.5 rounded transition-colors ${
              isSplitView
                ? 'bg-accent text-white'
                : 'text-text-subtle hover:text-text-main hover:bg-bg-hover'
            }`}
            title="Toggle Split View (⌘\)"
          >
            <Columns className="w-4 h-4" />
          </button>
        )}
      </div>

      {tabs.length > 0 && activeTab ? (
        <div className="flex-1 w-full h-full flex flex-col overflow-hidden">
          {isSplitView && secondaryTab ? (
            <div className="flex-1 w-full h-full flex overflow-hidden">
              {/* Primary Pane */}
              <div className="flex-1 flex flex-col h-full border-r border-border-subtle overflow-hidden">
                <BreadcrumbsBar tabId="primary" />
                <div className="flex-1 relative">
                  <MonacoEditorContainer tabId="primary" onSaveRequested={handleSaveActiveTab} />
                </div>
              </div>

              {/* Secondary Pane */}
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                <BreadcrumbsBar tabId="secondary" />
                <div className="flex-1 relative">
                  <MonacoEditorContainer tabId="secondary" onSaveRequested={handleSaveActiveTab} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <BreadcrumbsBar />
              <div className="flex-1 relative">
                <MonacoEditorContainer onSaveRequested={handleSaveActiveTab} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-text-muted select-none">
          <div className="flex flex-col items-center gap-3 max-w-sm">
            <div className="p-4 bg-bg-surface rounded-full border border-border-subtle">
              <Code2 className="w-10 h-10 text-accent" />
            </div>
            <h2 className="text-base font-semibold text-text-main">No Open Files</h2>
            <p className="text-xs text-text-subtle leading-relaxed">
              Open a file from the explorer tree or create a new file to start coding.
            </p>
            <button
              type="button"
              onClick={newUntitledTab}
              className="mt-2 flex items-center gap-1.5 px-3 py-1.5 bg-accent hover:bg-accent-hover text-white rounded text-xs font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New File (⌘N)</span>
            </button>
          </div>
        </div>
      )}
    </main>
  );
};
