import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Cpu, Activity, X, CheckCircle, Terminal } from 'lucide-react';

interface Step {
  stepNumber: number;
  line: string;
  variables: Record<string, any>;
  condition: string;
  conditionMet: boolean;
  output?: string;
  explanation: string;
}

interface CodeVisualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
}

export const CodeVisualizerModal: React.FC<CodeVisualizerModalProps> = ({ isOpen, onClose, code }) => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);

  // Parse code and generate step-by-step machine execution trace
  useEffect(() => {
    if (!isOpen) return;

    const generatedSteps: Step[] = [];
    let stepNum = 1;

    // Simple AST-style loop evaluator for code visualization
    const matchLoop = code.match(/for\s*\(\s*(?:let|var)?\s*(\w+)\s*=\s*(\d+);\s*\1\s*<\s*(\d+);\s*\1\+\+\s*\)/i);
    const matchLog = code.match(/console\.log\s*\(\s*["'](.*?)["']\s*\)/i);
    const logText = matchLog ? matchLog[1] : 'Executing loop body';

    if (matchLoop) {
      const varName = matchLoop[1];
      const startVal = parseInt(matchLoop[2], 10);
      const endVal = parseInt(matchLoop[3], 10);

      for (let val = startVal; val <= endVal; val++) {
        const isLessThan = val < endVal;

        if (isLessThan) {
          generatedSteps.push({
            stepNumber: stepNum++,
            line: `for (let ${varName} = ${val}; ${varName} < ${endVal}; ${varName}++)`,
            variables: { [varName]: val, limit: endVal },
            condition: `${val} < ${endVal}`,
            conditionMet: true,
            output: logText.replace(new RegExp(`\\$\\{?${varName}\\}?`, 'g'), String(val)),
            explanation: `Variable ${varName} is ${val}. Condition ${val} < ${endVal} is TRUE. Executing loop iteration ${val + 1}.`,
          });
        } else {
          generatedSteps.push({
            stepNumber: stepNum++,
            line: `for (let ${varName} = ${val}; ${varName} < ${endVal}; ${varName}++)`,
            variables: { [varName]: val, limit: endVal },
            condition: `${val} < ${endVal}`,
            conditionMet: false,
            explanation: `Variable ${varName} reached ${val}. Condition ${val} < ${endVal} is FALSE. Loop terminated cleanly.`,
          });
        }
      }
    } else {
      // Fallback simulation for general code block
      const lines = code.split('\n').filter((l) => l.trim().length > 0);
      lines.forEach((line, idx) => {
        generatedSteps.push({
          stepNumber: idx + 1,
          line: line.trim(),
          variables: { lineNo: idx + 1 },
          condition: 'Instruction Executed',
          conditionMet: true,
          output: line.includes('console.log') ? line.replace(/.*console\.log\((.*)\).*/, '$1') : undefined,
          explanation: `Executed line ${idx + 1}: ${line.trim()}`,
        });
      });
    }

    setSteps(generatedSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [isOpen, code]);

  // Auto-play stepper timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && steps.length > 0) {
      timer = setTimeout(() => {
        setCurrentStepIndex((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, speed);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps, speed]);

  if (!isOpen) return null;

  const currentStep = steps[currentStepIndex];

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-bg-sidebar border border-border-strong rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-bg-surface border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-accent/15 border border-accent/30 text-accent">
              <Cpu className="w-5 h-5 animate-pulse text-accent" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-sm font-bold text-text-main tracking-tight flex items-center gap-2">
                Machine Execution & Logic Visualizer
                <span className="px-2 py-0.5 text-[10px] rounded bg-emerald-500/20 text-emerald-400 font-semibold">
                  STEP {currentStepIndex + 1} OF {steps.length}
                </span>
              </h2>
              <p className="text-[11px] text-text-subtle">Visual step-by-step CPU loop & memory inspector</p>
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

        {/* Modal Content */}
        <div className="p-5 flex flex-col gap-4 overflow-y-auto">
          {/* Controls Bar */}
          <div className="p-3 rounded-xl bg-bg-surface border border-border-subtle flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors cursor-pointer ${
                  isPlaying
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause' : 'Play Execution'}</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
                disabled={currentStepIndex === 0}
                className="p-1.5 rounded-lg bg-bg-hover hover:bg-bg-active text-text-subtle hover:text-text-main disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Previous Step"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))}
                disabled={currentStepIndex === steps.length - 1}
                className="p-1.5 rounded-lg bg-bg-hover hover:bg-bg-active text-text-subtle hover:text-text-main disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Next Step"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentStepIndex(0);
                  setIsPlaying(false);
                }}
                className="p-1.5 rounded-lg hover:bg-bg-hover text-text-subtle hover:text-text-main transition-colors ml-1"
                title="Reset Simulation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Speed Selector */}
            <div className="flex items-center gap-2 text-xs text-text-subtle">
              <span>Speed:</span>
              <select
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="bg-bg-sidebar border border-border-subtle rounded px-2 py-1 text-xs text-text-main outline-none cursor-pointer"
              >
                <option value={1000}>Slow (1.0s)</option>
                <option value={600}>Normal (0.6s)</option>
                <option value={200}>Fast (0.2s)</option>
              </select>
            </div>
          </div>

          {/* Active Step Highlight Card */}
          {currentStep && (
            <div className="p-4 rounded-xl bg-bg-surface border border-accent/40 flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                <span className="text-xs font-bold text-accent flex items-center gap-1.5">
                  <Activity className="w-4 h-4" />
                  Current Machine Instruction:
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    currentStep.conditionMet
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  Condition: {currentStep.condition} ({currentStep.conditionMet ? 'PASS' : 'FAIL'})
                </span>
              </div>

              <div className="p-2.5 rounded bg-[#0d0e11] border border-border-subtle font-mono text-xs text-amber-300">
                <code>{currentStep.line}</code>
              </div>

              <p className="text-xs text-text-main leading-relaxed bg-bg-sidebar/60 p-2.5 rounded-lg border border-border-subtle">
                💡 {currentStep.explanation}
              </p>
            </div>
          )}

          {/* Memory Register Inspector */}
          {currentStep && (
            <div className="grid grid-cols-2 gap-3">
              {/* CPU Registers / Variables */}
              <div className="p-3.5 rounded-xl bg-bg-surface border border-border-subtle flex flex-col gap-2">
                <span className="text-xs font-semibold text-text-main flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-accent" /> Machine Registers & Memory
                </span>
                <div className="flex flex-col gap-1.5 font-mono text-xs">
                  {Object.entries(currentStep.variables).map(([k, v]) => (
                    <div
                      key={k}
                      className="flex items-center justify-between p-2 rounded bg-[#0d0e11] border border-border-subtle"
                    >
                      <span className="text-text-subtle">{k}:</span>
                      <span className="text-emerald-400 font-bold">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Console Output Stream */}
              <div className="p-3.5 rounded-xl bg-bg-surface border border-border-subtle flex flex-col gap-2">
                <span className="text-xs font-semibold text-text-main flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Console Stream Output
                </span>
                <div className="max-h-32 overflow-y-auto p-2 rounded bg-[#0d0e11] border border-border-subtle font-mono text-xs flex flex-col gap-1">
                  {steps.slice(0, currentStepIndex + 1).map((s, i) => (
                    s.output ? (
                      <div key={i} className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{s.output}</span>
                      </div>
                    ) : null
                  ))}
                  {steps.slice(0, currentStepIndex + 1).filter((s) => s.output).length === 0 && (
                    <span className="text-text-subtle italic">No console logs yet...</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
