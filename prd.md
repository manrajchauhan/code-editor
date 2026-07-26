# Product Requirements Document (PRD)

## Project Overview

**Product**: Local-First Desktop Code Editor  
**Target Platform**: macOS (Initial target, portable to Linux and Windows)  
**Core Goal**: A fast, local-first code editor application built using Tauri 2, React, TypeScript, Vite, Monaco Editor, Zustand, and Tailwind CSS.

---

## 1. Current Scope — MVP Requirements

### 1.1 Desktop Application Shell
- Cross-platform desktop runtime powered by Tauri 2.
- Native OS window controls (close, minimize, maximize/fullscreen) integrated with a custom titlebar layout.
- Modular layout containing:
  - **Activity Bar** (fixed vertical icons for switching left panel views)
  - **Sidebar Panel** (collapsible file explorer / view pane)
  - **Editor Workspace** (tabbed Monaco code editor container)
  - **Status Bar** (bottom bar displaying document stats, encoding, active branch/status)

### 1.2 Workspace & File Management (Phase 2)
- Open local folder / project directory via native Tauri file dialog.
- Hierarchical file tree displaying folders and files.
- File explorer actions: Create file, Create folder, Rename item, Delete item.
- File watcher to detect external changes to the opened directory.

### 1.3 Code Editor & Tabs (Phase 1)
- Monaco Editor integration for high-performance syntax highlighting, line numbers, and basic code editing.
- Multi-tab support: open multiple files in separate tabs.
- Unsaved / Dirty indicators (e.g. Amber dot on dirty tabs).
- Save changes (`⌘S` / `Ctrl+S`) back to disk using typed Tauri native API commands.

### 1.4 Command Palette & Search (Phase 3)
- Command Palette triggered by `⌘K` or `⌘P` to execute editor commands and navigate files.
- Global file search by name within the active workspace folder.
- Custom keybindings for panel toggle (`⌘B`), file save (`⌘S`), tab close (`⌘W`).

### 1.5 Application Settings & Preferences (Phase 3)
- Basic preferences state (Theme, Font Size, Tab Size, Word Wrap).
- Persistent user settings stored in local app configuration.

---

## 2. Future Scope — Explicitly Postponed

The following features are **strictly out of scope** for the current phases and MUST NOT be implemented or imported:

- ❌ **AI & LLM Features**: Ollama, Gemma, Hugging Face, MLX, AI agents, RAG, vector databases, inline autocomplete, AI chat panels.
- ❌ **Database & Backend Sync**: Application databases, cloud synchronization, user accounts, authentication.
- ❌ **Extensions & Marketplace**: Plugin system, extension APIs, marketplace UI.
- ❌ **Integrated Terminal & Debugger**: Pseudo-terminal runtime (pty), step debugger, breakpoints.
- ❌ **Git Integration**: Source control panel, diff viewer, git blame.
- ❌ **Telemetry & Analytics**: Remote tracking or data collection.

---

## 3. Non-Functional Requirements

### 3.1 Performance
- **Startup Time**: < 1.0 second cold start to interactive state.
- **Input Latency**: < 16ms typing response inside Monaco editor.
- **Memory Footprint**: Sub-200MB baseline RAM consumption.

### 3.2 Security
- Strict Tauri IPC isolation; no arbitrary system execution granted to frontend JavaScript code.
- Narrow, typed Tauri commands for filesystem reads and writes within user-selected directories.

### 3.3 Reliability & Local-First
- Operating completely offline without requiring internet connectivity.
- Immediate atomic file writes to prevent corruption during saves.
