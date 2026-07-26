import { create } from 'zustand';

export interface TerminalState {
  isTerminalOpen: boolean;
  activeDrawerTab: 'terminal' | 'problems' | 'output';
  cwd: string;
  toggleTerminal: () => void;
  setTerminalOpen: (open: boolean) => void;
  setActiveDrawerTab: (tab: 'terminal' | 'problems' | 'output') => void;
  setCwd: (path: string) => void;
}

export const useTerminalStore = create<TerminalState>((set) => ({
  isTerminalOpen: false,
  activeDrawerTab: 'terminal',
  cwd: '/my-project',
  toggleTerminal: () =>
    set((state) => ({
      isTerminalOpen: !state.isTerminalOpen,
      activeDrawerTab: 'terminal',
    })),
  setTerminalOpen: (isTerminalOpen) => set({ isTerminalOpen, activeDrawerTab: 'terminal' }),
  setActiveDrawerTab: (activeDrawerTab) => set({ activeDrawerTab, isTerminalOpen: true }),
  setCwd: (cwd) => set({ cwd }),
}));
