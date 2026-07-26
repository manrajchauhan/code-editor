import React from 'react';
import { ChevronRight, Folder } from 'lucide-react';
import { useEditorStore } from '../stores/editorStore';
import { useWorkspaceStore } from '../../workspace/stores/workspaceStore';
import { useLayoutStore } from '../../../stores/layoutStore';
import { FileIcon } from '../../../components/ui/FileIcon';

export const BreadcrumbsBar: React.FC<{ tabId?: string }> = ({ tabId }) => {
  const { getActiveTab, getSecondaryTab } = useEditorStore();
  const { selectNode, toggleNodeExpanded } = useWorkspaceStore();
  const { setActiveView } = useLayoutStore();

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

  return (
    <div className="h-6 bg-bg-surface border-b border-border-subtle flex items-center px-3 gap-1 text-[11px] text-text-subtle select-none overflow-x-auto shrink-0">
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
  );
};
