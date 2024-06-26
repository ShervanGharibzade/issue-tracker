"use client";

import Column from "@/sections/column";
import AddIcon from "@mui/icons-material/Add";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addColumn,
  getColumns,
  getTasks,
  getWorkSpaceId,
  getWorkSpaces,
  selectWorkSpaces,
} from "@/redux/slices/userSlice";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverlay,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Task from "./task";

export default function WorkSpace() {
  const allColumns = useAppSelector(getColumns);
  const workspaceID = useAppSelector(getWorkSpaceId);
  const allTasks = useAppSelector(getTasks);
  const [tasks, setTasks] = useState<any>(allTasks || []);
  const workSpacesSelected = useAppSelector(getWorkSpaceId);
  const [activeColumn, setActiveColumn] = useState<any>(null);
  const [activeTask, setActiveTask] = useState<any>(null);
  const findColumns = allColumns.filter((i) => i.workSpaceId === workspaceID);

  const [columns, setColumns] = useState<any>(findColumns || []);

  const dispatch = useAppDispatch();

  useEffect(() => {
    setColumns(allColumns);
    setTasks(allTasks);
  }, [allColumns, allTasks]);

  function handlerAddColumn() {
    dispatch(
      addColumn({ title: "new column", workSpaceId: workSpacesSelected })
    );
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = event;

    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) return;

    setColumns((col: any) => {
      const activeColumnIdIndex = columns.findIndex(
        (col: any) => col.id === activeColumnId
      );
      const overColumnIdIndex = columns.findIndex(
        (col: any) => col.id === overColumnId
      );

      return arrayMove(columns, activeColumnIdIndex, overColumnIdIndex);
    });
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";
    const isOverAColumn = over.data.current?.type === "Column";

    if (isActiveATask && isOverATask) {
      setTasks((tasks: any) => {
        const updateTasks = [...tasks];
        const activeIndex = tasks.findIndex((i: any) => i.id === activeId);
        const overIndex = tasks.findIndex((i: any) => i.id === overId);

        if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
          updateTasks[activeIndex] = {
            ...updateTasks[activeIndex],
            columnId: tasks[overIndex].columnId,
          };
        }

        return arrayMove(updateTasks, activeIndex, overIndex);
      });
    }

    if (isActiveATask && isOverAColumn) {
      setTasks((tasks: any) => {
        const updateTasks = [...tasks];
        const activeIndex = tasks.findIndex((i: any) => i.id === activeId);
        if (tasks[activeIndex].columnId !== overId) {
          updateTasks[activeIndex] = {
            ...updateTasks[activeIndex],
            columnId: overId,
          };
        }
        return arrayMove(updateTasks, activeIndex, 0);
      });
    }
  }

  return (
    <section id="section" className="p-5">
      <div className="w-fit flex gap-10 relative">
        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
        >
          {columns?.length > 0 &&
            columns?.map(
              (i: any) =>
                i.workSpaceId === workspaceID && (
                  <Column column={i} key={i.id} tasks={tasks} />
                )
            )}
          {createPortal(
            <DragOverlay>
              {activeColumn && (
                <Column column={activeColumn} key={activeColumn?.id} />
              )}
              {activeTask && <Task task={activeTask} />}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
        <motion.button
          initial={{
            y: -300,
          }}
          animate={{ y: 0 }}
          transition={{
            duration: 0.3,
            stiffness: 280,
            damping: 80,
          }}
          onClick={handlerAddColumn}
          className="text-center bg-zinc-800 hover:bg-white/30 rounded-lg w-fit h-10 py-2 px-5 flex font-semibold items-center justify-center text-black active:bg-white mx-auto gap-2 active:bg-white/50 border-2 border-purple-600 transition-all duration-200 min-w-[200px]"
        >
          <span className="flex items-center justify-center rounded-full">
            <AddIcon
              fontSize="small"
              style={{
                color: "white",
              }}
            />
          </span>
          <h2 className="text-white">Add Column</h2>
        </motion.button>
      </div>
    </section>
  );
}
