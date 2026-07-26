export interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Editor' | 'File' | 'View' | 'Settings';
  shortcut?: string;
  action: () => void;
}

export interface CommandState {
  isOpen: boolean;
  query: string;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleCommandPalette: () => void;
  setQuery: (q: string) => void;
}
