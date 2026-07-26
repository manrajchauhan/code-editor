# Vibe & Design Philosophy

## Product Philosophy

**Goal**: A lightweight, blazing-fast, local-first code editor designed for maximum developer focus and flow.

### Core Principles

1. **Minimal & Low Visual Noise**
   - Every pixel must earn its place.
   - Eliminate superfluous decorations, heavy drop shadows, and unnecessary borders.
   - High content-to-chrome ratio: the code and content take center stage.

2. **Developer-Focused & Context-Aware**
   - Optimized for daily development tasks with immediate visual feedback.
   - Intuitive layout inspired by leading modern dev tools (VS Code, Cursor, Zed, Linear) without cloning any single UI.

3. **Extremely Responsive & Performant**
   - Microsecond UI responses, sub-100ms startup feeling.
   - Zero layout shifts during panel toggling or sidebar resizing.
   - Typing latency must feel instantaneous.

4. **Keyboard-First Design**
   - Every core operation accessible via shortcut or Command Palette (`⌘K` / `Ctrl+K`).
   - Clear visual focus indicators for keyboard navigation.

5. **Dark-Mode-First Aesthetics**
   - Deep, muted background colors (`#0d0e11`, `#14161b`, `#1a1d24`) with harmonious contrast ratios.
   - Vibrant yet controlled accent highlights (`#6366f1` / `#818cf8`) for active states.
   - High text legibility without harsh white-on-black contrast.

6. **Local-First & Native Feeling**
   - Native OS window controls, sleek custom titlebar.
   - Files stored and manipulated directly on the local filesystem. Zero cloud dependency.

---

## Visual Direction & Tokens

### Color Palette (Tailwind / Custom CSS Variables)

- **Background Main**: `#0d0e11` (Deep Charcoal)
- **Background Elevate / Sidebar**: `#13151a` (Dark Slate)
- **Background Surface / Activity Bar**: `#181b22` (Muted Surface)
- **Border / Divider**: `#262a36` (Subtle Slate Border)
- **Primary Accent**: `#6366f1` (Indigo / Electric Iris)
- **Primary Accent Hover**: `#4f46e5`
- **Text Main**: `#f3f4f6` (High contrast, crisp readable white)
- **Text Muted**: `#9ca3af` (Secondary metadata, file trees)
- **Text Subtle**: `#4b5563` (Inactive tabs, line numbers)
- **Status Indicators**:
  - Dirty / Unsaved: `#eab308` (Amber)
  - Success / Saved: `#22c55e` (Emerald)
  - Error / Warning: `#ef4444` (Rose)

---

## Spacing & Layout Grid

- **Base Unit**: 4px grid (`4px`, `8px`, `12px`, `16px`, `24px`).
- **Activity Bar Width**: 48px fixed.
- **Sidebar Width**: 240px default (collapsible / resizable 180px–480px).
- **Status Bar Height**: 24px fixed.
- **Header / Tab Bar Height**: 36px fixed.

---

## Typography Philosophy

- **UI Font**: `Inter`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif`.
- **Editor Font**: `JetBrains Mono`, `Fira Code`, `SF Mono`, `monospace`.
- **Font Sizes**:
  - Status Bar & Metadata: `11px` / `12px`
  - Sidebar & Tabs: `13px`
  - Code Editor: `14px` (Line height 1.5–1.6)

---

## Interaction & Panel Behavior

- **Resizable Panels**: Smooth pointer dragging with min/max bounds and quick double-click to reset.
- **Sidebar Toggle**: Toggle via `⌘B` or Activity Bar click with immediate CSS transitions.
- **Tabs**: Compact tabs with close button on hover/active, unsaved dot indicator.
