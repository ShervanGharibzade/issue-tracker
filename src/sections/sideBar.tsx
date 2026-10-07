"use client";

import { useEffect, useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import ConfirmDialog from "@/components/ConfirmDialog";
import InlineInput from "@/components/InlineInput";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addWorkSpace,
  deleteWorkSpace,
  renameWorkSpace,
  selectActiveWorkSpaceId,
  selectWorkSpace,
  selectWorkSpaces,
  toggleFavorite,
} from "@/redux/slices/userSlice";
import type { Workspace } from "@/types";

const rowAction =
  "icon-btn h-7 w-7 opacity-0 focus-visible:opacity-100 group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100";

export default function SideBar() {
  const dispatch = useAppDispatch();
  const workSpaces = useAppSelector(selectWorkSpaces);
  const activeId = useAppSelector(selectActiveWorkSpaceId);

  const [collapsed, setCollapsed] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Workspace | null>(null);

  // Start collapsed on small screens so the board gets the space.
  useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) setCollapsed(true);
  }, []);

  // Favourites first; Array.sort is stable so the rest keep their order.
  const sorted = useMemo(
    () =>
      [...workSpaces].sort(
        (a, b) => Number(b.isFavorite) - Number(a.isFavorite)
      ),
    [workSpaces]
  );

  const toggle = (
    <button
      type="button"
      onClick={() => setCollapsed((value) => !value)}
      className="icon-btn"
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      aria-expanded={!collapsed}
    >
      {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
    </button>
  );

  return (
    <>
      <aside
        aria-label="Boards"
        className={`flex shrink-0 flex-col border-r border-zinc-800 bg-zinc-900/60 transition-[width] duration-200 ${
          collapsed ? "w-14" : "w-64"
        }`}
      >
        {collapsed ? (
          <nav className="flex flex-1 flex-col items-center gap-2 overflow-y-auto py-3">
            {toggle}
            {sorted.map((workSpace) => (
              <button
                key={workSpace.id}
                type="button"
                title={workSpace.title}
                aria-label={`Open board ${workSpace.title}`}
                aria-current={workSpace.id === activeId ? "page" : undefined}
                onClick={() => dispatch(selectWorkSpace(workSpace.id))}
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
                  workSpace.id === activeId
                    ? "bg-purple-600 text-white"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                }`}
              >
                {workSpace.title.charAt(0)}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setCollapsed(false);
                setIsCreating(true);
              }}
              className="icon-btn"
              aria-label="New board"
            >
              <AddIcon fontSize="small" />
            </button>
          </nav>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-zinc-800 py-3 pl-4 pr-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
                Your boards
              </h2>
              {toggle}
            </div>

            <nav className="flex-1 overflow-y-auto p-2">
              <ul className="space-y-1">
                {sorted.map((workSpace) => {
                  const isActive = workSpace.id === activeId;
                  return (
                    <li
                      key={workSpace.id}
                      className={`group flex items-center gap-0.5 rounded-md border-l-2 py-1 pl-2 pr-1 transition-colors ${
                        isActive
                          ? "border-purple-500 bg-white/10"
                          : "border-transparent hover:bg-white/5"
                      }`}
                    >
                      {renamingId === workSpace.id ? (
                        <InlineInput
                          initialValue={workSpace.title}
                          ariaLabel="Board name"
                          className="min-w-0 flex-1"
                          onCommit={(title) => {
                            dispatch(
                              renameWorkSpace({ id: workSpace.id, title })
                            );
                            setRenamingId(null);
                          }}
                          onCancel={() => setRenamingId(null)}
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            dispatch(selectWorkSpace(workSpace.id))
                          }
                          aria-current={isActive ? "page" : undefined}
                          className="min-w-0 flex-1 truncate rounded py-1.5 text-left text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                        >
                          {workSpace.title}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => dispatch(toggleFavorite(workSpace.id))}
                        aria-pressed={workSpace.isFavorite}
                        aria-label={
                          workSpace.isFavorite
                            ? `Remove ${workSpace.title} from favorites`
                            : `Add ${workSpace.title} to favorites`
                        }
                        className={`icon-btn h-7 w-7 ${
                          workSpace.isFavorite ? "text-amber-400" : ""
                        }`}
                      >
                        {workSpace.isFavorite ? (
                          <StarIcon fontSize="small" />
                        ) : (
                          <StarOutlineIcon fontSize="small" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setRenamingId(workSpace.id)}
                        aria-label={`Rename board ${workSpace.title}`}
                        className={rowAction}
                      >
                        <EditIcon sx={{ fontSize: 16 }} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(workSpace)}
                        aria-label={`Delete board ${workSpace.title}`}
                        className={`${rowAction} hover:text-red-400`}
                      >
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </button>
                    </li>
                  );
                })}
              </ul>

              {sorted.length === 0 && !isCreating && (
                <p className="px-2 py-4 text-center text-sm text-zinc-500">
                  You have no boards yet.
                </p>
              )}

              {isCreating ? (
                <div className="mt-2 space-y-1 px-1">
                  <InlineInput
                    ariaLabel="New board name"
                    placeholder="Board name"
                    onCommit={(title) => {
                      dispatch(addWorkSpace(title));
                      setIsCreating(false);
                    }}
                    onCancel={() => setIsCreating(false)}
                  />
                  <p className="text-xs text-zinc-500">
                    Enter to create, Escape to cancel.
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsCreating(true)}
                  className="mt-2 flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                >
                  <AddIcon fontSize="small" />
                  New board
                </button>
              )}
            </nav>
          </>
        )}
      </aside>

      <ConfirmDialog
        open={pendingDelete !== null}
        title={`Delete "${pendingDelete?.title ?? ""}"?`}
        message="The board with all of its columns and tasks will be permanently removed."
        confirmLabel="Delete board"
        destructive
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) dispatch(deleteWorkSpace(pendingDelete.id));
          setPendingDelete(null);
        }}
      />
    </>
  );
}
