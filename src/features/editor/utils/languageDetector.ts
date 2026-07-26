const EXTENSION_MAP: Record<string, string> = {
  ts: 'typescript',
  tsx: 'typescript',
  js: 'javascript',
  jsx: 'javascript',
  json: 'json',
  html: 'html',
  htm: 'html',
  css: 'css',
  scss: 'scss',
  less: 'less',
  md: 'markdown',
  markdown: 'markdown',
  rs: 'rust',
  py: 'python',
  go: 'go',
  sh: 'shell',
  bash: 'shell',
  yaml: 'yaml',
  yml: 'yaml',
  sql: 'sql',
  xml: 'xml',
  c: 'c',
  cpp: 'cpp',
  h: 'cpp',
};

export function detectLanguage(filename: string): string {
  if (!filename) return 'plaintext';
  const parts = filename.split('.');
  if (parts.length <= 1) return 'plaintext';
  const ext = parts[parts.length - 1].toLowerCase();
  return EXTENSION_MAP[ext] || 'plaintext';
}
