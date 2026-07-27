import React, { useEffect, useRef } from 'react';
import Editor, { OnMount, BeforeMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { useEditorStore } from '../stores/editorStore';
import { useSettingsStore, FONT_FAMILY_MAP } from '../../settings/stores/settingsStore';
import { registerSnippets } from '../snippets/snippetManager';

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

    // ── Enable React JSX & TSX Compiler Options ─────────────────────────────
    const compilerOptions = {
      jsx: monaco.languages.typescript.JsxEmit.React,
      jsxFactory: 'React.createElement',
      jsxFragmentFactory: 'React.Fragment',
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      allowJs: true,
      checkJs: false,
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      noEmit: true,
      skipLibCheck: true,
      baseUrl: '.',
      paths: {
        '*': ['*', 'src/*', 'node_modules/*'],
      },
    };

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions(compilerOptions);
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions(compilerOptions);

    // ── Inject Ambient React & react/jsx-runtime Types for TSX ───────────────
    const reactTypes = `
      declare module 'react/jsx-runtime' {
        export namespace JSX {
          interface IntrinsicElements { [elemName: string]: any; }
          type Element = any;
        }
        export function jsx(type: any, props: any, key?: any): any;
        export function jsxs(type: any, props: any, key?: any): any;
        export function Fragment(): any;
      }
      declare module 'react/jsx-dev-runtime' {
        export namespace JSX {
          interface IntrinsicElements { [elemName: string]: any; }
          type Element = any;
        }
        export function jsxDEV(type: any, props: any, key?: any, isStatic?: boolean, source?: any, self?: any): any;
        export function Fragment(): any;
      }
      declare module 'react' {
        export = React;
      }
      declare namespace React {
        type ReactNode = any;
        type ComponentType<P = {}> = any;
        type FC<P = {}> = (props: P) => any;
        type FunctionComponent<P = {}> = (props: P) => any;
        type CSSProperties = Record<string, any>;
        type MouseEvent<T = Element> = any;
        type FormEvent<T = Element> = any;
        type ChangeEvent<T = Element> = any;
        type KeyboardEvent<T = Element> = any;
        type FocusEvent<T = Element> = any;
        function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
        function useEffect(effect: () => void | (() => void), deps?: any[]): void;
        function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
        function useMemo<T>(factory: () => T, deps: any[]): T;
        function useRef<T>(initialValue: T): { current: T };
        function useContext<T>(context: any): T;
        function useReducer<R extends (...args: any[]) => any>(reducer: R, initialState: any): [any, any];
        function createContext<T>(defaultValue: T): any;
      }
      declare namespace JSX {
        interface IntrinsicElements { [elemName: string]: any; }
        type Element = any;
      }
      declare const React: any;
    `;

    monaco.languages.typescript.typescriptDefaults.addExtraLib(reactTypes, 'ts:filename/react.d.ts');
    monaco.languages.typescript.javascriptDefaults.addExtraLib(reactTypes, 'js:filename/react.d.ts');

    // Suppress missing local module & jsx-runtime diagnostic squiggles for relative file imports
    const ignoredDiagnostics = [2307, 2304, 2503, 2552, 2792, 6142, 17004, 7026, 7016, 2686, 2339];
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
      diagnosticCodesToIgnore: ignoredDiagnostics,
    });
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
      diagnosticCodesToIgnore: ignoredDiagnostics,
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

  const modelPath = tab.filePath || (tab.fileName.includes('.') ? tab.fileName : `${tab.fileName}.tsx`);

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#0d0e11]">
      <Editor
        key={tab.id}
        height="100%"
        width="100%"
        path={modelPath}
        language={tab.language || 'typescript'}
        value={tab.content ?? ''}
        onChange={(val) => updateTabContent(tab.id, val ?? '')}
        beforeMount={handleBeforeMount}
        onMount={handleEditorMount}
        theme={theme || 'vs-dark'}
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
        }}
      />
    </div>
  );
};
