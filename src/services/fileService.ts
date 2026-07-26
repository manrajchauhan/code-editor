import { invoke } from '@tauri-apps/api/core';

export interface SaveFileResult {
  success: boolean;
  message?: string;
}

/**
 * Save file content through native Tauri IPC command if available,
 * or fallback gracefully when running in web dev mode.
 */
export async function saveFile(filePath: string | undefined, content: string): Promise<SaveFileResult> {
  if (!filePath) {
    return { success: true, message: 'Saved to local memory (Untitled)' };
  }

  try {
    // Native Tauri IPC command write_file_content writes content directly to filesystem
    await invoke('write_file_content', { path: filePath, content });
    return { success: true, message: `Successfully saved to ${filePath}` };
  } catch (error) {
    console.error('[FileService] Failed to save file:', error);
    return { success: false, message: String(error) };
  }
}
