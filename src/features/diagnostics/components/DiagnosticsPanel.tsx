import React from 'react';
import { X, Info, AlertTriangle, AlertCircle, Trash2 } from 'lucide-react';
import { useDiagnosticsStore } from '../stores/diagnosticsStore';

export const DiagnosticsPanel: React.FC = () => {
  const { isOpen, activeTab, messages, setOpen, setActiveTab, clearMessages } = useDiagnosticsStore();

  if (!isOpen) return null;

  return (
    <div className="h-44 bg-bg-sidebar border-t border-border-subtle flex flex-col select-none z-20 shrink-0">
      {/* Drawer Header */}
      <div className="h-8 px-3 bg-bg-surface flex items-center justify-between border-b border-border-subtle text-xs">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('problems')}
            className={`font-semibold transition-colors ${
              activeTab === 'problems'
                ? 'text-text-main border-b-2 border-accent pb-1'
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            Problems ({messages.filter((m) => m.type !== 'info').length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('output')}
            className={`font-semibold transition-colors ${
              activeTab === 'output'
                ? 'text-text-main border-b-2 border-accent pb-1'
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            Output ({messages.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clearMessages}
            className="p-1 rounded hover:bg-bg-hover text-text-subtle hover:text-text-main"
            title="Clear Logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="p-1 rounded hover:bg-bg-hover text-text-subtle hover:text-text-main"
            title="Close Panel (⌘J)"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 p-2 overflow-y-auto font-mono text-xs text-text-muted flex flex-col gap-1 select-text">
        {messages.length === 0 ? (
          <p className="text-text-subtle text-center py-4 select-none">
            No problems or output logs detected.
          </p>
        ) : (
          messages.map((msg) => (
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
    </div>
  );
};
