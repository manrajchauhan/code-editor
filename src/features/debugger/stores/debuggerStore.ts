import { create } from 'zustand';

export interface Breakpoint {
  filePath: string;
  line: number;
  enabled: boolean;
}

export interface StackFrame {
  id: number;
  name: string;
  file: string;
  line: number;
}

export interface DebugVariable {
  name: string;
  value: string;
  type: string;
}

export interface DebuggerState {
  isRunning: boolean;
  isPaused: boolean;
  breakpoints: Breakpoint[];
  callStack: StackFrame[];
  variables: DebugVariable[];
  currentFile: string | null;
  currentLine: number | null;
  output: string[];
  toggleBreakpoint: (filePath: string, line: number) => void;
  enableBreakpoint: (filePath: string, line: number) => void;
  disableBreakpoint: (filePath: string, line: number) => void;
  removeBreakpoint: (filePath: string, line: number) => void;
  clearBreakpoints: () => void;
  startSession: () => void;
  stopSession: () => void;
  stepOver: () => void;
  stepInto: () => void;
  continueExecution: () => void;
  addOutput: (line: string) => void;
  clearOutput: () => void;
}

export const useDebuggerStore = create<DebuggerState>((set, get) => ({
  isRunning: false,
  isPaused: false,
  breakpoints: [],
  callStack: [],
  variables: [],
  currentFile: null,
  currentLine: null,
  output: [],

  toggleBreakpoint: (filePath, line) => {
    const { breakpoints } = get();
    const idx = breakpoints.findIndex((b) => b.filePath === filePath && b.line === line);
    if (idx === -1) {
      set({ breakpoints: [...breakpoints, { filePath, line, enabled: true }] });
    } else {
      set({ breakpoints: breakpoints.filter((_, i) => i !== idx) });
    }
  },

  enableBreakpoint: (filePath, line) => {
    set((state) => ({
      breakpoints: state.breakpoints.map((b) =>
        b.filePath === filePath && b.line === line ? { ...b, enabled: true } : b
      ),
    }));
  },

  disableBreakpoint: (filePath, line) => {
    set((state) => ({
      breakpoints: state.breakpoints.map((b) =>
        b.filePath === filePath && b.line === line ? { ...b, enabled: false } : b
      ),
    }));
  },

  removeBreakpoint: (filePath, line) => {
    set((state) => ({
      breakpoints: state.breakpoints.filter((b) => !(b.filePath === filePath && b.line === line)),
    }));
  },

  clearBreakpoints: () => set({ breakpoints: [] }),

  startSession: () => {
    set({
      isRunning: true,
      isPaused: false,
      callStack: [
        { id: 1, name: 'main()', file: 'index.js', line: 1 },
      ],
      variables: [],
      output: ['▷ Debug session started (simulated)'],
    });
  },

  stopSession: () => {
    set({
      isRunning: false,
      isPaused: false,
      callStack: [],
      variables: [],
      currentLine: null,
      currentFile: null,
      output: [...get().output, '■ Debug session ended'],
    });
  },

  stepOver: () => {
    if (!get().isRunning) return;
    set((state) => ({
      isPaused: true,
      output: [...state.output, '⤮ Step over'],
    }));
  },

  stepInto: () => {
    if (!get().isRunning) return;
    set((state) => ({
      isPaused: true,
      output: [...state.output, '↓ Step into'],
    }));
  },

  continueExecution: () => {
    set({ isPaused: false });
  },

  addOutput: (line) => set((state) => ({ output: [...state.output, line] })),
  clearOutput: () => set({ output: [] }),
}));
