# Engineering Memory

## Current Phase
- **The Real System Explorer & Native macOS Finder Folder Picker** (COMPLETED)

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
- Added Right-Click Context Menu for File Explorer Tree (`FileTreeContextMenu.tsx`).
- Added Live Cursor Position Indicator (`Ln X, Col Y`).
- Added Advanced Editor Workspace Features (Split view, Breadcrumbs bar, Format Document `⌥⇧F`, Keybindings modal).
- Added **The Real System Explorer**:
  - **Native macOS Finder Folder Dialog**: Integrated `rfd` (rusty file dialogs) in Rust for picking real directories on Mac disk via `open_folder_dialog`.
  - **Workspace Auto-Load**: Automatically loads the workspace root directory on launch.
  - **Persistent Expanded States**: Subfolder expansion states are preserved across file CRUD operations and refreshes.
- Validated build & type safety (`npm run build` completed in 1.03s with 0 errors).

---

## Current Work
- All non-AI core desktop code editor features, real system file explorer, native folder dialogs, interactive terminal, context menus, cursor indicators, UX tools, and documentation are complete.

---

## Architecture Decisions
- **Native OS Folder Dialog**: `rfd::AsyncFileDialog` in `src-tauri/src/commands/fs.rs` bound to `open_folder_dialog` Tauri IPC.
- **Tree Expansion Persistence**: `workspaceStore.ts` tracks expanded node IDs across directory re-scans.

---

## Known Issues
- Full native desktop binary execution (`tauri dev`) requires Rust compiler toolchain (`rustc`/`cargo`) on host environment.
