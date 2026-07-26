import type * as monacoType from 'monaco-editor';

let registered = false;

export function registerSnippets(monaco: typeof monacoType) {
  if (registered) return;
  registered = true;

  const jsTsLanguages = ['javascript', 'typescript', 'javascriptreact', 'typescriptreact'];

  jsTsLanguages.forEach((lang) => {
    monaco.languages.registerCompletionItemProvider(lang, {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const suggestions: monacoType.languages.CompletionItem[] = [
          // 1. Standard For Loop (fori)
          {
            label: 'fori',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: [
              'for (let ${1:i} = 0; ${1:i} < ${2:10}; ${1:i}++) {',
              '\tconsole.log("Hello", ${1:i});',
              '\t$0',
              '}',
            ].join('\n'),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Standard indexed for-loop snippet (for let i = 0; i < N; i++)',
            detail: 'For Loop (Indexed)',
            range,
          },
          // 2. For...of Loop (forof)
          {
            label: 'forof',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: [
              'for (const ${1:item} of ${2:iterable}) {',
              '\t$0',
              '}',
            ].join('\n'),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'For...of loop over arrays or iterables',
            detail: 'For...of Loop',
            range,
          },
          // 3. For...in Loop (forin)
          {
            label: 'forin',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: [
              'for (const ${1:key} in ${2:object}) {',
              '\tif (Object.prototype.hasOwnProperty.call(${2:object}, ${1:key})) {',
              '\t\tconst ${3:value} = ${2:object}[${1:key}];',
              '\t\t$0',
              '\t}',
              '}',
            ].join('\n'),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'For...in loop over object keys',
            detail: 'For...in Loop',
            range,
          },
          // 4. Console Log (clg / log)
          {
            label: 'clg',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'console.log("${1:Hello}", $2);',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Output message to terminal console',
            detail: 'console.log(...)',
            range,
          },
          {
            label: 'log',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'console.log($1);',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Output variable to console',
            detail: 'console.log()',
            range,
          },
          // 5. Try Catch (trycatch)
          {
            label: 'trycatch',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: [
              'try {',
              '\t$1',
              '} catch (${2:error}) {',
              '\tconsole.error(${2:error});',
              '}',
            ].join('\n'),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Try...Catch block for error handling',
            detail: 'Try Catch Block',
            range,
          },
          // 6. Arrow Function (afunc / fn)
          {
            label: 'afunc',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'const ${1:funcName} = (${2:params}) => {\n\t$0\n};',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Declare ES6 Arrow Function',
            detail: 'const fn = () => {}',
            range,
          },
          // 7. React useState Hook (usestate)
          {
            label: 'usestate',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'const [${1:state}, set${1/(.*)/${1:/capitalize}/}] = useState(${2:initialState});',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Declare React useState Hook',
            detail: 'React useState',
            range,
          },
          // 8. React useEffect Hook (useeffect)
          {
            label: 'useeffect',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'useEffect(() => {\n\t$1\n}, [${2:deps}]);',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Declare React useEffect Hook',
            detail: 'React useEffect',
            range,
          },
          // 9. React Component (rfc)
          {
            label: 'rfc',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: [
              'import React from \'react\';',
              '',
              'export const ${1:ComponentName}: React.FC = () => {',
              '\treturn (',
              '\t\t<div className="${2:container}">',
              '\t\t\t$0',
              '\t\t</div>',
              '\t);',
              '};',
            ].join('\n'),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Create React Functional Component template',
            detail: 'React FC Template',
            range,
          },
        ];

        return { suggestions };
      },
    });
  });

  // Python Snippets
  monaco.languages.registerCompletionItemProvider('python', {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const suggestions: monacoType.languages.CompletionItem[] = [
        {
          label: 'fori',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'for ${1:i} in range(${2:10}):\n\tprint(f"Index: {${1:i}}")\n\t$0\n',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Python For Loop over range(N)',
          detail: 'for i in range(10)',
          range,
        },
        {
          label: 'def',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'def ${1:func_name}(${2:params}):\n\t"""${3:Docstring}"""\n\t$0\n',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Define Python function',
          detail: 'def func():',
          range,
        },
      ];

      return { suggestions };
    },
  });
}
