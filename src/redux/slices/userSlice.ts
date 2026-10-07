import {
  createSelector,
  createSlice,
  nanoid,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { Column, Task, UserProfile, Workspace } from "@/types";

/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */

export interface PersistedState {
  auth: boolean;
  workSpaceId: string;
  workSpaces: Workspace[];
  columns: Column[];
  tasks: Task[];
}

interface UserState extends PersistedState {
  /** True once saved data has been read from storage (client only). */
  hydrated: boolean;
  searchQuery: string;
  user: UserProfile;
}

export const DEFAULT_COLUMN_TITLES = ["To do", "In progress", "Done"] as const;

const initialState: UserState = {
  hydrated: false,
  auth: false,
  searchQuery: "",
  user: { name: "test", lastName: "user" },
  workSpaceId: "ws-chat",
  workSpaces: [
    { id: "ws-chat", title: "Chat app", isFavorite: true },
    { id: "ws-todo", title: "Todo list", isFavorite: false },
    { id: "ws-product", title: "New product", isFavorite: false },
  ],
  columns: [
    { id: "col-chat-backlog", workSpaceId: "ws-chat", title: "Backlog" },
    { id: "col-chat-progress", workSpaceId: "ws-chat", title: "In progress" },
    { id: "col-chat-done", workSpaceId: "ws-chat", title: "Done" },
    { id: "col-todo-backlog", workSpaceId: "ws-todo", title: "Backlog" },
    { id: "col-todo-progress", workSpaceId: "ws-todo", title: "In progress" },
    { id: "col-todo-done", workSpaceId: "ws-todo", title: "Done" },
    { id: "col-product-backlog", workSpaceId: "ws-product", title: "Backlog" },
  ],
  tasks: [
    {
      id: "task-1",
      workSpaceId: "ws-chat",
      columnId: "col-chat-backlog",
      description: "Design the message bubble component",
      assignees: ["mohamad", "shervan"],
    },
    {
      id: "task-2",
      workSpaceId: "ws-chat",
      columnId: "col-chat-backlog",
      description: "Create a reusable modal",
      assignees: ["ahmad", "hosein"],
    },
    {
      id: "task-3",
      workSpaceId: "ws-chat",
      columnId: "col-chat-progress",
      description: "Fix responsive layout on small screens",
      assignees: ["payam", "shervan"],
    },
    {
      id: "task-4",
      workSpaceId: "ws-todo",
      columnId: "col-todo-backlog",
      description: "Create button component",
      assignees: ["mohamad", "shervan", "ali"],
    },
    {
      id: "task-5",
      workSpaceId: "ws-todo",
      columnId: "col-todo-backlog",
      description: "Create modal",
      assignees: ["ali"],
    },
    {
      id: "task-6",
      workSpaceId: "ws-todo",
      columnId: "col-todo-progress",
      description: "Persist todos in local storage",
      assignees: ["mohamad", "shervan", "ali", "payam", "hosein", "ahmad"],
    },
    {
      id: "task-7",
      workSpaceId: "ws-product",
      columnId: "col-product-backlog",
      description: "Write the product brief",
      assignees: [],
    },
    {
      id: "task-8",
      workSpaceId: "ws-product",
      columnId: "col-product-backlog",
      description: "Collect user feedback",
      assignees: ["ali"],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Moves an item inside an (immer draft) array. */
function moveItem<T>(list: T[], from: number, to: number) {
  const [item] = list.splice(from, 1);
  list.splice(to, 0, item);
}

function normalizeAssignees(names: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of names) {
    const name = raw.trim();
    const key = name.toLowerCase();
    if (!name || seen.has(key)) continue;
    seen.add(key);
    result.push(name);
  }
  return result;
}

/* ------------------------------------------------------------------ */
/* Slice                                                               */
/* ------------------------------------------------------------------ */

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    /* ---- app / auth ---- */
    hydrate(state, action: PayloadAction<PersistedState | null>) {
      const saved = action.payload;
      if (saved) {
        state.auth = saved.auth;
        state.workSpaces = saved.workSpaces;
        state.columns = saved.columns;
        state.tasks = saved.tasks;
        state.workSpaceId = saved.workSpaces.some(
          (w) => w.id === saved.workSpaceId
        )
          ? saved.workSpaceId
          : saved.workSpaces[0]?.id ?? "";
      }
      state.hydrated = true;
    },
    signIn(state) {
      state.auth = true;
    },
    signOut(state) {
      state.auth = false;
      state.searchQuery = "";
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },

    /* ---- workspaces ---- */
    addWorkSpace: {
      reducer(
        state,
        action: PayloadAction<{
          id: string;
          title: string;
          columnIds: string[];
        }>
      ) {
        const { id, title, columnIds } = action.payload;
        const trimmed = title.trim();
        if (!trimmed) return;
        state.workSpaces.push({ id, title: trimmed, isFavorite: false });
        DEFAULT_COLUMN_TITLES.forEach((columnTitle, index) => {
          state.columns.push({
            id: columnIds[index],
            workSpaceId: id,
            title: columnTitle,
          });
        });
        state.workSpaceId = id;
        state.searchQuery = "";
      },
      prepare(title: string) {
        return {
          payload: {
            id: nanoid(),
            title,
            columnIds: DEFAULT_COLUMN_TITLES.map(() => nanoid()),
          },
        };
      },
    },
    selectWorkSpace(state, action: PayloadAction<string>) {
      if (!state.workSpaces.some((w) => w.id === action.payload)) return;
      if (state.workSpaceId !== action.payload) state.searchQuery = "";
      state.workSpaceId = action.payload;
    },
    renameWorkSpace(
      state,
      action: PayloadAction<{ id: string; title: string }>
    ) {
      const title = action.payload.title.trim();
      const workSpace = state.workSpaces.find((w) => w.id === action.payload.id);
      if (workSpace && title) workSpace.title = title;
    },
    toggleFavorite(state, action: PayloadAction<string>) {
      const workSpace = state.workSpaces.find((w) => w.id === action.payload);
      if (workSpace) workSpace.isFavorite = !workSpace.isFavorite;
    },
    deleteWorkSpace(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.workSpaces = state.workSpaces.filter((w) => w.id !== id);
      state.columns = state.columns.filter((c) => c.workSpaceId !== id);
      state.tasks = state.tasks.filter((t) => t.workSpaceId !== id);
      if (state.workSpaceId === id) {
        state.workSpaceId = state.workSpaces[0]?.id ?? "";
        state.searchQuery = "";
      }
    },

    /* ---- columns ---- */
    addColumn: {
      reducer(
        state,
        action: PayloadAction<{
          id: string;
          workSpaceId: string;
          title: string;
        }>
      ) {
        const { id, workSpaceId, title } = action.payload;
        const trimmed = title.trim();
        if (!trimmed) return;
        if (!state.workSpaces.some((w) => w.id === workSpaceId)) return;
        state.columns.push({ id, workSpaceId, title: trimmed });
      },
      prepare(payload: { workSpaceId: string; title: string }) {
        return { payload: { ...payload, id: nanoid() } };
      },
    },
    renameColumn(state, action: PayloadAction<{ id: string; title: string }>) {
      const title = action.payload.title.trim();
      const column = state.columns.find((c) => c.id === action.payload.id);
      if (column && title) column.title = title;
    },
    deleteColumn(state, action: PayloadAction<string>) {
      state.columns = state.columns.filter((c) => c.id !== action.payload);
      state.tasks = state.tasks.filter((t) => t.columnId !== action.payload);
    },
    reorderColumns(
      state,
      action: PayloadAction<{ activeId: string; overId: string }>
    ) {
      const { activeId, overId } = action.payload;
      if (activeId === overId) return;
      const from = state.columns.findIndex((c) => c.id === activeId);
      const to = state.columns.findIndex((c) => c.id === overId);
      if (from < 0 || to < 0) return;
      moveItem(state.columns, from, to);
    },

    /* ---- tasks ---- */
    addTask: {
      reducer(
        state,
        action: PayloadAction<{
          id: string;
          workSpaceId: string;
          columnId: string;
          description: string;
        }>
      ) {
        const { id, workSpaceId, columnId, description } = action.payload;
        const trimmed = description.trim();
        if (!trimmed) return;
        if (!state.columns.some((c) => c.id === columnId)) return;
        state.tasks.push({
          id,
          workSpaceId,
          columnId,
          description: trimmed,
          assignees: [],
        });
      },
      prepare(payload: {
        workSpaceId: string;
        columnId: string;
        description: string;
      }) {
        return { payload: { ...payload, id: nanoid() } };
      },
    },
    editTask(
      state,
      action: PayloadAction<{
        id: string;
        description: string;
        assignees: string[];
      }>
    ) {
      const task = state.tasks.find((t) => t.id === action.payload.id);
      const description = action.payload.description.trim();
      if (!task || !description) return;
      task.description = description;
      task.assignees = normalizeAssignees(action.payload.assignees);
    },
    deleteTask(state, action: PayloadAction<string>) {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    },
    /**
     * Drag & drop. Dropping on a task puts the dragged task at that task's
     * position (and in its column); dropping on a column appends to it.
     */
    moveTask(
      state,
      action: PayloadAction<{
        activeId: string;
        overId: string;
        overType: "Task" | "Column";
      }>
    ) {
      const { activeId, overId, overType } = action.payload;
      const from = state.tasks.findIndex((t) => t.id === activeId);
      if (from < 0) return;
      const task = state.tasks[from];

      if (overType === "Task") {
        const to = state.tasks.findIndex((t) => t.id === overId);
        if (to < 0 || to === from) return;
        task.columnId = state.tasks[to].columnId;
        task.workSpaceId = state.tasks[to].workSpaceId;
        moveItem(state.tasks, from, to);
        return;
      }

      if (task.columnId === overId) return;
      const column = state.columns.find((c) => c.id === overId);
      if (!column) return;
      task.columnId = column.id;
      task.workSpaceId = column.workSpaceId;
      moveItem(state.tasks, from, state.tasks.length - 1);
    },
    /** Restores a snapshot, used when a drag is cancelled. */
    setTasks(state, action: PayloadAction<Task[]>) {
      state.tasks = action.payload;
    },
  },
});

export default userSlice.reducer;

export const {
  hydrate,
  signIn,
  signOut,
  setSearchQuery,
  addWorkSpace,
  selectWorkSpace,
  renameWorkSpace,
  toggleFavorite,
  deleteWorkSpace,
  addColumn,
  renameColumn,
  deleteColumn,
  reorderColumns,
  addTask,
  editTask,
  deleteTask,
  moveTask,
  setTasks,
} = userSlice.actions;

/* ------------------------------------------------------------------ */
/* Selectors                                                           */
/* ------------------------------------------------------------------ */

export const selectHydrated = (state: RootState) => state.user.hydrated;
export const selectAuth = (state: RootState) => state.user.auth;
export const selectUser = (state: RootState) => state.user.user;
export const selectSearchQuery = (state: RootState) => state.user.searchQuery;
export const selectWorkSpaces = (state: RootState) => state.user.workSpaces;
export const selectActiveWorkSpaceId = (state: RootState) =>
  state.user.workSpaceId;
export const selectAllColumns = (state: RootState) => state.user.columns;
export const selectAllTasks = (state: RootState) => state.user.tasks;

export const selectActiveWorkSpace = createSelector(
  [selectWorkSpaces, selectActiveWorkSpaceId],
  (workSpaces, id) => workSpaces.find((w) => w.id === id) ?? null
);

export const selectActiveColumns = createSelector(
  [selectAllColumns, selectActiveWorkSpaceId],
  (columns, id) => columns.filter((c) => c.workSpaceId === id)
);

export const selectActiveTasks = createSelector(
  [selectAllTasks, selectActiveWorkSpaceId],
  (tasks, id) => tasks.filter((t) => t.workSpaceId === id)
);
