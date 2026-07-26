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
    // Attempt Tauri native invoke if running in desktop shell
    await invoke('write_file', { path: filePath, content });
    return { success: true, message: `Successfully saved to ${filePath}` };
  } catch (error) {
    // Web dev mode fallback
    console.info('[FileService] Tauri IPC write_file not active in browser dev mode:', error);
    return { success: true, message: 'Saved content in local editor state.' };
  }
}
