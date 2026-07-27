import React, { useEffect, useRef } from 'react';
import Editor, { OnMount, BeforeMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { useEditorStore } from '../stores/editorStore';
import { useSettingsStore, FONT_FAMILY_MAP } from '../../settings/stores/settingsStore';
import { registerSnippets } from '../snippets/snippetManager';
import { registerMonacoThemes } from '../themes/themeManager';

interface MonacoEditorContainerProps {
  tabId?: string;
  onSaveRequested?: () => void;
}

export const MonacoEditorContainer: React.FC<MonacoEditorContainerProps> = ({
  tabId,
  onSaveRequested,
}) => {
  const { getActiveTab, getSecondaryTab, updateTabContent, setCursorPosition } = useEditorStore();
  const {
    theme, fontFamily, fontSize, tabSize, wordWrap, minimap,
    stickyScroll, lineNumbers, cursorStyle, fontLigatures,
    renderWhitespace, smoothScrolling,
  } = useSettingsStore();

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const activeTab = tabId ? (tabId === 'secondary' ? getSecondaryTab() : getActiveTab()) : getActiveTab();
  const tab = activeTab;

  const fontCss = FONT_FAMILY_MAP[fontFamily]?.css || FONT_FAMILY_MAP['jetbrains-mono'].css;

  // Window level ⌘S Save hotkey fallback listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (onSaveRequested) {
          onSaveRequested();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSaveRequested]);

  if (!tab) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-bg-main text-text-subtle text-xs select-none">
        No active editor tab
      </div>
    );
  }

  const handleBeforeMount: BeforeMount = (monaco) => {
    registerSnippets(monaco);
    registerMonacoThemes(monaco);

    // ── Enable Full React TSX / JSX Support in Monaco ─────────────────────
    const compilerOptions = {
      jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      allowJs: true,
      checkJs: false,
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      noEmit: true,
      skipLibCheck: true,
    };

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions(compilerOptions);
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions(compilerOptions);

    // Ignore missing ambient module / type definition squiggles in standalone files
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
      diagnosticCodesToIgnore: [2307, 2304, 2792, 17004, 7026, 2686],
    });
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
      diagnosticCodesToIgnore: [2307, 2304, 2792, 17004, 7026, 2686],
    });
  };

  const handleEditorMount: OnMount = (editorInstance, monaco) => {
    editorRef.current = editorInstance;

    // Register ⌘S Save shortcut in Monaco
    editorInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      if (onSaveRequested) {
        onSaveRequested();
      }
    });

    // ⌥⇧F Format Document shortcut
    editorInstance.addCommand(monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
      const formatAction = editorInstance.getAction('editor.action.formatDocument');
      if (formatAction) {
        formatAction.run().catch(() => {});
      }
    });

    // Cursor position listener
    editorInstance.onDidChangeCursorPosition((e) => {
      if (e?.position) {
        setCursorPosition(e.position.lineNumber, e.position.column);
      }
    });
  };

  // Determine model path with .tsx extension fallback for untitled tabs
  const modelPath = tab.filePath || (tab.fileName.includes('.') ? tab.fileName : `${tab.fileName}.tsx`);
  const effectiveLanguage = tab.language === 'plaintext' ? 'typescript' : tab.language;

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#0d0e11]">
      <Editor
        key={tab.id}
        height="100%"
        width="100%"
        path={modelPath}
        language={effectiveLanguage || 'typescript'}
        value={tab.content ?? ''}
        onChange={(val) => updateTabContent(tab.id, val ?? '')}
        beforeMount={handleBeforeMount}
        onMount={handleEditorMount}
        theme={theme || 'tokyo-night'}
        options={{
          fontSize,
          fontFamily: fontCss,
          fontLigatures,
          lineNumbers,
          minimap: { enabled: minimap, side: 'right' },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize,
          wordWrap,
          contextmenu: true,
          copyWithSyntaxHighlighting: true,
          padding: { top: 10, bottom: 10 },
          smoothScrolling,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          cursorStyle,
          renderLineHighlight: 'all',
          lineHeight: Math.round(fontSize * 1.5),
          snippetSuggestions: 'top',
          tabCompletion: 'on',
          stickyScroll: { enabled: stickyScroll },
          renderWhitespace,
          'semanticHighlighting.enabled': true,
        }}
      />
    </div>
  );
};
