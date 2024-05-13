import { create } from "domain";
import React from "react";

export default function Modal({
  createTitle,
  createBody,
  createActions,
  width,
  onClose,
  show,
}: any) {
  return (
    <>
      {show && (
        <div className="bg-zinc-700/50 w-full h-screen absolute top-0 left-0 flex items-center justify-center z-10">
          <div
            style={{ width: width ? width : "fit-content" }}
            className="bg-zinc-950 p-10 rounded-md space-y-5  relative"
          >
            <div className="">
              {createTitle}
              <button
                onClick={onClose}
                type="button"
                className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600  dark:hover:text-white absolute top-2 right-2"
                data-modal-hide="authentication-modal"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div>{createBody}</div>
            <div>{createActions}</div>
          </div>
        </div>
      )}
    </>
  );
}
