"use client";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectActiveColumns,
  selectActiveTasks,
  selectActiveWorkSpace,
  selectSearchQuery,
  setSearchQuery,
} from "@/redux/slices/userSlice";

function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

export default function BoardToolbar() {
  const dispatch = useAppDispatch();
  const workSpace = useAppSelector(selectActiveWorkSpace);
  const columns = useAppSelector(selectActiveColumns);
  const tasks = useAppSelector(selectActiveTasks);
  const query = useAppSelector(selectSearchQuery);

  if (!workSpace) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-zinc-800 bg-zinc-900/60 px-4 py-3">
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-xl font-bold text-white">
          {workSpace.title}
        </h1>
        <p className="text-xs text-zinc-400">
          {plural(tasks.length, "task")} · {plural(columns.length, "column")}
        </p>
      </div>

      <div className="relative w-full sm:w-72">
        <label htmlFor="task-search" className="sr-only">
          Search tasks on this board
        </label>
        <SearchIcon
          fontSize="small"
          className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500"
        />
        <input
          id="task-search"
          type="search"
          value={query}
          onChange={(event) => dispatch(setSearchQuery(event.target.value))}
          placeholder="Search tasks or people…"
          autoComplete="off"
          className="field pl-9 pr-9 [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => dispatch(setSearchQuery(""))}
            aria-label="Clear search"
            className="icon-btn absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </button>
        )}
      </div>
    </div>
  );
}
