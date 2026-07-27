import React from 'react';
import { Settings, Sliders, Type, LayoutGrid, Eye, AlignLeft, MousePointer, Minus, Columns } from 'lucide-react';
import { useSettingsStore, EditorTheme, LineNumbersMode, CursorStyle } from '../stores/settingsStore';

export const SettingsPane: React.FC = () => {
  const {
    theme, fontSize, tabSize, wordWrap, minimap,
    stickyScroll, lineNumbers, cursorStyle, fontLigatures,
    renderWhitespace, smoothScrolling,
    setTheme, setFontSize, setTabSize, setWordWrap, setMinimap,
    setStickyScroll, setLineNumbers, setCursorStyle, setFontLigatures,
    setRenderWhitespace, setSmoothScrolling,
  } = useSettingsStore();

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-8 h-4 rounded-full transition-colors ${checked ? 'bg-accent' : 'bg-bg-active border border-border-strong'}`}
    >
      <span
        className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ${checked ? 'left-[18px]' : 'left-0.5'}`}
      />
    </button>
  );

  return (
    <div className="flex flex-col gap-4 text-xs text-text-muted select-none p-2">
      <div className="flex items-center gap-2 pb-2 border-b border-border-subtle">
        <Settings className="w-3.5 h-3.5 text-accent" />
        <span className="font-semibold text-text-main text-[11px] uppercase tracking-wider">Preferences</span>
      </div>

      {/* Theme */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-medium text-text-subtle flex items-center gap-1.5 uppercase tracking-wider">
          <Sliders className="w-3 h-3 text-accent" /> Editor Theme
        </label>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as EditorTheme)}
          className="bg-bg-surface border border-border-subtle rounded px-2 py-1.5 text-text-main text-xs outline-none focus:border-accent"
        >
          <option value="tokyo-night">Tokyo Night</option>
          <option value="one-dark-pro">One Dark Pro</option>
          <option value="vitesse-dark">Vitesse Dark</option>
          <option value="vs-dark">VS Dark</option>
          <option value="light">VS Light</option>
        </select>
      </div>

      {/* Font Size */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-medium text-text-subtle flex items-center gap-1.5 uppercase tracking-wider">
          <Type className="w-3 h-3 text-accent" /> Font Size — {fontSize}px
        </label>
        <input
          type="range" min={11} max={22} value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="w-full accent-accent cursor-pointer"
        />
      </div>

      {/* Tab Size */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-medium text-text-subtle flex items-center gap-1.5 uppercase tracking-wider">
          <LayoutGrid className="w-3 h-3 text-accent" /> Tab Size
        </label>
        <select
          value={tabSize}
          onChange={(e) => setTabSize(Number(e.target.value))}
          className="bg-bg-surface border border-border-subtle rounded px-2 py-1.5 text-text-main text-xs outline-none focus:border-accent"
        >
          <option value={2}>2 Spaces</option>
          <option value={4}>4 Spaces</option>
          <option value={8}>8 Spaces</option>
        </select>
      </div>

      {/* Word Wrap */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-medium text-text-subtle flex items-center gap-1.5 uppercase tracking-wider">
          <AlignLeft className="w-3 h-3 text-accent" /> Word Wrap
        </label>
        <select
          value={wordWrap}
          onChange={(e) => setWordWrap(e.target.value as 'on' | 'off')}
          className="bg-bg-surface border border-border-subtle rounded px-2 py-1.5 text-text-main text-xs outline-none focus:border-accent"
        >
          <option value="on">On</option>
          <option value="off">Off</option>
        </select>
      </div>

      {/* Line Numbers */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-medium text-text-subtle flex items-center gap-1.5 uppercase tracking-wider">
          <Columns className="w-3 h-3 text-accent" /> Line Numbers
        </label>
        <select
          value={lineNumbers}
          onChange={(e) => setLineNumbers(e.target.value as LineNumbersMode)}
          className="bg-bg-surface border border-border-subtle rounded px-2 py-1.5 text-text-main text-xs outline-none focus:border-accent"
        >
          <option value="on">On</option>
          <option value="off">Off</option>
          <option value="relative">Relative</option>
        </select>
      </div>

      {/* Cursor Style */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-medium text-text-subtle flex items-center gap-1.5 uppercase tracking-wider">
          <MousePointer className="w-3 h-3 text-accent" /> Cursor Style
        </label>
        <select
          value={cursorStyle}
          onChange={(e) => setCursorStyle(e.target.value as CursorStyle)}
          className="bg-bg-surface border border-border-subtle rounded px-2 py-1.5 text-text-main text-xs outline-none focus:border-accent"
        >
          <option value="line">Line</option>
          <option value="block">Block</option>
          <option value="underline">Underline</option>
          <option value="line-thin">Line Thin</option>
          <option value="block-outline">Block Outline</option>
        </select>
      </div>

      {/* Render Whitespace */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-medium text-text-subtle flex items-center gap-1.5 uppercase tracking-wider">
          <Minus className="w-3 h-3 text-accent" /> Render Whitespace
        </label>
        <select
          value={renderWhitespace}
          onChange={(e) => setRenderWhitespace(e.target.value as 'none' | 'boundary' | 'all')}
          className="bg-bg-surface border border-border-subtle rounded px-2 py-1.5 text-text-main text-xs outline-none focus:border-accent"
        >
          <option value="none">None</option>
          <option value="boundary">Boundary</option>
          <option value="all">All</option>
        </select>
      </div>

      {/* Toggle row */}
      <div className="flex flex-col gap-3 pt-2 border-t border-border-subtle">
        {[
          { label: 'Minimap', icon: <Eye className="w-3 h-3 text-accent" />, value: minimap, onChange: setMinimap },
          { label: 'Sticky Scroll', icon: <Sliders className="w-3 h-3 text-accent" />, value: stickyScroll, onChange: setStickyScroll },
          { label: 'Font Ligatures', icon: <Type className="w-3 h-3 text-accent" />, value: fontLigatures, onChange: setFontLigatures },
          { label: 'Smooth Scrolling', icon: <AlignLeft className="w-3 h-3 text-accent" />, value: smoothScrolling, onChange: setSmoothScrolling },
        ].map(({ label, icon, value, onChange }) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-text-subtle flex items-center gap-1.5 uppercase tracking-wider">
              {icon} {label}
            </span>
            <Toggle checked={value} onChange={onChange} />
          </div>
        ))}
      </div>
    </div>
  );
};
