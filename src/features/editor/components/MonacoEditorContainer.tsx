import React from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { useEditorStore } from '../stores/editorStore';
import { useSettingsStore } from '../../settings/stores/settingsStore';

interface MonacoEditorContainerProps {
  tabId?: string;
  onSaveRequested?: () => void;
}

const GLOBAL_TYPES_DECLARATIONS = `
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
  interface Element {}
  interface ReactElement {}
}

declare namespace React {
  type ReactNode = any;
  type ComponentType<P = {}> = any;
  type FC<P = {}> = (props: P) => any;
  type FunctionComponent<P = {}> = (props: P) => any;
  type CSSProperties = { [key: string]: any };
  type MouseEvent<T = any> = any;
  type KeyboardEvent<T = any> = any;
  type FormEvent<T = any> = any;
  type ChangeEvent<T = any> = any;

  function useState<T>(initialState: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void];
  function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  function useContext<T>(context: any): T;
  function useMemo<T>(factory: () => T, deps?: any[]): T;
  function useCallback<T extends (...args: any[]) => any>(callback: T, deps?: any[]): T;
  function useRef<T>(initialValue?: T): { current: T };
  function createContext<T>(defaultValue: T): any;
  function createElement(type: any, props?: any, ...children: any[]): any;
}

declare var React: typeof React;
declare var console: {
  log(...args: any[]): void;
  error(...args: any[]): void;
  warn(...args: any[]): void;
  info(...args: any[]): void;
  debug(...args: any[]): void;
};
declare var document: any;
declare var window: any;
declare var fetch: (url: string, init?: any) => Promise<any>;
declare var setTimeout: (fn: (...args: any[]) => void, delay?: number, ...args: any[]) => number;
declare var clearTimeout: (id?: number) => void;
declare var setInterval: (fn: (...args: any[]) => void, delay?: number, ...args: any[]) => number;
declare var clearInterval: (id?: number) => void;
declare var process: { env: Record<string, string | undefined> };
declare var module: any;
declare var exports: any;
declare var require: (id: string) => any;
`;

export const MonacoEditorContainer: React.FC<MonacoEditorContainerProps> = ({
  tabId,
  onSaveRequested,
}) => {
  const { getActiveTab, getSecondaryTab, updateTabContent, setCursorPosition } = useEditorStore();
  const { theme, fontSize, tabSize, wordWrap, minimap } = useSettingsStore();

  const tab = tabId ? (tabId === 'secondary' ? getSecondaryTab() : getActiveTab()) : getActiveTab();

  if (!tab) return null;

  const handleEditorMount: OnMount = (editor, monaco) => {
    // 1. Define Premium Editor Themes
    monaco.editor.defineTheme('tokyo-night', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'bb9af7', fontStyle: 'bold' },
        { token: 'type.identifier', foreground: '7dcfff', fontStyle: 'bold' },
        { token: 'interface.identifier', foreground: '7dcfff', fontStyle: 'italic' },
        { token: 'string', foreground: '9ece6a' },
        { token: 'number', foreground: 'ff9e64' },
        { token: 'comment', foreground: '565f89', fontStyle: 'italic' },
        { token: 'tag', foreground: 'f7768e' },
        { token: 'attribute.name', foreground: 'bb9af7' },
        { token: 'function', foreground: '7aa2f7' },
        { token: 'delimiter', foreground: '89ddff' },
      ],
      colors: {
        'editor.background': '#1a1b26',
        'editor.foreground': '#a9b1d6',
        'editor.lineHighlightBackground': '#24283b',
        'editorCursor.foreground': '#7aa2f7',
        'editorWhitespace.foreground': '#3b4261',
        'editorIndentGuide.background': '#292e42',
        'editorIndentGuide.activeBackground': '#7aa2f7',
      },
    });

    monaco.editor.defineTheme('one-dark-pro', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'c678dd', fontStyle: 'bold' },
        { token: 'type.identifier', foreground: 'e5c07b' },
        { token: 'string', foreground: '98c379' },
        { token: 'number', foreground: 'd19a66' },
        { token: 'comment', foreground: '5c6370', fontStyle: 'italic' },
        { token: 'tag', foreground: 'e06c75' },
        { token: 'function', foreground: '61afef' },
      ],
      colors: {
        'editor.background': '#21252b',
        'editor.foreground': '#abb2bf',
        'editor.lineHighlightBackground': '#2c313a',
        'editorCursor.foreground': '#528bff',
      },
    });

    monaco.editor.defineTheme('vitesse-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '4d9375', fontStyle: 'bold' },
        { token: 'type.identifier', foreground: 'bd9765' },
        { token: 'string', foreground: 'c98a7d' },
        { token: 'number', foreground: '6394bf' },
        { token: 'comment', foreground: '758575', fontStyle: 'italic' },
        { token: 'function', foreground: '4d9375' },
      ],
      colors: {
        'editor.background': '#121212',
        'editor.foreground': '#dbd7ca',
        'editor.lineHighlightBackground': '#1e1e1e',
        'editorCursor.foreground': '#4d9375',
      },
    });

    // 2. Configure TypeScript & JavaScript Workers with Global Declarations
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

      // Inject Global Type Declarations for React, JSX, DOM, and Node
      tsDefaults.addExtraLib(GLOBAL_TYPES_DECLARATIONS, 'ts:filename/react-globals.d.ts');
      jsDefaults.addExtraLib(GLOBAL_TYPES_DECLARATIONS, 'ts:filename/react-globals.d.ts');

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
        theme={theme || 'tokyo-night'}
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
