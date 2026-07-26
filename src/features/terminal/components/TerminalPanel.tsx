import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { Play, Package, TestTube, Trash2, Code2 } from 'lucide-react';
import { useWorkspaceStore } from '../../workspace/stores/workspaceStore';
import { useTerminalStore } from '../stores/terminalStore';
import { executeShellCommand } from '../../../services/fileSystemService';

export const TerminalPanel: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const inputBufferRef = useRef<string>('');

  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number>(-1);

  const { currentFolderPath, currentFolderName, refreshWorkspace } = useWorkspaceStore();
  const { pendingRunCommand, clearPendingRunCommand } = useTerminalStore();

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
    term.writeln('\x1b[38;2;156;163;175mPress ↑ Up / ↓ Down Arrow keys for command history.\x1b[0m');
    prompt();

    term.onData(async (data) => {
      // 1. Up Arrow Key: Navigate to previous command in history
      if (data === '\x1b[A') {
        if (historyRef.current.length > 0) {
          if (historyIndexRef.current === -1) {
            historyIndexRef.current = historyRef.current.length - 1;
          } else if (historyIndexRef.current > 0) {
            historyIndexRef.current--;
          }
          const prevCmd = historyRef.current[historyIndexRef.current] || '';
          while (inputBufferRef.current.length > 0) {
            inputBufferRef.current = inputBufferRef.current.slice(0, -1);
            term.write('\b \b');
          }
          inputBufferRef.current = prevCmd;
          term.write(prevCmd);
        }
        return;
      }

      // 2. Down Arrow Key: Navigate to next command in history
      if (data === '\x1b[B') {
        if (historyRef.current.length > 0 && historyIndexRef.current !== -1) {
          if (historyIndexRef.current < historyRef.current.length - 1) {
            historyIndexRef.current++;
            const nextCmd = historyRef.current[historyIndexRef.current];
            while (inputBufferRef.current.length > 0) {
              inputBufferRef.current = inputBufferRef.current.slice(0, -1);
              term.write('\b \b');
            }
            inputBufferRef.current = nextCmd;
            term.write(nextCmd);
          } else {
            historyIndexRef.current = historyRef.current.length;
            while (inputBufferRef.current.length > 0) {
              inputBufferRef.current = inputBufferRef.current.slice(0, -1);
              term.write('\b \b');
            }
            inputBufferRef.current = '';
          }
        }
        return;
      }

      const code = data.charCodeAt(0);

      if (code === 13) {
        // Enter key
        const line = inputBufferRef.current.trim();
        inputBufferRef.current = '';

        if (line.length > 0) {
          // Push into command history
          historyRef.current.push(line);
          historyIndexRef.current = historyRef.current.length;

          term.write('\r\n');
          await runCommand(line, term);
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

  // Effect to execute pending run commands (e.g. from "Run Code" button)
  useEffect(() => {
    if (pendingRunCommand && xtermRef.current) {
      const cmd = pendingRunCommand;
      clearPendingRunCommand();
      executeQuickAction(cmd);
    }
  }, [pendingRunCommand]);

  const runCommand = async (commandLine: string, term: XTerm) => {
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

  const executeQuickAction = async (cmd: string) => {
    if (!xtermRef.current) return;
    const term = xtermRef.current;

    historyRef.current.push(cmd);
    historyIndexRef.current = historyRef.current.length;

    term.write(`\r\n\x1b[38;2;99;102;241m${currentFolderName || 'code-editor'}\x1b[0m \x1b[38;2;156;163;175m$\x1b[0m ${cmd}\r\n`);
    await runCommand(cmd, term);
  };

  return (
    <div className="w-full h-full bg-[#0d0e11] p-2 overflow-hidden flex flex-col gap-1.5">
      {/* Terminal Toolbar Quick Actions */}
      <div className="flex items-center justify-between px-2 py-1 bg-bg-surface border-b border-border-subtle text-[11px] text-text-subtle shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-text-main">Code Runners:</span>
          <button
            type="button"
            onClick={() => executeQuickAction('node --version')}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors"
          >
            <Code2 className="w-3 h-3" />
            <span>Node JS</span>
          </button>
          <button
            type="button"
            onClick={() => executeQuickAction('python3 --version')}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
          >
            <Code2 className="w-3 h-3" />
            <span>Python3</span>
          </button>

          <span className="text-border-subtle mx-1">|</span>

          <button
            type="button"
            onClick={() => executeQuickAction('npm run dev')}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
          >
            <Play className="w-3 h-3" />
            <span>npm run dev</span>
          </button>
          <button
            type="button"
            onClick={() => executeQuickAction('npm install')}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors"
          >
            <Package className="w-3 h-3" />
            <span>npm install</span>
          </button>
          <button
            type="button"
            onClick={() => executeQuickAction('npm test')}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
          >
            <TestTube className="w-3 h-3" />
            <span>npm test</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            if (xtermRef.current) xtermRef.current.clear();
          }}
          className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-bg-hover text-text-subtle hover:text-text-main transition-colors"
          title="Clear Terminal Screen"
        >
          <Trash2 className="w-3 h-3" />
          <span>Clear</span>
        </button>
      </div>

      <div ref={terminalRef} className="w-full flex-1 overflow-hidden" />
    </div>
  );
};
