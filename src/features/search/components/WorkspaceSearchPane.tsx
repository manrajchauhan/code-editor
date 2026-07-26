import React, { useState } from 'react';
import { Search as SearchIcon, FileCode, Replace } from 'lucide-react';
import { useWorkspaceStore } from '../../workspace/stores/workspaceStore';
import { useEditorStore } from '../../editor/stores/editorStore';
import { FileNode } from '../../workspace/types/workspace.types';
import { detectLanguage } from '../../editor/utils/languageDetector';
import { readFileText } from '../../../services/fileSystemService';

export const WorkspaceSearchPane: React.FC = () => {
  const [query, setQuery] = useState('');
  const [replaceStr, setReplaceStr] = useState('');
  const [showReplace, setShowReplace] = useState(false);

  const { rootNode } = useWorkspaceStore();
  const { openTab, updateTabContent } = useEditorStore();

  const searchFiles = (node: FileNode | null, searchStr: string): FileNode[] => {
    if (!node || !searchStr.trim()) return [];
    let results: FileNode[] = [];

    if (!node.isDirectory && node.name.toLowerCase().includes(searchStr.toLowerCase())) {
      results.push(node);
    }

    if (node.children) {
      for (const child of node.children) {
        results = results.concat(searchFiles(child, searchStr));
      }
    }

    return results;
  };

  const matchingFiles = searchFiles(rootNode, query);

  const handleOpenFile = async (node: FileNode) => {
    const content = await readFileText(node.path);
    openTab({
      id: node.path,
      filePath: node.path,
      fileName: node.name,
      content,
      language: detectLanguage(node.name),
    });
  };

  const handleGlobalReplace = async () => {
    if (!query.trim()) return;
    for (const file of matchingFiles) {
      const content = await readFileText(file.path);
      const updated = content.split(query).join(replaceStr);
      updateTabContent(file.path, updated);
    }
  };

  return (
    <div className="flex flex-col gap-3 text-xs p-1 select-none h-full">
      <div className="flex flex-col gap-1.5">
        <div className="relative flex items-center">
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files by name..."
            className="w-full bg-bg-surface border border-border-subtle rounded px-2.5 py-1.5 text-text-main placeholder:text-text-subtle outline-none focus:border-accent"
          />
          <SearchIcon className="w-3.5 h-3.5 text-text-subtle absolute right-8 top-2.5 pointer-events-none" />
          <button
            type="button"
            onClick={() => setShowReplace(!showReplace)}
            className={`p-1.5 absolute right-1 rounded transition-colors ${
              showReplace ? 'text-accent bg-bg-hover' : 'text-text-subtle hover:text-text-main'
            }`}
            title="Toggle Replace"
          >
            <Replace className="w-3.5 h-3.5" />
          </button>
        </div>

        {showReplace && (
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={replaceStr}
              onChange={(e) => setReplaceStr(e.target.value)}
              placeholder="Replace text..."
              className="flex-1 bg-bg-surface border border-border-subtle rounded px-2.5 py-1 text-text-main placeholder:text-text-subtle outline-none focus:border-accent text-xs"
            />
            <button
              type="button"
              onClick={handleGlobalReplace}
              className="px-2 py-1 bg-accent hover:bg-accent-hover text-white rounded text-[11px] font-medium shrink-0 transition-colors"
              title="Replace in matching files"
            >
              Replace
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-1">
        {query.trim() === '' ? (
          <p className="text-[11px] text-text-subtle text-center py-4">
            Type to search workspace files.
          </p>
        ) : matchingFiles.length === 0 ? (
          <p className="text-[11px] text-text-subtle text-center py-4">
            No files found matching &quot;{query}&quot;.
          </p>
        ) : (
          matchingFiles.map((file) => (
            <div
              key={file.id}
              onClick={() => handleOpenFile(file)}
              className="flex items-center gap-2 p-1.5 rounded hover:bg-bg-hover cursor-pointer text-text-muted hover:text-text-main transition-colors"
            >
              <FileCode className="w-4 h-4 text-accent shrink-0" />
              <div className="flex flex-col truncate">
                <span className="font-medium text-text-main truncate">{file.name}</span>
                <span className="text-[10px] text-text-subtle truncate">{file.path}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
