import React from 'react';
import { X, Code2, Sparkles, Cpu, ShieldCheck, Heart, Terminal } from 'lucide-react';

interface DeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeveloperModal: React.FC<DeveloperModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#12141a] border border-accent/30 rounded-xl shadow-2xl w-full max-w-md overflow-hidden text-text-main animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between bg-bg-surface/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center text-accent">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-text-main">Code Editor</h3>
              <p className="text-[11px] text-text-subtle">Local-First Desktop IDE</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-bg-hover text-text-subtle hover:text-text-main transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4 text-xs">
          {/* Developer Card */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-accent/15 to-indigo-500/15 border border-accent/20 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center text-accent text-lg font-bold">
              MC
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-text-main">Manraj Chauhan</span>
                <span className="px-1.5 py-0.5 text-[9px] rounded bg-accent/20 text-accent font-medium">Creator</span>
              </div>
              <span className="text-[11px] text-text-muted">Software Developer & Architect</span>
              <span className="text-[10px] text-text-subtle flex items-center gap-1 mt-1">
                <Heart className="w-3 h-3 text-red-400 fill-red-400" /> Crafting high-performance desktop apps
              </span>
            </div>
          </div>

          {/* Architecture Details */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 rounded bg-bg-surface border border-border-subtle flex flex-col gap-1">
              <span className="text-text-subtle flex items-center gap-1">
                <Cpu className="w-3 h-3 text-accent" /> Engine & Runtime
              </span>
              <span className="font-medium text-text-main">Tauri 2 + Rust Core</span>
            </div>
            <div className="p-2.5 rounded bg-bg-surface border border-border-subtle flex flex-col gap-1">
              <span className="text-text-subtle flex items-center gap-1">
                <Code2 className="w-3 h-3 text-emerald-400" /> UI Framework
              </span>
              <span className="font-medium text-text-main">React 18 + TSX</span>
            </div>
            <div className="p-2.5 rounded bg-bg-surface border border-border-subtle flex flex-col gap-1">
              <span className="text-text-subtle flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5 text-amber-400" /> Editor Kernel
              </span>
              <span className="font-medium text-text-main">Monaco Editor</span>
            </div>
            <div className="p-2.5 rounded bg-bg-surface border border-border-subtle flex flex-col gap-1">
              <span className="text-text-subtle flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Storage Model
              </span>
              <span className="font-medium text-text-main">100% Local Filesystem</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-bg-surface/80 border-t border-border-subtle flex items-center justify-between text-[11px] text-text-subtle">
          <span>Version 1.0.0 (Native macOS)</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-accent hover:bg-accent-hover text-white rounded font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
