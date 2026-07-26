import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { useWorkspaceStore } from '../../workspace/stores/workspaceStore';
import { readFileText, createFileItem, createDirItem, deleteFileSystemItem } from '../../../services/fileSystemService';

export const TerminalPanel: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const inputBufferRef = useRef<string>('');

  const { currentFolderPath, currentFolderName, rootNode, refreshWorkspace } = useWorkspaceStore();

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new XTerm({
      fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
      fontSize: 13,
      theme: {
        background: '#0d0e11',
        foreground: '#f3f4f6',
        cursor: '#6366f1',
        selectionBackground: '#2a2f3d',
        black: '#181b22',
        blue: '#6366f1',
        cyan: '#38bdf8',
        green: '#4ade80',
        magenta: '#c084fc',
        red: '#f87171',
        white: '#f3f4f6',
        yellow: '#fbbf24',
      },
      cursorBlink: true,
      cursorStyle: 'block',
      rows: 8,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    const prompt = () => {
      const dirName = currentFolderName || 'my-project';
      term.write(`\r\n\x1b[38;2;99;102;241m${dirName}\x1b[0m \x1b[38;2;156;163;175m$\x1b[0m `);
    };

    term.writeln('\x1b[1;38;2;99;102;241mLocal Code Editor Shell v1.0.0\x1b[0m');
    term.writeln('\x1b[38;2;156;163;175mType "help" to view available terminal commands.\x1b[0m');
    prompt();

    term.onData(async (data) => {
      const code = data.charCodeAt(0);

      if (code === 13) {
        // Enter key
        const line = inputBufferRef.current.trim();
        inputBufferRef.current = '';

        if (line.length > 0) {
          term.write('\r\n');
          await handleCommand(line, term);
        } else {
          prompt();
        }
      } else if (code === 127) {
        // Backspace key
        if (inputBufferRef.current.length > 0) {
          inputBufferRef.current = inputBufferRef.current.slice(0, -1);
          term.write('\b \b');
        }
      } else if (code < 32) {
        // Ignore control codes
      } else {
        inputBufferRef.current += data;
        term.write(data);
      }
    });

    const handleResize = () => {
      try {
        fitAddon.fit();
      } catch (err) {
        // Ignore fit error on hidden container
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
    };
  }, [currentFolderName]);

  const handleCommand = async (commandLine: string, term: XTerm) => {
    const parts = commandLine.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    const activePath = currentFolderPath || '/my-project';

    if (cmd === 'clear') {
      term.clear();
    } else if (cmd === 'help') {
      term.writeln('Available Commands:');
      term.writeln('  ls / dir       - List files in current directory');
      term.writeln('  pwd            - Print active working directory');
      term.writeln('  cat <file>     - Display file content');
      term.writeln('  touch <file>   - Create a new file');
      term.writeln('  mkdir <dir>    - Create a new directory');
      term.writeln('  rm <file>      - Delete a file or directory');
      term.writeln('  clear          - Clear terminal screen');
      term.writeln('  node -v        - Print Node version');
    } else if (cmd === 'pwd') {
      term.writeln(activePath);
    } else if (cmd === 'ls' || cmd === 'dir') {
      if (rootNode?.children) {
        const items = rootNode.children.map((c) => (c.isDirectory ? `\x1b[34m${c.name}/\x1b[0m` : c.name));
        term.writeln(items.join('  '));
      } else {
        term.writeln('App.tsx  main.ts  styles.css  package.json  README.md');
      }
    } else if (cmd === 'cat') {
      if (args.length === 0) {
        term.writeln('Usage: cat <file_name>');
      } else {
        const targetPath = `${activePath}/${args[0]}`;
        const content = await readFileText(targetPath);
        term.writeln(content);
      }
    } else if (cmd === 'touch') {
      if (args.length === 0) {
        term.writeln('Usage: touch <file_name>');
      } else {
        await createFileItem(activePath, args[0]);
        await refreshWorkspace();
        term.writeln(`Created file: ${args[0]}`);
      }
    } else if (cmd === 'mkdir') {
      if (args.length === 0) {
        term.writeln('Usage: mkdir <folder_name>');
      } else {
        await createDirItem(activePath, args[0]);
        await refreshWorkspace();
        term.writeln(`Created directory: ${args[0]}`);
      }
    } else if (cmd === 'rm') {
      if (args.length === 0) {
        term.writeln('Usage: rm <file_name>');
      } else {
        const targetPath = `${activePath}/${args[0]}`;
        await deleteFileSystemItem(targetPath);
        await refreshWorkspace();
        term.writeln(`Removed: ${args[0]}`);
      }
    } else if (cmd === 'node') {
      term.writeln('v23.6.0');
    } else {
      term.writeln(`command not found: ${cmd}. Type "help" for commands.`);
    }

    const dirName = currentFolderName || 'my-project';
    term.write(`\x1b[38;2;99;102;241m${dirName}\x1b[0m \x1b[38;2;156;163;175m$\x1b[0m `);
  };

  return (
    <div className="w-full h-full bg-[#0d0e11] p-2 overflow-hidden flex flex-col">
      <div ref={terminalRef} className="w-full h-full overflow-hidden" />
    </div>
  );
};
