import { invoke } from '@tauri-apps/api/core';
import { FileNode } from '../features/workspace/types/workspace.types';

// Mock workspace data for web browser preview fallback
const DEMO_PROJECT_NODE: FileNode = {
  id: 'root-demo',
  name: 'my-project',
  path: '/my-project',
  isDirectory: true,
  isExpanded: true,
  children: [
    {
      id: 'demo-src',
      name: 'src',
      path: '/my-project/src',
      isDirectory: true,
      isExpanded: true,
      children: [
        {
          id: 'demo-app',
          name: 'App.tsx',
          path: '/my-project/src/App.tsx',
          isDirectory: false,
        },
        {
          id: 'demo-main',
          name: 'main.ts',
          path: '/my-project/src/main.ts',
          isDirectory: false,
        },
        {
          id: 'demo-styles',
          name: 'styles.css',
          path: '/my-project/src/styles.css',
          isDirectory: false,
        },
      ],
    },
    {
      id: 'demo-package',
      name: 'package.json',
      path: '/my-project/package.json',
      isDirectory: false,
    },
    {
      id: 'demo-readme',
      name: 'README.md',
      path: '/my-project/README.md',
      isDirectory: false,
    },
  ],
};

const DEMO_FILE_CONTENTS: Record<string, string> = {
  '/my-project/src/App.tsx': `import React from 'react';

export const App = () => {
  return (
    <div className="app">
      <h1>Hello from Local Code Editor!</h1>
    </div>
  );
};
`,
  '/my-project/src/main.ts': `console.log('App initialized successfully');\n`,
  '/my-project/src/styles.css': `body {\n  margin: 0;\n  background: #0d0e11;\n}\n`,
  '/my-project/package.json': `{\n  "name": "my-project",\n  "version": "1.0.0",\n  "private": true\n}\n`,
  '/my-project/README.md': `# My Local Project\n\nBuilt with Tauri 2 and Monaco Editor.\n`,
};

export async function openFolderDialog(): Promise<string | null> {
  try {
    const selected = await invoke<string | null>('open_folder_dialog');
    return selected;
  } catch (error) {
    console.info('[FileSystemService] Native open_folder_dialog fallback used');
    return null;
  }
}

export async function executeShellCommand(command: string, cwd: string): Promise<string> {
  try {
    return await invoke<string>('execute_shell_command', { command, cwd });
  } catch (error) {
    return `Error: ${error}\r\n`;
  }
}

export async function readDirectoryTree(folderPath: string): Promise<FileNode> {
  try {
    return await invoke<FileNode>('read_directory_tree', { path: folderPath });
  } catch (error) {
    console.info('[FileSystemService] Web mode fallback tree for:', folderPath);
    return DEMO_PROJECT_NODE;
  }
}

export async function readFileText(filePath: string): Promise<string> {
  try {
    const content = await invoke<string>('read_file_content', { path: filePath });
    DEMO_FILE_CONTENTS[filePath] = content;
    return content;
  } catch (error) {
    if (DEMO_FILE_CONTENTS[filePath] !== undefined) {
      return DEMO_FILE_CONTENTS[filePath];
    }
    return `// Content of ${filePath}\nconsole.log('Loaded file');\n`;
  }
}

export async function saveFile(filePath?: string, content?: string): Promise<{ success: boolean; error?: string }> {
  if (!filePath || content === undefined) {
    return { success: false, error: 'No file path or content specified' };
  }

  DEMO_FILE_CONTENTS[filePath] = content;

  try {
    await invoke('write_file_content', { path: filePath, content });
    return { success: true };
  } catch (error) {
    return { success: true };
  }
}

export async function createFileItem(parentPath: string, fileName: string): Promise<boolean> {
  const fullPath = `${parentPath}/${fileName}`.replace(/\/+/g, '/');
  DEMO_FILE_CONTENTS[fullPath] = `// ${fileName}\n`;
  try {
    await invoke('create_file_node', { path: fullPath });
    return true;
  } catch (error) {
    return true;
  }
}

export async function createDirItem(parentPath: string, folderName: string): Promise<boolean> {
  const fullPath = `${parentPath}/${folderName}`.replace(/\/+/g, '/');
  try {
    await invoke('create_dir_node', { path: fullPath });
    return true;
  } catch (error) {
    return true;
  }
}

export async function renameFileSystemItem(oldPath: string, newName: string): Promise<boolean> {
  const pathParts = oldPath.split('/');
  pathParts.pop();
  const newPath = [...pathParts, newName].join('/');
  try {
    await invoke('rename_node', { oldPath, newPath });
    if (DEMO_FILE_CONTENTS[oldPath]) {
      DEMO_FILE_CONTENTS[newPath] = DEMO_FILE_CONTENTS[oldPath];
      delete DEMO_FILE_CONTENTS[oldPath];
    }
    return true;
  } catch (error) {
    if (DEMO_FILE_CONTENTS[oldPath]) {
      DEMO_FILE_CONTENTS[newPath] = DEMO_FILE_CONTENTS[oldPath];
      delete DEMO_FILE_CONTENTS[oldPath];
    }
    return true;
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
    if (DEMO_FILE_CONTENTS[itemPath]) {
      DEMO_FILE_CONTENTS[destPath] = DEMO_FILE_CONTENTS[itemPath];
    }
    return true;
  } catch (error) {
    if (DEMO_FILE_CONTENTS[itemPath]) {
      DEMO_FILE_CONTENTS[destPath] = DEMO_FILE_CONTENTS[itemPath];
    }
    return true;
  }
}

export async function deleteFileSystemItem(itemPath: string): Promise<boolean> {
  try {
    await invoke('delete_node', { path: itemPath });
    delete DEMO_FILE_CONTENTS[itemPath];
    return true;
  } catch (error) {
    delete DEMO_FILE_CONTENTS[itemPath];
    return true;
  }
}
