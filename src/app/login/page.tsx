"use client";

import React from "react";
import { useState } from "react";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { changeAuth } from "@/redux/slices/userSlice";

export default function Login() {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const dispatch = useAppDispatch();
  const router = useRouter();

  const [type, setType] = useState("text");

  function handlerChangeType() {
    setType(type === "text" ? "password" : "text");
  }

  function handlerChnage(e: any) {
    const { name, value } = e.target;

    setUser((prev: any) => {
      return { ...prev, [name]: value };
    });
  }

  function handlerSubmit(e: any) {
    e.preventDefault();
    if (user.password === "123456" && user.username === "test") {
      dispatch(changeAuth(true));
      router.push("/");
    }
  }

  return (
    <section className="flex items-center justify-center h-screen bg-zinc-950">
      <div className="absolute right-0 top-0 p-10 text-2xl">
        <h2>username : test</h2>
        <p>
          <span>password</span>:123456
        </p>
      </div>
      <div className="bg-zinc-900 w-fit mx-auto p-10 rounded-md border-2 border-purple-500/40">
        <form className="space-y-5">
          <h2 className="text-xl pb-5  text-purple-400">
            Login in |{" "}
            <span className="font-bold text-white">Issue Tracker</span>
          </h2>
          <div className="space-y-3">
            <label htmlFor="">Username</label>
            <input
              name="username"
              onChange={handlerChnage}
              className="block p-2 text-white bg-zinc-700 rounded-md outline-none w-full"
              type="text"
            />
          </div>
          <div className="space-y-3">
            <label htmlFor="" className="block">
              Password
            </label>
            <div className="flex gap-5 items-center">
              <input
                onChange={handlerChnage}
                name="password"
                className="p-2 text-white bg-zinc-700 rounded-md outline-none"
                type={type}
              />
              <RemoveRedEyeIcon
                onClick={handlerChangeType}
                sx={{ cursor: "pointer" }}
              />
            </div>
          </div>
          <Button onClick={handlerSubmit} title={"Submit"} />
        </form>
      </div>
    </section>
  );
}
