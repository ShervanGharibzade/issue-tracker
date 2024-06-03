import React from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { changeAuth, getAuth } from "@/redux/slices/userSlice";

export default function Header() {
  const auth = useAppSelector(getAuth);
  const dispatch = useAppDispatch();

  function handleLogout() {
    dispatch(changeAuth(false));
  }
  return (
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
  );
}
