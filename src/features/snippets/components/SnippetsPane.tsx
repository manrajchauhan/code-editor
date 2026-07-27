import React, { useState } from 'react';
import { Puzzle, Plus, Trash2, Edit3, Check, X, ChevronDown, ChevronRight } from 'lucide-react';

interface Snippet {
  id: string;
  language: string;
  trigger: string;
  description: string;
  body: string;
}

const BUILT_IN_SNIPPETS: Snippet[] = [
  { id: 'fori-js', language: 'javascript/typescript', trigger: 'fori', description: 'Indexed for loop', body: 'for (let ${1:i} = 0; ${1:i} < ${2:10}; ${1:i}++) {\n\t$0\n}' },
  { id: 'forof-js', language: 'javascript/typescript', trigger: 'forof', description: 'For...of loop', body: 'for (const ${1:item} of ${2:iterable}) {\n\t$0\n}' },
  { id: 'clg-js', language: 'javascript/typescript', trigger: 'clg', description: 'console.log', body: 'console.log("${1:Hello}", $2);' },
  { id: 'trycatch-js', language: 'javascript/typescript', trigger: 'trycatch', description: 'Try/catch block', body: 'try {\n\t$1\n} catch (${2:error}) {\n\tconsole.error(${2:error});\n}' },
  { id: 'afunc-js', language: 'javascript/typescript', trigger: 'afunc', description: 'Arrow function', body: 'const ${1:fn} = (${2:params}) => {\n\t$0\n};' },
  { id: 'rfc-js', language: 'javascript/typescript', trigger: 'rfc', description: 'React FC component', body: 'export const ${1:Component}: React.FC = () => {\n\treturn (\n\t\t<div>$0</div>\n\t);\n};' },
  { id: 'usestate-js', language: 'javascript/typescript', trigger: 'usestate', description: 'React useState', body: 'const [${1:state}, set${1}] = useState(${2:null});' },
  { id: 'fori-py', language: 'python', trigger: 'fori', description: 'Python for loop', body: 'for ${1:i} in range(${2:10}):\n\t$0' },
  { id: 'def-py', language: 'python', trigger: 'def', description: 'Python function', body: 'def ${1:func}(${2:params}):\n\t"""${3:docstring}"""\n\t$0' },
];

const STORAGE_KEY = 'editor_custom_snippets';

function loadCustomSnippets(): Snippet[] {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : [];
  } catch { return []; }
}

function saveCustomSnippets(snippets: Snippet[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets)); } catch {}
}

export const SnippetsPane: React.FC = () => {
  const [customSnippets, setCustomSnippets] = useState<Snippet[]>(loadCustomSnippets);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ 'javascript/typescript': true });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Snippet>>({});
  const [showNewForm, setShowNewForm] = useState(false);
  const [newForm, setNewForm] = useState<Partial<Snippet>>({ language: 'javascript/typescript', trigger: '', description: '', body: '' });

  const allSnippets = [...BUILT_IN_SNIPPETS, ...customSnippets];
  const byLanguage = allSnippets.reduce<Record<string, Snippet[]>>((acc, s) => {
    acc[s.language] = acc[s.language] || [];
    acc[s.language].push(s);
    return acc;
  }, {});

  const deleteCustom = (id: string) => {
    const updated = customSnippets.filter((s) => s.id !== id);
    setCustomSnippets(updated);
    saveCustomSnippets(updated);
  };

  const saveEdit = () => {
    const updated = customSnippets.map((s) => s.id === editingId ? { ...s, ...editForm } : s);
    setCustomSnippets(updated);
    saveCustomSnippets(updated);
    setEditingId(null);
  };

  const addSnippet = () => {
    if (!newForm.trigger?.trim()) return;
    const s: Snippet = {
      id: `custom-${Date.now()}`,
      language: newForm.language || 'javascript/typescript',
      trigger: newForm.trigger || '',
      description: newForm.description || '',
      body: newForm.body || '',
    };
    const updated = [...customSnippets, s];
    setCustomSnippets(updated);
    saveCustomSnippets(updated);
    setShowNewForm(false);
    setNewForm({ language: 'javascript/typescript', trigger: '', description: '', body: '' });
  };

  return (
    <div className="flex flex-col h-full text-xs select-none">
      {/* Header */}
      <div className="px-3 py-2 border-b border-border-subtle flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5">
          <Puzzle className="w-3.5 h-3.5 text-accent" />
          <span className="text-[10px] font-medium text-text-subtle uppercase tracking-wider">Snippets</span>
        </div>
        <button
          type="button"
          onClick={() => setShowNewForm(true)}
          className="flex items-center gap-1 px-2 py-0.5 rounded bg-accent/15 text-accent text-[10px] hover:bg-accent/25 transition-colors"
        >
          <Plus className="w-3 h-3" /> New
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* New snippet form */}
        {showNewForm && (
          <div className="m-2 p-3 bg-bg-surface border border-border-strong rounded-lg flex flex-col gap-2">
            <span className="text-[10px] text-accent font-medium uppercase tracking-wider">New Snippet</span>
            {(['language', 'trigger', 'description'] as const).map((field) => (
              <input
                key={field}
                type="text"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={newForm[field] || ''}
                onChange={(e) => setNewForm((p) => ({ ...p, [field]: e.target.value }))}
                className="w-full bg-bg-main border border-border-subtle rounded px-2 py-1 text-text-main text-[11px] outline-none focus:border-accent placeholder:text-text-subtle font-mono"
              />
            ))}
            <textarea
              placeholder="Snippet body (use $1, $0 for tab stops)"
              value={newForm.body || ''}
              onChange={(e) => setNewForm((p) => ({ ...p, body: e.target.value }))}
              rows={3}
              className="w-full bg-bg-main border border-border-subtle rounded px-2 py-1 text-text-main text-[11px] outline-none focus:border-accent placeholder:text-text-subtle font-mono resize-none"
            />
            <div className="flex gap-2">
              <button type="button" onClick={addSnippet} className="flex-1 py-1 rounded bg-accent text-white text-[10px] font-semibold hover:bg-accent/90">
                <Check className="w-3 h-3 inline mr-1" />Add
              </button>
              <button type="button" onClick={() => setShowNewForm(false)} className="flex-1 py-1 rounded bg-bg-hover text-text-muted text-[10px] hover:text-text-main">
                <X className="w-3 h-3 inline mr-1" />Cancel
              </button>
            </div>
          </div>
        )}

        {/* Snippet groups */}
        {Object.entries(byLanguage).map(([lang, snippets]) => (
          <div key={lang}>
            <button
              type="button"
              onClick={() => setExpanded((p) => ({ ...p, [lang]: !p[lang] }))}
              className="w-full px-3 py-1.5 flex items-center gap-1.5 hover:bg-bg-hover text-text-subtle hover:text-text-main transition-colors"
            >
              {expanded[lang] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              <span className="text-[10px] uppercase tracking-wider font-medium">{lang}</span>
              <span className="ml-auto text-[9px] text-text-subtle">{snippets.length}</span>
            </button>
            {expanded[lang] && snippets.map((s) => (
              <div key={s.id} className="group px-3 py-1.5 hover:bg-bg-hover flex items-start justify-between gap-2 transition-colors">
                {editingId === s.id ? (
                  <div className="flex-1 flex flex-col gap-1">
                    <input
                      value={editForm.trigger || ''}
                      onChange={(e) => setEditForm((p) => ({ ...p, trigger: e.target.value }))}
                      className="bg-bg-main border border-border-subtle rounded px-2 py-0.5 text-[11px] text-text-main outline-none focus:border-accent font-mono w-full"
                    />
                    <input
                      value={editForm.description || ''}
                      onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                      className="bg-bg-main border border-border-subtle rounded px-2 py-0.5 text-[11px] text-text-main outline-none focus:border-accent font-mono w-full"
                    />
                    <div className="flex gap-1">
                      <button type="button" onClick={saveEdit} className="px-2 py-0.5 rounded bg-accent text-white text-[10px]">Save</button>
                      <button type="button" onClick={() => setEditingId(null)} className="px-2 py-0.5 rounded bg-bg-hover text-text-muted text-[10px]">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col min-w-0">
                      <span className="font-mono text-accent text-[11px] font-medium">{s.trigger}</span>
                      <span className="text-text-subtle text-[10px] truncate">{s.description}</span>
                    </div>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 shrink-0 transition-opacity">
                      {!BUILT_IN_SNIPPETS.find((b) => b.id === s.id) && (
                        <>
                          <button
                            type="button"
                            onClick={() => { setEditingId(s.id); setEditForm(s); }}
                            className="p-0.5 rounded hover:bg-bg-active text-text-subtle hover:text-text-main"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteCustom(s.id)}
                            className="p-0.5 rounded hover:bg-bg-active text-text-subtle hover:text-red-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
