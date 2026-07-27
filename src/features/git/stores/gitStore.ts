import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';

export interface GitFileStatus {
  path: string;
  status: 'M' | 'A' | 'D' | 'U' | '??' | 'R';
  staged: boolean;
}

export interface GitState {
  branch: string;
  modifiedFiles: GitFileStatus[];
  commitMessage: string;
  isLoading: boolean;
  lastError: string | null;
  refresh: () => Promise<void>;
  stageFile: (path: string) => Promise<void>;
  unstageFile: (path: string) => Promise<void>;
  stageAll: () => Promise<void>;
  commit: (msg: string) => Promise<void>;
  pull: () => Promise<void>;
  push: () => Promise<void>;
  setCommitMessage: (msg: string) => void;
}

async function runGit(args: string[], cwd?: string): Promise<string> {
  try {
    const command = ['git', ...args].join(' ');
    const result = await invoke<string>('execute_shell_command', {
      command,
      cwd: cwd || '',
    });
    return result.trim();
  } catch (e) {
    throw new Error(String(e));
  }
}

function parseStatus(line: string): GitFileStatus | null {
  if (!line || line.length < 3) return null;
  const xy = line.slice(0, 2);
  const filePath = line.slice(3).trim();
  const staged = xy[0] !== ' ' && xy[0] !== '?';
  let status: GitFileStatus['status'] = 'M';
  const code = staged ? xy[0] : xy[1];
  if (code === 'A') status = 'A';
  else if (code === 'D') status = 'D';
  else if (code === 'R') status = 'R';
  else if (xy === '??') status = '??';
  else if (code === 'U' || xy === 'UU') status = 'U';
  return { path: filePath, status, staged };
}

export const useGitStore = create<GitState>((set, get) => ({
  branch: '',
  modifiedFiles: [],
  commitMessage: '',
  isLoading: false,
  lastError: null,

  refresh: async () => {
    set({ isLoading: true, lastError: null });
    try {
      const cwd = localStorage.getItem('current_folder_path') || '';
      const branch = await runGit(['rev-parse', '--abbrev-ref', 'HEAD'], cwd);
      const statusOutput = await runGit(['status', '--porcelain'], cwd);
      const files: GitFileStatus[] = [];
      for (const line of statusOutput.split('\n')) {
        const parsed = parseStatus(line);
        if (parsed) files.push(parsed);
      }
      set({ branch, modifiedFiles: files, isLoading: false });
    } catch (e) {
      set({ branch: 'not a git repo', modifiedFiles: [], isLoading: false, lastError: String(e) });
    }
  },

  stageFile: async (path) => {
    const cwd = localStorage.getItem('current_folder_path') || '';
    await runGit(['add', path], cwd);
    await get().refresh();
  },

  unstageFile: async (path) => {
    const cwd = localStorage.getItem('current_folder_path') || '';
    await runGit(['reset', 'HEAD', path], cwd);
    await get().refresh();
  },

  stageAll: async () => {
    const cwd = localStorage.getItem('current_folder_path') || '';
    await runGit(['add', '-A'], cwd);
    await get().refresh();
  },

  commit: async (msg) => {
    const cwd = localStorage.getItem('current_folder_path') || '';
    await runGit(['commit', '-m', msg], cwd);
    set({ commitMessage: '' });
    await get().refresh();
  },

  pull: async () => {
    const cwd = localStorage.getItem('current_folder_path') || '';
    await runGit(['pull'], cwd);
    await get().refresh();
  },

  push: async () => {
    const cwd = localStorage.getItem('current_folder_path') || '';
    await runGit(['push'], cwd);
    await get().refresh();
  },

  setCommitMessage: (msg) => set({ commitMessage: msg }),
}));
