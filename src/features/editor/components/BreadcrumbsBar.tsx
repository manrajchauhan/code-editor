import React from 'react';
import { ChevronRight, FileCode, Folder } from 'lucide-react';
import { useEditorStore } from '../stores/editorStore';

export const BreadcrumbsBar: React.FC<{ tabId?: string }> = ({ tabId }) => {
  const { getActiveTab, getSecondaryTab } = useEditorStore();
  const activeTab = tabId ? (tabId === 'secondary' ? getSecondaryTab() : getActiveTab()) : getActiveTab();

  if (!activeTab || !activeTab.filePath) return null;

  const parts = activeTab.filePath.split('/').filter(Boolean);

  return (
    <div className="h-6 bg-bg-surface border-b border-border-subtle flex items-center px-3 gap-1 text-[11px] text-text-subtle select-none overflow-x-auto shrink-0">
      {parts.map((part, index) => {
        const isLast = index === parts.length - 1;
        return (
          <React.Fragment key={`${part}-${index}`}>
            {index > 0 && <ChevronRight className="w-3 h-3 text-text-subtle/60 shrink-0" />}
            <div className="flex items-center gap-1 hover:text-text-main cursor-pointer transition-colors shrink-0">
              {isLast ? (
                <FileCode className="w-3.5 h-3.5 text-accent shrink-0" />
              ) : (
                <Folder className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
              )}
              <span className={isLast ? 'text-text-main font-medium' : ''}>{part}</span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
