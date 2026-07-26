# Engineering Memory

## Current Phase
- **Advanced Editor Workspace & Side-by-Side Dual View** (COMPLETED)

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
- Added Advanced Editor Workspace Features:
  - **Split Editor Workspace**: Side-by-side dual Monaco container view (`⌘\`) for editing two files simultaneously.
  - **Breadcrumbs Navigation Bar**: Interactive path bar (`BreadcrumbsBar.tsx`) above Monaco with file/folder icons.
  - **Format Document**: `⌥⇧F` / `Alt+Shift+F` native document formatting action.
  - **Sticky Scroll & Bracket Colorization**: Enabled in Monaco for high readability.
  - **Editor Keybindings Reference**: Modal overlay (`KeybindingsModal.tsx` / `⌘K ⌘S`).
- Validated build & type safety (`npm run build` completed in 1.06s with 0 errors).

---

## Current Work
- All non-AI Editor Workspace features, filesystem CRUD operations, interactive terminal, context menus, cursor indicators, UX tools, and documentation are complete.

---

## Architecture Decisions
- **Side-by-Side Dual Container**: `EditorWorkspace.tsx` manages primary and secondary active tab IDs with independent Monaco instances.
- **Path Segment Tokenizer**: `BreadcrumbsBar.tsx` breaks down file paths into clickable folder and file icon badges.

---

## Known Issues
- Full native desktop binary execution (`tauri dev`) requires Rust compiler toolchain (`rustc`/`cargo`) on host environment.
