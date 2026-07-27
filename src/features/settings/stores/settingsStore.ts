import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type EditorTheme = 'vs-dark' | 'tokyo-night' | 'one-dark-pro' | 'vitesse-dark' | 'light';
export type LineNumbersMode = 'on' | 'off' | 'relative';
export type CursorStyle = 'line' | 'block' | 'underline' | 'line-thin' | 'block-outline' | 'underline-thin';

export interface SettingsState {
  theme: EditorTheme;
  fontSize: number;
  tabSize: number;
  wordWrap: 'on' | 'off';
  minimap: boolean;
  stickyScroll: boolean;
  lineNumbers: LineNumbersMode;
  cursorStyle: CursorStyle;
  fontLigatures: boolean;
  renderWhitespace: 'none' | 'boundary' | 'all';
  smoothScrolling: boolean;
  setTheme: (theme: EditorTheme) => void;
  setFontSize: (size: number) => void;
  setTabSize: (size: number) => void;
  setWordWrap: (wrap: 'on' | 'off') => void;
  setMinimap: (enabled: boolean) => void;
  setStickyScroll: (enabled: boolean) => void;
  setLineNumbers: (mode: LineNumbersMode) => void;
  setCursorStyle: (style: CursorStyle) => void;
  setFontLigatures: (enabled: boolean) => void;
  setRenderWhitespace: (mode: 'none' | 'boundary' | 'all') => void;
  setSmoothScrolling: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'vs-dark',
      fontSize: 14,
      tabSize: 2,
      wordWrap: 'on',
      minimap: true,
      stickyScroll: true,
      lineNumbers: 'on',
      cursorStyle: 'line',
      fontLigatures: true,
      renderWhitespace: 'none',
      smoothScrolling: true,
      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      setTabSize: (tabSize) => set({ tabSize }),
      setWordWrap: (wordWrap) => set({ wordWrap }),
      setMinimap: (minimap) => set({ minimap }),
      setStickyScroll: (stickyScroll) => set({ stickyScroll }),
      setLineNumbers: (lineNumbers) => set({ lineNumbers }),
      setCursorStyle: (cursorStyle) => set({ cursorStyle }),
      setFontLigatures: (fontLigatures) => set({ fontLigatures }),
      setRenderWhitespace: (renderWhitespace) => set({ renderWhitespace }),
      setSmoothScrolling: (smoothScrolling) => set({ smoothScrolling }),
    }),
    { name: 'editor-settings' }
  )
);
