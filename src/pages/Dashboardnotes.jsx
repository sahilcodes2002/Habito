import React, { useEffect, useState, useRef } from "react";
import { Users } from "../components/Users";
import { todos } from "../store/atoms/todos";
import { useRecoilState } from "recoil";
import { TodoCard } from "../components/TodoCard";
import { TodoCarddel } from "../components/TodoCard";
import { Cardcreate } from "../components/Cardcreate";
import { refresh } from "../store/atoms/refresh";
import axios from "axios";
import { format } from "date-fns";
import { Topbarlogin } from "../components/Topbarlogin";
import { useNavigate } from "react-router-dom";
import { allitems } from "../store/atoms/allcards";
import Design from "../images/Design.jpg";

export const Dashboardnotes = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showdel, setshowdel] = useState(false);
  const navigate = useNavigate();
  const [allitm, setAllitems] = useRecoilState(allitems);
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="">
      <div
        className={`fixed right-0  top-0 z-50  ${
          isSidebarOpen ? "left-48" : "left-0"
        }`}
      >
        <div className="z-40">
          <Topbarlogin
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          ></Topbarlogin>
        </div>

        {/* <div className="flex justify-center mt-5">
          <div className="flex flex-col justify-center">
          <div className="text-3xl">Important Stuff</div>
          </div>
        </div> */}
      </div>
      {/* <div className="text-black">
    hi
  </div> */}
      <div className="">
        <div className="z-50">
          <Sidebar isSidebarOpen={isSidebarOpen}></Sidebar>

          <div
            className="z-0 bg-mybg min-h-screen"
            onClick={() => {
              setSidebarOpen(false);
            }}
          >
            <div
              className={`${
                isSidebarOpen ? "pl-48 rounded-md " : "mb-0 rounded-md "
              }`}
            >
              <Notes
                allitm={allitm}
                isSidebarOpen={isSidebarOpen}
                setAllitems={setAllitems}
                showdel={showdel}
                setshowdel={setshowdel}
              ></Notes>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function Notes({ allitm, setAllitems, showdel, setshowdel, isSidebarOpen }) {
  const [todo, setTodos] = useRecoilState(todos);
  const [deltodo, setdelTodos] = useState([]);
  //const [showdel, setshowdel] = useState(false);
  const [toshow, setShow] = useRecoilState(allitems);
  const [fresh, setFresh] = useRecoilState(refresh);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [selectedDate, setSelectedDate] = useState("");
  const [selecteddelDate, setSelecteddelDate] = useState(""); // State for selected date from dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown visibility
  const dropdownRef = useRef(null); // Ref for dropdown

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
    const fetchTodos = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://honoprisma.codessahil.workers.dev/gettodo",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        setTodos(response.data.Message.todo);
        setdelTodos(response.data.Message.todobin);
        //console.log(deltodo);
      } catch (error) {
        console.error("Error fetching todos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [fresh]);

  // Group todos by date

  const groupedTodos = {};
  todo.forEach((td) => {
    const date = format(new Date(td.created_at), "MM/dd/yyyy");
    if (!groupedTodos[date]) {
      groupedTodos[date] = [];
    }
    groupedTodos[date].push(td);
  });

  //for dels
  const groupedDelTodos = {};
  deltodo.forEach((td) => {
    const date = format(new Date(td.created_at), "MM/dd/yyyy");
    if (!groupedDelTodos[date]) {
      groupedDelTodos[date] = [];
    }
    groupedDelTodos[date].push(td);
  });

  // Sort groups by date (descending)
  const sortedDates = Object.keys(groupedTodos).sort(
    (a, b) => new Date(b) - new Date(a)
  );
  //console.log(sortedDates);
  //for dels
  const sorteddelDates = Object.keys(groupedDelTodos).sort(
    (a, b) => new Date(b) - new Date(a)
  );
  //console.log(sorteddelDates);

  // Sort todos within each date group by time (descending)
  sortedDates.forEach((date) => {
    groupedTodos[date].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  });
  //for dels
  sorteddelDates.forEach((date) => {
    groupedDelTodos[date].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  });

  // Filter todos based on search query and selected date
  const filteredGroupedTodos = {};
  Object.keys(groupedTodos).forEach((date) => {
    const filteredTodos = groupedTodos[date].filter(
      (td) =>
        td.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        td.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filteredTodos.length > 0) {
      if (!selectedDate || date === selectedDate) {
        filteredGroupedTodos[date] = filteredTodos;
      }
    }
  });

  const filteredGroupeddelTodos = {};
  Object.keys(groupedDelTodos).forEach((date) => {
    const filteredTodos = groupedDelTodos[date].filter(
      (td) =>
        td.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        td.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filteredTodos.length > 0) {
      if (!selecteddelDate || date === selecteddelDate) {
        filteredGroupeddelTodos[date] = filteredTodos;
      }
    }
  });
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className={`fixed right-3 top-16 flex justify-between space-x-2`}>
        <div
          className={`${
            showdel ? "hidden" : ""
          } text-sm rounded p-1 bg-blue-200 ${
            allitm ? "bg-green-200" : "bg-green-200"
          }`}
          onClick={() => {
            setAllitems((item) => !item);
          }}
        >
          <button>{allitm ? "All Cards" : "Create New"}</button>
        </div>

        <div
          className={`${
            allitm ? "hidden" : ""
          } text-sm rounded p-1 bg-blue-200 ${
            allitm ? "bg-green-200" : "bg-gray-200"
          }`}
          onClick={() => {
            setshowdel((item) => !item);
          }}
        >
          {!allitm && showdel && <button>back</button>}
          <div className="pt-[3px]">
            {!allitm && !showdel && (
              <button>
                <svg
                  className="w-[15px] h-[15px] fill-[#898989]"
                  viewBox="0 0 500 500"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M174.7 45.1C192.2 17 223 0 256 0s63.8 17 81.3 45.1l38.6 61.7 27-15.6c8.4-4.9 18.9-4.2 26.6 1.7s11.1 15.9 8.6 25.3l-23.4 87.4c-3.4 12.8-16.6 20.4-29.4 17l-87.4-23.4c-9.4-2.5-16.3-10.4-17.6-20s3.4-19.1 11.8-23.9l28.4-16.4L283 79c-5.8-9.3-16-15-27-15s-21.2 5.7-27 15l-17.5 28c-9.2 14.8-28.6 19.5-43.6 10.5-15.3-9.2-20.2-29.2-10.7-44.4l17.5-28zM429.5 251.9c15-9 34.4-4.3 43.6 10.5l24.4 39.1c9.4 15.1 14.4 32.4 14.6 50.2.3 53.1-42.7 96.4-95.8 96.4L320 448v32c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-64-64c-9.4-9.4-9.4-24.6 0-33.9l64-64c6.9-6.9 17.2-8.9 26.2-5.2s14.8 12.5 14.8 22.2v32l96.2 0c17.6 0 31.9-14.4 31.8-32 0-5.9-1.7-11.7-4.8-16.7l-24.4-39.1c-9.5-15.2-4.7-35.2 10.7-44.4zm-364.6-31L36 204.2c-8.4-4.9-13.1-14.3-11.8-23.9s8.2-17.5 17.6-20l87.4-23.4c12.8-3.4 26 4.2 29.4 17L182 241.2c2.5 9.4-.9 19.3-8.6 25.3s-18.2 6.6-26.6 1.7l-26.5-15.3L68.8 335.3c-3.1 5-4.8 10.8-4.8 16.7-.1 17.6 14.2 32 31.8 32l32.2 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-32.2 0C42.7 448-.3 404.8 0 351.6c.1-17.8 5.1-35.1 14.6-50.2l50.3-80.5z"></path>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <div
        className={`mt-32 md:mt-32 scroll-auto ${
          toshow ? "bg-white" : "hidden"
        }`}
      >
        <Cardcreate />
      </div>
      <div
        className={`mt-32 md:mt-32 scroll-auto ${
          toshow ? "hidden" : "bg-white"
        }`}
      >
        <div className=" p-4">
          {showdel && (
            <div className="text-center text-black text-2xl mb-5">
              {" "}
              Your Deleted Notes
            </div>
          )}
          <div className="mb-4 flex items-center">
            <input
              type="text"
              placeholder="Search by title or description"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <div className=" inline-block text-left mr-2" ref={dropdownRef}>
              <button
                type="button"
                className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                id="options-menu"
                aria-expanded={dropdownOpen}
                aria-hasgmapup="true"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <svg
                  class="h-8 w-8 text-gray-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  {" "}
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />{" "}
                  <line x1="16" y1="2" x2="16" y2="6" />{" "}
                  <line x1="8" y1="2" x2="8" y2="6" />{" "}
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </button>
              {dropdownOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-32 max-h-60 overflow-y-auto rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <div className=" py-1" role="none">
                    <button
                      onClick={() => {
                        setSelectedDate("");
                        setDropdownOpen(false);
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                      role="menuitem"
                    >
                      All Dates
                    </button>
                    {showdel &&
                      sorteddelDates.map((date) => (
                        <button
                          key={date}
                          onClick={() => {
                            setSelecteddelDate(date);
                            setDropdownOpen(false);
                          }}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                          role="menuitem"
                        >
                          {date}
                        </button>
                      ))}
                    {!showdel &&
                      sortedDates.map((date) => (
                        <button
                          key={date}
                          onClick={() => {
                            setSelectedDate(date);
                            setDropdownOpen(false);
                          }}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                          role="menuitem"
                        >
                          {date}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          {showdel &&
            (Object.keys(filteredGroupeddelTodos).length ===
            sorteddelDates.length
              ? sorteddelDates.map((date) => (
                  <div key={date} className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">{date}</h2>
                    <div
                      className={`grid ${
                        isSidebarOpen ? "gap-4" : "gap-14"
                      } grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 `}
                    >
                      {filteredGroupeddelTodos[date]?.map((td) => (
                        <TodoCarddel key={td.id} todo={td} />
                      ))}
                    </div>
                  </div>
                ))
              : Object.keys(filteredGroupeddelTodos).map((date) => (
                  <div key={date} className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">{date}</h2>
                    <div
                      className={`grid ${
                        isSidebarOpen ? "gap-4" : "gap-14"
                      } grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 `}
                    >
                      {filteredGroupeddelTodos[date].map((td) => (
                        <TodoCarddel key={td.id} todo={td} del={true} />
                      ))}
                    </div>
                  </div>
                )))}
          {!showdel &&
            (Object.keys(filteredGroupedTodos).length === sortedDates.length
              ? sortedDates.map((date) => (
                  <div key={date} className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">{date}</h2>
                    <div
                      className={`grid ${
                        isSidebarOpen ? "gap-4" : "gap-14"
                      } grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 `}
                    >
                      {filteredGroupedTodos[date]?.map((td) => (
                        <TodoCard key={td.id} todo={td} />
                      ))}
                    </div>
                  </div>
                ))
              : Object.keys(filteredGroupedTodos).map((date) => (
                  <div key={date} className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">{date}</h2>
                    <div
                      className={`grid ${
                        isSidebarOpen ? "gap-4" : "gap-14"
                      } grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 `}
                    >
                      {filteredGroupedTodos[date].map((td) => (
                        <TodoCard key={td.id} todo={td} />
                      ))}
                    </div>
                  </div>
                )))}
        </div>
      </div>
      {loading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="text-white">Loading...</div>
        </div>
      )}
    </div>
  );
}

function Sidebar({ isSidebarOpen }) {
  const navigate = useNavigate();
  return (
    <aside
      id="separator-sidebar"
      className={`fixed top-0 left-0 z-40 w-48 h-screen transition-transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } `}
      aria-label="Sidebar"
    >
      <div className="flex flex-col justify-between h-full px-3 pt-1 pb-4 overflow-y-auto bg-mytitlebar">
        <div>
          <ul className="cursor-pointer space-y-2 font-medium">
            <li>
              <a className="flex items-center justify-center p-2 rounded-lg text-white  group">
                <div className="flex space-x-0">
                  <span className="flex flex-col justify-center">
                    <img className="h-6 w-6" src={Design} />
                  </span>
                  <span className="ms-3 text-3xl text-mytext">abito</span>
                </div>
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  navigate("/dashboard");
                }}
                className="flex items-center p-2 text-mytext rounded-lg  hover:bg-mytextbg hover:text-white  group fill-mytext hover:fill-[#ffffff]"
              >
                <svg
                  className="flex-shrink-0 w-5 h-5  transition duration-75  group-hover:text-white "
                  xmlns="http://www.w3.org/2000/svg"
                  fill="peach"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>

                <span className="flex-1 ms-3 whitespace-nowrap">Dashboard</span>
                {/* <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span> */}
              </a>
            </li>
            {/* <li>
            <a
              onClick={() => {
                navigate("/messages");
              }}
              className="flex items-center p-2 text-mytext rounded-lg  hover:bg-mytextbg hover:text-white  group fill-mytext hover:fill-[#ffffff]"
            >
              <svg
                className="w-[25px] h-[25px] "
                viewBox="0 0 640 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M208 352c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176c0 38.6 14.7 74.3 39.6 103.4c-3.5 9.4-8.7 17.7-14.2 24.7c-4.8 6.2-9.7 11-13.3 14.3c-1.8 1.6-3.3 2.9-4.3 3.7c-.5 .4-.9 .7-1.1 .8l-.2 .2 0 0 0 0C1 327.2-1.4 334.4 .8 340.9S9.1 352 16 352c21.8 0 43.8-5.6 62.1-12.5c9.2-3.5 17.8-7.4 25.3-11.4C134.1 343.3 169.8 352 208 352zM448 176c0 112.3-99.1 196.9-216.5 207C255.8 457.4 336.4 512 432 512c38.2 0 73.9-8.7 104.7-23.9c7.5 4 16 7.9 25.2 11.4c18.3 6.9 40.3 12.5 62.1 12.5c6.9 0 13.1-4.5 15.2-11.1c2.1-6.6-.2-13.8-5.8-17.9l0 0 0 0-.2-.2c-.2-.2-.6-.4-1.1-.8c-1-.8-2.5-2-4.3-3.7c-3.6-3.3-8.5-8.1-13.3-14.3c-5.5-7-10.7-15.4-14.2-24.7c24.9-29 39.6-64.7 39.6-103.4c0-92.8-84.9-168.9-192.6-175.5c.4 5.1 .6 10.3 .6 15.5z"></path>
              </svg>
              <span className="flex-1 ms-3 whitespace-nowrap">Inbox</span>

            </a>
          </li> */}
            <li>
              <a
                onClick={() => {
                  navigate("/userprofile");
                }}
                className="flex items-center p-2 rounded-lg text-mytext hover:bg-mytextbg group  group fill-mytext hover:text-white hover:fill-[#ffffff]"
              >
                <svg
                  className="flex-shrink-0 w-5 h-5  transition duration-75  "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  // fill="#dfd6d6"
                  viewBox="0 0 20 18"
                >
                  <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Profile</span>
              </a>
            </li>

            <li>
              <a
                onClick={() => {
                  navigate("/dashboardnotes");
                }}
                className="flex items-center p-2 text-mytext rounded-lg  hover:bg-mytextbg group hover:text-white group fill-mytext hover:fill-[#ffffff]"
              >
                <svg
                  className="flex-shrink-0 w-5 h-5  transition duration-75  "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  // fill="#dfd6d6"
                  viewBox="0 0 20 18"
                >
                  <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z" />
                  <path d="M6.737 11.061a2.961 2.961 0 0 1 .81-1.515l6.117-6.116A4.839 4.839 0 0 1 16 2.141V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18v-3.093l-1.546 1.546c-.413.413-.94.695-1.513.81l-3.4.679a2.947 2.947 0 0 1-1.85-.227 2.96 2.96 0 0 1-1.635-3.257l.681-3.397Z" />
                  <path d="M8.961 16a.93.93 0 0 0 .189-.019l3.4-.679a.961.961 0 0 0 .49-.263l6.118-6.117a2.884 2.884 0 0 0-4.079-4.078l-6.117 6.117a.96.96 0 0 0-.263.491l-.679 3.4A.961.961 0 0 0 8.961 16Zm7.477-9.8a.958.958 0 0 1 .68-.281.961.961 0 0 1 .682 1.644l-.315.315-1.36-1.36.313-.318Zm-5.911 5.911 4.236-4.236 1.359 1.359-4.236 4.237-1.7.339.341-1.699Z" />
                </svg>
                <span className=" flex-1 ms-3 whitespace-nowrap">
                  Important stuff
                </span>
              </a>
            </li>

            <li>
              <a
                onClick={() => {
                  navigate("/userprojects");
                }}
                className="flex items-center p-2 text-mytext rounded-lg hover:bg-mytextbg group hover:text-white group fill-mytext hover:fill-[#ffffff]"
              >
                <svg
                  className="flex-shrink-0 w-5 h-5  transition duration-75  group-hover:text-white "
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
                    d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122"
                  />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Your Tasks
                </span>
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  navigate("/assignedprojects");
                }}
                className="flex items-center p-2 text-mytext rounded-lg hover:bg-mytextbg group hover:text-white group fill-mytext hover:fill-[#ffffff]"
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 transition duration-75  group-hover:text-white "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 16"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
                  />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Assigned Tasks
                </span>
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  navigate("/createtask");
                }}
                className="flex items-center p-2 text-mytext rounded-lg hover:bg-mytextbg group hover:text-white group fill-mytext hover:fill-[#ffffff]"
              >
                <svg
                  className="w-[25px] h-[25px] "
                  viewBox="0 0 576 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M64 64C28.7 64 0 92.7 0 128V384c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H64zm16 64h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V144c0-8.8 7.2-16 16-16zM64 240c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V240zm16 80h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V336c0-8.8 7.2-16 16-16zm80-176c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V144zm16 80h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V240c0-8.8 7.2-16 16-16zM160 336c0-8.8 7.2-16 16-16H400c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V336zM272 128h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V144c0-8.8 7.2-16 16-16zM256 240c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V240zM368 128h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H368c-8.8 0-16-7.2-16-16V144c0-8.8 7.2-16 16-16zM352 240c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H368c-8.8 0-16-7.2-16-16V240zM464 128h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H464c-8.8 0-16-7.2-16-16V144c0-8.8 7.2-16 16-16zM448 240c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H464c-8.8 0-16-7.2-16-16V240zm16 80h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H464c-8.8 0-16-7.2-16-16V336c0-8.8 7.2-16 16-16z"></path>
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Create Task
                </span>
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  navigate("/allcode");
                }}
                className="flex items-center p-2 text-mytext rounded-lg hover:bg-mytextbg group hover:text-white group fill-mytext hover:fill-[#ffffff]"
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
                    d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
                  />
                </svg>

                <span className="flex-1 ms-3 whitespace-nowrap">
                  Saved codes
                </span>
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  navigate("/settings");
                }}
                className="flex items-center p-2 text-mytext rounded-lg hover:bg-mytextbg group hover:text-white group fill-mytext hover:fill-[#ffffff]"
              >
                <svg
                  className="w-[25px] h-[25px]"
                  viewBox="0 0 512 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"></path>
                </svg>

                <span className="ms-3">Settings</span>
              </a>
            </li>
          </ul>
          <ul className="pt-4 mt-4 space-y-2 font-medium border-t text-mytext border-gray-200 dark:border-gray-700">
            <li>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSe7G-6BswDGNbcGfjRcGttV4oxP3eet_QRgUTkHkuwc49axfA/viewform?usp=sf_link"
                className="flex items-center p-2 text-mytext rounded-lg  group fill-mytext hover:fill-[#ffffff] hover:bg-mytextbg group hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="w-[15px] h-[20px] "
                  viewBox="0 0 384 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M14 2.2C22.5-1.7 32.5-.3 39.6 5.8L80 40.4 120.4 5.8c9-7.7 22.3-7.7 31.2 0L192 40.4 232.4 5.8c9-7.7 22.3-7.7 31.2 0L304 40.4 344.4 5.8c7.1-6.1 17.1-7.5 25.6-3.6s14 12.4 14 21.8V488c0 9.4-5.5 17.9-14 21.8s-18.5 2.5-25.6-3.6L304 471.6l-40.4 34.6c-9 7.7-22.3 7.7-31.2 0L192 471.6l-40.4 34.6c-9 7.7-22.3 7.7-31.2 0L80 471.6 39.6 506.2c-7.1 6.1-17.1 7.5-25.6 3.6S0 497.4 0 488V24C0 14.6 5.5 6.1 14 2.2zM96 144c-8.8 0-16 7.2-16 16s7.2 16 16 16H288c8.8 0 16-7.2 16-16s-7.2-16-16-16H96zM80 352c0 8.8 7.2 16 16 16H288c8.8 0 16-7.2 16-16s-7.2-16-16-16H96c-8.8 0-16 7.2-16 16zM96 240c-8.8 0-16 7.2-16 16s7.2 16 16 16H288c8.8 0 16-7.2 16-16s-7.2-16-16-16H96z"></path>
                </svg>
                <span className="ms-3">Feedback</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-mytext rounded-lg group fill-mytext hover:fill-[#ffffff] hover:bg-mytextbg group hover:text-white"
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 text-mytext transition duration-75 group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 16 20"
                >
                  <path d="M16 14V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v15a3 3 0 0 0 3 3h12a1 1 0 0 0 0-2h-1v-2a2 2 0 0 0 2-2ZM4 2h2v12H4V2Zm8 16H3a1 1 0 0 1 0-2h9v2Z" />
                </svg>
                <span className="ms-3">Documentation</span>
              </a>
            </li>

            <li className="cursor-pointer">
              <a
                onClick={() => {
                  navigate("/colab");
                }}
                className="flex items-center p-2 text-mytext rounded-lg hover:bg-mytextbg hover:text-white group fill-mytext hover:fill-[#ffffff]"
              >
                <svg
                  className="w-[25px] h-[25px] "
                  viewBox="0 0 640 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M323.4 85.2l-96.8 78.4c-16.1 13-19.2 36.4-7 53.1c12.9 17.8 38 21.3 55.3 7.8l99.3-77.2c7-5.4 17-4.2 22.5 2.8s4.2 17-2.8 22.5l-20.9 16.2L550.2 352H592c26.5 0 48-21.5 48-48V176c0-26.5-21.5-48-48-48H516h-4-.7l-3.9-2.5L434.8 79c-15.3-9.8-33.2-15-51.4-15c-21.8 0-43 7.5-60 21.2zm22.8 124.4l-51.7 40.2C263 274.4 217.3 268 193.7 235.6c-22.2-30.5-16.6-73.1 12.7-96.8l83.2-67.3c-11.6-4.9-24.1-7.4-36.8-7.4C234 64 215.7 69.6 200 80l-72 48H48c-26.5 0-48 21.5-48 48V304c0 26.5 21.5 48 48 48H156.2l91.4 83.4c19.6 17.9 49.9 16.5 67.8-3.1c5.5-6.1 9.2-13.2 11.1-20.6l17 15.6c19.5 17.9 49.9 16.6 67.8-2.9c4.5-4.9 7.8-10.6 9.9-16.5c19.4 13 45.8 10.3 62.1-7.5c17.9-19.5 16.6-49.9-2.9-67.8l-134.2-123z"></path>
                </svg>
                <span className="ms-3">Collab</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/sahil-kumar-sinha-98011a24b/"
                className="flex items-center p-2 text-mytext rounded-lg hover:bg-mytextbg group hover:text-white fill-mytext hover:fill-[#ffffff]"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="w-[25px] h-[25px] "
                  viewBox="0 0 640 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M64 96c0-35.3 28.7-64 64-64H512c35.3 0 64 28.7 64 64V352H512V96H128V352H64V96zM0 403.2C0 392.6 8.6 384 19.2 384H620.8c10.6 0 19.2 8.6 19.2 19.2c0 42.4-34.4 76.8-76.8 76.8H76.8C34.4 480 0 445.6 0 403.2zM281 209l-31 31 31 31c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-48-48c-9.4-9.4-9.4-24.6 0-33.9l48-48c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9zM393 175l48 48c9.4 9.4 9.4 24.6 0 33.9l-48 48c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l31-31-31-31c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z"></path>
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Developed by
                </span>
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("userinfo");
                  localStorage.removeItem("allusers");
                  localStorage.removeItem("starttime");
                  localStorage.removeItem("weektasks");
                  navigate("/signin");
                }}
                className="flex items-center p-2 text-mytext rounded-lg hover:bg-mytextbg group hover:text-white fill-mytext hover:fill-[#ffffff]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-6"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12 2.25a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM6.166 5.106a.75.75 0 0 1 0 1.06 8.25 8.25 0 1 0 11.668 0 .75.75 0 1 1 1.06-1.06c3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788a.75.75 0 0 1 1.06 0Z"
                    clip-rule="evenodd"
                  />
                </svg>

                <span className="ms-3">Log out</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}



// import React, { useEffect, useState, useRef } from "react";
// import { Users } from "../components/Users";
// import { todos } from "../store/atoms/todos";
// import { useRecoilState } from "recoil";
// import { TodoCard } from "../components/TodoCard";
// import { TodoCarddel } from "../components/TodoCard";
// import { Cardcreate } from "../components/Cardcreate";
// import { refresh } from "../store/atoms/refresh";
// import axios from "axios";
// import { format } from "date-fns";
// import { Topbarlogin } from "../components/Topbarlogin";
// import { useNavigate } from "react-router-dom";
// import { allitems } from "../store/atoms/allcards";
// import Design from "../images/Design.jpg"


// export const Dashboardnotes = ()=>{
//   const [isSidebarOpen, setSidebarOpen] = useState(false);
//   const [showdel, setshowdel] = useState(false);
//   const navigate = useNavigate();
//   const [allitm,setAllitems] = useRecoilState(allitems);
//   const toggleSidebar = () => {
//     setSidebarOpen(!isSidebarOpen);
//   };

//   return (
//     <div className="">
//         <div
//             className={`fixed right-0  top-0 z-50  ${isSidebarOpen ? "left-48" : "left-0"
//                 }`}
//         >
//             <div className="z-40">
//                 <Topbarlogin
//                     isSidebarOpen={isSidebarOpen}
//                     toggleSidebar={toggleSidebar}
//                 ></Topbarlogin>
//             </div>

//             <div></div>
//         </div>
//         {/* <div className="text-black">
//     hi
//   </div> */}
//         <div className="">
//             <div className="z-50">
//                 <Sidebar isSidebarOpen={isSidebarOpen}></Sidebar>

//                 <div
//                     className="z-0 bg-mybg min-h-screen"
//                     onClick={() => {
//                         setSidebarOpen(false);
//                     }}
//                 >
//                     <div className={`${
//           isSidebarOpen ? "pl-48 rounded-md " : "mb-0 rounded-md "
//         }`}>
//                         <Notes allitm={allitm} isSidebarOpen={isSidebarOpen} setAllitems={setAllitems} showdel={showdel} setshowdel={setshowdel}></Notes>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </div>
// );
// }



// function Notes({allitm,setAllitems,showdel,setshowdel,isSidebarOpen}){
//   const [todo, setTodos] = useRecoilState(todos);
//   const [deltodo, setdelTodos] = useState([]);
//   //const [showdel, setshowdel] = useState(false);
//   const [toshow, setShow] = useRecoilState(allitems);
//   const [fresh, setFresh] = useRecoilState(refresh);
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState(""); // State for search query
//   const [selectedDate, setSelectedDate] = useState("");
//   const [selecteddelDate, setSelecteddelDate] = useState(""); // State for selected date from dropdown
//   const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown visibility
//   const dropdownRef = useRef(null); // Ref for dropdown
  


//   useEffect(() => {
//     if(!localStorage.getItem('token')){
//       navigate('/')
//     }
//     const fetchTodos = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get("https://honoprisma.codessahil.workers.dev/gettodo", {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//             "Content-Type": "application/json",
//           },
//         });
//         setTodos(response.data.Message.todo);
//         setdelTodos(response.data.Message.todobin);
//         //console.log(deltodo);
//       } catch (error) {
//         console.error("Error fetching todos", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTodos();
//   }, [fresh]);

//   // Group todos by date
  
//   const groupedTodos = {};
//   todo.forEach((td) => {
//     const date = format(new Date(td.created_at), 'MM/dd/yyyy');
//     if (!groupedTodos[date]) {
//       groupedTodos[date] = [];
//     }
//     groupedTodos[date].push(td);
//   });

//   //for dels
//   const groupedDelTodos = {};
//   deltodo.forEach((td) => {
//     const date = format(new Date(td.created_at), 'MM/dd/yyyy');
//     if (!groupedDelTodos[date]) {
//       groupedDelTodos[date] = [];
//     }
//     groupedDelTodos[date].push(td);
//   });

//   // Sort groups by date (descending)
//   const sortedDates = Object.keys(groupedTodos).sort((a, b) => new Date(b) - new Date(a));
//   //console.log(sortedDates);
//   //for dels
//   const sorteddelDates = Object.keys(groupedDelTodos).sort((a, b) => new Date(b) - new Date(a));
//   //console.log(sorteddelDates);

//   // Sort todos within each date group by time (descending)
//   sortedDates.forEach((date) => {
//     groupedTodos[date].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
//   });
//   //for dels
//   sorteddelDates.forEach((date) => {
//     groupedDelTodos[date].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
//   });

//   // Filter todos based on search query and selected date
//   const filteredGroupedTodos = {};
//   Object.keys(groupedTodos).forEach((date) => {
//     const filteredTodos = groupedTodos[date].filter((td) =>
//       td.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       td.description.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//     if (filteredTodos.length > 0) {
//       if (!selectedDate || date === selectedDate) {
//         filteredGroupedTodos[date] = filteredTodos;
//       }
//     }
//   });

//   const filteredGroupeddelTodos = {};
//   Object.keys(groupedDelTodos).forEach((date) => {
//     const filteredTodos = groupedDelTodos[date].filter((td) =>
//       td.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       td.description.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//     if (filteredTodos.length > 0) {
//       if (!selecteddelDate || date === selecteddelDate) {
//         filteredGroupeddelTodos[date] = filteredTodos;
//       }
//     }
//   });
//   useEffect(() => {
    
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);






//   return (
//     <div>
//       <div className={`fixed right-3 top-16 flex justify-between space-x-2`}>
//         <div className={`${showdel?'hidden':''} text-sm rounded p-1 bg-blue-200 ${allitm?'bg-green-200':'bg-green-200'}`} onClick={() => {
//           setAllitems(item => !item);
//         }}>
//           <button >
//             {allitm ? 'All Cards' : 'Create New'}
//           </button>

//         </div>
        
//         <div className={`${allitm ?'hidden':''} text-sm rounded p-1 bg-blue-200 ${allitm?'bg-green-200':'bg-gray-200'}`} onClick={() => {
//           setshowdel(item => !item);
//         }}>
//           {!allitm && showdel && <button >back</button>}
//           <div className="pt-[3px]" >{!allitm && !showdel && <button ><svg
//   className="w-[15px] h-[15px] fill-[#898989]"
//   viewBox="0 0 500 500"
//   xmlns="http://www.w3.org/2000/svg"
// >
//   <path d="M174.7 45.1C192.2 17 223 0 256 0s63.8 17 81.3 45.1l38.6 61.7 27-15.6c8.4-4.9 18.9-4.2 26.6 1.7s11.1 15.9 8.6 25.3l-23.4 87.4c-3.4 12.8-16.6 20.4-29.4 17l-87.4-23.4c-9.4-2.5-16.3-10.4-17.6-20s3.4-19.1 11.8-23.9l28.4-16.4L283 79c-5.8-9.3-16-15-27-15s-21.2 5.7-27 15l-17.5 28c-9.2 14.8-28.6 19.5-43.6 10.5-15.3-9.2-20.2-29.2-10.7-44.4l17.5-28zM429.5 251.9c15-9 34.4-4.3 43.6 10.5l24.4 39.1c9.4 15.1 14.4 32.4 14.6 50.2.3 53.1-42.7 96.4-95.8 96.4L320 448v32c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-64-64c-9.4-9.4-9.4-24.6 0-33.9l64-64c6.9-6.9 17.2-8.9 26.2-5.2s14.8 12.5 14.8 22.2v32l96.2 0c17.6 0 31.9-14.4 31.8-32 0-5.9-1.7-11.7-4.8-16.7l-24.4-39.1c-9.5-15.2-4.7-35.2 10.7-44.4zm-364.6-31L36 204.2c-8.4-4.9-13.1-14.3-11.8-23.9s8.2-17.5 17.6-20l87.4-23.4c12.8-3.4 26 4.2 29.4 17L182 241.2c2.5 9.4-.9 19.3-8.6 25.3s-18.2 6.6-26.6 1.7l-26.5-15.3L68.8 335.3c-3.1 5-4.8 10.8-4.8 16.7-.1 17.6 14.2 32 31.8 32l32.2 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-32.2 0C42.7 448-.3 404.8 0 351.6c.1-17.8 5.1-35.1 14.6-50.2l50.3-80.5z"></path>
// </svg>

// </button>}</div>

//         </div>
        
//       </div>
      
//       <div className={`mt-32 md:mt-32 scroll-auto ${toshow ? 'bg-white' : 'hidden'}`}>
//         <Cardcreate />
//       </div>
//       <div className={`mt-32 md:mt-32 scroll-auto ${toshow ? 'hidden' : 'bg-white'}`}>
//         <div className=" p-4">
//         {showdel && <div className="text-center text-black text-2xl mb-5"> Your Deleted Notes</div>}
//           <div className="mb-4 flex items-center">
          
//           <input
//               type="text"
//               placeholder="Search by title or description"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded"
//             />
//             <div className=" inline-block text-left mr-2" ref={dropdownRef}>
//               <button
//                 type="button"
//                 className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                 id="options-menu"
//                 aria-expanded={dropdownOpen}
//                 aria-hasgmapup="true"
//                 onClick={() => setDropdownOpen(!dropdownOpen)}
//               >
//                 <svg class="h-8 w-8 text-gray-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />  <line x1="16" y1="2" x2="16" y2="6" />  <line x1="8" y1="2" x2="8" y2="6" />  <line x1="3" y1="10" x2="21" y2="10" /></svg>
//               </button>
//               {dropdownOpen && (
//                 <div
//                   className="origin-top-right absolute right-0 mt-2 w-32 max-h-60 overflow-y-auto rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
//                   role="menu"
//                   aria-orientation="vertical"
//                   aria-labelledby="options-menu"
//                 >
//                   <div className=" py-1" role="none">
//                     <button
//                       onClick={() => {setSelectedDate("")
//                         setDropdownOpen(false);}
//                       }
//                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
//                       role="menuitem"
//                     >
//                       All Dates
//                     </button>
//                     {showdel && sorteddelDates.map((date) => (
//                       <button
//                         key={date}
//                         onClick={() => {
//                           setSelecteddelDate(date);
//                           setDropdownOpen(false);
//                         }}
//                         className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
//                         role="menuitem"
//                       >
//                         {date}
//                       </button>
//                     ))}
//                     {!showdel && sortedDates.map((date) => (
//                       <button
//                         key={date}
//                         onClick={() => {
//                           setSelectedDate(date);
//                           setDropdownOpen(false);
//                         }}
//                         className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
//                         role="menuitem"
//                       >
//                         {date}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
            
//           </div>
//           {showdel && (Object.keys(filteredGroupeddelTodos).length === sorteddelDates.length ? (
            
//   sorteddelDates.map((date) => (
//     <div key={date} className="mb-4">
//       <h2 className="text-xl font-semibold mb-2">{date}</h2>
//       <div className={`grid ${isSidebarOpen?"gap-4":"gap-14"} grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 `}>
//         {filteredGroupeddelTodos[date]?.map((td) => (
//           <TodoCarddel key={td.id} todo={td} />
//         ))}
//       </div>
//     </div>
//   ))
// ) : (
//   Object.keys(filteredGroupeddelTodos).map((date) => (
//     <div key={date} className="mb-4">
//       <h2 className="text-xl font-semibold mb-2">{date}</h2>
//       <div className={`grid ${isSidebarOpen?"gap-4":"gap-14"} grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 `}>
//         {filteredGroupeddelTodos[date].map((td) => (
//           <TodoCarddel key={td.id} todo={td} del={true} />
//         ))}
//       </div>
//     </div>
//   ))
// ))}
// {!showdel && (Object.keys(filteredGroupedTodos).length === sortedDates.length ? (
//   sortedDates.map((date) => (
//     <div key={date} className="mb-4">
//       <h2 className="text-xl font-semibold mb-2">{date}</h2>
//       <div className={`grid ${isSidebarOpen?"gap-4":"gap-14"} grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 `}>
//         {filteredGroupedTodos[date]?.map((td) => (
//           <TodoCard key={td.id} todo={td} />
//         ))}
//       </div>
//     </div>
//   ))
// ) : (
//   Object.keys(filteredGroupedTodos).map((date) => (
//     <div key={date} className="mb-4">
//       <h2 className="text-xl font-semibold mb-2">{date}</h2>
//       <div className={`grid ${isSidebarOpen?"gap-4":"gap-14"} grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 `}>
//         {filteredGroupedTodos[date].map((td) => (
//           <TodoCard key={td.id} todo={td} />
//         ))}
//       </div>
//     </div>
//   ))
// ))}
//         </div>
//       </div>
//       {loading && (
//         <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
//           <div className="text-white">Loading...</div>
//         </div>
//       )}
//     </div>
//   );
// }


// function Sidebar({ isSidebarOpen }) {
//   const navigate = useNavigate();
//   return (
//       <aside
//           id="separator-sidebar"
//           className={`fixed top-0 left-0 z-40 w-48 h-screen transition-transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
//               } `}
//           aria-label="Sidebar"
//       >
//           <div className="flex flex-col justify-between h-full px-3 pt-1 pb-4 overflow-y-auto bg-mytitlebar">
//               <div>
//                   <ul className="cursor-pointer space-y-2 font-medium">
//                       <li>
//                           <a className="flex items-center justify-center p-2 rounded-lg text-white  group">
//                               <div className="flex space-x-0">
//                                   <span className="flex flex-col justify-center">
//                                       <img
//                                           className="h-6 w-6"
//                                           src={Design}
//                                       />
//                                   </span>
//                                   <span className="ms-3 text-3xl text-mytext">abito</span>
//                               </div>
//                           </a>
//                       </li>
//                       <li>
//                           <a
//                               onClick={() => {
//                                   navigate("/dashboard");
//                               }}
//                               className="flex items-center p-2 text-mytext rounded-lg  hover:bg-mytextbg hover:text-white  group fill-mytext hover:fill-[#ffffff]"
//                           >
//                               <svg
//                                   className="flex-shrink-0 w-5 h-5  transition duration-75  group-hover:text-white "
//                                   xmlns="http://www.w3.org/2000/svg"
//                                   fill="peach"
//                                   viewBox="0 0 24 24"
//                                   stroke-width="1.5"
//                                   stroke="currentColor"
//                                   class="size-6"
//                               >
//                                   <path
//                                       stroke-linecap="round"
//                                       stroke-linejoin="round"
//                                       d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
//                                   />
//                               </svg>

//                               <span className="flex-1 ms-3 whitespace-nowrap">Dashboard</span>
//                               {/* <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span> */}
//                           </a>
//                       </li>
//                       {/* <li>
//             <a
//               onClick={() => {
//                 navigate("/messages");
//               }}
//               className="flex items-center p-2 text-mytext rounded-lg  hover:bg-mytextbg hover:text-white  group fill-mytext hover:fill-[#ffffff]"
//             >
//               <svg
//                 className="w-[25px] h-[25px] "
//                 viewBox="0 0 640 512"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path d="M208 352c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176c0 38.6 14.7 74.3 39.6 103.4c-3.5 9.4-8.7 17.7-14.2 24.7c-4.8 6.2-9.7 11-13.3 14.3c-1.8 1.6-3.3 2.9-4.3 3.7c-.5 .4-.9 .7-1.1 .8l-.2 .2 0 0 0 0C1 327.2-1.4 334.4 .8 340.9S9.1 352 16 352c21.8 0 43.8-5.6 62.1-12.5c9.2-3.5 17.8-7.4 25.3-11.4C134.1 343.3 169.8 352 208 352zM448 176c0 112.3-99.1 196.9-216.5 207C255.8 457.4 336.4 512 432 512c38.2 0 73.9-8.7 104.7-23.9c7.5 4 16 7.9 25.2 11.4c18.3 6.9 40.3 12.5 62.1 12.5c6.9 0 13.1-4.5 15.2-11.1c2.1-6.6-.2-13.8-5.8-17.9l0 0 0 0-.2-.2c-.2-.2-.6-.4-1.1-.8c-1-.8-2.5-2-4.3-3.7c-3.6-3.3-8.5-8.1-13.3-14.3c-5.5-7-10.7-15.4-14.2-24.7c24.9-29 39.6-64.7 39.6-103.4c0-92.8-84.9-168.9-192.6-175.5c.4 5.1 .6 10.3 .6 15.5z"></path>
//               </svg>
//               <span className="flex-1 ms-3 whitespace-nowrap">Inbox</span>

//             </a>
//           </li> */}
//                       <li>
//                           <a
//                               onClick={() => {
//                                   navigate("/userprofile");
//                               }}
//                               className="flex items-center p-2 rounded-lg text-mytext hover:bg-mytextbg group  group fill-mytext hover:text-white hover:fill-[#ffffff]"
//                           >
//                               <svg
//                                   className="flex-shrink-0 w-5 h-5  transition duration-75  "
//                                   aria-hidden="true"
//                                   xmlns="http://www.w3.org/2000/svg"
//                                   // fill="#dfd6d6"
//                                   viewBox="0 0 20 18"
//                               >
//                                   <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
//                               </svg>
//                               <span className="flex-1 ms-3 whitespace-nowrap">Profile</span>
//                           </a>
//                       </li>

//                       <li>
//                           <a
//                               onClick={() => {
//                                   navigate("/dashboardnotes");
//                               }}
//                               className="flex items-center p-2 text-mytext rounded-lg  hover:bg-mytextbg group hover:text-white group fill-mytext hover:fill-[#ffffff]"
//                           >
//                               <svg
//                                   className="flex-shrink-0 w-5 h-5  transition duration-75  "
//                                   aria-hidden="true"
//                                   xmlns="http://www.w3.org/2000/svg"
//                                   // fill="#dfd6d6"
//                                   viewBox="0 0 20 18"
//                               >
//                                   <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z" />
//                                   <path d="M6.737 11.061a2.961 2.961 0 0 1 .81-1.515l6.117-6.116A4.839 4.839 0 0 1 16 2.141V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18v-3.093l-1.546 1.546c-.413.413-.94.695-1.513.81l-3.4.679a2.947 2.947 0 0 1-1.85-.227 2.96 2.96 0 0 1-1.635-3.257l.681-3.397Z" />
//                                   <path d="M8.961 16a.93.93 0 0 0 .189-.019l3.4-.679a.961.961 0 0 0 .49-.263l6.118-6.117a2.884 2.884 0 0 0-4.079-4.078l-6.117 6.117a.96.96 0 0 0-.263.491l-.679 3.4A.961.961 0 0 0 8.961 16Zm7.477-9.8a.958.958 0 0 1 .68-.281.961.961 0 0 1 .682 1.644l-.315.315-1.36-1.36.313-.318Zm-5.911 5.911 4.236-4.236 1.359 1.359-4.236 4.237-1.7.339.341-1.699Z" />
//                               </svg>
//                               <span className=" flex-1 ms-3 whitespace-nowrap">
//                                   Important stuff
//                               </span>
//                           </a>
//                       </li>

//                       <li>
//                           <a
//                               onClick={() => {
//                                   navigate("/userprojects");
//                               }}
//                               className="flex items-center p-2 text-mytext rounded-lg hover:bg-mytextbg group hover:text-white group fill-mytext hover:fill-[#ffffff]"
//                           >
//                               <svg
//                                   className="flex-shrink-0 w-5 h-5  transition duration-75  group-hover:text-white "
//                                   xmlns="http://www.w3.org/2000/svg"
//                                   fill="none"
//                                   viewBox="0 0 24 24"
//                                   stroke-width="1.5"
//                                   stroke="currentColor"
//                                   class="size-6"
//                               >
//                                   <path
//                                       stroke-linecap="round"
//                                       stroke-linejoin="round"
//                                       d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122"
//                                   />
//                               </svg>
//                               <span className="flex-1 ms-3 whitespace-nowrap">
//                                   Your Tasks
//                               </span>
//                           </a>
//                       </li>
//                       <li>
//                           <a
//                               onClick={() => {
//                                   navigate("/assignedprojects");
//                               }}
//                               className="flex items-center p-2 text-mytext rounded-lg hover:bg-mytextbg group hover:text-white group fill-mytext hover:fill-[#ffffff]"
//                           >
//                               <svg
//                                   className="flex-shrink-0 w-5 h-5 transition duration-75  group-hover:text-white "
//                                   aria-hidden="true"
//                                   xmlns="http://www.w3.org/2000/svg"
//                                   fill="none"
//                                   viewBox="0 0 18 16"
//                               >
//                                   <path
//                                       stroke="currentColor"
//                                       stroke-linecap="round"
//                                       stroke-linejoin="round"
//                                       stroke-width="2"
//                                       d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
//                                   />
//                               </svg>
//                               <span className="flex-1 ms-3 whitespace-nowrap">
//                                   Assigned Tasks
//                               </span>
//                           </a>
//                       </li>
//                       <li>
//                           <a
//                               onClick={() => {
//                                   navigate("/createtask");
//                               }}
//                               className="flex items-center p-2 text-mytext rounded-lg hover:bg-mytextbg group hover:text-white group fill-mytext hover:fill-[#ffffff]"
//                           >
//                               <svg
//                                   className="w-[25px] h-[25px] "
//                                   viewBox="0 0 576 512"
//                                   xmlns="http://www.w3.org/2000/svg"
//                               >
//                                   <path d="M64 64C28.7 64 0 92.7 0 128V384c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H64zm16 64h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V144c0-8.8 7.2-16 16-16zM64 240c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V240zm16 80h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V336c0-8.8 7.2-16 16-16zm80-176c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V144zm16 80h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V240c0-8.8 7.2-16 16-16zM160 336c0-8.8 7.2-16 16-16H400c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V336zM272 128h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V144c0-8.8 7.2-16 16-16zM256 240c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V240zM368 128h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H368c-8.8 0-16-7.2-16-16V144c0-8.8 7.2-16 16-16zM352 240c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H368c-8.8 0-16-7.2-16-16V240zM464 128h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H464c-8.8 0-16-7.2-16-16V144c0-8.8 7.2-16 16-16zM448 240c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H464c-8.8 0-16-7.2-16-16V240zm16 80h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H464c-8.8 0-16-7.2-16-16V336c0-8.8 7.2-16 16-16z"></path>
//                               </svg>
//                               <span className="flex-1 ms-3 whitespace-nowrap">
//                                   Create Task
//                               </span>
//                           </a>
//                       </li>
//                       <li>
//                           <a
//                               onClick={() => {
//                                   navigate("/settings");
//                               }}
//                               className="flex items-center p-2 text-mytext rounded-lg hover:bg-mytextbg group hover:text-white group fill-mytext hover:fill-[#ffffff]"
//                           >
//                               <svg
//                                   className="w-[25px] h-[25px]"
//                                   viewBox="0 0 512 512"
//                                   xmlns="http://www.w3.org/2000/svg"
//                               >
//                                   <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"></path>
//                               </svg>

//                               <span className="ms-3">Settings</span>
//                           </a>
//                       </li>
//                   </ul>
//                   <ul className="pt-4 mt-4 space-y-2 font-medium border-t text-mytext border-gray-200 dark:border-gray-700">
//                       <li>
//                           <a
//                               href="https://docs.google.com/forms/d/e/1FAIpQLSe7G-6BswDGNbcGfjRcGttV4oxP3eet_QRgUTkHkuwc49axfA/viewform?usp=sf_link"
//                               className="flex items-center p-2 text-mytext rounded-lg  group fill-mytext hover:fill-[#ffffff] hover:bg-mytextbg group hover:text-white"
//                               target="_blank"
//                               rel="noopener noreferrer"
//                           >
//                               <svg
//                                   className="w-[15px] h-[20px] "
//                                   viewBox="0 0 384 512"
//                                   xmlns="http://www.w3.org/2000/svg"
//                               >
//                                   <path d="M14 2.2C22.5-1.7 32.5-.3 39.6 5.8L80 40.4 120.4 5.8c9-7.7 22.3-7.7 31.2 0L192 40.4 232.4 5.8c9-7.7 22.3-7.7 31.2 0L304 40.4 344.4 5.8c7.1-6.1 17.1-7.5 25.6-3.6s14 12.4 14 21.8V488c0 9.4-5.5 17.9-14 21.8s-18.5 2.5-25.6-3.6L304 471.6l-40.4 34.6c-9 7.7-22.3 7.7-31.2 0L192 471.6l-40.4 34.6c-9 7.7-22.3 7.7-31.2 0L80 471.6 39.6 506.2c-7.1 6.1-17.1 7.5-25.6 3.6S0 497.4 0 488V24C0 14.6 5.5 6.1 14 2.2zM96 144c-8.8 0-16 7.2-16 16s7.2 16 16 16H288c8.8 0 16-7.2 16-16s-7.2-16-16-16H96zM80 352c0 8.8 7.2 16 16 16H288c8.8 0 16-7.2 16-16s-7.2-16-16-16H96c-8.8 0-16 7.2-16 16zM96 240c-8.8 0-16 7.2-16 16s7.2 16 16 16H288c8.8 0 16-7.2 16-16s-7.2-16-16-16H96z"></path>
//                               </svg>
//                               <span className="ms-3">Feedback</span>
//                           </a>
//                       </li>
//                       <li>
//                           <a
//                               href="#"
//                               className="flex items-center p-2 text-mytext rounded-lg group fill-mytext hover:fill-[#ffffff] hover:bg-mytextbg group hover:text-white"
//                           >
//                               <svg
//                                   className="flex-shrink-0 w-5 h-5 text-mytext transition duration-75 group-hover:text-white"
//                                   aria-hidden="true"
//                                   xmlns="http://www.w3.org/2000/svg"
//                                   fill="currentColor"
//                                   viewBox="0 0 16 20"
//                               >
//                                   <path d="M16 14V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v15a3 3 0 0 0 3 3h12a1 1 0 0 0 0-2h-1v-2a2 2 0 0 0 2-2ZM4 2h2v12H4V2Zm8 16H3a1 1 0 0 1 0-2h9v2Z" />
//                               </svg>
//                               <span className="ms-3">Documentation</span>
//                           </a>
//                       </li>

//                       <li className="cursor-pointer">
//                           <a
//                               onClick={() => {
//                                   navigate("/colab");
//                               }}
//                               className="flex items-center p-2 text-mytext rounded-lg hover:bg-mytextbg hover:text-white group fill-mytext hover:fill-[#ffffff]"
//                           >
//                               <svg
//                                   className="w-[25px] h-[25px] "
//                                   viewBox="0 0 640 512"
//                                   xmlns="http://www.w3.org/2000/svg"
//                               >
//                                   <path d="M323.4 85.2l-96.8 78.4c-16.1 13-19.2 36.4-7 53.1c12.9 17.8 38 21.3 55.3 7.8l99.3-77.2c7-5.4 17-4.2 22.5 2.8s4.2 17-2.8 22.5l-20.9 16.2L550.2 352H592c26.5 0 48-21.5 48-48V176c0-26.5-21.5-48-48-48H516h-4-.7l-3.9-2.5L434.8 79c-15.3-9.8-33.2-15-51.4-15c-21.8 0-43 7.5-60 21.2zm22.8 124.4l-51.7 40.2C263 274.4 217.3 268 193.7 235.6c-22.2-30.5-16.6-73.1 12.7-96.8l83.2-67.3c-11.6-4.9-24.1-7.4-36.8-7.4C234 64 215.7 69.6 200 80l-72 48H48c-26.5 0-48 21.5-48 48V304c0 26.5 21.5 48 48 48H156.2l91.4 83.4c19.6 17.9 49.9 16.5 67.8-3.1c5.5-6.1 9.2-13.2 11.1-20.6l17 15.6c19.5 17.9 49.9 16.6 67.8-2.9c4.5-4.9 7.8-10.6 9.9-16.5c19.4 13 45.8 10.3 62.1-7.5c17.9-19.5 16.6-49.9-2.9-67.8l-134.2-123z"></path>
//                               </svg>
//                               <span className="ms-3">Collab</span>
//                           </a>
//                       </li>
//                       <li>
//                           <a
//                               href="https://www.linkedin.com/in/sahil-kumar-sinha-98011a24b/"
//                               className="flex items-center p-2 text-mytext rounded-lg hover:bg-mytextbg group hover:text-white fill-mytext hover:fill-[#ffffff]"
//                               target="_blank"
//                               rel="noopener noreferrer"
//                           >
//                               <svg
//                                   className="w-[25px] h-[25px] "
//                                   viewBox="0 0 640 512"
//                                   xmlns="http://www.w3.org/2000/svg"
//                               >
//                                   <path d="M64 96c0-35.3 28.7-64 64-64H512c35.3 0 64 28.7 64 64V352H512V96H128V352H64V96zM0 403.2C0 392.6 8.6 384 19.2 384H620.8c10.6 0 19.2 8.6 19.2 19.2c0 42.4-34.4 76.8-76.8 76.8H76.8C34.4 480 0 445.6 0 403.2zM281 209l-31 31 31 31c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-48-48c-9.4-9.4-9.4-24.6 0-33.9l48-48c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9zM393 175l48 48c9.4 9.4 9.4 24.6 0 33.9l-48 48c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l31-31-31-31c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z"></path>
//                               </svg>
//                               <span className="flex-1 ms-3 whitespace-nowrap">
//                                   Developed by
//                               </span>
//                           </a>
//                       </li>
//                       <li>
//                           <a
//                               onClick={() => {
//                                   localStorage.removeItem("token");
//                                   localStorage.removeItem("userinfo");
//                                   localStorage.removeItem("allusers");
//                                   localStorage.removeItem("starttime");
//                                   localStorage.removeItem("weektasks");
//                                   navigate("/signin");
//                               }}
//                               className="flex items-center p-2 text-mytext rounded-lg hover:bg-mytextbg group hover:text-white fill-mytext hover:fill-[#ffffff]"
//                           >
//                               <svg
//                                   xmlns="http://www.w3.org/2000/svg"
//                                   viewBox="0 0 24 24"
//                                   fill="currentColor"
//                                   class="size-6"
//                               >
//                                   <path
//                                       fill-rule="evenodd"
//                                       d="M12 2.25a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM6.166 5.106a.75.75 0 0 1 0 1.06 8.25 8.25 0 1 0 11.668 0 .75.75 0 1 1 1.06-1.06c3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788a.75.75 0 0 1 1.06 0Z"
//                                       clip-rule="evenodd"
//                                   />
//                               </svg>

//                               <span className="ms-3">Log out</span>
//                           </a>
//                       </li>
//                   </ul>
//               </div>
//           </div>
//       </aside>
//   );
// }

