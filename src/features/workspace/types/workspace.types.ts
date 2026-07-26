export interface FileNode {
  id: string;
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileNode[];
  isExpanded?: boolean;
  parentId?: string | null;
}

export interface WorkspaceState {
  currentFolderPath: string | null;
  currentFolderName: string | null;
  rootNode: FileNode | null;
  selectedNodeId: string | null;
  isLoading: boolean;
  openFolder: (path?: string) => Promise<void>;
  toggleNodeExpanded: (id: string) => void;
  selectNode: (id: string) => void;
  createFile: (parentPath: string, fileName: string) => Promise<void>;
  createFolder: (parentPath: string, folderName: string) => Promise<void>;
  renameItem: (oldPath: string, newName: string) => Promise<void>;
  duplicateItem: (itemPath: string) => Promise<void>;
  deleteItem: (itemPath: string) => Promise<void>;
  refreshWorkspace: () => Promise<void>;
}
