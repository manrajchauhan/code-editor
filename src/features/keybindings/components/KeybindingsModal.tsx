import React from 'react';
import { Keyboard, X } from 'lucide-react';

interface KeybindingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeybindingsModal: React.FC<KeybindingsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '⌘N / Ctrl+N', description: 'Create New File' },
    { key: '⌘S / Ctrl+S', description: 'Save Active File' },
    { key: '⌘W / Ctrl+W', description: 'Close Active Tab' },
    { key: '⌘B / Ctrl+B', description: 'Toggle Sidebar Panel' },
    { key: '⌘K / ⌘P', description: 'Open Command Palette' },
    { key: '⌘T / ⌘J / Ctrl+~', description: 'Toggle Terminal & Problems Drawer' },
    { key: '⌘\\', description: 'Toggle Split Editor Panes (Side-by-Side)' },
    { key: '⌥⇧F / Alt+Shift+F', description: 'Format Active Document' },
    { key: 'F2', description: 'Rename File/Folder in Tree' },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-bg-sidebar border border-border-strong rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-10 px-4 bg-bg-surface border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-accent" />
            <span className="font-semibold text-xs text-text-main">Keyboard Shortcuts Reference</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-bg-hover text-text-subtle hover:text-text-main transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 max-h-80 overflow-y-auto flex flex-col gap-1 text-xs">
          {shortcuts.map((sc) => (
            <div
              key={sc.key}
              className="flex items-center justify-between p-2 rounded hover:bg-bg-hover text-text-muted hover:text-text-main transition-colors"
            >
              <span>{sc.description}</span>
              <kbd className="px-2 py-0.5 text-[10px] font-mono bg-bg-surface border border-border-subtle rounded text-accent font-medium">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="px-4 py-2 bg-bg-surface border-t border-border-subtle flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-accent hover:bg-accent-hover text-white rounded text-xs font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
