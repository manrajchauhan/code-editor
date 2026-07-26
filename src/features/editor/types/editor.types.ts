export interface EditorTab {
  id: string;
  filePath?: string;
  fileName: string;
  content: string;
  savedContent: string;
  isDirty: boolean;
  language: string;
}

export interface EditorState {
  tabs: EditorTab[];
  activeTabId: string | null;
  openTab: (tab: Omit<EditorTab, 'isDirty' | 'savedContent' | 'language'> & { content?: string; savedContent?: string; language?: string }) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTabContent: (id: string, newContent: string) => void;
  markTabSaved: (id: string) => void;
  newUntitledTab: () => void;
  getActiveTab: () => EditorTab | undefined;
}
