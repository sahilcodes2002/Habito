import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import { info } from "../store/atoms/userinfo";
import { useRecoilValue } from "recoil";

export function Topbarlogin({ toggleSidebar, isSidebarOpen }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const allInfo = useRecoilValue(info);
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const formattedDate = currentTime.toLocaleDateString();

  return (
    <div className="z-50 bg-mytitlebar text-mytext flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <div className="h-full flex flex-col justify-center">
          <button
            onClick={toggleSidebar}
            data-drawer-target="separator-sidebar"
            data-drawer-toggle="separator-sidebar"
            aria-controls="separator-sidebar"
            type="button"
            className="inline-flex items-center p-1 mt-2 ms-3 mb-1 text-sm text-mytext rounded-lg hover:text-gray-400  "
          >
            <span className="sr-only">Open sidebar</span>
            {!isSidebarOpen && (
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clip-rule="evenodd"
                  fill-rule="evenodd"
                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                ></path>
              </svg>
            )}
            {isSidebarOpen && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            )}
          </button>
        </div>
        <div className="flex gap-1">
          <div className="flex flex-col justify-center">
            <button>
              <div
                onClick={() => {
                  navigate("/userprofile");
                }}
                className="rounded-full text-[15px] text-gray-700 bg-gray-200 text-center h-6 w-6 mr-1"
              >
                {allInfo.name ? allInfo.name[0].toUpperCase() : "?"}
              </div>
            </button>
          </div>
          <button>
            <div className="flex  flex-col h-full justify-center">
              <span
                onClick={() => {
                  navigate("/userprofile");
                }}
                className="text-sm md:flex smd:text-xl  text-mytext"
              >
                {allInfo.name.split(" ")[0]}
              </span>
            </div>
          </button>
        </div>
      </div>
      <div className={`flex items-center space-x-8 text-xs `}>
        <div
          className={`text-right ${
            isSidebarOpen ? "hidden smd:block" : "block"
          }`}
        >
          <div className="text-mytext">{formattedDate}</div>
          <div className="text-mytext">{formattedTime}</div>
        </div>
        <div className="pr-1 smd:pr-2">
          <button
            onClick={() => {
              navigate(`/notifications`);
            }}
            className="  text-mytext font-semibold  rounded-lg transition duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
