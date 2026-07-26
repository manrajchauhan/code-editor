import { create } from 'zustand';
import { WorkspaceState, FileNode } from '../types/workspace.types';
import {
  openFolderDialog,
  readDirectoryTree,
  createFileItem,
  createDirItem,
  renameFileSystemItem,
  copyFileSystemItem,
  deleteFileSystemItem,
} from '../../../services/fileSystemService';

function toggleNodeInTree(node: FileNode, targetId: string): FileNode {
  if (node.id === targetId) {
    return { ...node, isExpanded: !node.isExpanded };
  }
  if (node.children) {
    return {
      ...node,
      children: node.children.map((child) => toggleNodeInTree(child, targetId)),
    };
  }
  return node;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  currentFolderPath: null,
  currentFolderName: null,
  rootNode: null,
  selectedNodeId: null,
  isLoading: false,

  openFolder: async (path?: string) => {
    set({ isLoading: true });
    try {
      const targetPath = path || (await openFolderDialog());
      if (!targetPath) {
        set({ isLoading: false });
        return;
      }

      const root = await readDirectoryTree(targetPath);
      const folderName = targetPath.split('/').pop() || targetPath;

      set({
        currentFolderPath: targetPath,
        currentFolderName: folderName,
        rootNode: root,
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
      return {
        rootNode: toggleNodeInTree(state.rootNode, id),
      };
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
    await renameFileSystemItem(oldPath, newName);
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
    const { currentFolderPath } = get();
    if (!currentFolderPath) return;
    set({ isLoading: true });
    try {
      const root = await readDirectoryTree(currentFolderPath);
      set({ rootNode: root, isLoading: false });
    } catch (error) {
      console.error('Failed to refresh workspace:', error);
      set({ isLoading: false });
    }
  },
}));
