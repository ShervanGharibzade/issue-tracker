import React from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";

export default function EidtTask({ task, handlerOpenEditTaskModal }: any) {
  console.log(task, "edit");

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
              className="w-5/6 bg-zinc-800 rounded-md h-[150px] max-h-[150px] p-5 my-4"
              value={task.description}
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
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
