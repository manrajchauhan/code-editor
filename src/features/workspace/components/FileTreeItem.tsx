import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  Trash2,
  Edit2,
  Copy,
} from 'lucide-react';
import { FileNode } from '../types/workspace.types';
import { useWorkspaceStore } from '../stores/workspaceStore';
import { useEditorStore } from '../../editor/stores/editorStore';
import { detectLanguage } from '../../editor/utils/languageDetector';
import { readFileText } from '../../../services/fileSystemService';
import { FileTreeContextMenu } from './FileTreeContextMenu';

interface FileTreeItemProps {
  node: FileNode;
  depth?: number;
}

export const FileTreeItem: React.FC<FileTreeItemProps> = ({ node, depth = 0 }) => {
  const { selectedNodeId, selectNode, toggleNodeExpanded, deleteItem, renameItem, duplicateItem } =
    useWorkspaceStore();
  const { openTab } = useEditorStore();

  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(node.name);

  // Context Menu State
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);

  const isDirectoryNode = Boolean(node.isDirectory || (node as unknown as { is_directory?: boolean }).is_directory);
  const isSelected = selectedNodeId === node.id;
  const paddingLeft = depth * 12 + 12;

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    selectNode(node.id);

    if (isDirectoryNode) {
      toggleNodeExpanded(node.id);
    } else {
      const content = await readFileText(node.path);
      openTab({
        id: node.path,
        filePath: node.path,
        fileName: node.name,
        content,
        language: detectLanguage(node.name),
      });
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    selectNode(node.id);
    setContextMenuPos({ x: e.clientX, y: e.clientY });
  };

  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (renameValue.trim() && renameValue.trim() !== node.name) {
      await renameItem(node.path, renameValue.trim());
    }
    setIsRenaming(false);
  };

  const handleDuplicate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await duplicateItem(node.path);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete ${node.name}?`)) {
      await deleteItem(node.path);
    }
  };

  const renderIcon = () => {
    if (isDirectoryNode) {
      return node.isExpanded ? (
        <FolderOpen className="w-4 h-4 text-amber-400 shrink-0" />
      ) : (
        <Folder className="w-4 h-4 text-amber-400 shrink-0" />
      );
    }

    const ext = node.name.split('.').pop()?.toLowerCase();
    if (ext === 'ts' || ext === 'tsx' || ext === 'js' || ext === 'jsx') {
      return <FileCode className="w-4 h-4 text-indigo-400 shrink-0" />;
    }
    return <FileText className="w-4 h-4 text-text-subtle shrink-0" />;
  };

  return (
    <div className="flex flex-col select-none">
      {contextMenuPos && (
        <FileTreeContextMenu
          x={contextMenuPos.x}
          y={contextMenuPos.y}
          node={node}
          onClose={() => setContextMenuPos(null)}
          onStartRename={() => setIsRenaming(true)}
        />
      )}

      {isRenaming ? (
        <form
          onSubmit={handleRenameSubmit}
          style={{ paddingLeft: `${paddingLeft}px` }}
          className="py-0.5 pr-2 bg-bg-surface border border-accent rounded my-0.5"
        >
          <input
            type="text"
            autoFocus
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onBlur={() => setIsRenaming(false)}
            className="w-full bg-transparent text-xs text-text-main outline-none"
          />
        </form>
      ) : (
        <div
          onClick={handleClick}
          onContextMenu={handleContextMenu}
          style={{ paddingLeft: `${paddingLeft}px` }}
          className={`group flex items-center justify-between py-1 pr-2 cursor-pointer text-xs transition-colors rounded ${
            isSelected
              ? 'bg-bg-active text-text-main font-medium'
              : 'text-text-muted hover:bg-bg-hover hover:text-text-main'
          }`}
        >
          <div className="flex items-center gap-1.5 truncate">
            {isDirectoryNode ? (
              <span className="text-text-subtle hover:text-text-main shrink-0">
                {node.isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </span>
            ) : (
              <span className="w-3.5 h-3.5 shrink-0" />
            )}

            {renderIcon()}
            <span className="truncate">{node.name}</span>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsRenaming(true);
              }}
              className="p-0.5 rounded hover:bg-bg-active text-text-subtle hover:text-text-main"
              title="Rename (F2)"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={handleDuplicate}
              className="p-0.5 rounded hover:bg-bg-active text-text-subtle hover:text-text-main"
              title="Duplicate Item"
            >
              <Copy className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="p-0.5 rounded hover:bg-red-500/20 hover:text-red-400 text-text-subtle"
              title={`Delete ${node.name}`}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {isDirectoryNode && node.isExpanded && node.children && (
        <div className="flex flex-col">
          {node.children.map((child) => (
            <FileTreeItem key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};
