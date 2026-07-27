const EXTENSION_MAP: Record<string, string> = {
  ts: 'typescript',
  tsx: 'typescriptreact',
  js: 'javascript',
  jsx: 'javascriptreact',
  json: 'json',
  html: 'html',
  htm: 'html',
  svg: 'html',
  css: 'css',
  scss: 'scss',
  sass: 'scss',
  less: 'less',
  md: 'markdown',
  markdown: 'markdown',
  rs: 'rust',
  py: 'python',
  go: 'go',
  c: 'c',
  cpp: 'cpp',
  cc: 'cpp',
  h: 'cpp',
  hpp: 'cpp',
  java: 'java',
  kt: 'kotlin',
  kts: 'kotlin',
  cs: 'csharp',
  swift: 'swift',
  rb: 'ruby',
  php: 'php',
  sh: 'shell',
  bash: 'shell',
  zsh: 'shell',
  yaml: 'yaml',
  yml: 'yaml',
  toml: 'ini',
  sql: 'sql',
  xml: 'xml',
  graphql: 'graphql',
  gql: 'graphql',
  dockerfile: 'dockerfile',
  vue: 'html',
  svelte: 'html',
};

export function detectLanguage(filename: string): string {
  if (!filename) return 'plaintext';
  const parts = filename.split('.');
  if (parts.length <= 1) {
    if (filename.toLowerCase() === 'dockerfile') return 'dockerfile';
    return 'plaintext';
  }
  const ext = parts[parts.length - 1].toLowerCase();
  return EXTENSION_MAP[ext] || 'plaintext';
}
