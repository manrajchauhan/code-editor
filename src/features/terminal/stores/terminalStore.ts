import { create } from 'zustand';

export interface TerminalState {
  isTerminalOpen: boolean;
  activeDrawerTab: 'terminal' | 'problems' | 'output';
  cwd: string;
  pendingRunCommand: string | null;
  toggleTerminal: () => void;
  setTerminalOpen: (open: boolean) => void;
  setActiveDrawerTab: (tab: 'terminal' | 'problems' | 'output') => void;
  setCwd: (path: string) => void;
  runCodeFile: (command: string) => void;
  clearPendingRunCommand: () => void;
}

export const useTerminalStore = create<TerminalState>((set) => ({
  isTerminalOpen: false,
  activeDrawerTab: 'terminal',
  cwd: '/my-project',
  pendingRunCommand: null,

  toggleTerminal: () =>
    set((state) => ({
      isTerminalOpen: !state.isTerminalOpen,
      activeDrawerTab: 'terminal',
    })),

  setTerminalOpen: (isTerminalOpen) => set({ isTerminalOpen, activeDrawerTab: 'terminal' }),
  setActiveDrawerTab: (activeDrawerTab) => set({ activeDrawerTab, isTerminalOpen: true }),
  setCwd: (cwd) => set({ cwd }),

  runCodeFile: (command: string) =>
    set({
      isTerminalOpen: true,
      activeDrawerTab: 'terminal',
      pendingRunCommand: command,
    }),

  clearPendingRunCommand: () => set({ pendingRunCommand: null }),
}));
