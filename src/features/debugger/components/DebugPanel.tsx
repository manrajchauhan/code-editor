import React, { useState } from 'react';
import {
  Bug, Play, Square, StepForward, ArrowDownLeft, RotateCcw,
  ChevronDown, ChevronRight, Trash2, CircleDot, Circle,
} from 'lucide-react';
import { useDebuggerStore } from '../stores/debuggerStore';


export const DebugPanel: React.FC = () => {
  const {
    isRunning, isPaused, breakpoints, callStack, variables, output,
    enableBreakpoint, disableBreakpoint, removeBreakpoint,
    clearBreakpoints, startSession, stopSession, stepOver, stepInto,
    continueExecution, clearOutput,
  } = useDebuggerStore();

  const [sections, setSections] = useState({
    breakpoints: true,
    callStack: true,
    variables: true,
    output: false,
  });

  const toggle = (s: keyof typeof sections) =>
    setSections((p) => ({ ...p, [s]: !p[s] }));

  const SectionHeader = ({
    label, open, onToggle, count,
  }: { label: string; open: boolean; onToggle: () => void; count?: number }) => (
    <button
      type="button"
      onClick={onToggle}
      className="w-full px-3 py-1.5 flex items-center gap-1.5 hover:bg-bg-hover text-text-subtle hover:text-text-main transition-colors"
    >
      {open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
      <span className="text-[10px] uppercase tracking-wider font-medium">{label}</span>
      {count !== undefined && (
        <span className="ml-auto text-[9px] text-text-subtle">{count}</span>
      )}
    </button>
  );

  return (
    <div className="flex flex-col h-full text-xs select-none">
      {/* Controls */}
      <div className="px-3 py-2 border-b border-border-subtle flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5">
          <Bug className="w-3.5 h-3.5 text-accent" />
          <span className="text-[10px] font-medium text-text-subtle uppercase tracking-wider">Debugger</span>
        </div>
        <div className="flex items-center gap-1">
          {!isRunning ? (
            <button
              type="button"
              onClick={startSession}
              className="p-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
              title="Start Debug Session"
            >
              <Play className="w-3.5 h-3.5" />
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={continueExecution}
                disabled={!isPaused}
                className="p-1 rounded hover:bg-bg-hover text-text-subtle hover:text-emerald-400 disabled:opacity-30 transition-colors"
                title="Continue (F5)"
              >
                <Play className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={stepOver}
                className="p-1 rounded hover:bg-bg-hover text-text-subtle hover:text-text-main transition-colors"
                title="Step Over (F10)"
              >
                <StepForward className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={stepInto}
                className="p-1 rounded hover:bg-bg-hover text-text-subtle hover:text-text-main transition-colors"
                title="Step Into (F11)"
              >
                <ArrowDownLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={stopSession}
                className="p-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                title="Stop"
              >
                <Square className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Status badge */}
      <div className="px-3 py-1.5 border-b border-border-subtle/50 flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? (isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse') : 'bg-text-subtle'}`} />
        <span className="text-[10px] text-text-subtle">
          {isRunning ? (isPaused ? 'Paused at breakpoint' : 'Running') : 'Idle — click ▷ to start'}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Breakpoints */}
        <SectionHeader label="Breakpoints" open={sections.breakpoints} onToggle={() => toggle('breakpoints')} count={breakpoints.length} />
        {sections.breakpoints && (
          <div className="pb-1">
            {breakpoints.length === 0 ? (
              <p className="px-6 py-2 text-[10px] text-text-subtle">Click the line gutter in editor to add breakpoints.</p>
            ) : (
              breakpoints.map((bp) => (
                <div key={`${bp.filePath}-${bp.line}`} className="group flex items-center gap-2 px-4 py-1 hover:bg-bg-hover transition-colors">
                  <button type="button" onClick={() => bp.enabled ? disableBreakpoint(bp.filePath, bp.line) : enableBreakpoint(bp.filePath, bp.line)}>
                    {bp.enabled
                      ? <CircleDot className="w-3 h-3 text-red-400" />
                      : <Circle className="w-3 h-3 text-text-subtle" />
                    }
                  </button>
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-[10px] text-text-main">{bp.filePath.split('/').pop()}</span>
                    <span className="text-text-subtle text-[10px]">:{bp.line}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeBreakpoint(bp.filePath, bp.line)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3 text-text-subtle hover:text-red-400" />
                  </button>
                </div>
              ))
            )}
            {breakpoints.length > 0 && (
              <button
                type="button"
                onClick={clearBreakpoints}
                className="mx-4 mt-1 text-[10px] text-text-subtle hover:text-red-400 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Clear all
              </button>
            )}
          </div>
        )}

        {/* Call Stack */}
        <SectionHeader label="Call Stack" open={sections.callStack} onToggle={() => toggle('callStack')} count={callStack.length} />
        {sections.callStack && (
          <div className="pb-1">
            {callStack.length === 0 ? (
              <p className="px-6 py-2 text-[10px] text-text-subtle">No active stack frames.</p>
            ) : (
              callStack.map((frame) => (
                <div key={frame.id} className="px-5 py-1.5 hover:bg-bg-hover transition-colors flex items-center gap-2">
                  <span className="font-mono text-[11px] text-accent">{frame.name}</span>
                  <span className="text-[10px] text-text-subtle truncate">{frame.file}:{frame.line}</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* Variables */}
        <SectionHeader label="Variables" open={sections.variables} onToggle={() => toggle('variables')} count={variables.length} />
        {sections.variables && (
          <div className="pb-1">
            {variables.length === 0 ? (
              <p className="px-6 py-2 text-[10px] text-text-subtle">No variables in current scope.</p>
            ) : (
              variables.map((v) => (
                <div key={v.name} className="px-5 py-1 flex items-center gap-2">
                  <span className="font-mono text-[11px] text-sky-400">{v.name}</span>
                  <span className="text-[10px] text-text-subtle">{v.type}</span>
                  <span className="ml-auto font-mono text-[10px] text-text-main">{v.value}</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* Output */}
        <SectionHeader label="Debug Output" open={sections.output} onToggle={() => toggle('output')} />
        {sections.output && (
          <div className="pb-1">
            <div className="flex justify-end px-3">
              <button type="button" onClick={clearOutput} className="text-[10px] text-text-subtle hover:text-text-main flex items-center gap-1">
                <RotateCcw className="w-3 h-3" /> Clear
              </button>
            </div>
            <div className="px-4 font-mono text-[10px] text-text-muted leading-relaxed max-h-32 overflow-y-auto">
              {output.map((line, i) => <div key={i}>{line}</div>)}
              {output.length === 0 && <span className="text-text-subtle">No output yet.</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
