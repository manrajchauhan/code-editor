import React from 'react';
import { Columns, Keyboard } from 'lucide-react';
import { EditorTabs } from './components/EditorTabs';
import { MonacoEditorContainer } from './components/MonacoEditorContainer';
import { useEditorStore } from './stores/editorStore';
import { useWorkspaceStore } from '../workspace/stores/workspaceStore';
import { saveFile } from '../../services/fileService';

const SHORTCUTS = [
  { key: '⌘B', label: 'Toggle Sidebar' },
  { key: '⌘N', label: 'New File' },
  { key: '⌘K', label: 'Command Palette' },
  { key: '⌘\\', label: 'Split View' },
  { key: '⌘T', label: 'Terminal' },
  { key: '⌘S', label: 'Save File' },
  { key: '⌘W', label: 'Close Tab' },
  { key: '⌥⇧F', label: 'Format Code' },
];

const FEATURES = [
  {
    icon: '⌘',
    title: 'Monaco Editor',
    body: 'Full VS Code engine — syntax highlighting, IntelliSense, multi-language support.',
    color: 'from-indigo-500/10 to-violet-500/10',
    border: 'border-indigo-500/20',
  },
  {
    icon: '⎇',
    title: 'Git Integration',
    body: 'Stage, commit and push without leaving the editor. Live branch and diff view.',
    color: 'from-amber-500/10 to-orange-500/10',
    border: 'border-amber-500/20',
    accent: true,
  },
  {
    icon: '◈',
    title: 'Logic Visualizer',
    body: 'Step-by-step runtime stepper — arrays, loops, call stack and variables, all animated.',
    color: 'from-emerald-500/10 to-teal-500/10',
    border: 'border-emerald-500/20',
  },
  {
    icon: '◉',
    title: 'Debugger',
    body: 'Set breakpoints, inspect call stack and variables. Step over or into functions.',
    color: 'from-rose-500/10 to-red-500/10',
    border: 'border-rose-500/20',
  },
  {
    icon: '⌸',
    title: 'Snippets Manager',
    body: 'View, add and edit custom code snippets. Fires directly in Monaco via tab completion.',
    color: 'from-sky-500/10 to-cyan-500/10',
    border: 'border-sky-500/20',
  },
  {
    icon: '⧉',
    title: 'Split View',
    body: 'Side-by-side file editing with independent scroll. Open files in parallel panes.',
    color: 'from-purple-500/10 to-fuchsia-500/10',
    border: 'border-purple-500/20',
  },
];

export const EditorWorkspace: React.FC = () => {
  const { tabs, isSplitView, getActiveTab, getSecondaryTab, markTabSaved, newUntitledTab, toggleSplitView } =
    useEditorStore();
  const { openFolder, recentFolders } = useWorkspaceStore();

  const activeTab = getActiveTab();
  const secondaryTab = getSecondaryTab();

  const handleSaveActiveTab = async () => {
    if (!activeTab) return;
    const result = await saveFile(activeTab.filePath, activeTab.content);
    if (result.success) {
      markTabSaved(activeTab.id);
    }
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
        /* ── Upgraded Welcome Screen ─────────────────────────────────── */
        <div className="flex-1 flex flex-col overflow-y-auto select-none bg-bg-main">
          {/* Animated gradient mesh background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-indigo-500/8 blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-violet-500/6 blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
            <div className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full bg-accent/5 blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
          </div>

          {/* Hero */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-10 pt-20 pb-12 gap-6">
            {/* Badge */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-border-strong bg-bg-surface/80 text-[11px] text-text-muted font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Local-first · Tauri 2 + Monaco + Rust
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-bold text-text-main tracking-tight max-w-2xl leading-tight">
              Your code,{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                your machine.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-text-muted text-base max-w-md leading-relaxed font-mono text-sm">
              A fast, offline code editor with Git, Debugger, Snippets,
              split-view and step-by-step logic visualizer.
            </p>

            {/* CTA */}
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <button
                type="button"
                onClick={newUntitledTab}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/20"
              >
                New File ▸
              </button>
              <button
                type="button"
                onClick={() => openFolder()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-border-strong text-text-muted hover:text-text-main hover:border-accent/50 transition-colors text-sm font-mono"
              >
                Open Folder
              </button>
            </div>
          </div>

          {/* Feature cards grid */}
          <div className="relative z-10 px-8 pb-8 grid grid-cols-3 gap-3 max-w-5xl mx-auto w-full">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className={`group flex flex-col gap-2 p-4 rounded-xl border bg-gradient-to-br ${f.color} ${f.border} hover:scale-[1.02] hover:border-accent/40 transition-all duration-200 cursor-default`}
              >
                <span className="text-xl">{f.icon}</span>
                <h3 className="text-sm font-semibold text-text-main">{f.title}</h3>
                <p className="text-[11px] text-text-muted leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>

          {/* Keyboard shortcuts */}
          <div className="relative z-10 px-8 pb-6 max-w-5xl mx-auto w-full">
            <div className="border border-border-subtle rounded-xl p-4 bg-bg-surface/40">
              <div className="flex items-center gap-2 mb-3">
                <Keyboard className="w-3.5 h-3.5 text-accent" />
                <span className="text-[10px] text-text-subtle uppercase tracking-wider font-medium">Keyboard Shortcuts</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {SHORTCUTS.map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-2">
                    <kbd className="px-1.5 py-0.5 rounded bg-bg-active border border-border-strong text-[10px] font-mono text-accent whitespace-nowrap">
                      {key}
                    </kbd>
                    <span className="text-[10px] text-text-subtle truncate">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent projects */}
          {recentFolders.length > 0 && (
            <div className="relative z-10 px-8 pb-8 max-w-5xl mx-auto w-full">
              <div className="border border-border-subtle rounded-xl overflow-hidden bg-bg-surface/30">
                <div className="px-4 py-2 border-b border-border-subtle">
                  <span className="text-[10px] text-text-subtle uppercase tracking-wider font-medium">Recent Projects</span>
                </div>
                {recentFolders.slice(0, 5).map((path) => {
                  const name = path.split('/').pop() || path;
                  return (
                    <button
                      key={path}
                      type="button"
                      onClick={() => openFolder(path)}
                      className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-bg-hover border-b border-border-subtle/50 last:border-0 transition-colors text-left group"
                    >
                      <div className="flex flex-col">
                        <span className="text-[12px] text-text-main font-medium font-mono">{name}</span>
                        <span className="text-[10px] text-text-subtle font-mono">{path}</span>
                      </div>
                      <span className="text-[10px] text-accent opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                        Open →
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
};
