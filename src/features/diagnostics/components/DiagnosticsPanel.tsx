import React, { useState, useRef } from 'react';
import {
  X, Info, AlertTriangle, AlertCircle, Trash2, Terminal as TerminalIcon,
  Plus, Maximize2, Minimize2
} from 'lucide-react';
import { useDiagnosticsStore } from '../stores/diagnosticsStore';
import { useTerminalStore } from '../../terminal/stores/terminalStore';
import { TerminalPanel } from '../../terminal/components/TerminalPanel';

export const DiagnosticsPanel: React.FC = () => {
  const { messages, clearMessages } = useDiagnosticsStore();
  const {
    isTerminalOpen, activeDrawerTab, drawerHeight, isMaximized,
    terminals, activeTerminalId,
    setTerminalOpen, setActiveDrawerTab, setDrawerHeight, toggleMaximize,
    createTerminalTab, closeTerminalTab, setActiveTerminalTab, runCodeFile,
  } = useTerminalStore();

  const [isResizing, setIsResizing] = useState(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  if (!isTerminalOpen) return null;

  // Handle Drag Resizing
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startYRef.current = e.clientY;
    startHeightRef.current = drawerHeight;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = startYRef.current - moveEvent.clientY;
      const newHeight = Math.min(Math.max(160, startHeightRef.current + deltaY), window.innerHeight - 100);
      setDrawerHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const currentHeight = isMaximized ? 'calc(100vh - 60px)' : `${drawerHeight}px`;

  return (
    <div
      className="bg-bg-sidebar border-t border-border-subtle flex flex-col select-none z-20 shrink-0 relative transition-all duration-100"
      style={{ height: currentHeight }}
    >
      {/* Drag Resize Handle */}
      {!isMaximized && (
        <div
          onMouseDown={handleMouseDown}
          className={`h-1.5 w-full cursor-ns-resize absolute top-0 left-0 hover:bg-accent/40 z-30 transition-colors ${
            isResizing ? 'bg-accent' : 'bg-transparent'
          }`}
          title="Drag to resize terminal drawer"
        />
      )}

      {/* Drawer Header Toolbar */}
      <div className="h-9 px-3 bg-bg-surface flex items-center justify-between border-b border-border-subtle text-xs shrink-0">
        <div className="flex items-center gap-3 overflow-x-auto min-w-0 flex-1">
          {/* Active Tab Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveDrawerTab('terminal')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-t text-xs font-semibold transition-colors ${
                activeDrawerTab === 'terminal'
                  ? 'bg-bg-main text-accent border-t-2 border-accent'
                  : 'text-text-muted hover:text-text-main hover:bg-bg-hover'
              }`}
            >
              <TerminalIcon className="w-3.5 h-3.5 text-accent" />
              <span>Terminal</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveDrawerTab('problems')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-t text-xs font-semibold transition-colors ${
                activeDrawerTab === 'problems'
                  ? 'bg-bg-main text-text-main border-t-2 border-accent'
                  : 'text-text-muted hover:text-text-main hover:bg-bg-hover'
              }`}
            >
              <span>Problems</span>
              <span className="px-1.5 py-0.2 text-[9px] rounded-full bg-border-subtle text-text-subtle font-mono">
                {messages.filter((m) => m.type !== 'info').length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveDrawerTab('output')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-t text-xs font-semibold transition-colors ${
                activeDrawerTab === 'output'
                  ? 'bg-bg-main text-text-main border-t-2 border-accent'
                  : 'text-text-muted hover:text-text-main hover:bg-bg-hover'
              }`}
            >
              <span>Output</span>
              <span className="px-1.5 py-0.2 text-[9px] rounded-full bg-border-subtle text-text-subtle font-mono">
                {messages.length}
              </span>
            </button>
          </div>

          {/* Terminal Tabs (when in Terminal view) */}
          {activeDrawerTab === 'terminal' && (
            <div className="flex items-center gap-1 border-l border-border-subtle pl-3">
              {terminals.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setActiveTerminalTab(t.id)}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                    activeTerminalId === t.id
                      ? 'bg-accent/20 text-accent font-semibold border border-accent/30'
                      : 'bg-bg-hover/60 text-text-muted hover:text-text-main'
                  }`}
                >
                  <span>{t.name}</span>
                  {terminals.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        closeTerminalTab(t.id);
                      }}
                      className="p-0.5 hover:bg-bg-active rounded text-text-subtle hover:text-text-main"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => createTerminalTab()}
                className="p-1 rounded bg-bg-hover hover:bg-bg-active text-text-subtle hover:text-text-main transition-colors"
                title="New Terminal Tab"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Quick Command Launcher (when in Terminal view) */}
          {activeDrawerTab === 'terminal' && (
            <div className="hidden md:flex items-center gap-1 border-l border-border-subtle pl-3">
              {[
                { label: 'npm dev', cmd: 'npm run dev' },
                { label: 'npm start', cmd: 'npm start' },
                { label: 'git status', cmd: 'git status' },
              ].map(({ label, cmd }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => runCodeFile(cmd)}
                  className="px-2 py-0.5 rounded bg-bg-hover hover:bg-bg-active text-[10px] font-mono text-text-muted hover:text-text-main transition-colors border border-border-subtle"
                >
                  ▶ {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Toolbar Controls */}
        <div className="flex items-center gap-1 shrink-0 ml-2">
          {activeDrawerTab === 'terminal' && (
            <button
              type="button"
              onClick={() => runCodeFile('clear')}
              className="p-1 rounded hover:bg-bg-hover text-text-subtle hover:text-text-main transition-colors"
              title="Clear Terminal (Ctrl+L)"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          {activeDrawerTab !== 'terminal' && (
            <button
              type="button"
              onClick={clearMessages}
              className="p-1 rounded hover:bg-bg-hover text-text-subtle hover:text-text-main transition-colors"
              title="Clear Logs"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={toggleMaximize}
            className="p-1 rounded hover:bg-bg-hover text-text-subtle hover:text-text-main transition-colors"
            title={isMaximized ? 'Restore Height' : 'Maximize Terminal'}
          >
            {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => setTerminalOpen(false)}
            className="p-1 rounded hover:bg-bg-hover text-text-subtle hover:text-text-main transition-colors"
            title="Close Drawer (⌘T / ⌘J)"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Drawer Body Content */}
      <div className="flex-1 overflow-hidden">
        {activeDrawerTab === 'terminal' && <TerminalPanel />}

        {(activeDrawerTab === 'problems' || activeDrawerTab === 'output') && (
          <div className="h-full p-3 overflow-y-auto font-mono text-xs text-text-muted flex flex-col gap-1 select-text">
            {messages.length === 0 ? (
              <p className="text-text-subtle text-center py-6 select-none text-[11px]">
                No problems or output logs detected.
              </p>
            ) : (
              messages
                .filter((m) => (activeDrawerTab === 'problems' ? m.type !== 'info' : true))
                .map((msg) => (
                  <div
                    key={msg.id}
                    className="flex items-start gap-2 py-1 px-2 rounded hover:bg-bg-hover text-[11px]"
                  >
                    {msg.type === 'error' && <AlertCircle className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />}
                    {msg.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />}
                    {msg.type === 'info' && <Info className="w-3.5 h-3.5 text-sky-400 mt-0.5 shrink-0" />}

                    <div className="flex flex-1 items-center justify-between gap-2">
                      <span className="text-text-main leading-snug">{msg.message}</span>
                      <div className="flex items-center gap-2 text-[10px] text-text-subtle shrink-0">
                        {msg.source && <span>[{msg.source}]</span>}
                        <span>{msg.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
