"use client";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion } from "framer-motion";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { ArrowRight } from "@mui/icons-material";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect, useRef, useState } from "react";
import {
  addNewWorkSpace,
  changeWorkSpaceName,
  deleteWorkSpace,
  getWorkSpaceId,
  selectWorkSpace,
  selectWorkSpaces,
  toggleFavorite,
} from "@/redux/slices/userSlice";

export default function SideBar() {
  const [nameWorkSpace, setNameWorkSpace] = useState({ title: "", id: "" });
  const [openSideBar, setOpentSideBar] = useState(false);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const inputBoard = useRef<any>(null);

  const workSpaces = useAppSelector(selectWorkSpaces);
  const workSpaceId = useAppSelector(getWorkSpaceId);
  const workSpacesSorted = [...workSpaces].sort((a, b) =>
    a.isFovrite === b.isFovrite ? 0 : a.isFovrite ? -1 : 1
  );

  useEffect(() => {
    if (inputBoard.current) {
      inputBoard.current?.focus();
    }
  }, [show, edit]);

  const dispatch = useAppDispatch();

  function handlerCreateWorkSpace() {
    dispatch(addNewWorkSpace(nameWorkSpace.title));
    setNameWorkSpace({ title: "", id: "" });
    setShow(!show);
  }

  function handlerOpenSideBar() {
    setOpentSideBar(!openSideBar);
  }

  function handleToggleFovrite(id: string) {
    dispatch(toggleFavorite(id));
  }

  function handleDelete(id: string) {
    dispatch(deleteWorkSpace(id));
  }

  function handleChnageWorkSpaceTitle(e: any, id: string) {
    const { value } = e.target;
    setNameWorkSpace((prev) => {
      return { ...prev, id: id, title: value };
    });
  }

  function handleEditWorkSpace(idWorkSpace: string) {
    setEdit(!edit);
    setNameWorkSpace((prevState) => ({
      ...prevState,
      id: prevState.id === idWorkSpace ? "" : idWorkSpace,
    }));
  }

  function updateWorkSpace(e: any) {
    if (e.key === "Enter") {
      dispatch(changeWorkSpaceName(nameWorkSpace));
      setNameWorkSpace({ title: "", id: "" });
    }
  }

  function onCloseModal() {
    setShow(!show);
    inputBoard.current?.focus();
  }

  function handlerChange(e: any) {
    const { value } = e.target;
    setNameWorkSpace({ title: value, id: "" });
  }

  function handleSelectWorkSpace(id: string) {
    dispatch(selectWorkSpace(id));
  }

  return (
    <>
      <motion.aside
        initial={{ x: -200 }}
        animate={{ x: 0 }}
        transition={{
          duration: 0.3,
          stiffness: 360,
          damping: 50,
        }}
        style={{ height: "calc(100vh - 150px)" }}
        className={`p-5 m-3 bg-zinc-900 rounded-md h-full shadow-xl shadow-purple-600/20 ${
          openSideBar ? "w-[20px]" : "w-[300px]"
        } transition-all duration-200 relative`}
      >
        <div
          onClick={handlerOpenSideBar}
          className="bg-black w-fit absolute top-1/2 -translate-y-1/2 -right-3"
        >
          <span
            style={{
              transform: `rotate(${openSideBar ? "0" : "-180deg"})`,
              transition: "transform ease-in-out .5s",
            }}
            className="flex items-center justify-center border-2 border-white w-fit rounded-full opacity-65 hover:opacity-100 cursor-pointer"
          >
            <ArrowRight />
          </span>
        </div>
        {!openSideBar && (
          <>
            <div className="mb-5">
              <h2 className="font-bold text-xl py-5 flex justify-between items-center w-[250px]">
                Your Boards
                <FormatListBulletedIcon />
              </h2>
              <div className="bg-gradient-to-r from-purple-700 to-purple-950/0 w-full h-[2px] rounded-full"></div>
            </div>
            <ul className="text-lg space-y-4 overflow-y-auto h-full">
              {workSpacesSorted.map((i) => (
                <motion.li
                  initial={{ x: -80, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    duration: 0.1,
                    damping: 50,
                  }}
                  key={i.id}
                  style={{
                    borderLeft: i.id === workSpaceId ? "solid 2px #9333ea" : "",
                    background: i.id === workSpaceId ? "#3f3f3fc2" : "",
                  }}
                  className="p-2 cursor-pointer transition-all duration-200 rounded-r-md hover:bg-white/30"
                >
                  <div className="flex items-center">
                    {i.id !== nameWorkSpace.id ? (
                      <h2
                        className="flex-1"
                        onClick={() => handleSelectWorkSpace(i.id)}
                      >
                        {i.title.toUpperCase()}
                      </h2>
                    ) : (
                      <input
                        ref={inputBoard}
                        onChange={(e: any) =>
                          handleChnageWorkSpaceTitle(e, i.id)
                        }
                        onKeyDown={updateWorkSpace}
                        type="text"
                        className="bg-white/10 text-white rounded-md py-2 px-3 mr-2 w-5/6"
                      />
                    )}
                    <span onClick={() => handleToggleFovrite(i.id)}>
                      {!i.isFovrite ? <StarOutlineIcon /> : <StarIcon />}
                    </span>
                    <span>
                      <EditIcon onClick={() => handleEditWorkSpace(i.id)} />
                    </span>
                    <span>
                      <DeleteIcon onClick={() => handleDelete(i.id)} />
                    </span>
                  </div>
                </motion.li>
              ))}
              {show && (
                <li className="p-2 cursor-pointer transition-all duration-200 rounded-r-md w-full">
                  <div className="flex">
                    <input
                      ref={inputBoard}
                      value={nameWorkSpace.title}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handlerCreateWorkSpace();
                        }
                      }}
                      onChange={(e: any) => handleChnageWorkSpaceTitle(e, "")}
                      placeholder="Board Name"
                      type="text"
                      className="bg-white/10 text-white rounded-md py-2 px-3 mr-2 w-5/6 placeholder:text-sm"
                    />
                    <span
                      onClick={handlerCreateWorkSpace}
                      className="active:bg-white/30 rounded-full w-fit px-2 flex items-center justify-center gap-3"
                    >
                      <CheckCircleIcon />
                    </span>
                    <span
                      onClick={onCloseModal}
                      className="active:bg-white/30 rounded-full w-fit px-2 flex items-center justify-center gap-3"
                    >
                      <CancelIcon />
                    </span>
                  </div>
                </li>
              )}
              <button
                onClick={onCloseModal}
                className="text-center bg-black/50 rounded-full w-10 h-10 p-2 flex items-center justify-center active:bg-white my-5 mx-auto border-2 border-transparent hover:border-white transition-all duration-200"
              >
                <AddIcon />
              </button>
            </ul>
          </>
        )}
      </motion.aside>
    </>
  );
}
