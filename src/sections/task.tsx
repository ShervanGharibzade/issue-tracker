"use client";

import { useAppDispatch } from "@/redux/hooks";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteTask, editTask } from "@/redux/slices/userSlice";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import EidtTask from "./eidtTask";

export default function Task({ task, workId }: any) {
  const [taskInfo, setTaskInfo] = useState({
    description: "",
    workSpaceId: "",
    columnId: "",
    assignment: "",
    id: "",
    status: "backLog",
  });
  const [iseditTask, setIsEditTask] = useState(false);
  const [openEditTask, setOpenEditTask] = useState(false);

  const dispatch = useAppDispatch();
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "Task", task },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  function handlerOpenEditTaskModal() {
    setOpenEditTask(!openEditTask);
  }

  function handlerOpenEditTask(id?: string) {
    setTaskInfo((prev) => {
      return { ...prev, id: id ? id : "" };
    });
    setIsEditTask(!iseditTask);
  }

  function handlerDeleteTask(id: string) {
    dispatch(deleteTask(id));
  }

  function handlerChange(e: any) {
    const { value, name } = e.target;
    setTaskInfo((prev) => {
      return { ...prev, [name]: value, workSpaceId: workId };
    });
  }

  function handlerEditTask() {
    const { description, id, assignment } = taskInfo;
    dispatch(editTask({ description, id, assignment }));
    handlerOpenEditTask();
  }

  const createTitleTask = (
    <div>
      <h2 className="text-xl text-center font-semibold">Edit Task</h2>
    </div>
  );

  const createBodyTask = (
    <div className="space-y-3">
      <div className="space-y-3">
        <label className="block">Description</label>
        <input
          name="description"
          className="bg-black/30 rounded-md text-white p-2 outline-none"
          type="text"
          onChange={handlerChange}
        />
      </div>
      <div className="space-y-3">
        <label className="block">assignment</label>
        <input
          name="assignment"
          className="bg-black/30 rounded-md text-white p-2 outline-none"
          type="text"
          onChange={handlerChange}
        />
      </div>
    </div>
  );

  const createActionsTask = (
    <button
      onClick={handlerEditTask}
      className="bg-white w-full py-2 rounded-md active:bg-black/40 text-black font-semibold my-4"
    >
      Submit
    </button>
  );

  if (isDragging)
    return (
      <div className="bg-white/10 opacity-40 max-w-[200px] grid gap-2  rounded-lg p-3 h-12 border-2 border-white.40" />
    );

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        key={task.id}
        onClick={handlerOpenEditTaskModal}
        className="bg-zinc-700/50 hover:bg-zinc-700 border-l-2 border-purple-800 max-w-[300px] w-[200px] grid gap-2 h-fit rounded-r-lg px-3 py-2 items-center"
      >
        <motion.div
          initial={{ y: -200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.1,
            stiffness: 360,
            damping: 50,
          }}
        >
          <p className="flex gap-3 items-center justify-between break-words">
            <h2 className="flex-1">{task?.description}</h2>
            <div className="flex">
              <span
                onClick={() => handlerOpenEditTask(task.id)}
                className="cursor-pointer active:bg-white/30 rounded-full p-1 flex items-center"
              >
                <EditIcon fontSize="small" />
              </span>
              <span
                onClick={() => handlerDeleteTask(task.id)}
                className="cursor-pointer active:bg-white/30 rounded-full p-1 flex items-center"
              >
                <DeleteIcon fontSize="small" />
              </span>
            </div>
          </p>
          <div className="flex gap-1">
            {task?.assignment?.map((i: string) => (
              <div key={i} className="relative">
                <div className="rounded-full w-7 h-7 font-bold flex items-center justify-center text-sm text-white bg-zinc-600">
                  {i?.slice(0, 2)}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      {openEditTask && (
        <EidtTask
          task={task}
          handlerOpenEditTaskModal={handlerOpenEditTaskModal}
        />
      )}
    </>
  );
}
