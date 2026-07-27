import React from 'react';
import { Columns } from 'lucide-react';
import { EditorTabs } from './components/EditorTabs';
import { MonacoEditorContainer } from './components/MonacoEditorContainer';
import { useEditorStore } from './stores/editorStore';
import { useWorkspaceStore } from '../workspace/stores/workspaceStore';
import { saveFile } from '../../services/fileService';

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
              {/* Primary Pane */}
              <div className="flex-1 flex flex-col h-full border-r border-border-subtle overflow-hidden relative">
                <MonacoEditorContainer tabId="primary" onSaveRequested={handleSaveActiveTab} />
              </div>
              {/* Secondary Pane */}
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
        /* ──────────────────────────────────────────────────────────────
           MONAD EDITORIAL WELCOME SCREEN
           Warm parchment canvas · editorial serif headlines · mono body
           ────────────────────────────────────────────────────────────── */
        <div
          className="flex-1 flex flex-col overflow-y-auto select-none monad-surface"
          style={{ backgroundColor: 'var(--color-parchment)' }}
        >
          {/* Atmospheric gradient wash — decorative blob */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full monad-gradient-coral-sky opacity-30"
              aria-hidden="true"
            />
          </div>

          {/* ── Hero Section ───────────────────────────────────────── */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-10 pt-24 pb-16 gap-8">
            {/* Eyebrow tag */}
            <span className="monad-tag" style={{ borderColor: 'var(--color-ash)' }}>
              <span style={{ fontSize: 10 }}>◉</span> Local IDE · Tauri 2 + Monaco
            </span>

            {/* Editorial display headline */}
            <h1
              className="monad-display max-w-3xl"
              style={{
                fontFamily: 'var(--font-editorial-serif)',
                fontSize: 'clamp(40px, 6vw, 80px)',
                lineHeight: 1.15,
                letterSpacing: '-1.6px',
                fontWeight: 400,
                color: 'var(--color-off-black)',
              }}
            >
              Your code,<br />your machine.
            </h1>

            {/* Mono subtext */}
            <p
              className="max-w-md"
              style={{
                fontFamily: 'var(--font-diatype-mono)',
                fontSize: 'var(--text-body-lg)',
                lineHeight: 'var(--leading-body-lg)',
                letterSpacing: 'var(--tracking-body-lg)',
                color: 'var(--color-graphite)',
              }}
            >
              A fast, local-first code editor with syntax highlighting, split view,
              file tree, terminal and step-by-step logic visualizer — all offline.
            </p>

            {/* CTA Button Row */}
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <button
                type="button"
                onClick={newUntitledTab}
                className="monad-btn-primary"
                style={{ fontFamily: 'var(--font-diatype-mono)' }}
              >
                New File ▸
              </button>
              <button
                type="button"
                onClick={() => openFolder()}
                className="monad-btn-ghost"
                style={{ fontFamily: 'var(--font-diatype-mono)' }}
              >
                Open Folder
              </button>
            </div>
          </div>

          {/* ── Divider ─────────────────────────────────────────────── */}
          <div className="monad-divider mx-10" />

          {/* ── Feature Cards Row ───────────────────────────────────── */}
          <div className="relative z-10 px-10 py-12 grid grid-cols-3 gap-5 max-w-5xl mx-auto w-full">
            {[
              {
                icon: '⌘',
                title: 'Monaco Editor',
                body: 'Full VS Code editor engine with syntax highlighting, IntelliSense and multi-language support.',
              },
              {
                icon: '⧉',
                title: 'Split View',
                body: 'Side-by-side file editing with independent scroll. Activate with ⌘\\ shortcut.',
                accent: true,
              },
              {
                icon: '◈',
                title: 'Logic Visualizer',
                body: 'Step-by-step runtime stepper — arrays, loops, call stack and variable state, all animated.',
              },
            ].map((card) => (
              <div
                key={card.title}
                className={card.accent ? 'monad-card-periwinkle' : 'monad-card'}
                style={{ position: 'relative', overflow: 'hidden' }}
              >
                {card.accent && (
                  /* Gradient wash inside periwinkle card */
                  <div
                    className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
                    style={{
                      background: 'radial-gradient(ellipse at 80% 20%, rgba(167, 252, 205, 0.6), rgba(160, 181, 235, 0.4), transparent)',
                      filter: 'blur(30px)',
                    }}
                    aria-hidden="true"
                  />
                )}
                <div
                  style={{
                    fontSize: 20,
                    color: 'var(--color-off-black)',
                    marginBottom: 16,
                    fontFamily: 'var(--font-diatype-mono)',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {card.icon}
                </div>
                <h3
                  className="monad-subheading"
                  style={{
                    fontFamily: 'var(--font-editorial-serif)',
                    fontSize: 'var(--text-subheading)',
                    lineHeight: 'var(--leading-subheading)',
                    letterSpacing: 'var(--tracking-subheading)',
                    fontWeight: 400,
                    color: 'var(--color-off-black)',
                    marginBottom: 12,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {card.title}
                </h3>
                <p
                  className="monad-body"
                  style={{
                    fontFamily: 'var(--font-diatype-mono)',
                    fontSize: 'var(--text-body)',
                    lineHeight: 'var(--leading-body)',
                    letterSpacing: 'var(--tracking-body)',
                    color: 'var(--color-graphite)',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {card.body}
                </p>
              </div>
            ))}
          </div>

          {/* ── Recent Workspaces ───────────────────────────────────── */}
          {recentFolders.length > 0 && (
            <div className="relative z-10 px-10 pb-16 max-w-5xl mx-auto w-full">
              <div className="monad-divider mb-8" />
              <div
                style={{
                  fontFamily: 'var(--font-diatype-mono)',
                  fontSize: 'var(--text-caption)',
                  letterSpacing: 'var(--tracking-caption)',
                  textTransform: 'uppercase',
                  color: 'var(--color-smoke)',
                  marginBottom: 16,
                }}
              >
                Recent Workspaces
              </div>
              <div className="flex flex-col gap-1">
                {recentFolders.slice(0, 5).map((path) => {
                  const name = path.split('/').pop() || path;
                  return (
                    <button
                      key={path}
                      type="button"
                      onClick={() => openFolder(path)}
                      className="flex items-center justify-between py-3 px-4 rounded-xl transition-colors text-left group"
                      style={{
                        border: '1px solid transparent',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-ash)';
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(206, 202, 200, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent';
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                      }}
                    >
                      <div className="flex flex-col">
                        <span
                          style={{
                            fontFamily: 'var(--font-diatype-mono)',
                            fontSize: 'var(--text-body-sm)',
                            letterSpacing: 'var(--tracking-body-sm)',
                            fontWeight: 500,
                            color: 'var(--color-off-black)',
                          }}
                        >
                          {name}
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-diatype-mono)',
                            fontSize: 'var(--text-caption)',
                            letterSpacing: 'var(--tracking-caption)',
                            color: 'var(--color-smoke)',
                          }}
                        >
                          {path}
                        </span>
                      </div>
                      <span
                        style={{
                          fontFamily: 'var(--font-diatype-mono)',
                          fontSize: 'var(--text-caption)',
                          color: 'var(--color-lake-blue)',
                          textTransform: 'uppercase',
                          letterSpacing: 'var(--tracking-caption)',
                        }}
                      >
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
