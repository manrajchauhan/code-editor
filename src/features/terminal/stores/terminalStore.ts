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

export interface TerminalInstance {
  id: string;
  name: string;
  cwd: string;
}

export interface TerminalState {
  isTerminalOpen: boolean;
  activeDrawerTab: 'terminal' | 'problems' | 'output';
  drawerHeight: number;
  isMaximized: boolean;
  terminals: TerminalInstance[];
  activeTerminalId: string;
  pendingRunCommand: string | null;
  lastExecutionBenchmark: ExecutionBenchmark | null;
  isBenchmarkModalOpen: boolean;

  toggleTerminal: () => void;
  setTerminalOpen: (open: boolean) => void;
  setActiveDrawerTab: (tab: 'terminal' | 'problems' | 'output') => void;
  setDrawerHeight: (height: number) => void;
  toggleMaximize: () => void;

  createTerminalTab: (name?: string) => void;
  closeTerminalTab: (id: string) => void;
  setActiveTerminalTab: (id: string) => void;

  runCodeFile: (command: string) => void;
  clearPendingRunCommand: () => void;
  setLastExecutionBenchmark: (benchmark: ExecutionBenchmark) => void;
  closeBenchmarkModal: () => void;
}

export const useTerminalStore = create<TerminalState>((set, get) => ({
  isTerminalOpen: false,
  activeDrawerTab: 'terminal',
  drawerHeight: 260,
  isMaximized: false,
  terminals: [{ id: 'term-1', name: 'bash 1', cwd: '' }],
  activeTerminalId: 'term-1',
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
  setDrawerHeight: (drawerHeight) => set({ drawerHeight }),
  toggleMaximize: () => set((state) => ({ isMaximized: !state.isMaximized })),

  createTerminalTab: (name) => {
    const { terminals } = get();
    const newId = `term-${Date.now()}`;
    const newName = name || `bash ${terminals.length + 1}`;
    set({
      terminals: [...terminals, { id: newId, name: newName, cwd: '' }],
      activeTerminalId: newId,
      isTerminalOpen: true,
      activeDrawerTab: 'terminal',
    });
  },

  closeTerminalTab: (id) => {
    const { terminals, activeTerminalId } = get();
    if (terminals.length <= 1) return; // Keep at least one terminal open
    const filtered = terminals.filter((t) => t.id !== id);
    const nextActive = activeTerminalId === id ? filtered[filtered.length - 1].id : activeTerminalId;
    set({ terminals: filtered, activeTerminalId: nextActive });
  },

  setActiveTerminalTab: (activeTerminalId) => set({ activeTerminalId }),

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
      isBenchmarkModalOpen: false,
    }),

  closeBenchmarkModal: () => set({ isBenchmarkModalOpen: false }),
}));
