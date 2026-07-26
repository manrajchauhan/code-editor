import React, { useState, useRef, useEffect } from 'react';
import {
  FolderOpen,
  Save,
  Plus,
  Clock,
  Command,
  ChevronRight,
  Sparkles,
  Columns,
  Layout,
  Play,
  Terminal,
  Search,
  CheckSquare,
  ArrowRight,
  Keyboard,
  X,
} from 'lucide-react';
import { useEditorStore } from '../../features/editor/stores/editorStore';
import { useWorkspaceStore } from '../../features/workspace/stores/workspaceStore';
import { useCommandStore } from '../../features/command-palette/stores/commandStore';
import { useLayoutStore } from '../../stores/layoutStore';
import { useTerminalStore } from '../../features/terminal/stores/terminalStore';
import { saveFile } from '../../services/fileService';

type MenuType = 'file' | 'edit' | 'selection' | 'view' | 'go' | 'run' | 'terminal' | 'help' | null;

export const TopMenuBar: React.FC<{ onOpenDevModal: () => void }> = ({ onOpenDevModal }) => {
  const [activeMenu, setActiveMenu] = useState<MenuType>(null);
  const [showRecentSubmenu, setShowRecentSubmenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { newUntitledTab, getActiveTab, markTabSaved, closeTab, toggleSplitView } = useEditorStore();
  const { openFolder, recentFolders } = useWorkspaceStore();
  const { toggleCommandPalette } = useCommandStore();
  const { toggleSidebar, setActiveView } = useLayoutStore();
  const { toggleTerminal, runCodeFile } = useTerminalStore();

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

  const handleRunCurrentFile = () => {
    if (!activeTab || !activeTab.filePath) return;
    const ext = activeTab.fileName.split('.').pop()?.toLowerCase();
    let cmd = `node "${activeTab.filePath}"`;
    if (ext === 'py') cmd = `python3 "${activeTab.filePath}"`;
    else if (ext === 'ts' || ext === 'tsx') cmd = `npx tsx "${activeTab.filePath}"`;
    else if (ext === 'rs') cmd = `cargo run`;
    else if (ext === 'sh') cmd = `bash "${activeTab.filePath}"`;
    runCodeFile(cmd);
  };

  return (
    <header
      data-tauri-drag-region
      className="h-8 bg-bg-surface border-b border-border-subtle flex items-center justify-between pl-[76px] pr-3 text-xs text-text-muted select-none shrink-0 relative z-40"
    >
      {/* Left: VS Code Style Top Menus */}
      <div className="flex items-center gap-1" ref={menuRef}>
        <div className="flex items-center gap-0.5 text-[11px] font-medium">
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
              <div className="absolute left-0 top-6 w-60 bg-[#12141a] border border-border-subtle rounded-lg shadow-2xl z-50 p-1 flex flex-col gap-0.5 text-xs">
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
                    <span>New Text File</span>
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
                  <kbd className="text-[10px] font-mono text-text-subtle">⌘O</kbd>
                </button>

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
                    <div className="absolute left-full top-0 w-64 bg-[#12141a] border border-border-subtle rounded-lg shadow-2xl p-1 flex flex-col gap-0.5 ml-1 z-50">
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
                    handleSave();
                    setActiveMenu(null);
                  }}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-bg-hover text-text-main transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Save className="w-3.5 h-3.5 text-amber-400" />
                    <span>Save</span>
                  </div>
                  <kbd className="text-[10px] font-mono text-text-subtle">⌘S</kbd>
                </button>

                <div className="h-px bg-border-subtle my-1" />

                <button
                  type="button"
                  onClick={() => {
                    if (activeTab) closeTab(activeTab.id);
                    setActiveMenu(null);
                  }}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-bg-hover text-text-main transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <X className="w-3.5 h-3.5 text-red-400" />
                    <span>Close Editor</span>
                  </div>
                  <kbd className="text-[10px] font-mono text-text-subtle">⌘W</kbd>
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
              <div className="absolute left-0 top-6 w-56 bg-[#12141a] border border-border-subtle rounded-lg shadow-2xl z-50 p-1 flex flex-col gap-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setActiveView('search');
                    setActiveMenu(null);
                  }}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-bg-hover text-text-main transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-accent" />
                    <span>Find in Workspace</span>
                  </div>
                  <kbd className="text-[10px] font-mono text-text-subtle">⌘F</kbd>
                </button>
              </div>
            )}
          </div>

          {/* SELECTION MENU */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveMenu(activeMenu === 'selection' ? null : 'selection')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                activeMenu === 'selection' ? 'bg-bg-active text-text-main font-semibold' : 'hover:bg-bg-hover hover:text-text-main'
              }`}
            >
              Selection
            </button>

            {activeMenu === 'selection' && (
              <div className="absolute left-0 top-6 w-56 bg-[#12141a] border border-border-subtle rounded-lg shadow-2xl z-50 p-1 flex flex-col gap-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveMenu(null)}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-bg-hover text-text-main transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-3.5 h-3.5 text-accent" />
                    <span>Select All</span>
                  </div>
                  <kbd className="text-[10px] font-mono text-text-subtle">⌘A</kbd>
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
              <div className="absolute left-0 top-6 w-56 bg-[#12141a] border border-border-subtle rounded-lg shadow-2xl z-50 p-1 flex flex-col gap-0.5 text-xs">
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
                    <span>Command Palette...</span>
                  </div>
                  <kbd className="text-[10px] font-mono text-text-subtle">⌘K</kbd>
                </button>

                <div className="h-px bg-border-subtle my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setActiveView('explorer');
                    setActiveMenu(null);
                  }}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-bg-hover text-text-main transition-colors cursor-pointer"
                >
                  <span>Explorer</span>
                  <kbd className="text-[10px] font-mono text-text-subtle">⇧⌘E</kbd>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveView('search');
                    setActiveMenu(null);
                  }}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-bg-hover text-text-main transition-colors cursor-pointer"
                >
                  <span>Search</span>
                  <kbd className="text-[10px] font-mono text-text-subtle">⇧⌘F</kbd>
                </button>

                <div className="h-px bg-border-subtle my-1" />

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
                    <span>Toggle Split Editor</span>
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
                    <span>Toggle Primary Sidebar</span>
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
                    <Terminal className="w-3.5 h-3.5 text-amber-400" />
                    <span>Toggle Terminal Panel</span>
                  </div>
                  <kbd className="text-[10px] font-mono text-text-subtle">⌘T</kbd>
                </button>
              </div>
            )}
          </div>

          {/* GO MENU */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveMenu(activeMenu === 'go' ? null : 'go')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                activeMenu === 'go' ? 'bg-bg-active text-text-main font-semibold' : 'hover:bg-bg-hover hover:text-text-main'
              }`}
            >
              Go
            </button>

            {activeMenu === 'go' && (
              <div className="absolute left-0 top-6 w-56 bg-[#12141a] border border-border-subtle rounded-lg shadow-2xl z-50 p-1 flex flex-col gap-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    toggleCommandPalette();
                    setActiveMenu(null);
                  }}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-bg-hover text-text-main transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-accent" />
                    <span>Go to File...</span>
                  </div>
                  <kbd className="text-[10px] font-mono text-text-subtle">⌘P</kbd>
                </button>
              </div>
            )}
          </div>

          {/* RUN MENU */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveMenu(activeMenu === 'run' ? null : 'run')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                activeMenu === 'run' ? 'bg-bg-active text-text-main font-semibold' : 'hover:bg-bg-hover hover:text-text-main'
              }`}
            >
              Run
            </button>

            {activeMenu === 'run' && (
              <div className="absolute left-0 top-6 w-56 bg-[#12141a] border border-border-subtle rounded-lg shadow-2xl z-50 p-1 flex flex-col gap-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    handleRunCurrentFile();
                    setActiveMenu(null);
                  }}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-bg-hover text-text-main transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                    <span>Run Active File</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* TERMINAL MENU */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveMenu(activeMenu === 'terminal' ? null : 'terminal')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                activeMenu === 'terminal' ? 'bg-bg-active text-text-main font-semibold' : 'hover:bg-bg-hover hover:text-text-main'
              }`}
            >
              Terminal
            </button>

            {activeMenu === 'terminal' && (
              <div className="absolute left-0 top-6 w-56 bg-[#12141a] border border-border-subtle rounded-lg shadow-2xl z-50 p-1 flex flex-col gap-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    toggleTerminal();
                    setActiveMenu(null);
                  }}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-bg-hover text-text-main transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-accent" />
                    <span>New Terminal</span>
                  </div>
                  <kbd className="text-[10px] font-mono text-text-subtle">⌘T</kbd>
                </button>
              </div>
            )}
          </div>

          {/* HELP MENU */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveMenu(activeMenu === 'help' ? null : 'help')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                activeMenu === 'help' ? 'bg-bg-active text-text-main font-semibold' : 'hover:bg-bg-hover hover:text-text-main'
              }`}
            >
              Help
            </button>

            {activeMenu === 'help' && (
              <div className="absolute left-0 top-6 w-56 bg-[#12141a] border border-border-subtle rounded-lg shadow-2xl z-50 p-1 flex flex-col gap-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    toggleCommandPalette();
                    setActiveMenu(null);
                  }}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-bg-hover text-text-main transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Keyboard className="w-3.5 h-3.5 text-accent" />
                    <span>Keyboard Shortcuts</span>
                  </div>
                  <kbd className="text-[10px] font-mono text-text-subtle">⌘K ⌘S</kbd>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onOpenDevModal();
                    setActiveMenu(null);
                  }}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-bg-hover text-text-main transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>About Developer</span>
                  </div>
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
