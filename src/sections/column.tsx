"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { motion } from "framer-motion";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addColumn,
  addTask,
  changeNameColumn,
  deleteColumn,
  getStatusList,
} from "@/redux/slices/userSlice";
import Options from "@/components/options";
import { CSS } from "@dnd-kit/utilities";
import DeleteIcon from "@mui/icons-material/Delete";
import Task from "@/sections/task";
import { SortableContext, useSortable } from "@dnd-kit/sortable";

export default function Column({ column, tasks }: any) {
  const [taskInfo, setTaskInfo] = useState({
    description: "",
    workSpaceId: "",
    columnId: "",
    assignment: "",
    id: "",
    status: "backLog",
  });
  const [taskVlaue, setTaskValue] = useState("");
  const inputTask = useRef<any>(null);
  const [columnTitle, setColumnTitle] = useState<string>(column.title);
  const [isChangeColumnTitle, setIsChangeTitleColumn] = useState(false);

  const tasksIds = useMemo(() => tasks?.map((i: any) => i.id), [tasks]);
  const statusList = useAppSelector(getStatusList);

  useEffect(() => {
    inputColumn.current?.focus();
  }, [isChangeColumnTitle]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: { type: "Column", column },
  });
  const inputColumn = useRef<any>(null);
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const dispatch = useAppDispatch();

  const [isAddTask, setIsAddTask] = useState(false);
  const [openOptions, setOpenOptions] = useState(false);

  const options = [
    { name: "Delete column", func: handlerDeleteColumn, icon: <DeleteIcon /> },
  ];

  function handlerCloseModal() {
    setTaskInfo((prev) => {
      return {
        ...prev,
        columnId: column.id,
        workSpaceId: column.workSpaceId,
      };
    });
    setIsAddTask(!isAddTask);
  }

  // function handlerChange(e: any) {
  //   const { value, name } = e.target;
  //   setTaskInfo((prev) => {
  //     return { ...prev, [name]: value, workSpaceId: column.workSpaceId };
  //   });
  // }

  function handlerCreateNewTask() {
    dispatch(addTask(taskInfo));
    handlerCloseModal();
  }

  function handlerDeleteColumn() {
    dispatch(
      deleteColumn({ workSpaceId: "1c1h2", title: column.title, id: column.id })
    );
    handlerOpenOptions();
  }

  function handlerIsChangeColumnTitle() {
    setIsChangeTitleColumn(!isChangeColumnTitle);
  }

  function handlerChangeColumnTitle(e: any) {
    const { value } = e.target;
    console.log(value);

    setColumnTitle(value);
    dispatch(
      changeNameColumn({
        workSpaceId: column.workSpaceId,
        title: value,
        id: column.id,
      })
    );
  }

  function handlerKeyEnter(e: any) {
    if (e.key === "Enter") {
      e.preventDefault();
      dispatch(
        changeNameColumn({
          workSpaceId: "1c1h2",
          title: columnTitle,
          id: column.id,
        })
      );
      setIsChangeTitleColumn(false);
    }
  }

  function handlerOpenOptions() {
    setOpenOptions(!openOptions);
  }

  if (isDragging) {
    return (
      <div className="bg-white/10 opacity-35 w-[275px] rounded-lg p-3 relative h-full border-[1px] border-white/30"></div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} key={column.id}>
      <motion.div
        initial={{ scale: 0, rotate: 90 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{
          duration: 0.3,
          stiffness: 260,
          damping: 20,
        }}
        className="min-w-[250px] bg-zinc-900 shadow-2xl shadow-purple-900/60 rounded-xl p-5 h-fit relative transition-all duration-150 max-w-[300px]"
      >
        <div
          {...attributes}
          {...listeners}
          className="flex items-center gap-x-2 border-b-[1px] border-purple-600 pb-5 my-3"
        >
          {!isChangeColumnTitle ? (
            <h2
              onClick={handlerIsChangeColumnTitle}
              className="text-lg text-white text-center font-semibold flex-1 cursor-pointer"
            >
              {columnTitle ? columnTitle : "not name"}
            </h2>
          ) : (
            <input
              onChange={handlerChangeColumnTitle}
              onKeyDown={handlerKeyEnter}
              value={columnTitle}
              type="text"
              className="bg-black/40 text-white rounded-md py-2 px-3 max-w-[150px]"
            />
          )}
          <span
            onClick={handlerOpenOptions}
            className="rounded-full cursor-pointer px-0.5 active:bg-white/50"
          >
            <MoreHorizIcon />
          </span>
        </div>
        <div className="grid gap-5 pt-5 px-2 justify-center w-[250px] max-h-[500px] overflow-y-auto overflow-x-hidden max-w-[300px]">
          {tasks?.map(
            (i: any) =>
              i.columnId === column.id &&
              i.workSpaceId === column.workSpaceId && (
                <SortableContext items={tasksIds} key={i.id}>
                  <Task task={i} workId={column.workSpaceId} />
                </SortableContext>
              )
          )}
          {isAddTask && (
            <p className="flex gap-3 items-center justify-between break-words">
              <input
                value={taskVlaue}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handlerCreateNewTask();
                    setTaskValue("");
                  }
                }}
                ref={inputTask}
                onChange={(e) => {
                  setTaskValue(e.target.value);
                  setTaskInfo((prev) => {
                    return { ...prev, description: e.target.value };
                  });
                }}
                className="flex-1 bg-zinc-800 border-l-2 border-purple-500 p-2 rounded-r-md outline-none w-5/6"
              />
              {taskVlaue ? (
                <span onClick={handlerCreateNewTask}>
                  <CheckCircleIcon />
                </span>
              ) : (
                <span
                  onClick={() => setIsAddTask(false)}
                  className="cursor-pointer"
                >
                  <CancelIcon />
                </span>
              )}
            </p>
          )}
          <button
            onClick={handlerCloseModal}
            className="text-center bg-purple-500 rounded-lg w-fit h-10 p-2 flex font-semibold items-center justify-center text-black active:bg-white my-5 mx-auto gap-2 active:bg-white/50 transition-all duration-200"
          >
            <span className="flex items-center justify-center rounded-full bg-purple-300">
              <AddIcon
                fontSize="small"
                style={{
                  color: "black",
                }}
              />
            </span>
            <h2>Add Task</h2>
          </button>
          <Options show={openOptions} items={options} />
        </div>
      </motion.div>
    </div>
  );
}
