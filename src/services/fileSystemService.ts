import { invoke } from '@tauri-apps/api/core';
import { FileNode } from '../features/workspace/types/workspace.types';

// Mock workspace data for web browser preview mode
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
    console.info('[FileSystemService] Native open_folder_dialog not available in web mode, using demo project');
    return '/my-project';
  }
}

export async function readDirectoryTree(folderPath: string): Promise<FileNode> {
  try {
    return await invoke<FileNode>('read_directory_tree', { path: folderPath });
  } catch (error) {
    console.info('[FileSystemService] Using web mode demo tree for:', folderPath);
    return DEMO_PROJECT_NODE;
  }
}

export async function readFileText(filePath: string): Promise<string> {
  try {
    return await invoke<string>('read_file_content', { path: filePath });
  } catch (error) {
    if (DEMO_FILE_CONTENTS[filePath]) {
      return DEMO_FILE_CONTENTS[filePath];
    }
    return `// Content of ${filePath}\nconsole.log('Loaded file');\n`;
  }
}

export async function createFileItem(parentPath: string, fileName: string): Promise<boolean> {
  try {
    const fullPath = `${parentPath}/${fileName}`;
    await invoke('create_file_node', { path: fullPath });
    return true;
  } catch (error) {
    console.info(`[FileSystemService] Created mock file: ${parentPath}/${fileName}`);
    DEMO_FILE_CONTENTS[`${parentPath}/${fileName}`] = `// Created ${fileName}\n`;
    return true;
  }
}

export async function createDirItem(parentPath: string, folderName: string): Promise<boolean> {
  try {
    const fullPath = `${parentPath}/${folderName}`;
    await invoke('create_dir_node', { path: fullPath });
    return true;
  } catch (error) {
    console.info(`[FileSystemService] Created mock folder: ${parentPath}/${folderName}`);
    return true;
  }
}

export async function renameFileSystemItem(oldPath: string, newName: string): Promise<boolean> {
  try {
    const parent = oldPath.substring(0, oldPath.lastIndexOf('/'));
    const newPath = `${parent}/${newName}`;
    await invoke('rename_node', { oldPath, newPath });
    return true;
  } catch (error) {
    console.info(`[FileSystemService] Renamed mock item: ${oldPath} to ${newName}`);
    if (DEMO_FILE_CONTENTS[oldPath]) {
      const parent = oldPath.substring(0, oldPath.lastIndexOf('/'));
      const newPath = `${parent}/${newName}`;
      DEMO_FILE_CONTENTS[newPath] = DEMO_FILE_CONTENTS[oldPath];
      delete DEMO_FILE_CONTENTS[oldPath];
    }
    return true;
  }
}

export async function copyFileSystemItem(srcPath: string): Promise<boolean> {
  const parts = srcPath.split('/');
  const name = parts.pop() || 'file';
  const parent = parts.join('/');
  const extIndex = name.lastIndexOf('.');
  const destName =
    extIndex !== -1
      ? `${name.substring(0, extIndex)}_copy${name.substring(extIndex)}`
      : `${name}_copy`;
  const destPath = `${parent}/${destName}`;

  try {
    await invoke('copy_node', { srcPath, destPath });
    return true;
  } catch (error) {
    console.info(`[FileSystemService] Duplicated mock item: ${srcPath} to ${destPath}`);
    if (DEMO_FILE_CONTENTS[srcPath]) {
      DEMO_FILE_CONTENTS[destPath] = `// Copy of ${name}\n` + DEMO_FILE_CONTENTS[srcPath];
    }
    return true;
  }
}

export async function deleteFileSystemItem(itemPath: string): Promise<boolean> {
  try {
    await invoke('delete_node', { path: itemPath });
    return true;
  } catch (error) {
    console.info(`[FileSystemService] Deleted mock item: ${itemPath}`);
    delete DEMO_FILE_CONTENTS[itemPath];
    return true;
  }
}
