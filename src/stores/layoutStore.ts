import { create } from 'zustand';
import { LayoutState, ActivityView } from '../types/layout.types';

export const useLayoutStore = create<LayoutState>((set) => ({
  activeView: 'explorer',
  isSidebarOpen: true,
  sidebarWidth: 240,
  setActiveView: (view: ActivityView) =>
    set((state) => ({
      activeView: view,
      isSidebarOpen: state.activeView === view ? !state.isSidebarOpen : true,
    })),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarWidth: (sidebarWidth: number) => set({ sidebarWidth }),
}));
