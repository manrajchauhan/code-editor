import React, { useState, useCallback, useRef } from 'react';
import { Search as SearchIcon, Replace, CaseSensitive, Regex, ChevronRight, ChevronDown, FileText } from 'lucide-react';
import { useWorkspaceStore } from '../../workspace/stores/workspaceStore';
import { useEditorStore } from '../../editor/stores/editorStore';
import { FileNode } from '../../workspace/types/workspace.types';
import { detectLanguage } from '../../editor/utils/languageDetector';
import { readFileText } from '../../../services/fileSystemService';

interface LineMatch {
  lineNumber: number;
  lineText: string;
  matchStart: number;
  matchEnd: number;
}

interface FileMatch {
  file: FileNode;
  matches: LineMatch[];
}

export const WorkspaceSearchPane: React.FC = () => {
  const [query, setQuery] = useState('');
  const [replaceStr, setReplaceStr] = useState('');
  const [showReplace, setShowReplace] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [results, setResults] = useState<FileMatch[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const { rootNode } = useWorkspaceStore();
  const { openTab, updateTabContent } = useEditorStore();

  function collectFiles(node: FileNode | null): FileNode[] {
    if (!node) return [];
    if (!node.isDirectory) return [node];
    return (node.children || []).flatMap(collectFiles);
  }

  const searchContent = useCallback(async (searchStr: string) => {
    if (!searchStr.trim() || !rootNode) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    const files = collectFiles(rootNode).filter((f) => {
      const ext = f.name.split('.').pop()?.toLowerCase() || '';
      return ['js', 'ts', 'tsx', 'jsx', 'py', 'css', 'html', 'json', 'md', 'txt', 'rs', 'go', 'java', 'cpp', 'c', 'sh'].includes(ext);
    });

    let pattern: RegExp;
    try {
      pattern = useRegex
        ? new RegExp(searchStr, caseSensitive ? 'g' : 'gi')
        : new RegExp(searchStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), caseSensitive ? 'g' : 'gi');
    } catch {
      setIsSearching(false);
      return;
    }

    const fileMatches: FileMatch[] = [];
    for (const file of files.slice(0, 500)) {
      try {
        const content = await readFileText(file.path);
        const lines = content.split('\n');
        const matches: LineMatch[] = [];
        lines.forEach((line, i) => {
          pattern.lastIndex = 0;
          const m = pattern.exec(line);
          if (m) {
            matches.push({
              lineNumber: i + 1,
              lineText: line.trim().slice(0, 120),
              matchStart: m.index,
              matchEnd: m.index + m[0].length,
            });
          }
        });
        if (matches.length > 0) {
          fileMatches.push({ file, matches });
          setExpanded((p) => ({ ...p, [file.id]: p[file.id] ?? true }));
        }
      } catch { /* skip unreadable files */ }
    }
    setResults(fileMatches);
    setIsSearching(false);
  }, [rootNode, caseSensitive, useRegex]);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchContent(val), 350);
  };

  const handleOpenAt = async (file: FileNode, line: number) => {
    const content = await readFileText(file.path);
    openTab({
      id: file.path,
      filePath: file.path,
      fileName: file.name,
      content,
      language: detectLanguage(file.name),
    });
    // Brief delay for Monaco to mount then scroll
    setTimeout(() => {
      const editors = (window as any).__monaco_editors__ as any[];
      if (editors?.[0]) {
        editors[0].revealLineInCenter(line);
        editors[0].setPosition({ lineNumber: line, column: 1 });
      }
    }, 300);
  };

  const handleGlobalReplace = async () => {
    if (!query.trim()) return;
    for (const { file, matches } of results) {
      if (matches.length === 0) continue;
      const content = await readFileText(file.path);
      const updated = caseSensitive
        ? content.split(query).join(replaceStr)
        : content.replace(new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), replaceStr);
      updateTabContent(file.path, updated);
    }
  };

  const totalMatches = results.reduce((s, r) => s + r.matches.length, 0);

  return (
    <div className="flex flex-col gap-2 text-xs p-1 select-none h-full">
      {/* Search input */}
      <div className="flex flex-col gap-1.5">
        <div className="relative flex items-center">
          <SearchIcon className="w-3.5 h-3.5 text-text-subtle absolute left-2.5 top-2.5 pointer-events-none" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search in files..."
            className="w-full bg-bg-surface border border-border-subtle rounded pl-8 pr-16 py-1.5 text-text-main placeholder:text-text-subtle outline-none focus:border-accent text-[11px]"
          />
          <div className="absolute right-7 flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => setCaseSensitive(!caseSensitive)}
              className={`p-0.5 rounded transition-colors ${caseSensitive ? 'text-accent bg-accent/15' : 'text-text-subtle hover:text-text-main'}`}
              title="Case Sensitive"
            >
              <CaseSensitive className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => setUseRegex(!useRegex)}
              className={`p-0.5 rounded transition-colors ${useRegex ? 'text-accent bg-accent/15' : 'text-text-subtle hover:text-text-main'}`}
              title="Use Regex"
            >
              <Regex className="w-3 h-3" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => setShowReplace(!showReplace)}
            className={`absolute right-1 p-1 rounded transition-colors ${showReplace ? 'text-accent bg-bg-hover' : 'text-text-subtle hover:text-text-main'}`}
            title="Toggle Replace"
          >
            <Replace className="w-3.5 h-3.5" />
          </button>
        </div>

        {showReplace && (
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={replaceStr}
              onChange={(e) => setReplaceStr(e.target.value)}
              placeholder="Replace with..."
              className="flex-1 bg-bg-surface border border-border-subtle rounded px-2.5 py-1 text-text-main placeholder:text-text-subtle outline-none focus:border-accent text-[11px]"
            />
            <button
              type="button"
              onClick={handleGlobalReplace}
              className="px-2 py-1 bg-accent hover:bg-accent-hover text-white rounded text-[10px] font-medium shrink-0 transition-colors"
            >
              Replace all
            </button>
          </div>
        )}

        {/* Results summary */}
        {query.trim() !== '' && (
          <div className="text-[10px] text-text-subtle px-0.5">
            {isSearching
              ? 'Searching...'
              : results.length === 0
                ? `No results for "${query}"`
                : `${totalMatches} match${totalMatches !== 1 ? 'es' : ''} in ${results.length} file${results.length !== 1 ? 's' : ''}`
            }
          </div>
        )}
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-0.5">
        {query.trim() === '' ? (
          <p className="text-[11px] text-text-subtle text-center py-6">Type to search across all workspace files.</p>
        ) : (
          results.map(({ file, matches }) => (
            <div key={file.id} className="flex flex-col">
              {/* File header */}
              <button
                type="button"
                onClick={() => setExpanded((p) => ({ ...p, [file.id]: !p[file.id] }))}
                className="flex items-center gap-1.5 px-1.5 py-1 hover:bg-bg-hover rounded transition-colors text-left"
              >
                {expanded[file.id] ? <ChevronDown className="w-3 h-3 text-text-subtle shrink-0" /> : <ChevronRight className="w-3 h-3 text-text-subtle shrink-0" />}
                <FileText className="w-3 h-3 text-accent shrink-0" />
                <span className="font-medium text-text-main text-[11px] truncate">{file.name}</span>
                <span className="ml-auto text-[9px] text-text-subtle shrink-0 font-mono">{matches.length}</span>
              </button>

              {/* Line matches */}
              {expanded[file.id] && matches.map((m) => (
                <button
                  key={`${file.id}-${m.lineNumber}`}
                  type="button"
                  onClick={() => handleOpenAt(file, m.lineNumber)}
                  className="flex items-start gap-2 pl-7 pr-2 py-0.5 hover:bg-bg-hover rounded text-left transition-colors group"
                >
                  <span className="font-mono text-[10px] text-text-subtle w-6 shrink-0 text-right group-hover:text-accent">
                    {m.lineNumber}
                  </span>
                  <span className="font-mono text-[10px] text-text-muted truncate">
                    {m.lineText}
                  </span>
                </button>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
