import React from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { useEditorStore } from '../stores/editorStore';
import { useSettingsStore } from '../../settings/stores/settingsStore';

interface MonacoEditorContainerProps {
  tabId?: string;
  onSaveRequested?: () => void;
}

export const MonacoEditorContainer: React.FC<MonacoEditorContainerProps> = ({
  tabId,
  onSaveRequested,
}) => {
  const { getActiveTab, getSecondaryTab, updateTabContent, setCursorPosition } = useEditorStore();
  const { theme, fontSize, tabSize, wordWrap, minimap } = useSettingsStore();

  const tab = tabId ? (tabId === 'secondary' ? getSecondaryTab() : getActiveTab()) : getActiveTab();

  if (!tab) return null;

  const handleEditorMount: OnMount = (editor, monaco) => {
    // Enable React & JSX compilation options for TypeScript and JavaScript workers
    if (monaco?.languages?.typescript) {
      const tsDefaults = monaco.languages.typescript.typescriptDefaults;
      const jsDefaults = monaco.languages.typescript.javascriptDefaults;

      tsDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ESNext,
        module: monaco.languages.typescript.ModuleKind.ESNext,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        jsx: monaco.languages.typescript.JsxEmit.ReactJSX || monaco.languages.typescript.JsxEmit.React,
        jsxFactory: 'React.createElement',
        reactNamespace: 'React',
        allowNonTsExtensions: true,
        allowJs: true,
      });

      jsDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ESNext,
        module: monaco.languages.typescript.ModuleKind.ESNext,
        jsx: monaco.languages.typescript.JsxEmit.ReactJSX || monaco.languages.typescript.JsxEmit.React,
        allowNonTsExtensions: true,
        allowJs: true,
      });

      // Suppress false-positive missing module/type errors (e.g. "Cannot find module 'react'")
      tsDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: false,
      });

      jsDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: false,
      });
    }

    // ⌘S Save shortcut
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      if (onSaveRequested) {
        onSaveRequested();
      }
    });

    // ⌥⇧F Format Document shortcut
    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
      const formatAction = editor.getAction('editor.action.formatDocument');
      if (formatAction) {
        formatAction.run().catch(() => {});
      }
    });

    // Cursor position listener
    editor.onDidChangeCursorPosition((e) => {
      if (e?.position) {
        setCursorPosition(e.position.lineNumber, e.position.column);
      }
    });
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#0d0e11]">
      <Editor
        key={tab.id}
        height="100%"
        width="100%"
        language={tab.language || 'plaintext'}
        value={tab.content ?? ''}
        onChange={(val) => updateTabContent(tab.id, val ?? '')}
        onMount={handleEditorMount}
        theme={theme || 'vs-dark'}
        options={{
          fontSize,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
          lineNumbers: 'on',
          minimap: { enabled: minimap, side: 'right' },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize,
          wordWrap,
          padding: { top: 10, bottom: 10 },
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
