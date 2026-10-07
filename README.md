# Issue Tracker

A drag-and-drop kanban board for tracking issues across several boards.
Built with Next.js 14 (App Router), Redux Toolkit, dnd-kit, Tailwind CSS and framer-motion.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # tsc --noEmit
npm run lint
npm run build
```

Demo login: `test` / `123456` (there is no backend; credentials are checked locally).

## Features

- Multiple boards: create, rename, favourite (pinned to the top) and delete
- Columns: add, rename (click the title), reorder by dragging the grip, delete
- Tasks: add (Enter), edit in a dialog, assign people, delete, drag between columns
- Search across task text and assignees
- Everything is saved to `localStorage`, including the signed-in state
- Keyboard accessible drag & drop, dialogs with focus trapping, reduced-motion support

## Project structure

```
src/
  app/            routes (board page, login) and global styles
  components/     generic UI: Button, Modal, ConfirmDialog, Menu, Avatar, InlineInput, Loading
  sections/       feature UI: header, sideBar, boardToolbar, workSpace (DnD), column, task, taskCard, editTask, addColumn
  redux/          store factory, typed hooks, persistence, userSlice (state, reducers, selectors)
  types/          shared domain types
  utils/          avatar helpers
```
