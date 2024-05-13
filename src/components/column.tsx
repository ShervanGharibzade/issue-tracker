"use client";

import React, { useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddIcon from "@mui/icons-material/Add";
import Modal from "./Modal";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addColumn,
  addTask,
  changeNameColumn,
  deleteColumn,
  getStatusList,
  getTasks,
} from "@/redux/slices/userSlice";
import Options from "./options";
import DeleteIcon from "@mui/icons-material/Delete";
import Task from "@/sections/task";

export default function Column({
  title,
  id,
  worlId,
}: {
  title: string;
  id: string;
  worlId: string;
}) {
  const [taskInfo, setTaskInfo] = useState({
    description: "",
    workSpaceId: "",
    columnId: "",
    assignment: "",
    id: "",
    status: "backLog",
  });
  const [columnTitle, setColumnTitle] = useState(title);
  const [isChangeColumnTitle, setIsChangeTitleColumn] = useState(false);

  const tasks = useAppSelector(getTasks);
  const statusList = useAppSelector(getStatusList);

  const dispatch = useAppDispatch();

  const [openModal, setOpenModal] = useState(false);
  const [openOptions, setOpenOptions] = useState(false);

  const options = [
    { name: "Add new column", func: handlerAddColumn, icon: <AddIcon /> },
    { name: "Delete column", func: handlerDeleteColumn, icon: <DeleteIcon /> },
  ];

  function handlerCloseModal() {
    setOpenModal(!openModal);
  }

  function handlerChange(e: any) {
    const { value, name } = e.target;
    setTaskInfo((prev) => {
      return { ...prev, [name]: value, workSpaceId: worlId };
    });
  }

  function handlerCreateNewTask() {
    dispatch(addTask(taskInfo));
    handlerCloseModal();
  }

  function handlerAddColumn() {
    dispatch(addColumn({ title: "new column", workSpaceId: worlId }));
    handlerOpenOptions();
  }

  function handlerDeleteColumn() {
    dispatch(deleteColumn({ workSpaceId: "1c1h2", title: title, id: id }));
    handlerOpenOptions();
  }

  function handlerIsChangeColumnTitle() {
    setIsChangeTitleColumn(!isChangeColumnTitle);
  }

  function handlerChangeColumnTitle(e: any) {
    const { value } = e.target;
    setColumnTitle(value);
  }

  function handlerKeyEnter(e: any) {
    if (e.key === "Enter") {
      dispatch(
        changeNameColumn({
          workSpaceId: "1c1h2",
          title: columnTitle,
          id: id,
        })
      );
      setIsChangeTitleColumn(false);
    }
  }

  function handlerOpenOptions() {
    setOpenOptions(!openOptions);
  }

  const createTitle = (
    <div>
      <h2 className="text-xl text-center font-semibold">New Task</h2>
    </div>
  );

  const createBody = (
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
      <select
        id="status"
        name="status"
        className="bg-black/50 text-white w-full p-3 rounded-md outline-none"
        onChange={handlerChange}
      >
        {statusList.map((i: string) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </select>
    </div>
  );

  const createActions = (
    <button
      onClick={handlerCreateNewTask}
      className="bg-white w-full py-2 rounded-md active:bg-black/40 text-black font-semibold my-4"
    >
      Submit
    </button>
  );

  return (
    <div key={id}>
      <div className="bg-zinc-900 min-w-[200px] rounded-lg p-3 h-fit relative">
        <div className="flex items-center gap-x-2">
          {!isChangeColumnTitle ? (
            <h2
              onClick={handlerIsChangeColumnTitle}
              className="text-xl text-center font-semibold flex-1 cursor-pointer"
            >
              {columnTitle}
            </h2>
          ) : (
            <input
              onKeyDown={handlerKeyEnter}
              onChange={handlerChangeColumnTitle}
              value={columnTitle}
              type="text"
              className="bg-black/40 text-white rounded-md py-2 px-3"
            />
          )}
          <span
            onClick={handlerOpenOptions}
            className="rounded-full cursor-pointer px-0.5 active:bg-white/50"
          >
            <MoreHorizIcon />
          </span>
        </div>
        <div className="grid gap-3 p-4 w-[250px]  max-h-[500px] overflow-y-scroll">
          {tasks?.map(
            (i: any) =>
              i.columnId === id &&
              i.workSpaceId === worlId && (
                <Task key={i.id} task={i} workId={worlId} />
              )
          )}
          <button
            onClick={handlerCloseModal}
            className="text-center bg-black/50 rounded-full w-10 h-10 p-2 flex items-center justify-center active:bg-white my-5 mx-auto"
          >
            <AddIcon />
          </button>
          <Options show={openOptions} items={options} />
        </div>
      </div>
      <Modal
        show={openModal}
        onClose={handlerCloseModal}
        createActions={createActions}
        createBody={createBody}
        createTitle={createTitle}
      />
    </div>
  );
}
