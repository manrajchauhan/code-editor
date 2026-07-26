import React, { useCallback, useEffect, useState } from 'react';
import { useLayoutStore } from '../../stores/layoutStore';

export const PanelResizer: React.FC = () => {
  const { isSidebarOpen, setSidebarWidth } = useLayoutStore();
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Activity Bar width is 48px
      const newWidth = Math.max(180, Math.min(480, e.clientX - 48));
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, setSidebarWidth]);

  if (!isSidebarOpen) return null;

  return (
    <div
      onMouseDown={handleMouseDown}
      className={`w-1 hover:w-1.5 h-full cursor-col-resize select-none z-30 shrink-0 transition-colors ${
        isDragging ? 'bg-accent w-1.5' : 'bg-transparent hover:bg-accent/60'
      }`}
      title="Drag to resize sidebar"
    />
  );
};
