import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Folder, Play, ChevronDown } from 'lucide-react';
import { useEditorStore } from '../stores/editorStore';
import { useWorkspaceStore } from '../../workspace/stores/workspaceStore';
import { useTerminalStore } from '../../terminal/stores/terminalStore';
import { FileIcon } from '../../../components/ui/FileIcon';
import { readDirectoryTree, readFileText } from '../../../services/fileSystemService';
import { saveFile } from '../../../services/fileService';
import { FileNode } from '../../workspace/types/workspace.types';

export const BreadcrumbsBar: React.FC<{ tabId?: string }> = ({ tabId }) => {
  const { getActiveTab, getSecondaryTab, openTab, markTabSaved } = useEditorStore();
  const { selectNode, toggleNodeExpanded } = useWorkspaceStore();
  const { runCodeFile } = useTerminalStore();

  const [activeDropdownPath, setActiveDropdownPath] = useState<string | null>(null);
  const [dropdownItems, setDropdownItems] = useState<FileNode[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeTab = tabId ? (tabId === 'secondary' ? getSecondaryTab() : getActiveTab()) : getActiveTab();

  // Outside click listener to close breadcrumb dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveDropdownPath(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!activeTab || !activeTab.filePath) return null;

  const rawPath = activeTab.filePath;
  const startsWithSlash = rawPath.startsWith('/');
  const parts = rawPath.split('/').filter(Boolean);

  const handleSegmentClick = async (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const isLast = index === parts.length - 1;
    const segmentPath = (startsWithSlash ? '/' : '') + parts.slice(0, index + 1).join('/');

    if (isLast) {
      selectNode(segmentPath);
      return;
    }

    if (activeDropdownPath === segmentPath) {
      setActiveDropdownPath(null);
      return;
    }

    setActiveDropdownPath(segmentPath);
    setIsLoadingItems(true);

    try {
      const dirNode = await readDirectoryTree(segmentPath);
      setDropdownItems(dirNode.children || []);
    } catch (err) {
      setDropdownItems([]);
    } finally {
      setIsLoadingItems(false);
    }
  };

  const handleItemSelect = async (item: FileNode) => {
    setActiveDropdownPath(null);
    if (item.isDirectory) {
      selectNode(item.path);
      toggleNodeExpanded(item.path);
    } else {
      const content = await readFileText(item.path);
      openTab({
        id: item.path,
        fileName: item.name,
        filePath: item.path,
        content,
      });
    }
  };

  const handleRunFile = async () => {
    if (!activeTab || !activeTab.filePath) return;

    // Flush and write active file edits directly to physical disk BEFORE running process!
    await saveFile(activeTab.filePath, activeTab.content);
    markTabSaved(activeTab.id);

    const ext = activeTab.fileName.split('.').pop()?.toLowerCase();
    let cmd = `node "${activeTab.filePath}"`;

    if (ext === 'py') {
      cmd = `python3 "${activeTab.filePath}"`;
    } else if (ext === 'ts' || ext === 'tsx') {
      cmd = `npx tsx "${activeTab.filePath}"`;
    } else if (ext === 'rs') {
      cmd = `cargo run`;
    } else if (ext === 'go') {
      cmd = `go run "${activeTab.filePath}"`;
    } else if (ext === 'sh' || ext === 'bash') {
      cmd = `bash "${activeTab.filePath}"`;
    }

    runCodeFile(cmd);
  };

  return (
    <div
      ref={containerRef}
      className="h-6 bg-bg-surface border-b border-border-subtle flex items-center justify-between px-3 text-[11px] text-text-subtle select-none shrink-0 relative z-30"
    >
      <div className="flex items-center gap-1 overflow-x-auto">
        {parts.map((part, index) => {
          const isLast = index === parts.length - 1;
          const segmentPath = (startsWithSlash ? '/' : '') + parts.slice(0, index + 1).join('/');
          const isDropdownOpen = activeDropdownPath === segmentPath;

          return (
            <React.Fragment key={`${part}-${index}`}>
              {index > 0 && <ChevronRight className="w-3 h-3 text-text-subtle/60 shrink-0" />}

              <div className="relative flex items-center">
                <button
                  type="button"
                  onClick={(e) => handleSegmentClick(index, e)}
                  className={`flex items-center gap-1 px-1 py-0.5 rounded transition-colors shrink-0 outline-none cursor-pointer ${
                    isDropdownOpen
                      ? 'bg-bg-active text-text-main font-semibold'
                      : 'hover:text-text-main hover:bg-bg-hover'
                  }`}
                  title={isLast ? part : `Click to view contents of ${part}`}
                >
                  {isLast ? (
                    <FileIcon fileName={part} className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <Folder className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
                  )}
                  <span className={isLast ? 'text-text-main font-medium' : ''}>{part}</span>
                  {!isLast && <ChevronDown className="w-2.5 h-2.5 text-text-subtle/80 opacity-70" />}
                </button>

                {/* Folder Directory Contents Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute left-0 top-6 min-w-[200px] max-w-[280px] bg-[#12141a] border border-border-subtle rounded-lg shadow-2xl z-50 p-1 flex flex-col gap-0.5">
                    <div className="px-2 py-1 text-[10px] font-semibold text-text-muted border-b border-border-subtle truncate">
                      📁 {part}
                    </div>

                    <div className="max-h-48 overflow-y-auto flex flex-col gap-0.5">
                      {isLoadingItems ? (
                        <div className="px-2 py-2 text-[11px] text-text-subtle">Loading folder contents...</div>
                      ) : dropdownItems.length === 0 ? (
                        <div className="px-2 py-2 text-[11px] text-text-subtle">Folder is empty.</div>
                      ) : (
                        dropdownItems.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleItemSelect(item)}
                            className="flex items-center gap-2 px-2 py-1 rounded hover:bg-bg-hover text-left transition-colors cursor-pointer"
                          >
                            {item.isDirectory ? (
                              <Folder className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            ) : (
                              <FileIcon fileName={item.name} className="w-3.5 h-3.5 shrink-0" />
                            )}
                            <span className="text-xs text-text-main truncate">{item.name}</span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleRunFile}
        className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors font-semibold cursor-pointer shrink-0"
        title={`Run ${activeTab.fileName} in Terminal`}
      >
        <Play className="w-3 h-3 fill-emerald-400" />
        <span>Run Code</span>
      </button>
    </div>
  );
};
