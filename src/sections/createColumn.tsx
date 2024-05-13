"use client";

import Button from "@/components/Button";
import { useAppDispatch } from "@/redux/hooks";
import { addFirstColumn } from "@/redux/slices/userSlice";
import React, { useState } from "react";

export default function CreateColumn({ id }: { id: string }) {
  const [culomnInfo, setColumnInfo] = useState({ title: "", workSpaceId: "" });

  const dispatch = useAppDispatch();

  function handleChnageName(e: any) {
    const { value } = e.target;
    setColumnInfo((prev) => {
      return { ...prev, title: value, workSpaceId: id };
    });
  }

  function handleCreateColumn() {
    if (culomnInfo.title) {
      dispatch(addFirstColumn(culomnInfo));
    }
  }

  return (
    <div className="bg-zinc-800 rounded-md grid justify-center items-center p-5 gap-5 h-fit w-fit">
      <h2 className="text-center text-xl font-semibold">Add a column</h2>
      <input
        value={culomnInfo.title}
        onChange={handleChnageName}
        className="bg-black/30 rounded-md text-white p-2 outline-none"
      />
      <Button title={"Create"} onClick={handleCreateColumn} />
    </div>
  );
}
