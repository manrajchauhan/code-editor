import React, { useState, useEffect } from 'react';
import { Search, Command, FileText, Layout, Settings, Activity } from 'lucide-react';
import { useCommandStore } from '../stores/commandStore';
import { useEditorStore } from '../../editor/stores/editorStore';
import { useLayoutStore } from '../../../stores/layoutStore';
import { useWorkspaceStore } from '../../workspace/stores/workspaceStore';
import { useDiagnosticsStore } from '../../diagnostics/stores/diagnosticsStore';
import { CommandItem } from '../types/command.types';
import { SystemStatusModal } from '../../system-status/components/SystemStatusModal';

export const CommandPaletteModal: React.FC = () => {
  const { isOpen, query, setQuery, closeCommandPalette } = useCommandStore();
  const { getActiveTab, markTabSaved, closeTab, newUntitledTab } = useEditorStore();
  const { toggleSidebar, setActiveView } = useLayoutStore();
  const { openFolder } = useWorkspaceStore();
  const { toggleDiagnostics } = useDiagnosticsStore();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSystemModalOpen, setIsSystemModalOpen] = useState(false);

  const activeTab = getActiveTab();

  const commands: CommandItem[] = [
    {
      id: 'system-status',
      title: 'System: View Full System Running Status',
      subtitle: 'Check memory footprint, session uptime, and runtime environment',
      category: 'View',
      action: () => setIsSystemModalOpen(true),
    },
    {
      id: 'new-file',
      title: 'New File',
      subtitle: 'Create a new untitled file',
      category: 'File',
      shortcut: '⌘N',
      action: () => newUntitledTab(),
    },
    {
      id: 'save-file',
      title: 'Save Active File',
      subtitle: activeTab ? `Save ${activeTab.fileName}` : 'No active file',
      category: 'File',
      shortcut: '⌘S',
      action: () => {
        if (activeTab) markTabSaved(activeTab.id);
      },
    },
    {
      id: 'close-tab',
      title: 'Close Tab',
      subtitle: activeTab ? `Close ${activeTab.fileName}` : 'No active file',
      category: 'File',
      shortcut: '⌘W',
      action: () => {
        if (activeTab) closeTab(activeTab.id);
      },
    },
    {
      id: 'open-folder',
      title: 'Open Folder...',
      subtitle: 'Select project directory from filesystem',
      category: 'File',
      action: () => openFolder(),
    },
    {
      id: 'toggle-diagnostics',
      title: 'Toggle Problems & Output Panel',
      subtitle: 'Open or close bottom drawer',
      category: 'View',
      shortcut: '⌘J',
      action: () => toggleDiagnostics(),
    },
    {
      id: 'toggle-sidebar',
      title: 'Toggle Sidebar',
      subtitle: 'Show or hide the side panel',
      category: 'View',
      shortcut: '⌘B',
      action: () => toggleSidebar(),
    },
    {
      id: 'view-explorer',
      title: 'Switch to File Explorer',
      subtitle: 'Show project file tree',
      category: 'View',
      action: () => setActiveView('explorer'),
    },
    {
      id: 'view-search',
      title: 'Switch to Workspace Search',
      subtitle: 'Search files by name',
      category: 'View',
      action: () => setActiveView('search'),
    },
    {
      id: 'view-settings',
      title: 'Open Settings',
      subtitle: 'Preferences and editor configuration',
      category: 'Settings',
      action: () => setActiveView('settings'),
    },
  ];

  const filteredCommands = commands.filter(
    (cmd) =>
      cmd.title.toLowerCase().includes(query.toLowerCase()) ||
      cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeCommandPalette();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev - 1 < 0 ? Math.max(0, filteredCommands.length - 1) : prev - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          closeCommandPalette();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, closeCommandPalette]);

  return (
    <>
      <SystemStatusModal isOpen={isSystemModalOpen} onClose={() => setIsSystemModalOpen(false)} />

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-[15vh] px-4"
          onClick={() => closeCommandPalette()}
        >
          <div
            className="w-full max-w-xl bg-bg-sidebar border border-border-strong rounded-xl shadow-2xl overflow-hidden flex flex-col select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border-subtle bg-bg-surface">
              <Search className="w-4 h-4 text-accent shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search..."
                className="w-full bg-transparent text-sm text-text-main placeholder:text-text-subtle outline-none"
              />
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-bg-main border border-border-subtle text-text-subtle rounded">
                ESC
              </kbd>
            </div>

            {/* Command List */}
            <div className="max-h-72 overflow-y-auto p-2 flex flex-col gap-1">
              {filteredCommands.length === 0 ? (
                <div className="p-4 text-center text-xs text-text-subtle">
                  No commands found matching &quot;{query}&quot;.
                </div>
              ) : (
                filteredCommands.map((cmd, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={cmd.id}
                      onClick={() => {
                        cmd.action();
                        closeCommandPalette();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                        isSelected ? 'bg-accent text-white font-medium' : 'text-text-muted hover:bg-bg-hover'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {cmd.id === 'system-status' && <Activity className="w-4 h-4 text-emerald-400 shrink-0" />}
                        {cmd.category === 'File' && <FileText className="w-4 h-4 shrink-0" />}
                        {cmd.category === 'View' && cmd.id !== 'system-status' && <Layout className="w-4 h-4 shrink-0" />}
                        {cmd.category === 'Settings' && <Settings className="w-4 h-4 shrink-0" />}
                        {cmd.category === 'Editor' && <Command className="w-4 h-4 shrink-0" />}
                        <div className="flex flex-col">
                          <span className="text-xs">{cmd.title}</span>
                          {cmd.subtitle && (
                            <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-text-subtle'}`}>
                              {cmd.subtitle}
                            </span>
                          )}
                        </div>
                      </div>

                      {cmd.shortcut && (
                        <kbd
                          className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-bg-main text-text-subtle border border-border-subtle'
                          }`}
                        >
                          {cmd.shortcut}
                        </kbd>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
