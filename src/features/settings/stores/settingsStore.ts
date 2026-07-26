import { create } from 'zustand';

export interface SettingsState {
  theme: 'vs-dark' | 'light';
  fontSize: number;
  tabSize: number;
  wordWrap: 'on' | 'off';
  minimap: boolean;
  setTheme: (theme: 'vs-dark' | 'light') => void;
  setFontSize: (size: number) => void;
  setTabSize: (size: number) => void;
  setWordWrap: (wrap: 'on' | 'off') => void;
  setMinimap: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: 'vs-dark',
  fontSize: 14,
  tabSize: 2,
  wordWrap: 'on',
  minimap: true,
  setTheme: (theme) => set({ theme }),
  setFontSize: (fontSize) => set({ fontSize }),
  setTabSize: (tabSize) => set({ tabSize }),
  setWordWrap: (wordWrap) => set({ wordWrap }),
  setMinimap: (minimap) => set({ minimap }),
}));
