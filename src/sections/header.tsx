"use client";

import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import Avatar from "@/components/Avatar";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectUser, signOut } from "@/redux/slices/userSlice";

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function Header() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const fullName = `${capitalize(user.name)} ${capitalize(user.lastName)}`;

  return (
    <header className="flex items-center gap-3 border-b border-purple-900/60 bg-gradient-to-r from-purple-900 via-purple-950 to-zinc-950 px-4 py-2">
      <DashboardIcon className="text-purple-300" />
      <p className="flex-1 truncate text-lg font-bold tracking-tight">
        Issue Tracker
      </p>
      <div className="flex items-center gap-2">
        <Avatar name={fullName} />
        <span className="hidden text-sm font-medium sm:block">{fullName}</span>
        <button
          type="button"
          onClick={() => dispatch(signOut())}
          className="icon-btn"
          aria-label="Log out"
          title="Log out"
        >
          <LogoutIcon fontSize="small" />
        </button>
      </div>
    </header>
  );
}
