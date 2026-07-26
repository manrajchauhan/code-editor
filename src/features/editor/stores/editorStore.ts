import { create } from 'zustand';
import { EditorState, EditorTab } from '../types/editor.types';
import { detectLanguage } from '../utils/languageDetector';

let untitledCounter = 1;

const INITIAL_WELCOME_TAB: EditorTab = {
  id: 'welcome-tab',
  fileName: 'welcome.ts',
  filePath: '/welcome.ts',
  content: `// Welcome to your Local-First Code Editor!
// Context menu & cursor position status indicators active.

export function greetDeveloper(name: string): string {
  return \`Hello \${name}! Right-click files in tree for quick actions.\`;
}

console.log(greetDeveloper('Developer'));
`,
  savedContent: `// Welcome to your Local-First Code Editor!
// Context menu & cursor position status indicators active.

export function greetDeveloper(name: string): string {
  return \`Hello \${name}! Right-click files in tree for quick actions.\`;
}

console.log(greetDeveloper('Developer'));
`,
  isDirty: false,
  language: 'typescript',
};

export const useEditorStore = create<EditorState>((set, get) => ({
  tabs: [INITIAL_WELCOME_TAB],
  activeTabId: 'welcome-tab',
  cursorPosition: { line: 1, column: 1 },

  openTab: (tabData) => {
    const { tabs } = get();
    const existing = tabs.find((t) => (tabData.filePath && t.filePath === tabData.filePath) || t.id === tabData.id);

    if (existing) {
      set({ activeTabId: existing.id });
      return;
    }

    const content = tabData.content ?? '';
    const savedContent = tabData.savedContent ?? content;
    const newTab: EditorTab = {
      id: tabData.id || `tab-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      fileName: tabData.fileName,
      filePath: tabData.filePath,
      content,
      savedContent,
      isDirty: content !== savedContent,
      language: tabData.language || detectLanguage(tabData.fileName),
    };

    set((state) => ({
      tabs: [...state.tabs, newTab],
      activeTabId: newTab.id,
    }));
  },

  closeTab: (id) => {
    set((state) => {
      const remaining = state.tabs.filter((t) => t.id !== id);
      let nextActiveId = state.activeTabId;

      if (state.activeTabId === id) {
        if (remaining.length > 0) {
          const closedIndex = state.tabs.findIndex((t) => t.id === id);
          const newIndex = Math.max(0, closedIndex - 1);
          nextActiveId = remaining[newIndex].id;
        } else {
          nextActiveId = null;
        }
      }

      return {
        tabs: remaining,
        activeTabId: nextActiveId,
      };
    });
  },

  setActiveTab: (id) => set({ activeTabId: id }),

  setCursorPosition: (line, column) =>
    set({
      cursorPosition: { line, column },
    }),

  updateTabContent: (id, newContent) => {
    set((state) => ({
      tabs: state.tabs.map((tab) => {
        if (tab.id !== id) return tab;
        const isDirty = newContent !== tab.savedContent;
        return {
          ...tab,
          content: newContent,
          isDirty,
        };
      }),
    }));
  },

  markTabSaved: (id) => {
    set((state) => ({
      tabs: state.tabs.map((tab) => {
        if (tab.id !== id) return tab;
        return {
          ...tab,
          savedContent: tab.content,
          isDirty: false,
        };
      }),
    }));
  },

  newUntitledTab: () => {
    const fileName = `Untitled-${untitledCounter++}.ts`;
    get().openTab({
      id: `untitled-${Date.now()}`,
      fileName,
      content: `// New File: ${fileName}\n\n`,
      language: 'typescript',
    });
  },

  getActiveTab: () => {
    const { tabs, activeTabId } = get();
    return tabs.find((t) => t.id === activeTabId);
  },
}));
