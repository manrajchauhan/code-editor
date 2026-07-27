import type * as monacoType from 'monaco-editor';

let registered = false;

// ─── Helper ─────────────────────────────────────────────────────────────────
function makeSnippet(
  monaco: typeof monacoType,
  label: string,
  insertText: string | string[],
  detail: string,
  documentation: string,
  range: monacoType.IRange
): monacoType.languages.CompletionItem {
  return {
    label,
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: Array.isArray(insertText) ? insertText.join('\n') : insertText,
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation,
    detail,
    range,
  };
}

export function registerSnippets(monaco: typeof monacoType) {
  if (registered) return;
  registered = true;

  const jsTsLanguages = ['javascript', 'typescript', 'javascriptreact', 'typescriptreact'];

  // ─── JS / TS / JSX / TSX Snippets ─────────────────────────────────────────
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
        const s = (label: string, body: string | string[], detail: string, doc: string) =>
          makeSnippet(monaco, label, body, detail, doc, range);

        const suggestions: monacoType.languages.CompletionItem[] = [
          // ── Loops ─────────────────────────────────────────────────────────
          s('fori', [
            'for (let ${1:i} = 0; ${1:i} < ${2:arr}.length; ${1:i}++) {',
            '\tconst ${3:item} = ${2:arr}[${1:i}];',
            '\t$0',
            '}',
          ], 'For Loop (Indexed)', 'Indexed for loop over array'),

          s('forof', [
            'for (const ${1:item} of ${2:iterable}) {',
            '\t$0',
            '}',
          ], 'For...of Loop', 'Iterate over iterable values'),

          s('forin', [
            'for (const ${1:key} in ${2:object}) {',
            '\tif (Object.prototype.hasOwnProperty.call(${2:object}, ${1:key})) {',
            '\t\tconst ${3:value} = ${2:object}[${1:key}];',
            '\t\t$0',
            '\t}',
            '}',
          ], 'For...in Loop', 'Iterate over object keys'),

          s('while', [
            'while (${1:condition}) {',
            '\t$0',
            '}',
          ], 'While Loop', 'While loop'),

          s('dowhile', [
            'do {',
            '\t$0',
            '} while (${1:condition});',
          ], 'Do...While Loop', 'Do while loop'),

          // ── Functions ─────────────────────────────────────────────────────
          s('fn', 'function ${1:name}(${2:params}) {\n\t$0\n}', 'Function Declaration', 'Named function declaration'),
          s('afn', 'const ${1:name} = (${2:params}) => {\n\t$0\n};', 'Arrow Function', 'Arrow function expression'),
          s('afunc', 'const ${1:funcName} = (${2:params}) => {\n\t$0\n};', 'Arrow Function', 'Arrow function expression'),
          s('iife', '(() => {\n\t$0\n})();', 'IIFE', 'Immediately invoked function expression'),
          s('async', 'const ${1:name} = async (${2:params}) => {\n\ttry {\n\t\t$0\n\t} catch (error) {\n\t\tconsole.error(error);\n\t}\n};', 'Async Arrow Function', 'Async arrow function with try/catch'),
          s('asyncfn', [
            'async function ${1:name}(${2:params}) {',
            '\ttry {',
            '\t\t$0',
            '\t} catch (${3:error}) {',
            '\t\tconsole.error(${3:error});',
            '\t}',
            '}',
          ], 'Async Function', 'Async function with try/catch'),
          s('promise', [
            'new Promise<${1:void}>((resolve, reject) => {',
            '\t$0',
            '});',
          ], 'New Promise', 'Create a new Promise'),

          // ── Console ───────────────────────────────────────────────────────
          s('cl', 'console.log($1);', 'console.log', 'console.log()'),
          s('clg', 'console.log("${1:label}:", $2);', 'console.log label', 'console.log with label'),
          s('log', 'console.log($1);', 'console.log', 'console.log()'),
          s('cle', 'console.error($1);', 'console.error', 'console.error()'),
          s('clw', 'console.warn($1);', 'console.warn', 'console.warn()'),
          s('clt', 'console.table($1);', 'console.table', 'console.table()'),
          s('cld', 'console.dir($1);', 'console.dir', 'console.dir()'),
          s('clc', 'console.count("${1:label}");', 'console.count', 'console.count()'),
          s('cltm', 'console.time("${1:label}");\n$0\nconsole.timeEnd("${1:label}");', 'console.time', 'Measure execution time'),

          // ── Error Handling ────────────────────────────────────────────────
          s('try', [
            'try {',
            '\t$1',
            '} catch (${2:error}) {',
            '\tconsole.error(${2:error});',
            '}',
          ], 'Try/Catch', 'Try catch block'),
          s('trycatch', [
            'try {',
            '\t$1',
            '} catch (${2:error}) {',
            '\tconsole.error(${2:error});',
            '} finally {',
            '\t$3',
            '}',
          ], 'Try/Catch/Finally', 'Try catch finally block'),

          // ── Variables ─────────────────────────────────────────────────────
          s('cv', 'const ${1:name} = ${2:value};', 'const', 'Declare const'),
          s('lv', 'let ${1:name} = ${2:value};', 'let', 'Declare let'),
          s('dst', 'const { ${1:prop} } = ${2:object};', 'Destructure Object', 'Object destructuring'),
          s('dsta', 'const [${1:first}, ${2:second}] = ${3:array};', 'Destructure Array', 'Array destructuring'),
          s('spread', 'const ${1:copy} = { ...${2:original}, ${3:newProp}: ${4:value} };', 'Spread Object', 'Spread operator'),
          s('spreada', 'const ${1:copy} = [...${2:original}, ${3:newItem}];', 'Spread Array', 'Array spread'),
          s('nv', 'const ${1:name} = ${2:condition} ?? ${3:fallback};', 'Nullish Coalesce', 'Nullish coalescing operator'),
          s('opt', '${1:obj}?.${2:prop}', 'Optional Chain', 'Optional chaining'),

          // ── Classes ───────────────────────────────────────────────────────
          s('cls', [
            'class ${1:ClassName} {',
            '\tconstructor(${2:params}) {',
            '\t\t$0',
            '\t}',
            '}',
          ], 'Class', 'ES6 class declaration'),
          s('clse', [
            'class ${1:ClassName} extends ${2:BaseClass} {',
            '\tconstructor(${3:params}) {',
            '\t\tsuper(${4:args});',
            '\t\t$0',
            '\t}',
            '}',
          ], 'Class extends', 'Class with inheritance'),

          // ── Modules ───────────────────────────────────────────────────────
          s('imp', "import ${1:name} from '${2:module}';", 'Import default', 'Default import'),
          s('imn', "import '${1:module}';", 'Import side-effect', 'Side-effect import'),
          s('imd', "import { ${1:names} } from '${2:module}';", 'Import named', 'Named imports'),
          s('ima', "import * as ${1:alias} from '${2:module}';", 'Import all', 'Namespace import'),
          s('exp', 'export default ${1:name};', 'Export default', 'Default export'),
          s('exn', 'export { ${1:name} };', 'Export named', 'Named export'),
          s('exd', 'export const ${1:name} = ${2:value};', 'Export const', 'Inline named export'),

          // ── Array methods ─────────────────────────────────────────────────
          s('map', '${1:arr}.map((${2:item}) => $0)', 'Array.map', 'Map over array'),
          s('filter', '${1:arr}.filter((${2:item}) => $0)', 'Array.filter', 'Filter array'),
          s('reduce', '${1:arr}.reduce((${2:acc}, ${3:cur}) => {\n\t$0\n\treturn ${2:acc};\n}, ${4:initialValue})', 'Array.reduce', 'Reduce array'),
          s('find', '${1:arr}.find((${2:item}) => $0)', 'Array.find', 'Find in array'),
          s('some', '${1:arr}.some((${2:item}) => $0)', 'Array.some', 'Some in array'),
          s('every', '${1:arr}.every((${2:item}) => $0)', 'Array.every', 'Every in array'),
          s('flat', '${1:arr}.flat(${2:Infinity})', 'Array.flat', 'Flatten array'),
          s('include', '${1:arr}.includes(${2:value})', 'Array.includes', 'Check includes'),

          // ── Object ────────────────────────────────────────────────────────
          s('okeys', 'Object.keys(${1:obj})', 'Object.keys', 'Get object keys'),
          s('oval', 'Object.values(${1:obj})', 'Object.values', 'Get object values'),
          s('oent', 'Object.entries(${1:obj})', 'Object.entries', 'Get key-value pairs'),
          s('oass', 'Object.assign({}, ${1:target}, ${2:source})', 'Object.assign', 'Merge objects'),
          s('ofr', 'Object.fromEntries(${1:entries})', 'Object.fromEntries', 'Create object from entries'),

          // ── TypeScript specific ───────────────────────────────────────────
          s('inter', [
            'interface ${1:Name} {',
            '\t${2:prop}: ${3:string};',
            '\t$0',
            '}',
          ], 'Interface', 'TypeScript interface'),
          s('type', 'type ${1:Name} = ${2:string};', 'Type alias', 'TypeScript type alias'),
          s('typeobj', [
            'type ${1:Name} = {',
            '\t${2:prop}: ${3:string};',
            '\t$0',
            '};',
          ], 'Type object', 'TypeScript object type'),
          s('enum', [
            'enum ${1:Name} {',
            '\t${2:Option1} = \'${3:value1}\',',
            '\t$0',
            '}',
          ], 'Enum', 'TypeScript enum'),
          s('gen', '${1:function}<${2:T}>(${3:param}: ${2:T}): ${4:T} {\n\t$0\n}', 'Generic function', 'TypeScript generic function'),
          s('cast', '(${1:value} as ${2:Type})', 'Type cast', 'TypeScript type assertion'),
          s('guard', [
            'function is${1:Type}(value: unknown): value is ${1:Type} {',
            '\treturn ${2:condition};',
            '}',
          ], 'Type guard', 'TypeScript type guard'),
          s('util', [
            'type ${1:Partial}<${2:T}> = {',
            '\t[P in keyof ${2:T}]?: ${2:T}[P];',
            '};',
          ], 'Utility type', 'TypeScript utility type pattern'),

          // ── React Hooks ───────────────────────────────────────────────────
          s('usestate', 'const [${1:state}, set${1/(.*)/${1:/capitalize}/}] = useState<${2:T}>(${3:initialValue});', 'useState', 'React useState hook'),
          s('useeffect', 'useEffect(() => {\n\t$1\n\treturn () => {\n\t\t$2\n\t};\n}, [${3:deps}]);', 'useEffect', 'React useEffect hook with cleanup'),
          s('ueff', 'useEffect(() => {\n\t$0\n}, []);', 'useEffect once', 'useEffect with empty deps'),
          s('usecb', 'const ${1:handler} = useCallback((${2:params}) => {\n\t$0\n}, [${3:deps}]);', 'useCallback', 'React useCallback hook'),
          s('usememo', 'const ${1:memoValue} = useMemo(() => {\n\t$0\n\treturn ${2:value};\n}, [${3:deps}]);', 'useMemo', 'React useMemo hook'),
          s('useref', 'const ${1:ref} = useRef<${2:HTMLDivElement}>(null);', 'useRef', 'React useRef hook'),
          s('usectx', 'const ${1:value} = useContext(${2:Context});', 'useContext', 'React useContext hook'),
          s('usered', [
            'const [${1:state}, dispatch] = useReducer(${2:reducer}, ${3:initialState});',
          ], 'useReducer', 'React useReducer hook'),
          s('custo', [
            'function use${1:Hook}(${2:params}) {',
            '\t$0',
            '\treturn { ${3:value} };',
            '}',
          ], 'Custom Hook', 'React custom hook'),

          // ── React Components ──────────────────────────────────────────────
          s('rfc', [
            "import React from 'react';",
            '',
            'interface ${1:Component}Props {',
            '\t${2:prop}: ${3:string};',
            '}',
            '',
            'export const ${1:Component}: React.FC<${1:Component}Props> = ({ ${2:prop} }) => {',
            '\treturn (',
            '\t\t<div className="${4:container}">',
            '\t\t\t$0',
            '\t\t</div>',
            '\t);',
            '};',
          ], 'React FC (with Props)', 'React functional component with typed props'),

          s('rfce', [
            "import React from 'react';",
            '',
            'export const ${1:Component}: React.FC = () => {',
            '\treturn (',
            '\t\t<div>',
            '\t\t\t$0',
            '\t\t</div>',
            '\t);',
            '};',
          ], 'React FC (no Props)', 'React functional component'),

          s('rfcd', [
            "import React from 'react';",
            '',
            'interface ${1:Component}Props {',
            '\t${2:prop}?: ${3:string};',
            '}',
            '',
            'export default function ${1:Component}({ ${2:prop} }: ${1:Component}Props) {',
            '\treturn (',
            '\t\t<div>$0</div>',
            '\t);',
            '}',
          ], 'React Default Export FC', 'React component with default export'),

          s('rfcp', [
            "import React, { useState, useEffect } from 'react';",
            '',
            'interface ${1:Component}Props {',
            '\t${2:prop}: ${3:string};',
            '}',
            '',
            'export const ${1:Component}: React.FC<${1:Component}Props> = ({ ${2:prop} }) => {',
            '\tconst [${4:state}, set${4/(.*)/${1:/capitalize}/}] = useState<${5:T}>(${6:null});',
            '',
            '\tuseEffect(() => {',
            '\t\t$0',
            '\t}, []);',
            '',
            '\treturn (',
            '\t\t<div>',
            '\t\t</div>',
            '\t);',
            '};',
          ], 'React FC Full', 'React component with state and effect'),

          s('rctx', [
            "import React, { createContext, useContext, useState } from 'react';",
            '',
            'interface ${1:Context}Type {',
            '\t${2:value}: ${3:string};',
            '}',
            '',
            'const ${1:Context} = createContext<${1:Context}Type | undefined>(undefined);',
            '',
            'export const use${1:Context} = () => {',
            '\tconst ctx = useContext(${1:Context});',
            '\tif (!ctx) throw new Error("use${1:Context} must be inside ${1:Context}Provider");',
            '\treturn ctx;',
            '};',
            '',
            'export const ${1:Context}Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {',
            '\tconst [${2:value}, set${2/(.*)/${1:/capitalize}/}] = useState<${3:string}>($4);',
            '\treturn <${1:Context}.Provider value={{ ${2:value} }}>{children}</${1:Context}.Provider>;',
            '};',
          ], 'React Context', 'Full React context + provider + hook'),

          // ── JSX Snippets ──────────────────────────────────────────────────
          s('div', '<div className="${1:container}">\n\t$0\n</div>', 'div', 'JSX div element'),
          s('span', '<span className="${1:}">{${2:text}}</span>', 'span', 'JSX span element'),
          s('btn', '<button type="${1:button}" onClick={${2:handler}} className="${3:}">\n\t$0\n</button>', 'button', 'JSX button'),
          s('inp', '<input\n\ttype="${1:text}"\n\tvalue={${2:value}}\n\tonChange={(e) => ${3:setValue}(e.target.value)}\n\tplaceholder="${4:}"\n\tclassName="${5:}"\n/>', 'input', 'JSX controlled input'),
          s('img', '<img src={${1:src}} alt="${2:alt}" className="${3:}" />', 'img', 'JSX image'),
          s('link', '<a href="${1:#}" className="${2:}">\n\t$0\n</a>', 'link', 'JSX anchor link'),
          s('ul', '<ul className="${1:}">\n\t{${2:items}.map((${3:item}) => (\n\t\t<li key={${3:item}.id}>{${3:item}.${4:name}}</li>\n\t))}\n</ul>', 'ul map', 'JSX unordered list with map'),
          s('cond', '{${1:condition} && (\n\t$0\n)}', 'Conditional render', 'JSX conditional rendering'),
          s('tern', '{${1:condition} ? (\n\t$2\n) : (\n\t$3\n)}', 'Ternary render', 'JSX ternary rendering'),
          s('frag', '<>\n\t$0\n</>', 'Fragment', 'React fragment shorthand'),

          // ── Zustand Store ─────────────────────────────────────────────────
          s('zustand', [
            "import { create } from 'zustand';",
            '',
            'interface ${1:Store}State {',
            '\t${2:count}: ${3:number};',
            '\t${4:increment}: () => void;',
            '}',
            '',
            'export const use${1:Store} = create<${1:Store}State>((set) => ({',
            '\t${2:count}: ${5:0},',
            '\t${4:increment}: () => set((state) => ({ ${2:count}: state.${2:count} + 1 })),',
            '}));',
          ], 'Zustand store', 'Zustand state store'),

          s('zper', [
            "import { create } from 'zustand';",
            "import { persist } from 'zustand/middleware';",
            '',
            'interface ${1:Store}State {',
            '\t${2:value}: ${3:string};',
            '\tset${2/(.*)/${1:/capitalize}/}: (v: ${3:string}) => void;',
            '}',
            '',
            'export const use${1:Store} = create<${1:Store}State>()(persist(',
            '\t(set) => ({',
            "\t\t${2:value}: ${4:''},",
            '\t\tset${2/(.*)/${1:/capitalize}/}: (v) => set({ ${2:value}: v }),',
            '\t}),',
            "\t{ name: '${5:store-key}' }",
            '));',
          ], 'Zustand persist', 'Zustand store with persistence'),

          // ── fetch / API ───────────────────────────────────────────────────
          s('fetch', [
            'const ${1:data} = await fetch(${2:url})',
            '\t.then((res) => {',
            '\t\tif (!res.ok) throw new Error(`HTTP \${res.status}`);',
            '\t\treturn res.json();',
            '\t});',
          ], 'fetch', 'Fetch API call'),
          s('fetcha', [
            'const fetchData = async () => {',
            '\ttry {',
            '\t\tconst res = await fetch(${1:url});',
            '\t\tif (!res.ok) throw new Error(`HTTP \${res.status}`);',
            '\t\tconst data: ${2:T} = await res.json();',
            '\t\t$0',
            '\t} catch (error) {',
            '\t\tconsole.error(error);',
            '\t}',
            '};',
          ], 'fetch async', 'Async fetch with error handling'),

          // ── Misc ──────────────────────────────────────────────────────────
          s('sw', [
            'switch (${1:expr}) {',
            '\tcase ${2:value}:',
            '\t\t$0',
            '\t\tbreak;',
            '\tdefault:',
            '\t\tbreak;',
            '}',
          ], 'Switch', 'Switch statement'),
          s('settimeout', 'setTimeout(() => {\n\t$0\n}, ${1:1000});', 'setTimeout', 'setTimeout call'),
          s('setinterval', 'setInterval(() => {\n\t$0\n}, ${1:1000});', 'setInterval', 'setInterval call'),
          s('local', "localStorage.setItem('${1:key}', JSON.stringify(${2:value}));", 'localStorage set', 'localStorage.setItem with JSON'),
          s('localg', "const ${1:value} = JSON.parse(localStorage.getItem('${2:key}') ?? 'null');", 'localStorage get', 'localStorage.getItem with parse'),
        ];

        return { suggestions };
      },
    });
  });

  // ─── CSS Snippets ──────────────────────────────────────────────────────────
  monaco.languages.registerCompletionItemProvider('css', {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = { startLineNumber: position.lineNumber, endLineNumber: position.lineNumber, startColumn: word.startColumn, endColumn: word.endColumn };
      const s = (label: string, body: string | string[], detail: string, doc: string) =>
        makeSnippet(monaco, label, body, detail, doc, range);
      return {
        suggestions: [
          s('flex', 'display: flex;\nalign-items: ${1:center};\njustify-content: ${2:center};', 'Flexbox', 'Flexbox layout'),
          s('grid', 'display: grid;\ngrid-template-columns: ${1:repeat(3, 1fr)};\ngap: ${2:1rem};', 'Grid', 'CSS Grid layout'),
          s('abs', 'position: absolute;\ntop: ${1:0};\nleft: ${2:0};', 'Position absolute', 'Absolute position'),
          s('center', 'position: absolute;\ntop: 50%;\nleft: 50%;\ntransform: translate(-50%, -50%);', 'Center absolute', 'Center element absolutely'),
          s('transition', 'transition: ${1:all} ${2:0.3s} ${3:ease};', 'Transition', 'CSS transition'),
          s('anim', '@keyframes ${1:name} {\n\tfrom { ${2:} }\n\tto { ${3:} }\n}', 'Animation keyframes', 'CSS keyframes'),
          s('media', '@media (max-width: ${1:768px}) {\n\t$0\n}', 'Media query', 'Responsive media query'),
          s('var', '--${1:name}: ${2:value};', 'CSS var', 'CSS custom property definition'),
          s('usevar', 'color: var(--${1:name});', 'Use CSS var', 'CSS var() usage'),
          s('shadow', 'box-shadow: ${1:0} ${2:4px} ${3:6px} ${4:-1px} ${5:rgba(0,0,0,0.1)};', 'Box shadow', 'Box shadow'),
          s('gradient', 'background: linear-gradient(${1:135deg}, ${2:#667eea}, ${3:#764ba2});', 'Gradient', 'Linear gradient'),
          s('reset', '*, *::before, *::after {\n\tbox-sizing: border-box;\n\tmargin: 0;\n\tpadding: 0;\n}', 'CSS reset', 'Box sizing reset'),
          s('scroll', 'overflow-y: auto;\nscrollbar-width: thin;\nscrollbar-color: ${1:#888} ${2:transparent};', 'Scrollbar', 'Custom scrollbar'),
        ],
      };
    },
  });

  // ─── HTML Snippets ─────────────────────────────────────────────────────────
  monaco.languages.registerCompletionItemProvider('html', {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = { startLineNumber: position.lineNumber, endLineNumber: position.lineNumber, startColumn: word.startColumn, endColumn: word.endColumn };
      const s = (label: string, body: string | string[], detail: string, doc: string) =>
        makeSnippet(monaco, label, body, detail, doc, range);
      return {
        suggestions: [
          s('doc', [
            '<!DOCTYPE html>',
            '<html lang="${1:en}">',
            '<head>',
            '\t<meta charset="UTF-8">',
            '\t<meta name="viewport" content="width=device-width, initial-scale=1.0">',
            '\t<title>${2:Document}</title>',
            '</head>',
            '<body>',
            '\t$0',
            '</body>',
            '</html>',
          ], 'HTML5 Document', 'Full HTML5 boilerplate'),
          s('inp', '<input type="${1:text}" name="${2:}" id="${3:}" placeholder="${4:}" />', 'Input', 'HTML input field'),
          s('form', '<form action="${1:#}" method="${2:post}">\n\t$0\n</form>', 'Form', 'HTML form'),
          s('nav', '<nav>\n\t<ul>\n\t\t<li><a href="${1:#}">${2:Link}</a></li>\n\t\t$0\n\t</ul>\n</nav>', 'Nav', 'HTML nav element'),
          s('meta', '<meta name="${1:description}" content="${2:}" />', 'Meta tag', 'HTML meta tag'),
          s('link', '<link rel="${1:stylesheet}" href="${2:style.css}" />', 'Link', 'HTML link tag'),
          s('script', '<script src="${1:app.js}" defer></script>', 'Script', 'HTML script tag'),
          s('img', '<img src="${1:}" alt="${2:}" width="${3:}" height="${4:}" />', 'Image', 'HTML image'),
          s('table', '<table>\n\t<thead>\n\t\t<tr><th>$1</th></tr>\n\t</thead>\n\t<tbody>\n\t\t<tr><td>$0</td></tr>\n\t</tbody>\n</table>', 'Table', 'HTML table'),
        ],
      };
    },
  });

  // ─── JSON Snippets ─────────────────────────────────────────────────────────
  monaco.languages.registerCompletionItemProvider('json', {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = { startLineNumber: position.lineNumber, endLineNumber: position.lineNumber, startColumn: word.startColumn, endColumn: word.endColumn };
      const s = (label: string, body: string | string[], detail: string, doc: string) =>
        makeSnippet(monaco, label, body, detail, doc, range);
      return {
        suggestions: [
          s('pkg', [
            '{',
            '\t"name": "${1:project}",',
            '\t"version": "${2:1.0.0}",',
            '\t"description": "${3:}",',
            '\t"scripts": {',
            '\t\t"dev": "${4:vite}",',
            '\t\t"build": "${5:vite build}"',
            '\t},',
            '\t"dependencies": {}',
            '}',
          ], 'package.json', 'package.json template'),
          s('tsconfig', [
            '{',
            '\t"compilerOptions": {',
            '\t\t"target": "ES2020",',
            '\t\t"module": "ESNext",',
            '\t\t"strict": true,',
            '\t\t"jsx": "react-jsx",',
            '\t\t"moduleResolution": "bundler",',
            '\t\t"outDir": "./dist"',
            '\t},',
            '\t"include": ["src"]',
            '}',
          ], 'tsconfig.json', 'TypeScript config'),
        ],
      };
    },
  });

  // ─── Python Snippets ───────────────────────────────────────────────────────
  monaco.languages.registerCompletionItemProvider('python', {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = { startLineNumber: position.lineNumber, endLineNumber: position.lineNumber, startColumn: word.startColumn, endColumn: word.endColumn };
      const s = (label: string, body: string | string[], detail: string, doc: string) =>
        makeSnippet(monaco, label, body, detail, doc, range);
      return {
        suggestions: [
          s('fori', 'for ${1:i} in range(${2:10}):\n\t$0', 'For range', 'for i in range(N)'),
          s('forl', 'for ${1:item} in ${2:iterable}:\n\t$0', 'For loop', 'for item in iterable'),
          s('def', 'def ${1:func}(${2:params}):\n\t"""${3:Docstring}"""\n\t$0', 'Function', 'Python function'),
          s('class', 'class ${1:Name}:\n\tdef __init__(self${2:, params}):\n\t\t$0', 'Class', 'Python class'),
          s('if', 'if ${1:condition}:\n\t$0', 'If', 'Python if'),
          s('ifelse', 'if ${1:condition}:\n\t$2\nelse:\n\t$0', 'If/else', 'Python if/else'),
          s('try', 'try:\n\t$1\nexcept ${2:Exception} as e:\n\tprint(e)', 'Try/except', 'Python try/except'),
          s('tryfin', 'try:\n\t$1\nexcept ${2:Exception} as e:\n\tprint(e)\nfinally:\n\t$0', 'Try/except/finally', 'Python try/except/finally'),
          s('with', 'with ${1:open("${2:file.txt}", "${3:r}")} as ${4:f}:\n\t$0', 'With', 'Python with statement'),
          s('lc', '[${1:expr} for ${2:item} in ${3:iterable}]', 'List comp', 'List comprehension'),
          s('dc', '{${1:key}: ${2:value} for ${3:item} in ${4:iterable}}', 'Dict comp', 'Dict comprehension'),
          s('main', 'if __name__ == "__main__":\n\t$0', '__main__', 'Python entry point'),
          s('print', 'print(f"${1:label}: {${2:value}}")', 'f-string print', 'Print with f-string'),
          s('dataclass', [
            'from dataclasses import dataclass',
            '',
            '@dataclass',
            'class ${1:Name}:',
            '\t${2:field}: ${3:str}',
            '\t$0',
          ], 'Dataclass', 'Python dataclass'),
        ],
      };
    },
  });

  // ─── Rust Snippets ─────────────────────────────────────────────────────────
  monaco.languages.registerCompletionItemProvider('rust', {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = { startLineNumber: position.lineNumber, endLineNumber: position.lineNumber, startColumn: word.startColumn, endColumn: word.endColumn };
      const s = (label: string, body: string | string[], detail: string, doc: string) =>
        makeSnippet(monaco, label, body, detail, doc, range);
      return {
        suggestions: [
          s('fn', 'fn ${1:name}(${2:params}) -> ${3:()} {\n\t$0\n}', 'Function', 'Rust function'),
          s('fnm', 'pub fn ${1:name}(${2:params}) -> ${3:()} {\n\t$0\n}', 'Public function', 'Rust public function'),
          s('struct', 'struct ${1:Name} {\n\t${2:field}: ${3:String},\n}', 'Struct', 'Rust struct'),
          s('impl', 'impl ${1:Name} {\n\tpub fn ${2:new}(${3:}) -> Self {\n\t\tSelf { $0 }\n\t}\n}', 'Impl', 'Rust impl block'),
          s('enum', 'enum ${1:Name} {\n\t${2:Variant},\n}', 'Enum', 'Rust enum'),
          s('match', 'match ${1:value} {\n\t${2:pattern} => $0,\n\t_ => (),\n}', 'Match', 'Rust match expression'),
          s('if', 'if ${1:condition} {\n\t$0\n}', 'If', 'Rust if'),
          s('for', 'for ${1:item} in ${2:0..10} {\n\t$0\n}', 'For', 'Rust for loop'),
          s('vec', 'let ${1:v}: Vec<${2:i32}> = vec![${3:}];', 'Vec', 'Rust Vec'),
          s('main', 'fn main() {\n\t$0\n}', 'main', 'Rust main function'),
          s('println', 'println!("${1:{}}", ${2:value});', 'println!', 'Rust println macro'),
          s('eprintln', 'eprintln!("${1:Error}: {}", ${2:error});', 'eprintln!', 'Rust error print'),
          s('unwrap', '${1:result}.unwrap_or_else(|e| { eprintln!("{}", e); $0 })', 'unwrap_or_else', 'Safe unwrap'),
          s('result', 'fn ${1:name}(${2:}) -> Result<${3:()}, ${4:Box<dyn std::error::Error>}> {\n\t$0\n\tOk(())\n}', 'Result fn', 'Function returning Result'),
          s('option', 'if let Some(${1:val}) = ${2:option} {\n\t$0\n}', 'if let Some', 'Option pattern matching'),
          s('derive', '#[derive(Debug, Clone, ${1:PartialEq})]', 'derive', 'Rust derive attribute'),
        ],
      };
    },
  });

  // ─── Go Snippets ───────────────────────────────────────────────────────────
  monaco.languages.registerCompletionItemProvider('go', {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = { startLineNumber: position.lineNumber, endLineNumber: position.lineNumber, startColumn: word.startColumn, endColumn: word.endColumn };
      const s = (label: string, body: string | string[], detail: string, doc: string) =>
        makeSnippet(monaco, label, body, detail, doc, range);
      return {
        suggestions: [
          s('fn', 'func ${1:name}(${2:params}) ${3:error} {\n\t$0\n\treturn nil\n}', 'Function', 'Go function'),
          s('main', 'func main() {\n\t$0\n}', 'main', 'Go main function'),
          s('struct', 'type ${1:Name} struct {\n\t${2:Field} ${3:string}\n}', 'Struct', 'Go struct'),
          s('iface', 'type ${1:Name} interface {\n\t${2:Method}() ${3:error}\n}', 'Interface', 'Go interface'),
          s('for', 'for ${1:i} := 0; ${1:i} < ${2:n}; ${1:i}++ {\n\t$0\n}', 'For loop', 'Go for loop'),
          s('forr', 'for ${1:_}, ${2:v} := range ${3:items} {\n\t$0\n}', 'For range', 'Go range loop'),
          s('if', 'if ${1:condition} {\n\t$0\n}', 'If', 'Go if'),
          s('iferr', 'if err != nil {\n\treturn $0err\n}', 'If error', 'Go error check'),
          s('goroutine', 'go func() {\n\t$0\n}()', 'Goroutine', 'Anonymous goroutine'),
          s('channel', '${1:ch} := make(chan ${2:int}, ${3:1})', 'Channel', 'Go channel'),
          s('fmt', 'fmt.Println(${1:"Hello, World!"})', 'fmt.Println', 'Go fmt print'),
          s('fmtf', 'fmt.Printf("${1:%v}\\n", ${2:value})', 'fmt.Printf', 'Go fmt printf'),
          s('err', '${1:result}, err := ${2:func}()\nif err != nil {\n\treturn $0err\n}', 'Error pattern', 'Go error handling pattern'),
        ],
      };
    },
  });

  // ─── Markdown Snippets ─────────────────────────────────────────────────────
  monaco.languages.registerCompletionItemProvider('markdown', {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = { startLineNumber: position.lineNumber, endLineNumber: position.lineNumber, startColumn: word.startColumn, endColumn: word.endColumn };
      const s = (label: string, body: string | string[], detail: string, doc: string) =>
        makeSnippet(monaco, label, body, detail, doc, range);
      return {
        suggestions: [
          s('code', '```${1:language}\n$0\n```', 'Code block', 'Fenced code block'),
          s('link', '[${1:text}](${2:url})', 'Link', 'Markdown link'),
          s('img', '![${1:alt}](${2:url})', 'Image', 'Markdown image'),
          s('table', '| ${1:Header} | ${2:Header} |\n| --- | --- |\n| ${3:Cell} | ${4:Cell} |', 'Table', 'Markdown table'),
          s('badge', '![${1:label}](https://img.shields.io/badge/${1:label}-${2:value}-${3:blue})', 'Badge', 'Shield.io badge'),
          s('details', '<details>\n<summary>${1:Summary}</summary>\n\n$0\n\n</details>', 'Details', 'Collapsible details'),
          s('todo', '- [ ] ${1:Task}', 'Todo item', 'Markdown todo checkbox'),
        ],
      };
    },
  });
}
