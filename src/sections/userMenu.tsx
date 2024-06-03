import React from "react";
import BarChartIcon from "@mui/icons-material/BarChart";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AlarmIcon from "@mui/icons-material/Alarm";
import DashboardIcon from "@mui/icons-material/Dashboard";

export default function UserMenu({ workSpacesSelected }: any) {
  return (
    <nav>
      <ul className="bg-zinc-900 p-2 rounded-b-md flex gap-5 items-center px-4 mx-5 py-2">
        <li className="flex-1 flex items-center">
          <h2 className="text-lg font-medium uppercase w-fit rounded-md transition-all duration-200 p-1">
            {workSpacesSelected[0].title}
          </h2>
        </li>
        <li className="flex items-center border-b-2 border-transparent hover:border-purple-700 transition-all duration-200 p-1 gap-1">
          <h2 className="text-lg font-medium cursor-pointer">My Tasks</h2>
          <FormatListBulletedIcon fontSize="small" />
        </li>
        <li className="flex items-center border-b-2 border-transparent hover:border-purple-700 transition-all duration-200 p-1 gap-1">
          <h2 className="text-lg font-medium cursor-pointer ">analize</h2>
          <BarChartIcon fontSize="small" />
        </li>
        <li className="flex items-center border-b-2 border-transparent hover:border-purple-700 transition-all duration-200 p-1 gap-1">
          <h2 className="text-lg font-medium cursor-pointer ">Dengers</h2>
          <AlarmIcon fontSize="small" />
        </li>
        <li className="flex items-center border-b-2 border-transparent hover:border-purple-700 transition-all duration-200 p-1 gap-1">
          <h2 className="text-lg font-medium cursor-pointer ">My Boards</h2>
          <DashboardIcon fontSize="small" />
        </li>
      </ul>
    </nav>
  );
}
