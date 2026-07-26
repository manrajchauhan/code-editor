import { useState, useEffect } from 'react';

export interface PerformanceMetrics {
  fps: number;
  frameTimeMs: number;
  heapMemoryMB: number;
}

export function useFpsMonitor(): PerformanceMetrics {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameTimeMs: 16.67,
    heapMemoryMB: 28.4,
  });

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const tick = (now: number) => {
      frameCount++;
      const delta = now - lastTime;

      if (delta >= 1000) {
        const calculatedFps = Math.min(120, Math.round((frameCount * 1000) / delta));
        const avgFrameTime = Number((delta / frameCount).toFixed(2));
        
        let memory = 28.4;
        if ((performance as any).memory) {
          memory = Number(((performance as any).memory.usedJSHeapSize / (1024 * 1024)).toFixed(1));
        }

        setMetrics({
          fps: calculatedFps,
          frameTimeMs: avgFrameTime,
          heapMemoryMB: memory,
        });

        frameCount = 0;
        lastTime = now;
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  return metrics;
}
