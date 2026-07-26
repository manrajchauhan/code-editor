import React, { useEffect } from 'react';
import { FilePlus, FolderPlus, Edit2, Copy, Trash2, Link } from 'lucide-react';
import { FileNode } from '../types/workspace.types';
import { useWorkspaceStore } from '../stores/workspaceStore';

interface FileTreeContextMenuProps {
  x: number;
  y: number;
  node: FileNode;
  onClose: () => void;
  onStartRename: () => void;
}

export const FileTreeContextMenu: React.FC<FileTreeContextMenuProps> = ({
  x,
  y,
  node,
  onClose,
  onStartRename,
}) => {
  const { createFile, createFolder, duplicateItem, deleteItem, currentFolderPath } = useWorkspaceStore();

  useEffect(() => {
    const handleOutsideClick = () => onClose();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('click', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const targetPath = node.isDirectory ? node.path : currentFolderPath || node.path;

  return (
    <div
      style={{ top: `${y}px`, left: `${x}px` }}
      className="fixed z-50 w-48 bg-bg-sidebar border border-border-strong rounded-lg shadow-2xl p-1 text-xs text-text-muted select-none flex flex-col gap-0.5"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={async () => {
          onClose();
          const name = prompt('Enter new file name:');
          if (name?.trim()) {
            await createFile(targetPath, name.trim());
          }
        }}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-bg-hover hover:text-text-main transition-colors text-left"
      >
        <FilePlus className="w-3.5 h-3.5 text-accent" />
        <span>New File...</span>
      </button>

      <button
        type="button"
        onClick={async () => {
          onClose();
          const name = prompt('Enter new folder name:');
          if (name?.trim()) {
            await createFolder(targetPath, name.trim());
          }
        }}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-bg-hover hover:text-text-main transition-colors text-left"
      >
        <FolderPlus className="w-3.5 h-3.5 text-amber-400" />
        <span>New Folder...</span>
      </button>

      <div className="h-[1px] bg-border-subtle my-0.5" />

      <button
        type="button"
        onClick={() => {
          onClose();
          onStartRename();
        }}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-bg-hover hover:text-text-main transition-colors text-left"
      >
        <Edit2 className="w-3.5 h-3.5 text-text-subtle" />
        <span>Rename (F2)</span>
      </button>

      <button
        type="button"
        onClick={async () => {
          onClose();
          await duplicateItem(node.path);
        }}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-bg-hover hover:text-text-main transition-colors text-left"
      >
        <Copy className="w-3.5 h-3.5 text-text-subtle" />
        <span>Duplicate</span>
      </button>

      <button
        type="button"
        onClick={() => {
          onClose();
          navigator.clipboard.writeText(node.path);
        }}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-bg-hover hover:text-text-main transition-colors text-left"
      >
        <Link className="w-3.5 h-3.5 text-text-subtle" />
        <span>Copy Path</span>
      </button>

      <div className="h-[1px] bg-border-subtle my-0.5" />

      <button
        type="button"
        onClick={async () => {
          onClose();
          if (window.confirm(`Delete ${node.name}?`)) {
            await deleteItem(node.path);
          }
        }}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-red-500/20 text-red-400 transition-colors text-left"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span>Delete</span>
      </button>
    </div>
  );
};
