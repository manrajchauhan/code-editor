import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { useWorkspaceStore } from '../../workspace/stores/workspaceStore';
import { executeShellCommand } from '../../../services/fileSystemService';

export const TerminalPanel: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const inputBufferRef = useRef<string>('');

  const { currentFolderPath, currentFolderName, refreshWorkspace } = useWorkspaceStore();

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
      const dirName = currentFolderName || 'code-editor';
      term.write(`\r\n\x1b[38;2;99;102;241m${dirName}\x1b[0m \x1b[38;2;156;163;175m$\x1b[0m `);
    };

    term.writeln('\x1b[1;38;2;99;102;241mIntegrated Terminal & Process Shell v1.0.0\x1b[0m');
    term.writeln('\x1b[38;2;156;163;175mConnected to workspace. Run "npm run dev", "npm install", "cat package.json", "ls", etc.\x1b[0m');
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
    const activePath = currentFolderPath || '/Volumes/Personal Space/Cross Platform Apps/code-editor';

    if (commandLine.toLowerCase() === 'clear') {
      term.clear();
    } else {
      const output = await executeShellCommand(commandLine, activePath);
      const formattedOutput = output.replace(/\r?\n/g, '\r\n');
      term.write(formattedOutput);
      await refreshWorkspace();
    }

    const dirName = currentFolderName || 'code-editor';
    term.write(`\x1b[38;2;99;102;241m${dirName}\x1b[0m \x1b[38;2;156;163;175m$\x1b[0m `);
  };

  return (
    <div className="w-full h-full bg-[#0d0e11] p-2 overflow-hidden flex flex-col">
      <div ref={terminalRef} className="w-full h-full overflow-hidden" />
    </div>
  );
};
