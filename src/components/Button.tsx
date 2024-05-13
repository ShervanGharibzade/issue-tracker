import React from "react";

export default function Button({ title, onClick, className }: any) {
  return (
    <button
      onClick={onClick}
      className={`${
        className
          ? className
          : "bg-purple-500 font-semibold text-lg active:bg-black text-white rounded-md px-4 py-2 w-full"
      }`}
    >
      {title}
    </button>
  );
}
