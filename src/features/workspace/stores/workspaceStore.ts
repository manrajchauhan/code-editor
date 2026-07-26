import { create } from 'zustand';
import { WorkspaceState, FileNode } from '../types/workspace.types';
import { useEditorStore } from '../../editor/stores/editorStore';
import {
  openFolderDialog,
  readDirectoryTree,
  createFileItem,
  createDirItem,
  renameFileSystemItem,
  copyFileSystemItem,
  deleteFileSystemItem,
} from '../../../services/fileSystemService';

const DEFAULT_WORKSPACE_PATH = '/Volumes/Personal Space/Cross Platform Apps/code-editor';
const RECENT_FOLDERS_KEY = 'code_editor_recent_folders';

function getInitialRecentFolders(): string[] {
  try {
    const stored = localStorage.getItem(RECENT_FOLDERS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    // Ignore parse error
  }
  return [DEFAULT_WORKSPACE_PATH];
}

function applyExpansionStates(node: FileNode, expandedIds: Set<string>): FileNode {
  const isExpanded = expandedIds.has(node.id) || (node.id === expandedIds.values().next().value);
  if (!node.children) {
    return { ...node, isExpanded };
  }
  return {
    ...node,
    isExpanded,
    children: node.children.map((child) => applyExpansionStates(child, expandedIds)),
  };
}

function toggleNodeInTree(node: FileNode, targetId: string): { node: FileNode; expandedIds: Set<string> } {
  const expanded = new Set<string>();

  function collectAndToggle(n: FileNode): FileNode {
    const isTarget = n.id === targetId;
    const nextExpanded = isTarget ? !n.isExpanded : n.isExpanded;
    if (nextExpanded) {
      expanded.add(n.id);
    }
    if (n.children) {
      return {
        ...n,
        isExpanded: nextExpanded,
        children: n.children.map((c) => collectAndToggle(c)),
      };
    }
    return { ...n, isExpanded: nextExpanded };
  }

  const updatedNode = collectAndToggle(node);
  return { node: updatedNode, expandedIds: expanded };
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  currentFolderPath: null,
  currentFolderName: null,
  rootNode: null,
  selectedNodeId: null,
  isLoading: false,
  recentFolders: getInitialRecentFolders(),

  openFolder: async (path?: string) => {
    set({ isLoading: true });
    try {
      const targetPath = path || (await openFolderDialog()) || DEFAULT_WORKSPACE_PATH;
      if (!targetPath) {
        set({ isLoading: false });
        return;
      }

      const rawRoot = await readDirectoryTree(targetPath);
      const folderName = targetPath.split('/').pop() || targetPath;

      const expandedIds = new Set<string>([rawRoot.id]);
      const root = applyExpansionStates(rawRoot, expandedIds);

      // Update recent folders
      const currentRecents = get().recentFolders;
      const updatedRecents = [targetPath, ...currentRecents.filter((p) => p !== targetPath)].slice(0, 10);
      try {
        localStorage.setItem(RECENT_FOLDERS_KEY, JSON.stringify(updatedRecents));
      } catch (e) {
        // Ignore storage error
      }

      set({
        currentFolderPath: targetPath,
        currentFolderName: folderName,
        rootNode: root,
        recentFolders: updatedRecents,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to open folder:', error);
      set({ isLoading: false });
    }
  },

  toggleNodeExpanded: (id: string) => {
    set((state) => {
      if (!state.rootNode) return state;
      const { node } = toggleNodeInTree(state.rootNode, id);
      return { rootNode: node };
    });
  },

  selectNode: (id: string) => set({ selectedNodeId: id }),

  createFile: async (parentPath: string, fileName: string) => {
    await createFileItem(parentPath, fileName);
    await get().refreshWorkspace();
  },

  createFolder: async (parentPath: string, folderName: string) => {
    await createDirItem(parentPath, folderName);
    await get().refreshWorkspace();
  },

  renameItem: async (oldPath: string, newName: string) => {
    const pathParts = oldPath.split('/');
    pathParts.pop();
    const newPath = [...pathParts, newName].join('/');

    await renameFileSystemItem(oldPath, newName);
    useEditorStore.getState().renameTab(oldPath, newPath, newName);
    await get().refreshWorkspace();
  },

  duplicateItem: async (itemPath: string) => {
    await copyFileSystemItem(itemPath);
    await get().refreshWorkspace();
  },

  deleteItem: async (itemPath: string) => {
    await deleteFileSystemItem(itemPath);
    await get().refreshWorkspace();
  },

  refreshWorkspace: async () => {
    const { currentFolderPath, rootNode } = get();
    if (!currentFolderPath) return;
    set({ isLoading: true });
    try {
      const expanded = new Set<string>();
      function extractExpanded(n: FileNode | null) {
        if (!n) return;
        if (n.isExpanded) expanded.add(n.id);
        if (n.children) n.children.forEach(extractExpanded);
      }
      extractExpanded(rootNode);

      const rawRoot = await readDirectoryTree(currentFolderPath);
      const root = applyExpansionStates(rawRoot, expanded);

      set({ rootNode: root, isLoading: false });
    } catch (error) {
      console.error('Failed to refresh workspace:', error);
      set({ isLoading: false });
    }
  },

  clearRecentFolders: () => {
    try {
      localStorage.removeItem(RECENT_FOLDERS_KEY);
    } catch (e) {}
    set({ recentFolders: [] });
  },
}));
