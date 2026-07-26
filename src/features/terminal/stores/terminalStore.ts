import { create } from 'zustand';

export interface ExecutionBenchmark {
  codeSnippet: string;
  command: string;
  durationMs: number;
  ipcSpawnMs: number;
  v8BootMs: number;
  execStreamMs: number;
  canvasRenderMs: number;
  timestamp: number;
}

export interface TerminalState {
  isTerminalOpen: boolean;
  activeDrawerTab: 'terminal' | 'problems' | 'output';
  cwd: string;
  pendingRunCommand: string | null;
  lastExecutionBenchmark: ExecutionBenchmark | null;
  isBenchmarkModalOpen: boolean;
  toggleTerminal: () => void;
  setTerminalOpen: (open: boolean) => void;
  setActiveDrawerTab: (tab: 'terminal' | 'problems' | 'output') => void;
  setCwd: (path: string) => void;
  runCodeFile: (command: string) => void;
  clearPendingRunCommand: () => void;
  setLastExecutionBenchmark: (benchmark: ExecutionBenchmark) => void;
  closeBenchmarkModal: () => void;
}

export const useTerminalStore = create<TerminalState>((set) => ({
  isTerminalOpen: false,
  activeDrawerTab: 'terminal',
  cwd: '/my-project',
  pendingRunCommand: null,
  lastExecutionBenchmark: null,
  isBenchmarkModalOpen: false,

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

  setLastExecutionBenchmark: (benchmark) =>
    set({
      lastExecutionBenchmark: benchmark,
      isBenchmarkModalOpen: false, // Never auto-pop up benchmark modal on execution
    }),

  closeBenchmarkModal: () => set({ isBenchmarkModalOpen: false }),
}));
