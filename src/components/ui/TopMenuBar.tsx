import React, { useState, useRef, useEffect } from 'react';
import {
  FolderOpen,
  Save,
  Plus,
  Clock,
  Command,
  ChevronRight,
  Code2,
  Sparkles,
  Columns,
  Layout,
} from 'lucide-react';
import { useEditorStore } from '../../features/editor/stores/editorStore';
import { useWorkspaceStore } from '../../features/workspace/stores/workspaceStore';
import { useCommandStore } from '../../features/command-palette/stores/commandStore';
import { useLayoutStore } from '../../stores/layoutStore';
import { useTerminalStore } from '../../features/terminal/stores/terminalStore';
import { saveFile } from '../../services/fileService';

export const TopMenuBar: React.FC<{ onOpenDevModal: () => void }> = ({ onOpenDevModal }) => {
  const [activeMenu, setActiveMenu] = useState<'file' | 'edit' | 'view' | null>(null);
  const [showRecentSubmenu, setShowRecentSubmenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { newUntitledTab, getActiveTab, markTabSaved, toggleSplitView } = useEditorStore();
  const { openFolder, recentFolders } = useWorkspaceStore();
  const { toggleCommandPalette } = useCommandStore();
  const { toggleSidebar } = useLayoutStore();
  const { toggleTerminal } = useTerminalStore();

  const activeTab = getActiveTab();

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
        setShowRecentSubmenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSave = async () => {
    if (activeTab && activeTab.filePath) {
      const res = await saveFile(activeTab.filePath, activeTab.content);
      if (res.success) {
        markTabSaved(activeTab.id);
      }
    }
  };

  return (
    <header
      data-tauri-drag-region
      className="h-8 bg-bg-surface border-b border-border-subtle flex items-center justify-between pl-[76px] pr-3 text-xs text-text-muted select-none shrink-0 relative z-40"
    >
      {/* Left: Window App Title & Top Menus */}
      <div className="flex items-center gap-3" ref={menuRef}>
        <div className="flex items-center gap-1 text-[11px] font-medium">
          {/* FILE MENU */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveMenu(activeMenu === 'file' ? null : 'file')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                activeMenu === 'file' ? 'bg-bg-active text-text-main font-semibold' : 'hover:bg-bg-hover hover:text-text-main'
              }`}
            >
              File
            </button>

            {activeMenu === 'file' && (
              <div className="absolute left-0 top-6 w-56 bg-[#12141a] border border-border-subtle rounded-lg shadow-2xl z-50 p-1 flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => {
                    newUntitledTab();
                    setActiveMenu(null);
                  }}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-bg-hover text-text-main transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Plus className="w-3.5 h-3.5 text-accent" />
                    <span>New File</span>
                  </div>
                  <kbd className="text-[10px] font-mono text-text-subtle">⌘N</kbd>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    openFolder();
                    setActiveMenu(null);
                  }}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-bg-hover text-text-main transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Open Folder...</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleSave();
                    setActiveMenu(null);
                  }}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-bg-hover text-text-main transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Save className="w-3.5 h-3.5 text-amber-400" />
                    <span>Save File</span>
                  </div>
                  <kbd className="text-[10px] font-mono text-text-subtle">⌘S</kbd>
                </button>

                <div className="h-px bg-border-subtle my-1" />

                {/* Open Recent Submenu Trigger */}
                <div
                  className="relative"
                  onMouseEnter={() => setShowRecentSubmenu(true)}
                  onMouseLeave={() => setShowRecentSubmenu(false)}
                >
                  <button
                    type="button"
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-bg-hover text-text-main transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-accent" />
                      <span>Open Recent</span>
                    </div>
                    <ChevronRight className="w-3 h-3 text-text-subtle" />
                  </button>

                  {/* Recent Workspaces Submenu */}
                  {showRecentSubmenu && (
                    <div className="absolute left-full top-0 w-64 bg-[#12141a] border border-border-subtle rounded-lg shadow-2xl p-1 flex flex-col gap-0.5 ml-1">
                      <div className="px-2 py-1 text-[10px] font-semibold text-text-muted border-b border-border-subtle">
                        Recent Workspaces
                      </div>
                      {recentFolders.length === 0 ? (
                        <div className="px-2 py-2 text-[11px] text-text-subtle">No recent folders.</div>
                      ) : (
                        recentFolders.map((path) => {
                          const name = path.split('/').pop() || path;
                          return (
                            <button
                              key={path}
                              type="button"
                              onClick={() => {
                                openFolder(path);
                                setActiveMenu(null);
                                setShowRecentSubmenu(false);
                              }}
                              className="flex flex-col text-left px-2 py-1.5 rounded hover:bg-bg-hover transition-colors cursor-pointer"
                            >
                              <span className="text-xs font-medium text-text-main truncate">{name}</span>
                              <span className="text-[10px] text-text-subtle truncate">{path}</span>
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>

                <div className="h-px bg-border-subtle my-1" />

                <button
                  type="button"
                  onClick={() => {
                    toggleCommandPalette();
                    setActiveMenu(null);
                  }}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-bg-hover text-text-main transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Command className="w-3.5 h-3.5 text-purple-400" />
                    <span>Command Palette</span>
                  </div>
                  <kbd className="text-[10px] font-mono text-text-subtle">⌘K</kbd>
                </button>
              </div>
            )}
          </div>

          {/* EDIT MENU */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveMenu(activeMenu === 'edit' ? null : 'edit')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                activeMenu === 'edit' ? 'bg-bg-active text-text-main font-semibold' : 'hover:bg-bg-hover hover:text-text-main'
              }`}
            >
              Edit
            </button>

            {activeMenu === 'edit' && (
              <div className="absolute left-0 top-6 w-52 bg-[#12141a] border border-border-subtle rounded-lg shadow-2xl z-50 p-1 flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => {
                    toggleCommandPalette();
                    setActiveMenu(null);
                  }}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-bg-hover text-text-main transition-colors cursor-pointer"
                >
                  <span>Search Commands</span>
                  <kbd className="text-[10px] font-mono text-text-subtle">⌘K</kbd>
                </button>
              </div>
            )}
          </div>

          {/* VIEW MENU */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveMenu(activeMenu === 'view' ? null : 'view')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                activeMenu === 'view' ? 'bg-bg-active text-text-main font-semibold' : 'hover:bg-bg-hover hover:text-text-main'
              }`}
            >
              View
            </button>

            {activeMenu === 'view' && (
              <div className="absolute left-0 top-6 w-52 bg-[#12141a] border border-border-subtle rounded-lg shadow-2xl z-50 p-1 flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => {
                    toggleSplitView();
                    setActiveMenu(null);
                  }}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-bg-hover text-text-main transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Columns className="w-3.5 h-3.5 text-accent" />
                    <span>Split Editor</span>
                  </div>
                  <kbd className="text-[10px] font-mono text-text-subtle">⌘\</kbd>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    toggleSidebar();
                    setActiveMenu(null);
                  }}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-bg-hover text-text-main transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Layout className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Toggle Sidebar</span>
                  </div>
                  <kbd className="text-[10px] font-mono text-text-subtle">⌘B</kbd>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    toggleTerminal();
                    setActiveMenu(null);
                  }}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-bg-hover text-text-main transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Code2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Toggle Terminal</span>
                  </div>
                  <kbd className="text-[10px] font-mono text-text-subtle">⌘T</kbd>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: Developer Attribution Badge */}
      <button
        type="button"
        onClick={onOpenDevModal}
        className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent/15 border border-accent/30 hover:bg-accent/25 text-accent transition-colors cursor-pointer text-[11px] font-medium shadow-sm"
        title="Click to view developer info"
      >
        <Sparkles className="w-3 h-3 text-accent animate-pulse" />
        <span>Developed by <strong className="font-semibold text-text-main">Manraj Chauhan</strong></span>
      </button>
    </header>
  );
};
