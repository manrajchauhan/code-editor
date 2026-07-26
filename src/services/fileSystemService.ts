import { invoke } from '@tauri-apps/api/core';
import { FileNode } from '../features/workspace/types/workspace.types';

export async function openFolderDialog(): Promise<string | null> {
  try {
    return await invoke<string | null>('open_folder_dialog');
  } catch (error) {
    console.error('[FileSystemService] Failed to open folder dialog:', error);
    return null;
  }
}

export async function executeShellCommand(command: string, cwd: string): Promise<string> {
  try {
    return await invoke<string>('execute_shell_command', { command, cwd });
  } catch (error) {
    return `Error executing command: ${error}\r\n`;
  }
}

export async function readDirectoryTree(folderPath: string): Promise<FileNode> {
  return await invoke<FileNode>('read_directory_tree', { path: folderPath });
}

export async function readFileText(filePath: string): Promise<string> {
  return await invoke<string>('read_file_content', { path: filePath });
}

export async function saveFile(filePath?: string, content?: string): Promise<{ success: boolean; error?: string }> {
  if (!filePath || content === undefined) {
    return { success: false, error: 'No file path or content specified' };
  }

  try {
    await invoke('write_file_content', { path: filePath, content });
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function createFileItem(parentPath: string, fileName: string): Promise<boolean> {
  const fullPath = `${parentPath}/${fileName}`.replace(/\/+/g, '/');
  try {
    await invoke('create_file_node', { path: fullPath });
    return true;
  } catch (error) {
    console.error('[FileSystemService] Failed to create file:', error);
    return false;
  }
}

export async function createDirItem(parentPath: string, folderName: string): Promise<boolean> {
  const fullPath = `${parentPath}/${folderName}`.replace(/\/+/g, '/');
  try {
    await invoke('create_dir_node', { path: fullPath });
    return true;
  } catch (error) {
    console.error('[FileSystemService] Failed to create dir:', error);
    return false;
  }
}

export async function renameFileSystemItem(oldPath: string, newName: string): Promise<boolean> {
  const pathParts = oldPath.split('/');
  pathParts.pop();
  const newPath = [...pathParts, newName].join('/');
  try {
    await invoke('rename_node', { oldPath, newPath });
    return true;
  } catch (error) {
    console.error('[FileSystemService] Failed to rename item:', error);
    return false;
  }
}

export async function copyFileSystemItem(itemPath: string): Promise<boolean> {
  const pathParts = itemPath.split('/');
  const name = pathParts.pop() || 'item';
  const copyName = name.includes('.')
    ? name.replace(/(\.[^.]+)$/, '-copy$1')
    : `${name}-copy`;
  const destPath = [...pathParts, copyName].join('/');

  try {
    await invoke('copy_node', { srcPath: itemPath, destPath });
    return true;
  } catch (error) {
    console.error('[FileSystemService] Failed to copy item:', error);
    return false;
  }
}

export async function deleteFileSystemItem(itemPath: string): Promise<boolean> {
  try {
    await invoke('delete_node', { path: itemPath });
    return true;
  } catch (error) {
    console.error('[FileSystemService] Failed to delete item:', error);
    return false;
  }
}
