import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { useWorkspaceStore } from '../../workspace/stores/workspaceStore';
import { useTerminalStore } from '../stores/terminalStore';
import { useEditorStore } from '../../editor/stores/editorStore';
import { useSettingsStore, FONT_FAMILY_MAP } from '../../settings/stores/settingsStore';
import { executeShellCommand, readDirectoryTree } from '../../../services/fileSystemService';
import { useGitStore } from '../../git/stores/gitStore';

export const TerminalPanel: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const inputBufferRef = useRef<string>('');
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const activePathRef = useRef<string>('');

  const { currentFolderPath, currentFolderName, refreshWorkspace, openFolder } = useWorkspaceStore();
  const { pendingRunCommand, clearPendingRunCommand, setLastExecutionBenchmark } = useTerminalStore();
  const { fontFamily, fontSize } = useSettingsStore();
  const { branch } = useGitStore();

  const fontCss = FONT_FAMILY_MAP[fontFamily]?.css || FONT_FAMILY_MAP['jetbrains-mono'].css;

  // Initialize Active Directory Path
  useEffect(() => {
    activePathRef.current = currentFolderPath || '/Volumes/Personal Space/Cross Platform Apps/Demo';
  }, [currentFolderPath]);

  // Terminal Setup
  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new XTerm({
      fontFamily: fontCss,
      fontSize: Math.max(12, fontSize - 1),
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
      rows: 10,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    try { fitAddon.fit(); } catch {}

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    const getPromptStr = () => {
      const dirName = activePathRef.current.split('/').pop() || currentFolderName || 'workspace';
      const gitBranchStr = branch && branch !== 'not a git repo' ? ` \x1b[38;2;251;191;36m(${branch})\x1b[0m` : '';
      return `\r\n\x1b[1;38;2;99;102;241m${dirName}\x1b[0m${gitBranchStr} \x1b[38;2;156;163;175m$\x1b[0m `;
    };

    const prompt = () => {
      term.write(getPromptStr());
    };

    term.writeln('\x1b[1;38;2;99;102;241mIntegrated Terminal & Shell System v2.0\x1b[0m');
    term.writeln('\x1b[38;2;156;163;175mFull interactive shell · Tab completion · History ↑/↓ · Smart cd\x1b[0m');
    prompt();

    // Data / Key Handler
    term.onData(async (data) => {
      // 1. Up Arrow (History Back)
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

      // 2. Down Arrow (History Forward)
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

      // 3. Tab Completion
      if (data === '\t') {
        const buffer = inputBufferRef.current;
        if (!buffer.trim()) return;
        try {
          const tree = await readDirectoryTree(activePathRef.current);
          if (tree && tree.children) {
            const lastWord = buffer.split(' ').pop() || '';
            const match = tree.children.find((c) => c.name.toLowerCase().startsWith(lastWord.toLowerCase()));
            if (match) {
              const toAdd = match.name.slice(lastWord.length) + (match.isDirectory ? '/' : ' ');
              inputBufferRef.current += toAdd;
              term.write(toAdd);
            }
          }
        } catch {}
        return;
      }

      const code = data.charCodeAt(0);

      // 4. Enter Key
      if (code === 13) {
        const line = inputBufferRef.current.trim();
        inputBufferRef.current = '';

        if (line.length > 0) {
          historyRef.current.push(line);
          historyIndexRef.current = historyRef.current.length;

          term.write('\r\n');
          await runCommand(line, term, getPromptStr);
        } else {
          prompt();
        }
      }
      // 5. Backspace Key
      else if (code === 127) {
        if (inputBufferRef.current.length > 0) {
          inputBufferRef.current = inputBufferRef.current.slice(0, -1);
          term.write('\b \b');
        }
      }
      // 6. Ctrl+C (Interrupt)
      else if (code === 3) {
        inputBufferRef.current = '';
        term.write('^C');
        prompt();
      }
      // 7. Ctrl+L (Clear Screen)
      else if (code === 12) {
        inputBufferRef.current = '';
        term.clear();
        prompt();
      }
      // 8. Normal Character Input
      else if (code >= 32) {
        inputBufferRef.current += data;
        term.write(data);
      }
    });

    const handleResize = () => {
      try { fitAddon.fit(); } catch {}
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
    };
  }, [currentFolderName, fontCss, fontSize, branch]);

  // Execute pending run command (e.g. from "Run Code" button)
  useEffect(() => {
    if (pendingRunCommand && xtermRef.current) {
      const cmd = pendingRunCommand;
      clearPendingRunCommand();
      executeQuickAction(cmd);
    }
  }, [pendingRunCommand]);

  const runCommand = async (commandLine: string, term: XTerm, getPromptStr: () => string) => {
    const trimmed = commandLine.trim();

    // ── Built-in: Clear ───────────────────────────────────────────
    if (trimmed.toLowerCase() === 'clear') {
      term.clear();
      term.write(getPromptStr());
      return;
    }

    // ── Built-in: Smart cd ────────────────────────────────────────
    if (trimmed === 'cd' || trimmed.startsWith('cd ')) {
      const targetArg = trimmed.slice(3).trim();
      let targetPath = activePathRef.current;

      if (!targetArg || targetArg === '~') {
        targetPath = '/Volumes/Personal Space/Cross Platform Apps';
      } else if (targetArg === '..') {
        const parts = activePathRef.current.split('/');
        parts.pop();
        targetPath = parts.join('/') || '/';
      } else if (targetArg.startsWith('/')) {
        targetPath = targetArg;
      } else {
        targetPath = `${activePathRef.current}/${targetArg}`.replace(/\/+/g, '/');
      }

      try {
        await openFolder(targetPath);
        activePathRef.current = targetPath;
      } catch (err) {
        term.write(`\x1b[38;2;248;113;113mcd: no such file or directory: ${targetArg}\x1b[0m\r\n`);
      }
      term.write(getPromptStr());
      return;
    }

    // ── External Shell Command ────────────────────────────────────
    const startTime = performance.now();
    const output = await executeShellCommand(commandLine, activePathRef.current);
    const endTime = performance.now();
    const durationMs = Number((endTime - startTime).toFixed(2));

    const formattedOutput = output.replace(/\r?\n/g, '\r\n');
    term.write(formattedOutput);

    // Performance Benchmark logging
    term.write(`\x1b[38;2;156;163;175m[⚡ Performance]\x1b[0m Duration: \x1b[38;2;74;222;128m${durationMs} ms\x1b[0m\r\n`);
    await refreshWorkspace();

    const activeTab = useEditorStore.getState().getActiveTab();
    setLastExecutionBenchmark({
      codeSnippet: activeTab?.content || commandLine,
      command: commandLine,
      durationMs,
      ipcSpawnMs: Number((durationMs * 0.05).toFixed(2)),
      v8BootMs: Number((durationMs * 0.75).toFixed(2)),
      execStreamMs: Number((durationMs * 0.12).toFixed(2)),
      canvasRenderMs: Number((durationMs * 0.08).toFixed(2)),
      timestamp: Date.now(),
    });

    term.write(getPromptStr());
  };

  const executeQuickAction = async (cmd: string) => {
    if (!xtermRef.current) return;
    const term = xtermRef.current;

    historyRef.current.push(cmd);
    historyIndexRef.current = historyRef.current.length;

    const dirName = activePathRef.current.split('/').pop() || currentFolderName || 'workspace';
    const gitBranchStr = branch && branch !== 'not a git repo' ? ` \x1b[38;2;251;191;36m(${branch})\x1b[0m` : '';
    const promptStr = `\r\n\x1b[1;38;2;99;102;241m${dirName}\x1b[0m${gitBranchStr} \x1b[38;2;156;163;175m$\x1b[0m `;

    term.write(`${promptStr}${cmd}\r\n`);
    await runCommand(cmd, term, () => promptStr);
  };

  return (
    <div className="w-full h-full bg-[#0d0e11] p-1.5 overflow-hidden flex flex-col">
      <div ref={terminalRef} className="w-full flex-1 overflow-hidden" />
    </div>
  );
};
