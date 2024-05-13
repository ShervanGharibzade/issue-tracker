"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { changeAuth, getAuth } from "@/redux/slices/userSlice";
import SideBar from "@/sections/sideBar";
import LogoutIcon from "@mui/icons-material/Logout";
import WorkSpace from "@/sections/workSpace";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "@/components/loading";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const auth = useAppSelector(getAuth);

  const router = useRouter();
  const dispatch = useAppDispatch();

  function handleLogout() {
    dispatch(changeAuth(false));
  }

  useEffect(() => {
    if (!auth) {
      router.push("/login");
    }
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, [auth]);

  let content = auth ? (
    loading ? (
      <Loading />
    ) : (
      <>
        <div className="px-4 text-xl py-2 bg-gradient-to-r from-purple-800 via-purple-950 to-purple-950/40 font-bold flex">
          <h2 className="flex-1">Issuse | Tracker App</h2>
          <div className="flex items-center">
            <div className="bg-white h-8 w-8 rounded-lg"></div>
            <h2 className="pl-2 text-base font-medium min-w-28">User Test</h2>
            <span className="rounded-full p-1 bg-transparent active:bg-white/20 cursor-pointer">
              <LogoutIcon onClick={handleLogout} />
            </span>
          </div>
        </div>
        <div
          style={{ height: "calc(100vh - 72px)" }}
          className="flex overflow-x-auto transition-all duration-200 overflow-y-hidden"
        >
          <SideBar />
          <WorkSpace />
        </div>
      </>
    )
  ) : (
    ""
  );
  return <main>{content}</main>;
}
