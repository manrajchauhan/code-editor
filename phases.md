# Project Development Roadmap

---

## [COMPLETED] Phase 0 — Foundation & Application Shell

**Objective**: Establish the desktop application foundation, repository architecture, styling, project documentation, and initial UI shell layout.

### Completed Tasks
- [x] Project Documentation (`vibe.md`, `prd.md`, `constraints.md`, `context.md`, `examples.md`, `phases.md`, `memory.md`)
- [x] Configure Vite + React + TypeScript + Tailwind CSS
- [x] Configure Tauri 2 application shell (`src-tauri/`)
- [x] Implement UI Base Shell Layout (Activity Bar, Sidebar, Editor Workspace, Status Bar)
- [x] Verify local dev build (`npm run build`) and typecheck.

---

## [COMPLETED] Phase 1 — Editor Core

**Objective**: Integrate Monaco Editor into the Editor Workspace area with multi-tab support, dirty state tracking, and keyboard shortcuts.

### Completed Tasks
- [x] Integrate Monaco Editor (`@monaco-editor/react`) with dark theme (`vs-dark`), line numbers, and minimap.
- [x] Implement multi-tab management (open, switch, close tabs, create untitled tabs).
- [x] Language auto-detection from file extensions (`.ts`, `.tsx`, `.js`, `.json`, `.css`, `.md`, `.rs`, `.html`, `.py`).
- [x] Dirty state tracking (amber unsaved dot on tab and status bar alert).
- [x] Save changes (`⌘S` / `Ctrl+S`) with typed Tauri service fallback layer.
- [x] Global keyboard shortcuts (`⌘S` save, `⌘W` close tab, `⌘N` new tab, `⌘B` toggle sidebar).

---

## [COMPLETED] Phase 2 — Workspace & File Explorer

**Objective**: Native open folder dialog, recursive expandable file tree, file reading into Monaco tabs, and file CRUD operations.

### Completed Tasks
- [x] Open folder functionality via native Tauri file dialog (with browser dev mode fallback).
- [x] Expandable recursive file tree rendering (`FileTreeItem.tsx`, `FileExplorerTree.tsx`).
- [x] File selection to open contents directly into Monaco Editor tabs.
- [x] File and folder CRUD operations (New File, New Folder, Refresh Explorer, Delete Item).
- [x] Rust Tauri 2 IPC commands in `src-tauri/src/commands/fs.rs` (`read_directory_tree`, `read_file_content`, `write_file_content`, `create_file_node`, `create_dir_node`, `delete_node`).

---

## [COMPLETED] Phase 3 — Editor UX & Search

**Objective**: Command Palette (`⌘K` / `⌘P`), real-time global workspace search, customizable application settings, and enhanced status bar.

### Completed Tasks
- [x] Command Palette (`CommandPaletteModal.tsx`) with fuzzy matching, keyboard navigation (Arrow keys, Enter), and instant command execution (`⌘K` / `⌘P`).
- [x] Global Workspace Search (`WorkspaceSearchPane.tsx`) searching opened directory files in real time.
- [x] Application Settings Store (`settingsStore.ts`) & Settings Pane (`SettingsPane.tsx`) controlling Monaco font size, tab size, theme, word wrap, and minimap.
- [x] Enhanced Status Bar (`StatusBar.tsx`) with clickable `⌘K` pill, tab size, encoding, and active language status.

---

## [COMPLETED] Phase 4 — Developer Tooling & Layout Refinements

**Objective**: Interactive panel resizer, file/folder renaming, bottom Problems & Diagnostics panel, and global text replace.

### Completed Tasks
- [x] Interactive Sidebar Panel Resizer (`PanelResizer.tsx`) allowing smooth pointer dragging between 180px and 480px.
- [x] Inline File & Folder Renaming (`F2` / pencil icon) in the file explorer tree.
- [x] Collapsible Bottom Problems & Diagnostics Panel (`DiagnosticsPanel.tsx` / `⌘J`).
- [x] Advanced Search & Replace (`WorkspaceSearchPane.tsx`) allowing global multi-file text replacement.

---

## [FUTURE] Phase 5 — AI Foundation (Postponed per scope restrictions)
- Provider abstraction layer.
- Local inference provider support.
- Model management interface.

---

## [FUTURE] Phase 6 — AI Coding Assistance (Postponed per scope restrictions)
- AI chat interface.
- Code context selection.
- Inline code diff generation & review (apply/reject changes).

---

## [FUTURE] Phase 7 — Autonomous Agent System (Postponed per scope restrictions)
- Controlled agent tools execution.
- Full repository indexing and semantic understanding.
- Checkpoint/rollback state management.
