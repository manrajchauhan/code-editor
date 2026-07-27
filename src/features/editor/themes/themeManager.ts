import type * as monacoType from 'monaco-editor';

let themesRegistered = false;

export function registerMonacoThemes(monaco: typeof monacoType) {
  if (themesRegistered) return;
  themesRegistered = true;

  // 1. Tokyo Night Theme
  monaco.editor.defineTheme('tokyo-night', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: '', foreground: 'a9b1d6', background: '0d0e11' },
      { token: 'comment', foreground: '565f89', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'bb9af7', fontStyle: 'bold' },
      { token: 'keyword.control', foreground: 'bb9af7' },
      { token: 'string', foreground: '9ece6a' },
      { token: 'string.escape', foreground: 'bb9af7' },
      { token: 'number', foreground: 'ff9e64' },
      { token: 'type', foreground: '7dcfff' },
      { token: 'type.identifier', foreground: '7dcfff' },
      { token: 'class', foreground: '7dcfff' },
      { token: 'function', foreground: '7aa2f7' },
      { token: 'variable', foreground: 'c0caf5' },
      { token: 'variable.parameter', foreground: 'e0af68' },
      // JSX / TSX Token Colors
      { token: 'tag', foreground: '7dcfff' },
      { token: 'tag.component', foreground: 'bb9af7', fontStyle: 'bold' },
      { token: 'tag.id', foreground: '7aa2f7' },
      { token: 'attribute.name', foreground: 'e0af68' },
      { token: 'attribute.value', foreground: '9ece6a' },
      { token: 'delimiter', foreground: '89ddff' },
      { token: 'delimiter.html', foreground: '89ddff' },
      { token: 'delimiter.xml', foreground: '89ddff' },
    ],
    colors: {
      'editor.background': '#0d0e11',
      'editor.foreground': '#a9b1d6',
      'editor.lineHighlightBackground': '#181b22',
      'editorCursor.foreground': '#7aa2f7',
      'editorIndentGuide.background': '#202430',
      'editorIndentGuide.activeBackground': '#3b4261',
      'editor.selectionBackground': '#2a2f3d',
    },
  });

  // 2. One Dark Pro Theme
  monaco.editor.defineTheme('one-dark-pro', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: '', foreground: 'abb2bf', background: '0d0e11' },
      { token: 'comment', foreground: '5c6370', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'c678dd', fontStyle: 'bold' },
      { token: 'string', foreground: '98c379' },
      { token: 'number', foreground: 'd19a66' },
      { token: 'type', foreground: 'e5c07b' },
      { token: 'function', foreground: '61afef' },
      { token: 'variable', foreground: 'abb2bf' },
      // JSX / TSX Token Colors
      { token: 'tag', foreground: 'e06c75' },
      { token: 'tag.component', foreground: 'e5c07b', fontStyle: 'bold' },
      { token: 'attribute.name', foreground: 'd19a66' },
      { token: 'attribute.value', foreground: '98c379' },
      { token: 'delimiter', foreground: 'abb2bf' },
    ],
    colors: {
      'editor.background': '#0d0e11',
      'editor.foreground': '#abb2bf',
      'editor.lineHighlightBackground': '#181b22',
      'editorCursor.foreground': '#528bff',
      'editor.selectionBackground': '#2a2f3d',
    },
  });

  // 3. Vitesse Dark Theme
  monaco.editor.defineTheme('vitesse-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: '', foreground: 'dbd7ca', background: '0d0e11' },
      { token: 'comment', foreground: '758575', fontStyle: 'italic' },
      { token: 'keyword', foreground: '4d9375', fontStyle: 'bold' },
      { token: 'string', foreground: 'c98a7d' },
      { token: 'number', foreground: 'bd976a' },
      { token: 'type', foreground: '5fa9f6' },
      { token: 'function', foreground: 'bd976a' },
      // JSX / TSX Token Colors
      { token: 'tag', foreground: '4d9375' },
      { token: 'tag.component', foreground: '5fa9f6', fontStyle: 'bold' },
      { token: 'attribute.name', foreground: 'cb7676' },
      { token: 'attribute.value', foreground: 'c98a7d' },
      { token: 'delimiter', foreground: '808080' },
    ],
    colors: {
      'editor.background': '#0d0e11',
      'editor.foreground': '#dbd7ca',
      'editor.lineHighlightBackground': '#181b22',
      'editorCursor.foreground': '#4d9375',
      'editor.selectionBackground': '#2a2f3d',
    },
  });
}
