export type ActivityView = 'explorer' | 'search' | 'settings';

export interface LayoutState {
  activeView: ActivityView;
  isSidebarOpen: boolean;
  sidebarWidth: number;
  setActiveView: (view: ActivityView) => void;
  toggleSidebar: () => void;
  setSidebarWidth: (width: number) => void;
}
