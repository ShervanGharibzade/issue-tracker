"use client";

import { memo, useEffect, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditIcon from "@mui/icons-material/Edit";
import { motion } from "framer-motion";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Button from "@/components/Button";
import ConfirmDialog from "@/components/ConfirmDialog";
import InlineInput from "@/components/InlineInput";
import Menu from "@/components/Menu";
import { useAppDispatch } from "@/redux/hooks";
import { addTask, deleteColumn, renameColumn } from "@/redux/slices/userSlice";
import Task from "./task";
import type { Column as ColumnType, Task as TaskType } from "@/types";

interface ColumnProps {
  column: ColumnType;
  /** Tasks currently visible (after the search filter). */
  tasks: TaskType[];
  /** Number of tasks in the column regardless of the filter. */
  totalCount: number;
  isFiltering: boolean;
}

function Column({ column, tasks, totalCount, isFiltering }: ColumnProps) {
  const dispatch = useAppDispatch();
  const [isRenaming, setIsRenaming] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const {
    setNodeRef,
    setActivatorNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id, data: { type: "Column" } });

  // Keep the newest task in view while adding several in a row.
  useEffect(() => {
    if (isComposing) {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
    }
  }, [tasks.length, isComposing]);

  function submitTask() {
    const description = draft.trim();
    if (!description) return;
    dispatch(
      addTask({
        workSpaceId: column.workSpaceId,
        columnId: column.id,
        description,
      })
    );
    setDraft("");
  }

  function closeComposer() {
    setIsComposing(false);
    setDraft("");
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={{ transform: CSS.Transform.toString(transform), transition }}
        className={`flex max-h-full w-72 shrink-0 ${isDragging ? "opacity-30" : ""}`}
      >
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          aria-label={`Column ${column.title}`}
          className="flex max-h-full w-full flex-col rounded-xl border border-zinc-800 bg-zinc-900 shadow-lg shadow-purple-950/30"
        >
          <header className="flex items-center gap-1 border-b border-zinc-800 p-2">
            <button
              ref={setActivatorNodeRef}
              {...attributes}
              {...listeners}
              type="button"
              aria-label={`Reorder column ${column.title}`}
              className="icon-btn cursor-grab touch-none active:cursor-grabbing"
            >
              <DragIndicatorIcon fontSize="small" />
            </button>

            {isRenaming ? (
              <InlineInput
                initialValue={column.title}
                ariaLabel="Column name"
                className="min-w-0 flex-1"
                onCommit={(title) => {
                  dispatch(renameColumn({ id: column.id, title }));
                  setIsRenaming(false);
                }}
                onCancel={() => setIsRenaming(false)}
              />
            ) : (
              <h2 className="min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => setIsRenaming(true)}
                  title="Click to rename"
                  className="w-full truncate rounded px-1 py-1 text-left font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                >
                  {column.title}
                </button>
              </h2>
            )}

            <span
              className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs font-medium tabular-nums text-zinc-300"
              aria-label={`${totalCount} tasks`}
            >
              {isFiltering ? `${tasks.length}/${totalCount}` : totalCount}
            </span>

            <Menu
              label={`Options for column ${column.title}`}
              items={[
                {
                  label: "Rename column",
                  icon: <EditIcon fontSize="small" />,
                  onSelect: () => setIsRenaming(true),
                },
                {
                  label: "Delete column",
                  icon: <DeleteIcon fontSize="small" />,
                  danger: true,
                  onSelect: () => setIsConfirmingDelete(true),
                },
              ]}
            />
          </header>

          <div
            ref={listRef}
            className="min-h-16 flex-1 space-y-2 overflow-y-auto p-2"
          >
            <SortableContext
              items={tasks.map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              {tasks.map((task) => (
                <Task key={task.id} task={task} />
              ))}
            </SortableContext>
            {tasks.length === 0 && !isComposing && (
              <p className="rounded-lg border border-dashed border-zinc-700 px-3 py-4 text-center text-xs text-zinc-500">
                {isFiltering && totalCount > 0
                  ? "No matching tasks"
                  : "No tasks yet. Add one or drop a task here."}
              </p>
            )}
          </div>

          <footer className="border-t border-zinc-800 p-2">
            {isComposing ? (
              <div className="space-y-2">
                <textarea
                  autoFocus
                  rows={2}
                  maxLength={280}
                  value={draft}
                  aria-label={`New task in ${column.title}`}
                  placeholder="What needs to be done?"
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      submitTask();
                    } else if (event.key === "Escape") {
                      closeComposer();
                    }
                  }}
                  className="field resize-none"
                />
                <div className="flex items-center gap-2">
                  <Button
                    onClick={submitTask}
                    disabled={!draft.trim()}
                    className="px-3 py-1.5"
                  >
                    Add task
                  </Button>
                  <button
                    type="button"
                    onClick={closeComposer}
                    className="icon-btn"
                    aria-label="Cancel adding task"
                  >
                    <CloseIcon fontSize="small" />
                  </button>
                  <span className="ml-auto text-xs text-zinc-500">
                    Enter to add
                  </span>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsComposing(true)}
                className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              >
                <AddIcon fontSize="small" />
                Add task
              </button>
            )}
          </footer>
        </motion.section>
      </div>

      <ConfirmDialog
        open={isConfirmingDelete}
        title={`Delete "${column.title}"?`}
        message={
          totalCount > 0
            ? `This column and its ${totalCount} ${
                totalCount === 1 ? "task" : "tasks"
              } will be permanently removed.`
            : "This empty column will be removed."
        }
        confirmLabel="Delete column"
        destructive
        onCancel={() => setIsConfirmingDelete(false)}
        onConfirm={() => {
          setIsConfirmingDelete(false);
          dispatch(deleteColumn(column.id));
        }}
      />
    </>
  );
}

export default memo(Column);
