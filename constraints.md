# Engineering Constraints & Guidelines

## Code Quality & Type Safety

1. **TypeScript Strict Mode**
   - `"strict": true` MUST be enabled in `tsconfig.json`.
   - Avoid `any` at all costs. Use `unknown`, generics, or explicit union types.
   - All function signatures must have explicit return types for clarity.

2. **Component Architecture**
   - Keep React components small, focused, and single-purpose (< 150 lines per component where possible).
   - Organize code using feature-based architecture (`src/features/<feature-name>/`).
   - Do NOT create giant global Zustand stores. Use modular, domain-specific stores (e.g. `layoutStore`, `editorStore`, `workspaceStore`).

3. **Dependencies**
   - Avoid unnecessary third-party npm packages.
   - Strictly forbid installing speculative dependencies for future phases (e.g. AI libraries, databases, terminal emulators).

4. **No Premature Abstraction or Optimization**
   - Write simple, explicit code first. Abstract only after duplicate patterns clearly emerge (Rule of Three).
   - Optimize only when concrete performance benchmarks indicate a bottleneck.

---

## Native Architecture & Security Boundaries

1. **Tauri IPC Boundary**
   - React components must NEVER directly invoke raw low-level filesystem or system commands.
   - All native interactions must pass through typed application services inside `src/services/`.
   - Native Rust code in `src-tauri/` must expose narrow, sanitized, typed IPC commands.

2. **Error Handling**
   - Never swallow exceptions silently.
   - Use explicit error boundaries in React and typed `Result<T, E>` returns in Rust Tauri commands.
   - Present human-readable error messages via the status bar or notification toasts.

3. **Portability & OS Safety**
   - Development target is macOS, but all file paths and OS interactions must handle cross-platform path separators (`/` vs `\`) cleanly.

---

## Naming Conventions & Project Structure

- **Components**: `PascalCase.tsx` (e.g. `EditorTabs.tsx`, `SidebarExplorer.tsx`).
- **Hooks**: `camelCase.ts` prefixed with `use` (e.g. `useKeyboardShortcuts.ts`).
- **Services & Utils**: `camelCase.ts` (e.g. `fileSystemService.ts`, `formatters.ts`).
- **Stores**: `camelCase.ts` suffixed with `Store` (e.g. `layoutStore.ts`).
- **Types**: `camelCase.ts` or `domain.types.ts` (e.g. `editor.types.ts`).
- **CSS / Styling**: Utility classes via Tailwind CSS (`tailwind.config.js`), supplemented by CSS variables in `globals.css`.
