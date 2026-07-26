import { useState, useEffect } from 'react';
import { SystemMetrics } from '../types/systemStatus.types';
import { useEditorStore } from '../../editor/stores/editorStore';
import { useWorkspaceStore } from '../../workspace/stores/workspaceStore';
import { FileNode } from '../../workspace/types/workspace.types';

const startTime = Date.now();

function countWorkspaceFiles(node: FileNode | null): number {
  if (!node) return 0;
  let count = node.isDirectory ? 0 : 1;
  if (node.children) {
    for (const child of node.children) {
      count += countWorkspaceFiles(child);
    }
  }
  return count;
}

export function useSystemMetrics(): SystemMetrics {
  const { tabs } = useEditorStore();
  const { rootNode } = useWorkspaceStore();

  const [metrics, setMetrics] = useState<SystemMetrics>({
    memoryUsedMB: 38,
    memoryLimitMB: 4096,
    activeTabsCount: tabs.length,
    dirtyFilesCount: tabs.filter((t) => t.isDirty).length,
    totalWorkspaceFiles: countWorkspaceFiles(rootNode),
    uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
    platform: typeof navigator !== 'undefined' && navigator.userAgent.includes('Mac') ? 'macOS (Darwin)' : 'Desktop',
    tauriVersion: '2.0.0',
    ipcStatus: typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window ? 'Connected' : 'Web Preview Mode',
  });

  useEffect(() => {
    const interval = setInterval(() => {
      let memoryUsed = 38;
      // Get browser/heap memory if performance.memory API exists
      if (typeof performance !== 'undefined' && 'memory' in performance) {
        const mem = (performance as unknown as { memory: { usedJSHeapSize: number } }).memory;
        if (mem?.usedJSHeapSize) {
          memoryUsed = Math.round(mem.usedJSHeapSize / (1024 * 1024));
        }
      }

      setMetrics({
        memoryUsedMB: memoryUsed,
        memoryLimitMB: 4096,
        activeTabsCount: tabs.length,
        dirtyFilesCount: tabs.filter((t) => t.isDirty).length,
        totalWorkspaceFiles: countWorkspaceFiles(rootNode),
        uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
        platform: typeof navigator !== 'undefined' && navigator.userAgent.includes('Mac') ? 'macOS (Darwin)' : 'Desktop',
        tauriVersion: '2.0.0',
        ipcStatus: typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window ? 'Connected' : 'Web Preview Mode',
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [tabs, rootNode]);

  return metrics;
}
