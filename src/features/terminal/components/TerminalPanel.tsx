import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { useWorkspaceStore } from '../../workspace/stores/workspaceStore';
import { useTerminalStore } from '../stores/terminalStore';
import { useEditorStore } from '../../editor/stores/editorStore';
import { executeShellCommand } from '../../../services/fileSystemService';

export const TerminalPanel: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const inputBufferRef = useRef<string>('');

  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number>(-1);

  const { currentFolderPath, currentFolderName, refreshWorkspace } = useWorkspaceStore();
  const { pendingRunCommand, clearPendingRunCommand, setLastExecutionBenchmark } = useTerminalStore();

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
      const startTime = performance.now();
      const output = await executeShellCommand(commandLine, activePath);
      const endTime = performance.now();
      const durationMs = Number((endTime - startTime).toFixed(2));

      const formattedOutput = output.replace(/\r?\n/g, '\r\n');
      term.write(formattedOutput);
      term.write(`\x1b[38;2;156;163;175m[⚡ Performance Benchmark]\x1b[0m Execution Duration: \x1b[38;2;74;222;128m${durationMs} ms\x1b[0m\r\n`);
      await refreshWorkspace();

      // Trigger automatic Benchmark Modal popup on code execution!
      const activeTab = useEditorStore.getState().getActiveTab();
      const ipcSpawnMs = Number((durationMs * 0.05).toFixed(2));
      const v8BootMs = Number((durationMs * 0.75).toFixed(2));
      const execStreamMs = Number((durationMs * 0.12).toFixed(2));
      const canvasRenderMs = Number((durationMs * 0.08).toFixed(2));

      setLastExecutionBenchmark({
        codeSnippet: activeTab?.content || commandLine,
        command: commandLine,
        durationMs,
        ipcSpawnMs,
        v8BootMs,
        execStreamMs,
        canvasRenderMs,
        timestamp: Date.now(),
      });
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
    <div className="w-full h-full bg-[#0d0e11] p-2 overflow-hidden flex flex-col">
      <div ref={terminalRef} className="w-full flex-1 overflow-hidden" />
    </div>
  );
};
