export interface EditorTab {
  id: string;
  filePath?: string;
  fileName: string;
  content: string;
  savedContent: string;
  isDirty: boolean;
  language: string;
}

export interface CursorPosition {
  line: number;
  column: number;
}

export interface EditorState {
  tabs: EditorTab[];
  activeTabId: string | null;
  secondaryTabId: string | null;
  isSplitView: boolean;
  cursorPosition: CursorPosition;

  openTab: (
    tab: Omit<EditorTab, 'isDirty' | 'savedContent' | 'language'> & {
      content?: string;
      savedContent?: string;
      language?: string;
    }
  ) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  setSecondaryTab: (id: string) => void;
  toggleSplitView: () => void;
  updateTabContent: (id: string, newContent: string) => void;
  markTabSaved: (id: string) => void;
  newUntitledTab: () => void;
  setCursorPosition: (line: number, column: number) => void;
  getActiveTab: () => EditorTab | undefined;
  getSecondaryTab: () => EditorTab | undefined;
}
