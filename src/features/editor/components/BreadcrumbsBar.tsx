import React from 'react';
import { ChevronRight, Folder, Play } from 'lucide-react';
import { useEditorStore } from '../stores/editorStore';
import { useWorkspaceStore } from '../../workspace/stores/workspaceStore';
import { useLayoutStore } from '../../../stores/layoutStore';
import { useTerminalStore } from '../../terminal/stores/terminalStore';
import { FileIcon } from '../../../components/ui/FileIcon';

export const BreadcrumbsBar: React.FC<{ tabId?: string }> = ({ tabId }) => {
  const { getActiveTab, getSecondaryTab } = useEditorStore();
  const { selectNode, toggleNodeExpanded } = useWorkspaceStore();
  const { setActiveView } = useLayoutStore();
  const { runCodeFile } = useTerminalStore();

  const activeTab = tabId ? (tabId === 'secondary' ? getSecondaryTab() : getActiveTab()) : getActiveTab();

  if (!activeTab || !activeTab.filePath) return null;

  const rawPath = activeTab.filePath;
  const startsWithSlash = rawPath.startsWith('/');
  const parts = rawPath.split('/').filter(Boolean);

  const handleSegmentClick = (index: number) => {
    const segmentPath = (startsWithSlash ? '/' : '') + parts.slice(0, index + 1).join('/');
    selectNode(segmentPath);
    toggleNodeExpanded(segmentPath);
    setActiveView('explorer');
  };

  const handleRunFile = () => {
    if (!activeTab || !activeTab.filePath) return;

    const ext = activeTab.fileName.split('.').pop()?.toLowerCase();
    let cmd = `node "${activeTab.filePath}"`;

    if (ext === 'py') {
      cmd = `python3 "${activeTab.filePath}"`;
    } else if (ext === 'ts' || ext === 'tsx') {
      cmd = `npx tsx "${activeTab.filePath}"`;
    } else if (ext === 'rs') {
      cmd = `cargo run`;
    } else if (ext === 'go') {
      cmd = `go run "${activeTab.filePath}"`;
    } else if (ext === 'sh' || ext === 'bash') {
      cmd = `bash "${activeTab.filePath}"`;
    }

    runCodeFile(cmd);
  };

  return (
    <div className="h-6 bg-bg-surface border-b border-border-subtle flex items-center justify-between px-3 text-[11px] text-text-subtle select-none shrink-0">
      <div className="flex items-center gap-1 overflow-x-auto">
        {parts.map((part, index) => {
          const isLast = index === parts.length - 1;
          return (
            <React.Fragment key={`${part}-${index}`}>
              {index > 0 && <ChevronRight className="w-3 h-3 text-text-subtle/60 shrink-0" />}
              <button
                type="button"
                onClick={() => handleSegmentClick(index)}
                className="flex items-center gap-1 hover:text-text-main cursor-pointer transition-colors shrink-0 outline-none"
                title={`Jump to ${part} in Explorer`}
              >
                {isLast ? (
                  <FileIcon fileName={part} className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <Folder className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
                )}
                <span className={isLast ? 'text-text-main font-medium' : ''}>{part}</span>
              </button>
            </React.Fragment>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleRunFile}
        className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors font-semibold cursor-pointer shrink-0"
        title={`Run ${activeTab.fileName} in Terminal`}
      >
        <Play className="w-3 h-3 fill-emerald-400" />
        <span>Run Code</span>
      </button>
    </div>
  );
};
