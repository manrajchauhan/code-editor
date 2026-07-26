import React from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { useEditorStore } from '../stores/editorStore';
import { useSettingsStore } from '../../settings/stores/settingsStore';

interface MonacoEditorContainerProps {
  onSaveRequested?: () => void;
}

export const MonacoEditorContainer: React.FC<MonacoEditorContainerProps> = ({ onSaveRequested }) => {
  const { getActiveTab, updateTabContent } = useEditorStore();
  const { theme, fontSize, tabSize, wordWrap, minimap } = useSettingsStore();

  const activeTab = getActiveTab();

  if (!activeTab) return null;

  const handleEditorMount: OnMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      if (onSaveRequested) {
        onSaveRequested();
      }
    });
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#0d0e11]">
      <Editor
        key={activeTab.id}
        height="100%"
        width="100%"
        language={activeTab.language}
        value={activeTab.content}
        onChange={(val) => updateTabContent(activeTab.id, val ?? '')}
        onMount={handleEditorMount}
        theme={theme}
        options={{
          fontSize,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
          lineNumbers: 'on',
          minimap: { enabled: minimap, side: 'right' },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize,
          wordWrap,
          padding: { top: 12, bottom: 12 },
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          renderLineHighlight: 'all',
          lineHeight: Math.round(fontSize * 1.5),
        }}
      />
    </div>
  );
};
