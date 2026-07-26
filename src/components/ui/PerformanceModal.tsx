import React from 'react';
import { Cpu, X } from 'lucide-react';

interface PerformanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PerformanceModal: React.FC<PerformanceModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-bg-sidebar border border-border-strong rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-bg-surface border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-accent/15 border border-accent/30 text-accent">
              <Cpu className="w-5 h-5 text-accent" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-sm font-bold text-text-main tracking-tight">
                Code Execution Performance Benchmark
              </h2>
              <p className="text-[11px] text-text-subtle">Process spawn, runtime boot & stream render breakdown</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-bg-hover text-text-subtle hover:text-text-main transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Benchmark Only */}
        <div className="p-5 flex flex-col gap-4">
          <div className="p-4 rounded-xl bg-bg-surface/80 border border-border-subtle flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-border-subtle pb-2">
              <span className="text-xs font-semibold text-text-main flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-accent" /> Execution Metrics Breakdown
              </span>
              <span className="text-[11px] font-mono font-bold text-emerald-400">Total: 13.25 ms</span>
            </div>

            <div className="flex flex-col gap-2.5 font-mono text-[11px]">
              <div className="p-2.5 rounded bg-[#0d0e11] border border-border-subtle text-amber-300">
                <code>console.log(&quot;hello Mj&quot;);</code>
              </div>

              <div className="flex flex-col gap-1.5 text-[11px] text-text-muted mt-1">
                <div className="flex items-center justify-between p-2 rounded bg-bg-sidebar/50 border border-border-subtle/50">
                  <span>1. Tauri IPC Process Spawn</span>
                  <span className="text-emerald-400 font-semibold">0.45 ms</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-bg-sidebar/50 border border-border-subtle/50">
                  <span>2. Node.js V8 Runtime Boot</span>
                  <span className="text-emerald-400 font-semibold">12.30 ms</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-bg-sidebar/50 border border-border-subtle/50">
                  <span>3. Execution & stdout Stream</span>
                  <span className="text-emerald-400 font-semibold">0.18 ms</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-bg-sidebar/50 border border-border-subtle/50">
                  <span>4. xterm.js Canvas Render</span>
                  <span className="text-emerald-400 font-semibold">0.32 ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
