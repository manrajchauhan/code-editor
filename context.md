# Project Context & Architecture

## Overview

This repository houses a **Local-First Desktop Code Editor** built with **Tauri 2**, **React**, **TypeScript**, **Vite**, **Monaco Editor**, **Zustand**, and **Tailwind CSS**.

---

## Directory Structure

```text
/
├── vibe.md                 # Design & UX philosophy
├── prd.md                  # Product Requirements Document
├── constraints.md          # Engineering constraints & coding standards
├── context.md              # Architectural context & directory layout
├── examples.md             # Standard implementation patterns
├── phases.md               # Development roadmap (Phase 0 to Phase 7)
├── memory.md               # Persistent project memory log
├── package.json            # Node.js dependencies & scripts
├── tsconfig.json           # Strict TypeScript configuration
├── vite.config.ts          # Vite build configuration
├── tailwind.config.js      # Tailwind styling configuration
├── src/                    # Frontend React application
│   ├── app/                # Main application container & shell layout
│   ├── components/         # Shared UI components
│   │   └── ui/             # Reusable atomic UI elements (Buttons, Icons, Resizers)
│   ├── features/           # Feature modules
│   │   ├── activity-bar/   # Left navigation activity bar
│   │   ├── sidebar/        # Collapsible explorer/view panel
│   │   ├── editor/         # Monaco editor workspace & tabs
│   │   ├── workspace/      # Project directory explorer (Phase 2)
│   │   ├── search/         # Workspace search (Phase 3)
│   │   └── settings/       # App preferences (Phase 3)
│   ├── hooks/              # Reusable React hooks
│   ├── stores/             # Modular Zustand state stores
│   ├── services/           # Typed Application Services & IPC wrappers
│   ├── types/              # TypeScript interface & type definitions
│   ├── utils/              # Pure utility functions
│   └── styles/             # Global CSS & Tailwind imports
└── src-tauri/              # Native Tauri Rust application
    ├── src/
    │   ├── commands/       # Tauri command handlers
    │   ├── services/       # Rust native system services
    │   ├── state/          # Rust managed application state
    │   ├── lib.rs          # Library entry point
    │   └── main.rs         # Tauri application main entry
    ├── capabilities/       # Tauri permission capabilities
    └── tauri.conf.json     # Tauri app configuration
```

---

## Data & IPC Flow Architecture

```text
┌──────────────────────────────────────────────────────────┐
│                   React Component Tree                   │
└────────────────────────────┬─────────────────────────────┘
                             │ Calls typed service methods
                             ▼
┌──────────────────────────────────────────────────────────┐
│              Application Services Layer                  │
│                (src/services/tauri/)                     │
└────────────────────────────┬─────────────────────────────┘
                             │ invoke('command_name', payload)
                             ▼
┌──────────────────────────────────────────────────────────┐
│               Tauri Native Command Layer                 │
│              (src-tauri/src/commands/)                   │
└────────────────────────────┬─────────────────────────────┘
                             │ Native OS operations
                             ▼
┌──────────────────────────────────────────────────────────┐
│                  Host System / OS APIs                   │
└──────────────────────────────────────────────────────────┘
```

---

## Guide for AI Coding Agents

When working in this codebase:
1. Read `context.md`, `constraints.md`, `phases.md`, and `memory.md` before making architectural decisions.
2. Ensure new components live within their appropriate `src/features/<feature>/` directory.
3. Keep state feature-scoped in `src/stores/`.
4. Update `memory.md` with significant architectural decisions and progress upon completing milestones.
5. Do NOT install packages for future phases (e.g. AI, database, terminal).
