import React, { useState } from 'react';
import { Package, ToggleLeft, ToggleRight, Star, ExternalLink } from 'lucide-react';

interface Extension {
  id: string;
  name: string;
  description: string;
  author: string;
  version: string;
  icon: string;
  builtIn: boolean;
  enabled: boolean;
}

const BUILT_IN_EXTENSIONS: Extension[] = [
  {
    id: 'code-visualizer',
    name: 'Code Visualizer',
    description: 'Step-by-step logic and memory visualizer for your active code.',
    author: 'Built-in',
    version: '1.0.0',
    icon: '◈',
    builtIn: true,
    enabled: true,
  },
  {
    id: 'snippet-manager',
    name: 'Snippet Manager',
    description: 'Manage and insert custom code snippets via Monaco completions.',
    author: 'Built-in',
    version: '1.0.0',
    icon: '⌸',
    builtIn: true,
    enabled: true,
  },
  {
    id: 'git-integration',
    name: 'Git Integration',
    description: 'Stage, commit, pull and push without leaving the editor.',
    author: 'Built-in',
    version: '1.0.0',
    icon: '⎇',
    builtIn: true,
    enabled: true,
  },
  {
    id: 'run-code',
    name: 'Run & Execute',
    description: 'Run JS, TS, Python and more from the editor toolbar.',
    author: 'Built-in',
    version: '1.0.0',
    icon: '▷',
    builtIn: true,
    enabled: true,
  },
];

const MARKETPLACE_COMING: Array<{ name: string; description: string; stars: number }> = [
  { name: 'Prettier Format', description: 'Auto-format code with Prettier on save.', stars: 4200 },
  { name: 'ESLint', description: 'Lint JS/TS files with ESLint rules.', stars: 3800 },
  { name: 'Theme Pack', description: 'One Click, Catppuccin, GitHub Dark, and Dracula themes.', stars: 2900 },
  { name: 'Markdown Preview', description: 'Live side-by-side markdown preview pane.', stars: 1700 },
];

const STORAGE_KEY = 'editor_extensions_enabled';

function loadEnabled(): Record<string, boolean> {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : {};
  } catch { return {}; }
}

export const ExtensionsPane: React.FC = () => {
  const [enabledMap, setEnabledMap] = useState<Record<string, boolean>>(loadEnabled);
  const [tab, setTab] = useState<'installed' | 'marketplace'>('installed');

  const isEnabled = (id: string) =>
    enabledMap[id] !== undefined ? enabledMap[id] : true;

  const toggleExt = (id: string) => {
    const next = { ...enabledMap, [id]: !isEnabled(id) };
    setEnabledMap(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  };

  return (
    <div className="flex flex-col h-full text-xs select-none">
      {/* Header */}
      <div className="px-3 py-2 border-b border-border-subtle flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5">
          <Package className="w-3.5 h-3.5 text-accent" />
          <span className="text-[10px] font-medium text-text-subtle uppercase tracking-wider">Extensions</span>
        </div>
        <div className="flex gap-1">
          {(['installed', 'marketplace'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider transition-colors ${
                tab === t ? 'bg-accent text-white' : 'text-text-subtle hover:text-text-main hover:bg-bg-hover'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {tab === 'installed' ? (
          <div className="flex flex-col">
            <div className="px-3 py-1.5 text-[10px] text-text-subtle uppercase tracking-wider">
              Built-in ({BUILT_IN_EXTENSIONS.length})
            </div>
            {BUILT_IN_EXTENSIONS.map((ext) => {
              const enabled = isEnabled(ext.id);
              return (
                <div
                  key={ext.id}
                  className="px-3 py-2.5 border-b border-border-subtle/50 flex items-start gap-2.5 hover:bg-bg-hover/50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-sm shrink-0">
                    {ext.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-text-main">{ext.name}</span>
                      <span className="text-[9px] text-text-subtle">v{ext.version}</span>
                    </div>
                    <p className="text-[10px] text-text-muted leading-relaxed">{ext.description}</p>
                    <span className="text-[9px] text-text-subtle">{ext.author}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleExt(ext.id)}
                    title={enabled ? 'Disable' : 'Enable'}
                    className="mt-0.5 shrink-0"
                  >
                    {enabled
                      ? <ToggleRight className="w-5 h-5 text-accent" />
                      : <ToggleLeft className="w-5 h-5 text-text-subtle" />
                    }
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="px-3 py-3 flex flex-col items-center gap-2 border-b border-border-subtle text-center">
              <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Package className="w-4 h-4 text-accent" />
              </div>
              <p className="text-[11px] text-text-muted">
                Marketplace is coming soon. Here's a preview of planned extensions:
              </p>
            </div>
            {MARKETPLACE_COMING.map((ext) => (
              <div
                key={ext.name}
                className="px-3 py-2.5 border-b border-border-subtle/50 flex items-start gap-2.5 opacity-60"
              >
                <div className="w-7 h-7 rounded-lg bg-bg-hover border border-border-subtle flex items-center justify-center shrink-0">
                  <Package className="w-3.5 h-3.5 text-text-subtle" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-text-main">{ext.name}</span>
                    <span className="flex items-center gap-0.5 text-[9px] text-amber-400">
                      <Star className="w-2.5 h-2.5" />{ext.stars.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[10px] text-text-muted leading-relaxed">{ext.description}</p>
                </div>
                <ExternalLink className="w-3 h-3 text-text-subtle mt-0.5 shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
