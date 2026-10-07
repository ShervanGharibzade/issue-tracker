"use client";

import { memo, useEffect, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useAppDispatch } from "@/redux/hooks";
import { deleteTask } from "@/redux/slices/userSlice";
import ConfirmDialog from "@/components/ConfirmDialog";
import EditTask from "./editTask";
import TaskCard from "./taskCard";
import type { Task as TaskType } from "@/types";

function Task({ task }: { task: TaskType }) {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: "Task" } });

  // A drag that ends over the card can still emit a click; ignore that one.
  const justDragged = useRef(false);
  useEffect(() => {
    if (isDragging) {
      justDragged.current = true;
      return;
    }
    const timer = setTimeout(() => {
      justDragged.current = false;
    }, 0);
    return () => clearTimeout(timer);
  }, [isDragging]);

  return (
    <>
      <div
        ref={setNodeRef}
        style={{ transform: CSS.Transform.toString(transform), transition }}
        {...attributes}
        {...listeners}
        aria-label={`Task: ${task.description}. Press space to pick up and move.`}
        onClick={() => {
          if (!justDragged.current) setIsEditing(true);
        }}
        className={`touch-manipulation rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
          isDragging ? "opacity-30" : ""
        }`}
      >
        <TaskCard
          task={task}
          onEdit={() => setIsEditing(true)}
          onDelete={() => setIsConfirmingDelete(true)}
        />
      </div>

      {/* Rendered outside the draggable element so dialog events never reach dnd-kit. */}
      {isEditing && <EditTask task={task} onClose={() => setIsEditing(false)} />}
      <ConfirmDialog
        open={isConfirmingDelete}
        title="Delete task?"
        message="This task will be permanently removed."
        confirmLabel="Delete"
        destructive
        onCancel={() => setIsConfirmingDelete(false)}
        onConfirm={() => {
          setIsConfirmingDelete(false);
          dispatch(deleteTask(task.id));
        }}
      />
    </>
  );
}

export default memo(Task);
