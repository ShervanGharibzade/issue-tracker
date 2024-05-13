import React from "react";
interface item {
  name: string;
  func: any;
  icon: any;
}
export default function Options({
  items,
  show,
}: {
  show: boolean;
  items: item[];
}) {
  return (
    <>
      {show && (
        <ul className="w-fit text-sm font-medium text-white bg-white/10 border border-gray-200/30 rounded-lg absolute top-10 -right-10">
          {items.map((i: item, index: number) => (
            <li
              key={index}
              onClick={i.func}
              className="w-full px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600 cursor-pointer active:bg-white/30 flex gap-2"
            >
              {i.icon}
              {i.name}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
