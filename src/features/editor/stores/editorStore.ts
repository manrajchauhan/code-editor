import { create } from 'zustand';
import { EditorState, EditorTab } from '../types/editor.types';
import { detectLanguage } from '../utils/languageDetector';

let untitledCounter = 1;

const INITIAL_WELCOME_TAB: EditorTab = {
  id: 'welcome-tab',
  fileName: 'welcome.ts',
  filePath: '/welcome.ts',
  content: `// Welcome to your Local-First Code Editor!
// Side-by-Side Split View & Breadcrumbs Active.

export function greetDeveloper(name: string): string {
  return "Hello " + name + "! Toggle side-by-side editing with ⌘\\\\";
}

console.log(greetDeveloper('Developer'));
`,
  savedContent: `// Welcome to your Local-First Code Editor!
// Side-by-Side Split View & Breadcrumbs Active.

export function greetDeveloper(name: string): string {
  return "Hello " + name + "! Toggle side-by-side editing with ⌘\\\\";
}

console.log(greetDeveloper('Developer'));
`,
  isDirty: false,
  language: 'typescript',
};

export const useEditorStore = create<EditorState>((set, get) => ({
  tabs: [INITIAL_WELCOME_TAB],
  activeTabId: 'welcome-tab',
  secondaryTabId: null,
  isSplitView: false,
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
      secondaryTabId: state.isSplitView ? state.secondaryTabId || newTab.id : state.secondaryTabId,
    }));
  },

  closeTab: (id) => {
    set((state) => {
      const remaining = state.tabs.filter((t) => t.id !== id);
      let nextActiveId = state.activeTabId;
      let nextSecondaryId = state.secondaryTabId;

      if (state.activeTabId === id) {
        if (remaining.length > 0) {
          const closedIndex = state.tabs.findIndex((t) => t.id === id);
          const newIndex = Math.max(0, closedIndex - 1);
          nextActiveId = remaining[newIndex].id;
        } else {
          nextActiveId = null;
        }
      }

      if (state.secondaryTabId === id) {
        nextSecondaryId = remaining.length > 0 ? remaining[0].id : null;
      }

      return {
        tabs: remaining,
        activeTabId: nextActiveId,
        secondaryTabId: nextSecondaryId,
      };
    });
  },

  setActiveTab: (id) => set({ activeTabId: id }),
  setSecondaryTab: (id) => set({ secondaryTabId: id }),

  toggleSplitView: () =>
    set((state) => {
      const nextSplit = !state.isSplitView;
      const secondaryId = nextSplit
        ? state.secondaryTabId || state.tabs.find((t) => t.id !== state.activeTabId)?.id || state.activeTabId
        : null;
      return { isSplitView: nextSplit, secondaryTabId: secondaryId };
    }),

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

  renameTab: (oldPath, newPath, newName) => {
    set((state) => ({
      tabs: state.tabs.map((tab) => {
        if (tab.filePath === oldPath || tab.id === oldPath) {
          return {
            ...tab,
            id: newPath,
            filePath: newPath,
            fileName: newName,
            language: detectLanguage(newName),
          };
        }
        return tab;
      }),
      activeTabId: state.activeTabId === oldPath ? newPath : state.activeTabId,
      secondaryTabId: state.secondaryTabId === oldPath ? newPath : state.secondaryTabId,
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

  getSecondaryTab: () => {
    const { tabs, secondaryTabId } = get();
    return tabs.find((t) => t.id === secondaryTabId);
  },
}));
