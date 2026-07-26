import React from 'react';
import { Settings, Sliders, Type, LayoutGrid, Eye } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';

export const SettingsPane: React.FC = () => {
  const {
    theme,
    fontSize,
    tabSize,
    wordWrap,
    minimap,
    setTheme,
    setFontSize,
    setTabSize,
    setWordWrap,
    setMinimap,
  } = useSettingsStore();

  return (
    <div className="flex flex-col gap-4 text-xs text-text-muted select-none p-1">
      <div className="flex items-center gap-2 pb-2 border-b border-border-subtle">
        <Settings className="w-4 h-4 text-accent" />
        <span className="font-semibold text-text-main">Preferences</span>
      </div>

      {/* Theme Setting */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium text-text-subtle flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-accent" />
          <span>Editor Theme</span>
        </label>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as 'vs-dark' | 'light')}
          className="bg-bg-surface border border-border-subtle rounded px-2 py-1.5 text-text-main text-xs outline-none focus:border-accent"
        >
          <option value="vs-dark">VS-Dark (Default)</option>
          <option value="light">VS-Light</option>
        </select>
      </div>

      {/* Font Size Setting */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium text-text-subtle flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-accent" />
          <span>Font Size ({fontSize}px)</span>
        </label>
        <input
          type="range"
          min={11}
          max={20}
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="w-full accent-accent cursor-pointer"
        />
      </div>

      {/* Tab Size Setting */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium text-text-subtle flex items-center gap-1.5">
          <LayoutGrid className="w-3.5 h-3.5 text-accent" />
          <span>Tab Size (Spaces)</span>
        </label>
        <select
          value={tabSize}
          onChange={(e) => setTabSize(Number(e.target.value))}
          className="bg-bg-surface border border-border-subtle rounded px-2 py-1.5 text-text-main text-xs outline-none focus:border-accent"
        >
          <option value={2}>2 Spaces</option>
          <option value={4}>4 Spaces</option>
        </select>
      </div>

      {/* Word Wrap & Minimap Toggles */}
      <div className="flex flex-col gap-2 pt-2 border-t border-border-subtle">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-[11px] font-medium text-text-subtle flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-accent" />
            <span>Minimap Enabled</span>
          </span>
          <input
            type="checkbox"
            checked={minimap}
            onChange={(e) => setMinimap(e.target.checked)}
            className="accent-accent cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-[11px] font-medium text-text-subtle">Word Wrap</span>
          <select
            value={wordWrap}
            onChange={(e) => setWordWrap(e.target.value as 'on' | 'off')}
            className="bg-bg-surface border border-border-subtle rounded px-2 py-1 text-text-main text-xs outline-none"
          >
            <option value="on">On</option>
            <option value="off">Off</option>
          </select>
        </label>
      </div>
    </div>
  );
};
