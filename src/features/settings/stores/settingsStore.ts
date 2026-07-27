import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type EditorTheme = 'vs-dark' | 'tokyo-night' | 'one-dark-pro' | 'vitesse-dark' | 'light';
export type LineNumbersMode = 'on' | 'off' | 'relative';
export type CursorStyle = 'line' | 'block' | 'underline' | 'line-thin' | 'block-outline' | 'underline-thin';

export type FontFamilyOption =
  | 'jetbrains-mono'
  | 'fira-code'
  | 'source-code-pro'
  | 'inconsolata'
  | 'ibm-plex-mono'
  | 'roboto-mono'
  | 'space-mono'
  | 'ubuntu-mono'
  | 'sf-mono'
  | 'cascadia-code';

export const FONT_FAMILY_MAP: Record<FontFamilyOption, { label: string; css: string }> = {
  'jetbrains-mono': {
    label: 'JetBrains Mono',
    css: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
  },
  'fira-code': {
    label: 'Fira Code',
    css: "'Fira Code', 'JetBrains Mono', 'SF Mono', monospace",
  },
  'source-code-pro': {
    label: 'Source Code Pro',
    css: "'Source Code Pro', 'JetBrains Mono', monospace",
  },
  inconsolata: {
    label: 'Inconsolata',
    css: "'Inconsolata', 'JetBrains Mono', monospace",
  },
  'ibm-plex-mono': {
    label: 'IBM Plex Mono',
    css: "'IBM Plex Mono', 'JetBrains Mono', monospace",
  },
  'roboto-mono': {
    label: 'Roboto Mono',
    css: "'Roboto Mono', 'JetBrains Mono', monospace",
  },
  'space-mono': {
    label: 'Space Mono',
    css: "'Space Mono', 'JetBrains Mono', monospace",
  },
  'ubuntu-mono': {
    label: 'Ubuntu Mono',
    css: "'Ubuntu Mono', 'JetBrains Mono', monospace",
  },
  'sf-mono': {
    label: 'SF Mono (macOS Native)',
    css: "'SF Mono', -apple-system-monospace, Monaco, monospace",
  },
  'cascadia-code': {
    label: 'Cascadia Code',
    css: "'Cascadia Code', 'Fira Code', 'JetBrains Mono', monospace",
  },
};

export interface SettingsState {
  theme: EditorTheme;
  fontFamily: FontFamilyOption;
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
  setFontFamily: (font: FontFamilyOption) => void;
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
      fontFamily: 'jetbrains-mono',
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
      setFontFamily: (fontFamily) => set({ fontFamily }),
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
