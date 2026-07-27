import React, { useEffect, useState } from 'react';
import {
  GitBranch, RefreshCw, Plus, Minus, GitCommit,
  ArrowDown, ArrowUp, AlertCircle, CheckCircle2, FileDiff,
} from 'lucide-react';
import { useGitStore, GitFileStatus } from '../stores/gitStore';

const STATUS_COLORS: Record<string, string> = {
  M: 'text-amber-400',
  A: 'text-emerald-400',
  D: 'text-red-400',
  U: 'text-red-400',
  R: 'text-sky-400',
  '??': 'text-text-muted',
};

const STATUS_LABELS: Record<string, string> = {
  M: 'M', A: 'A', D: 'D', U: 'C', R: 'R', '??': 'U',
};

export const GitPanel: React.FC = () => {
  const {
    branch, modifiedFiles, commitMessage, isLoading, lastError,
    refresh, stageFile, unstageFile, stageAll, commit, pull, push,
    setCommitMessage,
  } = useGitStore();

  const [commitLoading, setCommitLoading] = useState(false);

  useEffect(() => { refresh(); }, []);

  const staged = modifiedFiles.filter((f) => f.staged);
  const unstaged = modifiedFiles.filter((f) => !f.staged);

  const handleCommit = async () => {
    if (!commitMessage.trim()) return;
    setCommitLoading(true);
    await commit(commitMessage);
    setCommitLoading(false);
  };

  const FileRow = ({ file, showStage }: { file: GitFileStatus; showStage: boolean }) => (
    <div className="flex items-center justify-between px-2 py-1 rounded hover:bg-bg-hover group transition-colors">
      <div className="flex items-center gap-2 min-w-0">
        <FileDiff className="w-3 h-3 text-text-subtle shrink-0" />
        <span className="truncate text-[11px] text-text-main font-mono">
          {file.path.split('/').pop()}
        </span>
        <span className="text-[9px] text-text-subtle truncate hidden group-hover:block">{file.path}</span>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <span className={`text-[10px] font-bold font-mono w-4 text-center ${STATUS_COLORS[file.status] || 'text-text-muted'}`}>
          {STATUS_LABELS[file.status] || file.status}
        </span>
        <button
          type="button"
          onClick={() => showStage ? stageFile(file.path) : unstageFile(file.path)}
          className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-bg-active transition-all"
          title={showStage ? 'Stage file' : 'Unstage file'}
        >
          {showStage
            ? <Plus className="w-3 h-3 text-emerald-400" />
            : <Minus className="w-3 h-3 text-amber-400" />
          }
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full text-xs select-none">
      {/* Header */}
      <div className="px-3 py-2 border-b border-border-subtle flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5">
          <GitBranch className="w-3.5 h-3.5 text-accent" />
          <span className="font-mono text-[11px] text-text-main font-medium">
            {branch || 'detecting...'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={pull}
            className="p-1 rounded hover:bg-bg-hover text-text-subtle hover:text-text-main transition-colors"
            title="Pull"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={push}
            className="p-1 rounded hover:bg-bg-hover text-text-subtle hover:text-text-main transition-colors"
            title="Push"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={refresh}
            className={`p-1 rounded hover:bg-bg-hover text-text-subtle hover:text-text-main transition-colors ${isLoading ? 'animate-spin' : ''}`}
            title="Refresh"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Error banner */}
      {lastError && (
        <div className="mx-2 mt-2 p-2 rounded bg-red-500/10 border border-red-500/20 flex items-start gap-1.5">
          <AlertCircle className="w-3 h-3 text-red-400 shrink-0 mt-0.5" />
          <span className="text-[10px] text-red-400 font-mono leading-relaxed">{lastError}</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {/* Staged changes */}
        {staged.length > 0 && (
          <div>
            <div className="px-3 py-1.5 flex items-center justify-between">
              <span className="text-[10px] font-medium text-text-subtle uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Staged ({staged.length})
              </span>
              <button
                type="button"
                onClick={() => staged.forEach((f) => unstageFile(f.path))}
                className="text-[10px] text-text-subtle hover:text-text-main transition-colors"
              >
                Unstage all
              </button>
            </div>
            {staged.map((f) => <FileRow key={f.path} file={f} showStage={false} />)}
          </div>
        )}

        {/* Unstaged changes */}
        {unstaged.length > 0 && (
          <div>
            <div className="px-3 py-1.5 flex items-center justify-between">
              <span className="text-[10px] font-medium text-text-subtle uppercase tracking-wider">
                Changes ({unstaged.length})
              </span>
              <button
                type="button"
                onClick={stageAll}
                className="text-[10px] text-accent hover:text-accent/80 transition-colors"
              >
                Stage all +
              </button>
            </div>
            {unstaged.map((f) => <FileRow key={f.path} file={f} showStage={true} />)}
          </div>
        )}

        {modifiedFiles.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 opacity-60" />
            <span className="text-[11px] text-text-subtle">Working tree clean</span>
          </div>
        )}
      </div>

      {/* Commit box */}
      <div className="p-2 border-t border-border-subtle shrink-0 flex flex-col gap-1.5">
        <textarea
          value={commitMessage}
          onChange={(e) => setCommitMessage(e.target.value)}
          placeholder="Commit message..."
          rows={2}
          className="w-full bg-bg-surface border border-border-subtle rounded px-2 py-1.5 text-[11px] text-text-main placeholder:text-text-subtle outline-none focus:border-accent resize-none font-mono"
        />
        <button
          type="button"
          onClick={handleCommit}
          disabled={!commitMessage.trim() || commitLoading || staged.length === 0}
          className="flex items-center justify-center gap-1.5 py-1.5 rounded bg-accent text-white text-[11px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent/90 transition-colors"
        >
          <GitCommit className="w-3.5 h-3.5" />
          {commitLoading ? 'Committing...' : `Commit (${staged.length} files)`}
        </button>
      </div>
    </div>
  );
};
