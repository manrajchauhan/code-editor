# Engineering Memory

## Current Phase
- **Explorer Context Menu, Live Cursor Position Indicator & Status Bar Refinements** (COMPLETED)

---

## Completed Work
- Reorganized desktop code editor into dedicated folder: `/Volumes/Personal Space/Cross Platform Apps/code-editor/`.
- Completed Phase 0 Foundation Application Shell.
- Completed Phase 1 Editor Core (Monaco, Tabs, Dirty State, Save).
- Completed Phase 2 Workspace & File Explorer (Folder picker, recursive tree).
- Completed Phase 3 Editor UX & Search (Command Palette, Settings, Global Search).
- Completed Phase 4 Developer Tooling & Layout Refinements (Panel resizer, Diagnostics drawer).
- Added Real-time System Running Status Monitor (`SystemStatusModal.tsx` & RAM heap indicator pill).
- Added Full Filesystem CRUD Operations (Create, Read, Update, Rename, Duplicate, Delete).
- Added Full Integrated Terminal (`@xterm/xterm` & `@xterm/addon-fit` canvas drawer).
- Added Right-Click Context Menu for File Explorer Tree (`FileTreeContextMenu.tsx`):
  - Actions: New File, New Folder, Rename (`F2`), Duplicate, Copy Path, Delete.
- Added Live Cursor Position Indicator (`Ln X, Col Y`):
  - Listens to Monaco `onDidChangeCursorPosition` events and updates status bar coordinates in real time.
- Validated build & type safety (`npm run build` completed in 1.86s with 0 errors).
- Pushed commit `77bbd00` to GitHub `https://github.com/manrajchauhan/code-editor.git` (main).

---

## Current Work
- All non-AI core desktop code editor features, filesystem CRUD operations, interactive terminal, context menus, cursor indicators, UX tools, and documentation are complete and published.

---

## Architecture Decisions
- **Full FS Native IPC**: Tauri Rust handlers in `src-tauri/src/commands/fs.rs` with web dev fallback in `fileSystemService.ts`.
- **Canvas Terminal**: `@xterm/xterm` canvas rendering with automatic `@xterm/addon-fit` sizing.
- **Monaco Cursor Event Stream**: Efficient position listener bound to Zustand `editorStore`.

---

## Known Issues
- Full native desktop binary execution (`tauri dev`) requires Rust compiler toolchain (`rustc`/`cargo`) on host environment.
