"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  moveTask,
  reorderColumns,
  selectActiveColumns,
  selectActiveTasks,
  selectActiveWorkSpace,
  selectAllTasks,
  selectSearchQuery,
  setTasks,
} from "@/redux/slices/userSlice";
import AddColumn from "./addColumn";
import Column from "./column";
import TaskCard from "./taskCard";
import type { Column as ColumnType, Task } from "@/types";

const EMPTY_TASKS: Task[] = [];

function matchesQuery(task: Task, query: string) {
  return (
    task.description.toLowerCase().includes(query) ||
    task.assignees.some((name) => name.toLowerCase().includes(query))
  );
}

export default function WorkSpace() {
  const dispatch = useAppDispatch();
  const workSpace = useAppSelector(selectActiveWorkSpace);
  const columns = useAppSelector(selectActiveColumns);
  const tasks = useAppSelector(selectActiveTasks);
  const allTasks = useAppSelector(selectAllTasks);
  const searchQuery = useAppSelector(selectSearchQuery);

  const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  // Snapshot taken when a drag starts, so Escape can put everything back.
  const snapshot = useRef<Task[] | null>(null);

  const query = searchQuery.trim().toLowerCase();
  const isFiltering = query.length > 0;

  const { visibleByColumn, totalByColumn } = useMemo(() => {
    const visible: Record<string, Task[]> = {};
    const totals: Record<string, number> = {};
    for (const task of tasks) {
      totals[task.columnId] = (totals[task.columnId] ?? 0) + 1;
      if (isFiltering && !matchesQuery(task, query)) continue;
      (visible[task.columnId] ??= []).push(task);
    }
    return { visibleByColumn: visible, totalByColumn: totals };
  }, [tasks, query, isFiltering]);

  const columnIds = useMemo(() => columns.map((c) => c.id), [columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // While dragging a column only other columns are valid drop targets.
  const collisionDetection = useCallback<CollisionDetection>((args) => {
    if (args.active.data.current?.type === "Column") {
      return closestCorners({
        ...args,
        droppableContainers: args.droppableContainers.filter(
          (container) => container.data.current?.type === "Column"
        ),
      });
    }
    return closestCorners(args);
  }, []);

  function handleDragStart({ active }: DragStartEvent) {
    snapshot.current = allTasks;
    const type = active.data.current?.type;
    if (type === "Column") {
      setActiveColumn(columns.find((c) => c.id === active.id) ?? null);
    } else if (type === "Task") {
      setActiveTask(tasks.find((t) => t.id === active.id) ?? null);
    }
  }

  // Move tasks between columns live, so the target column makes room.
  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over || active.id === over.id) return;
    if (active.data.current?.type !== "Task") return;

    const overType = over.data.current?.type;
    if (overType === "Task") {
      const activeTaskNow = allTasks.find((t) => t.id === active.id);
      const overTask = allTasks.find((t) => t.id === over.id);
      if (!activeTaskNow || !overTask) return;
      if (activeTaskNow.columnId === overTask.columnId) return; // handled on drop
      dispatch(
        moveTask({
          activeId: String(active.id),
          overId: String(over.id),
          overType: "Task",
        })
      );
    } else if (overType === "Column") {
      dispatch(
        moveTask({
          activeId: String(active.id),
          overId: String(over.id),
          overType: "Column",
        })
      );
    }
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    const type = active.data.current?.type;
    setActiveColumn(null);
    setActiveTask(null);
    snapshot.current = null;
    if (!over || active.id === over.id) return;

    if (type === "Column") {
      // Dropping on a task inside a column still means "that column".
      const overColumnId =
        over.data.current?.type === "Task"
          ? allTasks.find((t) => t.id === over.id)?.columnId
          : String(over.id);
      if (overColumnId) {
        dispatch(
          reorderColumns({
            activeId: String(active.id),
            overId: overColumnId,
          })
        );
      }
    } else if (type === "Task" && over.data.current?.type === "Task") {
      dispatch(
        moveTask({
          activeId: String(active.id),
          overId: String(over.id),
          overType: "Task",
        })
      );
    }
  }

  function handleDragCancel() {
    if (snapshot.current) dispatch(setTasks(snapshot.current));
    snapshot.current = null;
    setActiveColumn(null);
    setActiveTask(null);
  }

  if (!workSpace) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-center">
        <div className="max-w-sm space-y-2">
          <h2 className="text-xl font-semibold text-white">No board selected</h2>
          <p className="text-sm text-zinc-400">
            Create a board from the sidebar to start organising your issues.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-x-auto overflow-y-hidden p-4">
      <DndContext
        id="board-dnd"
        sensors={sensors}
        collisionDetection={collisionDetection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex h-full w-max items-start gap-4 pr-4">
          <SortableContext
            items={columnIds}
            strategy={horizontalListSortingStrategy}
          >
            {columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                tasks={visibleByColumn[column.id] ?? EMPTY_TASKS}
                totalCount={totalByColumn[column.id] ?? 0}
                isFiltering={isFiltering}
              />
            ))}
          </SortableContext>
          <AddColumn workSpaceId={workSpace.id} />
        </div>

        <DragOverlay dropAnimation={{ duration: 180 }}>
          {activeTask && (
            <div className="w-64">
              <TaskCard task={activeTask} isOverlay />
            </div>
          )}
          {activeColumn && (
            <div className="w-72 rounded-xl border border-purple-500 bg-zinc-900 p-3 shadow-2xl shadow-purple-900/50">
              <p className="font-semibold text-white">{activeColumn.title}</p>
              <p className="text-xs text-zinc-400">
                {totalByColumn[activeColumn.id] ?? 0} tasks
              </p>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
