import React from 'react';
import { Sparkles } from 'lucide-react';

export const TopMenuBar: React.FC<{ onOpenDevModal: () => void }> = ({ onOpenDevModal }) => {
  return (
    <header
      data-tauri-drag-region
      className="h-8 bg-bg-surface border-b border-border-subtle flex items-center justify-end px-3 text-xs select-none shrink-0 relative z-40"
    >
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
