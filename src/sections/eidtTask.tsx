"use client";

import React, { useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";
import { useAppDispatch } from "@/redux/hooks";
import { editTask } from "@/redux/slices/userSlice";

export default function EidtTask({ task, handlerOpenEditTaskModal }: any) {
  const [user, setUser] = useState("");
  const [taskInfo, setTaskInfo] = useState({
    id: task.id,
    description: task.description || "",
    assignment: task.assignment || [],
  });

  const dispatch = useAppDispatch();

  function handlerChange(e: any) {
    const { value, name } = e.target;
    setTaskInfo((prev: any) => {
      return { ...prev, [name]: value };
    });
  }

  function submitChanges(e: any) {
    if (e.key === "Enter") {
      e.preventDefault();
      dispatch(editTask(taskInfo));
      handlerOpenEditTaskModal();
    }
  }

  function deleteUserFromAssignment(name: string) {
    const arr = task.assignment;
    const assignment = arr.filter((i: string) => i !== name);
    dispatch(
      editTask({
        id: task.id,
        description: task.description,
        assignment: assignment,
      })
    );
  }
  console.log(task.assignment);

  function addUserToAssignment(e: any) {
    if (e.key === "Enter" && user !== "") {
      e.preventDefault();
      let arr = [...task.assignment];

      arr.push(user);

      dispatch(
        editTask({
          id: task.id,
          description: task.description,
          assignment: arr,
        })
      );

      setUser("");
    }
  }

  return (
    <section className="fixed w-full h-full top-0 left-0 bg-black/20 z-50 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.3,
          stiffness: 360,
          damping: 50,
        }}
        className="w-3/6 h-5/6 bg-zinc-900 rounded-r-md shadow-2xl shadow-purple-500/10 border-l-2 border-purple-700 p-10 space-y-10 overflow-y-auto"
      >
        <div className="w-full flex justify-between items-center">
          <h2 className="text-2xl font-semibold border-b-2 border-purple-700 pb-3 w-fit">
            Task Info
          </h2>
          <span
            onClick={handlerOpenEditTaskModal}
            className="active:bg-white/30 rounded-full flex- items-center p-2 cursor-pointer"
          >
            <CloseIcon />
          </span>
        </div>
        <div className="space-y-10">
          <div className="">
            <div>
              <h2 className="text-lg font-semibold">Task Description:</h2>
              <div className="bg-gradient-to-r mt-3 from-purple-700 to-purple-950/0 w-full h-1 rounded-full"></div>
            </div>
            <textarea
              name="description"
              onChange={handlerChange}
              onKeyDown={submitChanges}
              className="w-5/6 bg-zinc-800 rounded-md h-[150px] max-h-[150px] p-5 my-4"
              value={taskInfo.description}
            />
          </div>
          <div className="">
            <div>
              <h2 className="text-lg font-semibold">Assigned to:</h2>
              <div className="bg-gradient-to-r from-purple-700 to-purple-950/0 w-full mt-3 h-1 rounded-full"></div>
            </div>{" "}
            <p className="my-4 flex items-center gap-4 flex-wrap ">
              {task?.assignment.length > 0 ? (
                task?.assignment?.map((i: any) => (
                  <span
                    onClick={() => deleteUserFromAssignment(i)}
                    key={task.id}
                    className="bg-zinc-800 font-medium text-md p-2 rounded-md flex gap-2 w-fit items-center  "
                  >
                    {i}
                    <CancelIcon />
                  </span>
                ))
              ) : (
                <h2>Not assigned to anyone</h2>
              )}
              <input
                value={user}
                placeholder="Add user"
                onKeyDown={addUserToAssignment}
                onChange={(e: any) => setUser(e.target.value)}
                type="text"
                className="bg-zinc-800 font-medium text-md p-2 rounded-md flex gap-2 w-fit items-center min-w-[120px]"
              />
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
