import { create } from 'zustand';

export interface DiagnosticMessage {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  source?: string;
  line?: number;
  timestamp: string;
}

export interface DiagnosticsState {
  isOpen: boolean;
  activeTab: 'problems' | 'output';
  messages: DiagnosticMessage[];
  toggleDiagnostics: () => void;
  setOpen: (open: boolean) => void;
  setActiveTab: (tab: 'problems' | 'output') => void;
  addMessage: (msg: Omit<DiagnosticMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
}

export const useDiagnosticsStore = create<DiagnosticsState>((set) => ({
  isOpen: false,
  activeTab: 'problems',
  messages: [
    {
      id: 'demo-1',
      type: 'info',
      message: 'Local Code Editor initialized. Zero diagnostic errors found.',
      source: 'System',
      timestamp: new Date().toLocaleTimeString(),
    },
  ],
  toggleDiagnostics: () => set((state) => ({ isOpen: !state.isOpen })),
  setOpen: (isOpen) => set({ isOpen }),
  setActiveTab: (activeTab) => set({ activeTab }),
  addMessage: (msg) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...msg,
          id: `diag-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ],
    })),
  clearMessages: () => set({ messages: [] }),
}));
