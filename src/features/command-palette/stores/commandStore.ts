import { create } from 'zustand';
import { CommandState } from '../types/command.types';

export const useCommandStore = create<CommandState>((set) => ({
  isOpen: false,
  query: '',
  openCommandPalette: () => set({ isOpen: true, query: '' }),
  closeCommandPalette: () => set({ isOpen: false, query: '' }),
  toggleCommandPalette: () => set((state) => ({ isOpen: !state.isOpen, query: '' })),
  setQuery: (query) => set({ query }),
}));
