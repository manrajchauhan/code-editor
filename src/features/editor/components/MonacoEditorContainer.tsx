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

    // ── Deep Compiler Options (ESNext, DOM, React JSX, Node) ───────────────
    const compilerOptions = {
      jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      lib: ['esnext', 'dom', 'dom.iterable'],
      allowJs: true,
      checkJs: false,
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      noEmit: true,
      skipLibCheck: true,
    };

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions(compilerOptions);
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions(compilerOptions);

    // ── Deep Ambient Declarations: HTML, CSS, JS, React, Next, UI Libs ──────
    const fullRuntimeTypes = `
      // ── React & JSX Runtime ──
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
        type TouchEvent<T = Element> = any;
        type SyntheticEvent<T = Element> = any;
        type HTMLAttributes<T> = any;
        function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
        function useEffect(effect: () => void | (() => void), deps?: any[]): void;
        function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
        function useMemo<T>(factory: () => T, deps: any[]): T;
        function useRef<T>(initialValue: T): { current: T };
        function useContext<T>(context: any): T;
        function useReducer<R extends (...args: any[]) => any>(reducer: R, initialState: any): [any, any];
        function createContext<T>(defaultValue: T): any;
        function memo<T>(component: T): T;
        function forwardRef<T, P = {}>(render: (props: P, ref: any) => any): any;
      }
      declare namespace JSX {
        interface IntrinsicElements { [elemName: string]: any; }
        type Element = any;
      }
      declare const React: any;

      // ── React DOM ──
      declare module 'react-dom' {
        export function render(element: any, container: any): void;
        export function createPortal(children: any, container: any): any;
      }
      declare module 'react-dom/client' {
        export function createRoot(container: any): { render(children: any): void; unmount(): void };
      }

      // ── Next.js Integration ──
      declare module 'next/link' {
        const Link: React.FC<any>;
        export default Link;
      }
      declare module 'next/image' {
        const Image: React.FC<any>;
        export default Image;
      }
      declare module 'next/router' {
        export function useRouter(): any;
      }
      declare module 'next/navigation' {
        export function useRouter(): any;
        export function usePathname(): string;
        export function useSearchParams(): any;
        export function redirect(url: string): never;
      }

      // ── Common Web UI Libs ──
      declare module 'lucide-react' {
        export const [key: string]: React.FC<any>;
      }
      declare module 'framer-motion' {
        export const motion: Record<string, React.FC<any>>;
        export function AnimatePresence(props: any): any;
      }
      declare module 'clsx' {
        export function clsx(...inputs: any[]): string;
        export default clsx;
      }
      declare module 'tailwind-merge' {
        export function twMerge(...inputs: any[]): string;
      }
      declare module 'zustand' {
        export function create<T>(stateCreator: any): any;
      }

      // ── Web API & DOM Globals ──
      declare const window: Window & typeof globalThis;
      declare const document: Document;
      declare const console: Console;
      declare const localStorage: Storage;
      declare const sessionStorage: Storage;
      declare const location: Location;
      declare const navigator: Navigator;
      declare function fetch(input: any, init?: any): Promise<Response>;
      declare function setTimeout(handler: any, timeout?: number, ...args: any[]): number;
      declare function clearTimeout(handle?: number): void;
      declare function setInterval(handler: any, timeout?: number, ...args: any[]): number;
      declare function clearInterval(handle?: number): void;
      declare function requestAnimationFrame(callback: any): number;
      declare function cancelAnimationFrame(handle: number): void;

      // ── CSS & DOM Element Types ──
      interface HTMLElement { [key: string]: any; }
      interface HTMLDivElement extends HTMLElement {}
      interface HTMLInputElement extends HTMLElement { value: string; }
      interface HTMLButtonElement extends HTMLElement {}
      interface HTMLFormElement extends HTMLElement {}
      interface HTMLAnchorElement extends HTMLElement { href: string; }
      interface HTMLImageElement extends HTMLElement { src: string; alt: string; }
      interface HTMLCanvasElement extends HTMLElement { getContext(type: string): any; }
      interface CSSStyleDeclaration { [key: string]: any; }
      interface Event { target: any; preventDefault(): void; stopPropagation(): void; }
      interface MouseEvent extends Event { clientX: number; clientY: number; }
      interface KeyboardEvent extends Event { key: string; code: string; metaKey: boolean; ctrlKey: boolean; }
    `;

    monaco.languages.typescript.typescriptDefaults.addExtraLib(fullRuntimeTypes, 'ts:filename/full-runtime.d.ts');
    monaco.languages.typescript.javascriptDefaults.addExtraLib(fullRuntimeTypes, 'js:filename/full-runtime.d.ts');

    // Ignore non-essential diagnostic codes in standalone files
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
          autoClosingBrackets: 'always',
          autoClosingQuotes: 'always',
          autoClosingOvertype: 'always',
          autoSurround: 'languageDefined',
          linkedEditing: true, // Auto-rename matching HTML / JSX opening and closing tags!
          formatOnType: true,
          formatOnPaste: true,
        }}
      />
    </div>
  );
};
