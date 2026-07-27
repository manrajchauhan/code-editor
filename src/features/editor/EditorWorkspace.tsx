import React from 'react';
import { Columns, FilePlus, FolderOpen, Sparkles, Terminal, Command, GitBranch, Cpu, Search, Zap } from 'lucide-react';
import { EditorTabs } from './components/EditorTabs';
import { MonacoEditorContainer } from './components/MonacoEditorContainer';
import { useEditorStore } from './stores/editorStore';
import { useWorkspaceStore } from '../workspace/stores/workspaceStore';
import { useCommandStore } from '../command-palette/stores/commandStore';
import { saveFile } from '../../services/fileService';

const QUICK_ACTIONS = [
  {
    icon: <FilePlus className="w-4 h-4 text-indigo-400" />,
    title: 'New File',
    shortcut: '⌘N',
    action: 'newFile',
    description: 'Create an untitled document',
  },
  {
    icon: <FolderOpen className="w-4 h-4 text-emerald-400" />,
    title: 'Open Folder',
    shortcut: '⌘O',
    action: 'openFolder',
    description: 'Browse local project directory',
  },
  {
    icon: <Command className="w-4 h-4 text-violet-400" />,
    title: 'Command Palette',
    shortcut: '⌘K',
    action: 'commandPalette',
    description: 'Quick search & editor actions',
  },
  {
    icon: <Search className="w-4 h-4 text-sky-400" />,
    title: 'Global Search',
    shortcut: '⌘⇧F',
    action: 'search',
    description: 'Find across all workspace files',
  },
];

const IDE_CAPABILITIES = [
  {
    icon: <Cpu className="w-4 h-4 text-indigo-400" />,
    title: 'Logic Visualizer',
    detail: 'Step-by-step memory & loop execution stepper',
  },
  {
    icon: <GitBranch className="w-4 h-4 text-amber-400" />,
    title: 'Git Control',
    detail: 'Stage, commit, diff, push & pull workspace',
  },
  {
    icon: <Zap className="w-4 h-4 text-emerald-400" />,
    title: 'Instant Snippets',
    detail: '100+ TSX, TS, React & Python completions',
  },
  {
    icon: <Terminal className="w-4 h-4 text-rose-400" />,
    title: 'Integrated Shell',
    detail: 'Execute code directly in embedded terminal',
  },
];

export const EditorWorkspace: React.FC = () => {
  const { tabs, isSplitView, getActiveTab, getSecondaryTab, markTabSaved, newUntitledTab, toggleSplitView } =
    useEditorStore();
  const { openFolder, recentFolders } = useWorkspaceStore();
  const { openCommandPalette } = useCommandStore();

  const activeTab = getActiveTab();
  const secondaryTab = getSecondaryTab();

  const handleSaveActiveTab = async () => {
    if (!activeTab) return;
    const result = await saveFile(activeTab.filePath, activeTab.content);
    if (result.success) {
      markTabSaved(activeTab.id);
    }
  };

  const handleQuickAction = (action: string) => {
    if (action === 'newFile') newUntitledTab();
    else if (action === 'openFolder') openFolder();
    else if (action === 'commandPalette') openCommandPalette();
  };

  return (
    <main className="flex-1 bg-bg-main flex flex-col h-full overflow-hidden select-none relative">
      {tabs.length > 0 && (
        <div className="flex items-center justify-between bg-bg-sidebar pr-2 border-b border-border-subtle shrink-0">
          <div className="flex-1 overflow-x-auto">
            <EditorTabs />
          </div>
          <button
            type="button"
            onClick={toggleSplitView}
            className={`p-1.5 rounded transition-colors ml-2 ${
              isSplitView
                ? 'bg-accent text-white'
                : 'text-text-subtle hover:text-text-main hover:bg-bg-hover'
            }`}
            title="Toggle Split View (⌘\)"
          >
            <Columns className="w-4 h-4" />
          </button>
        </div>
      )}

      {tabs.length > 0 && activeTab ? (
        <div className="flex-1 w-full h-full flex flex-col overflow-hidden">
          {isSplitView && secondaryTab ? (
            <div className="flex-1 w-full h-full flex overflow-hidden">
              <div className="flex-1 flex flex-col h-full border-r border-border-subtle overflow-hidden relative">
                <MonacoEditorContainer tabId="primary" onSaveRequested={handleSaveActiveTab} />
              </div>
              <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                <MonacoEditorContainer tabId="secondary" onSaveRequested={handleSaveActiveTab} />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
              <MonacoEditorContainer onSaveRequested={handleSaveActiveTab} />
            </div>
          )}
        </div>
      ) : (
        /* ── CLEAN AESTHETIC MINIMAL WELCOME SCREEN ───────────────────── */
        <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto px-6 py-12 select-none bg-bg-main relative">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full bg-accent/10 blur-[120px] opacity-70" />
            <div className="absolute bottom-10 left-1/3 w-[400px] h-[250px] rounded-full bg-violet-600/5 blur-[100px]" />
          </div>

          <div className="relative z-10 max-w-3xl w-full flex flex-col gap-10 items-center">
            {/* Header / Hero */}
            <div className="flex flex-col items-center text-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bg-surface/80 border border-border-subtle text-text-muted text-[11px] font-mono shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
                <span>Local Code Editor</span>
                <span className="text-border-strong">•</span>
                <span className="text-accent font-semibold">Tauri 2 + Monaco</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-text-main tracking-tight mt-1">
                Fast. Local.{' '}
                <span className="bg-gradient-to-r from-accent via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  Intelligent.
                </span>
              </h1>

              <p className="text-text-muted text-xs sm:text-sm max-w-md font-mono leading-relaxed">
                Lightweight desktop IDE built for speed, full offline privacy, and step-by-step logic visualization.
              </p>
            </div>

            {/* Main Action Bar */}
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <button
                type="button"
                onClick={newUntitledTab}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-lg shadow-accent/20 transition-all transform hover:-translate-y-0.5"
              >
                <FilePlus className="w-4 h-4" />
                <span>New File</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-mono ml-1">⌘N</kbd>
              </button>

              <button
                type="button"
                onClick={() => openFolder()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-bg-surface hover:bg-bg-hover text-text-main border border-border-subtle hover:border-accent/40 text-xs font-semibold transition-all transform hover:-translate-y-0.5"
              >
                <FolderOpen className="w-4 h-4 text-accent" />
                <span>Open Folder</span>
                <kbd className="px-1.5 py-0.5 rounded bg-bg-active text-text-subtle text-[10px] font-mono ml-1">⌘O</kbd>
              </button>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {QUICK_ACTIONS.map((item) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => handleQuickAction(item.action)}
                  className="group flex items-center justify-between p-3.5 rounded-xl bg-bg-surface/40 hover:bg-bg-surface border border-border-subtle/80 hover:border-accent/30 transition-all text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-bg-hover/80 border border-border-subtle group-hover:border-accent/20 transition-colors">
                      {item.icon}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-text-main group-hover:text-accent transition-colors">
                        {item.title}
                      </span>
                      <span className="text-[11px] text-text-subtle truncate font-mono">
                        {item.description}
                      </span>
                    </div>
                  </div>
                  <kbd className="px-2 py-0.5 rounded bg-bg-active text-[10px] font-mono text-text-subtle shrink-0 group-hover:text-text-main border border-border-subtle">
                    {item.shortcut}
                  </kbd>
                </button>
              ))}
            </div>

            {/* Feature Capabilities Strip */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border-subtle/60">
              {IDE_CAPABILITIES.map((cap) => (
                <div key={cap.title} className="flex flex-col gap-1 p-2.5 rounded-lg bg-bg-surface/20 border border-border-subtle/40">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-text-main">
                    {cap.icon}
                    <span>{cap.title}</span>
                  </div>
                  <span className="text-[10px] text-text-subtle font-mono leading-tight">{cap.detail}</span>
                </div>
              ))}
            </div>

            {/* Recent Folders List */}
            {recentFolders.length > 0 && (
              <div className="w-full flex flex-col gap-2 pt-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-semibold text-text-subtle uppercase tracking-wider font-mono">
                    Recent Workspaces
                  </span>
                  <span className="text-[10px] text-text-subtle font-mono">
                    {recentFolders.length} location{recentFolders.length > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="flex flex-col gap-1 bg-bg-surface/30 border border-border-subtle/70 rounded-xl p-1.5">
                  {recentFolders.slice(0, 4).map((path) => {
                    const name = path.split('/').pop() || path;
                    return (
                      <button
                        key={path}
                        type="button"
                        onClick={() => openFolder(path)}
                        className="group flex items-center justify-between px-3 py-2 rounded-lg hover:bg-bg-hover transition-colors text-left"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FolderOpen className="w-3.5 h-3.5 text-accent/70 group-hover:text-accent shrink-0" />
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xs font-medium text-text-main truncate font-mono">
                              {name}
                            </span>
                            <span className="text-[10px] text-text-subtle truncate font-mono opacity-60">
                              {path}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] text-accent font-mono opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                          Open →
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};
