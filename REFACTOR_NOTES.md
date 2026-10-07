# Refactor notes

## Logic bugs fixed
- Drag & drop never reached Redux: moved tasks / reordered columns snapped back on the next render. Now `moveTask` / `reorderColumns` reducers own the order, and Escape cancels a drag and restores the snapshot.
- Column reorder used columns from *all* boards; task `SortableContext` was created once per task. Both fixed (one context per column, one for columns).
- Hardcoded workspace id `"1c1h2"` in delete/rename column removed.
- Column rename dispatched on every keystroke; now commits on Enter/blur, cancels on Escape, rejects empty names.
- The top menu always showed the *first* board's title (and crashed with zero boards). It now shows the active board and handles the empty state.
- Deleting a board left its columns/tasks behind and kept it selected. Now cascades and selects another board.
- Edit-task modal: duplicate React keys, stale `task.assignment` reads, edit/delete icon clicks also opening the modal, saving only on Enter. Rewritten as a draft form with Save/Cancel.
- Login/auth state was lost on refresh and the password field started as plain text. Auth and data persist; password is masked with a toggle; errors are shown.
- Invalid HTML (`<h2>`/`<div>` inside `<p>`), missing keys, unused `Modal` import of `domain`, barrel icon import.
- Fake 3-second loading timer removed (it also leaked). The app waits only for storage hydration.
- Typos fixed across names and UI (`isFovrite`, `eidtTask`, "Issuse", "Dengers", "analize").

## UI / UX
- Consistent design tokens (`.icon-btn`, `.field`, `Button` variants), visible focus rings, responsive layout (`h-dvh`, collapsible sidebar, auto-collapsed on mobile).
- Inline composers for tasks / columns / boards instead of creating "new column" placeholders; new boards get To do / In progress / Done.
- Confirmation dialogs for destructive actions; empty states; task counts; search with per-column match counts.
- Dead navigation tabs ("My Tasks", "analize", "Dengers", "My Boards") removed: they did nothing. Replaced by a toolbar with the board title, stats and search.
- Accessible dialogs (focus trap, Escape, restore focus), menus (arrow keys), aria labels, `prefers-reduced-motion`.

## Notes
- I could not run `npm install` in my sandbox (no registry access), so the code was not compiled here. Please run `npm install && npm run typecheck && npm run build` once. 
- `package.json` dependencies are untouched so `package-lock.json` stays valid. Optional cleanup: `npm i @dnd-kit/utilities` (imported directly, currently only a transitive dependency) and `npm rm uuid @types/uuid` (no longer used).
- Saved data uses a new storage key/version, so old state is simply ignored.
