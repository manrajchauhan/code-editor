import React from 'react';
import { Code2, Plus } from 'lucide-react';
import { EditorTabs } from './components/EditorTabs';
import { MonacoEditorContainer } from './components/MonacoEditorContainer';
import { useEditorStore } from './stores/editorStore';
import { saveFile } from '../../services/fileService';

export const EditorWorkspace: React.FC = () => {
  const { tabs, getActiveTab, markTabSaved, newUntitledTab } = useEditorStore();
  const activeTab = getActiveTab();

  const handleSaveActiveTab = async () => {
    if (!activeTab) return;
    const result = await saveFile(activeTab.filePath, activeTab.content);
    if (result.success) {
      markTabSaved(activeTab.id);
    }
  };

  return (
    <main className="flex-1 bg-bg-main flex flex-col h-full overflow-hidden select-none relative">
      <EditorTabs />

      {tabs.length > 0 && activeTab ? (
        <div className="flex-1 w-full h-full relative">
          <MonacoEditorContainer onSaveRequested={handleSaveActiveTab} />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-text-muted select-none">
          <div className="flex flex-col items-center gap-3 max-w-sm">
            <div className="p-4 bg-bg-surface rounded-full border border-border-subtle">
              <Code2 className="w-10 h-10 text-accent" />
            </div>
            <h2 className="text-base font-semibold text-text-main">
              No Open Files
            </h2>
            <p className="text-xs text-text-subtle leading-relaxed">
              Open a file from the explorer or create a new file to start coding.
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
