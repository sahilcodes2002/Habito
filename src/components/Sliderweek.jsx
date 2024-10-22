import React, { useEffect, useState, useRef } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import addDays from "date-fns/addDays";
import { enUS } from "date-fns/locale";
import { startOfWeek as startWeek } from "date-fns";
import axios from "axios";
import { info } from "../store/atoms/userinfo";
import { useRecoilValue, useRecoilState } from "recoil";
import toast from "react-hot-toast";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export function HorizontalSliderweek({ isSidebarOpen, addevent }) {
  const allInfo = useRecoilValue(info);
  
  const containerRef = useRef(null);
  const [tasks, setTasks] = useState([]);
  //const [isLoading, setisLoading] = useState(false);
  useEffect(() => {
    async function getData() {
      try {
        
        const response = await axios.get(
          `https://honoprisma.codessahil.workers.dev/getweekevents`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        
        if (response.data.success) {
          const fetchedTasks = response.data.res;
          const newTasks = {}; // Temporary object to hold new tasks
  
          for (const r of fetchedTasks) {
            const date = r.date.split("T")[0]; // Extract date
            const task = r.task;
            const completed = r.completed;
            const id = r.id;
  
            // Accumulate tasks for each date
            if (!newTasks[date]) {
              newTasks[date] = [];
            }
            newTasks[date].push({ task, completed, id });
          }
  
          // Set tasks state after loop is done
          setTasks(newTasks);
          scrollRightless();
        } else {
          console.error("Error fetching events", response.data);
        }
        
      } catch (error) {
        console.error("Error fetching todos", error);
      }
    }
  
    getData();
  }, []);
  
  // useEffect(() => {
  //   // Store tasks in localStorage whenever tasks state changes
  //   if (tasks && Object.keys(tasks).length > 0) {
  //     localStorage.setItem("weektasks", JSON.stringify(tasks));
  //   }
  // }, [tasks]);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const lightColors = [
    "bg-gray-100",
    "bg-red-100",
    "bg-yellow-100",
    "bg-green-100",
    "bg-blue-100",
    "bg-indigo-100",
    "bg-purple-100",
    "bg-pink-100",
    "bg-teal-100",
    "bg-rose-100",
    "bg-orange-100",
    "bg-lime-100",
    "bg-cyan-100",
    "bg-emerald-100",
    "bg-violet-100",
  ];

  const [currentWeek, setCurrentWeek] = useState(
    startWeek(new Date(), { weekStartsOn: 1 })
  );
  

  const getFormattedDate = (date) => format(date, "yyyy-MM-dd");

  const addTask = async (day, date) => {
    const task = prompt(
      `Add a task for ${day}, ${format(date, "MMMM d, yyyy")}:`
    );
    const formattedDate = getFormattedDate(date);
    const datetosend = formattedDate + "T00:00:00Z";
    if (task) {
      var toastId=null;
      try {
        toastId = toast.loading("Adding a new week task");
        const response = await axios.post(
          "https://honoprisma.codessahil.workers.dev/addweekevent",
          {
            task: task,
            completed: false,
            date: datetosend,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Task added successfully", { id: toastId });
        const r = await response.data.res;
        const d = await r.date.split("T")[0];

        const t = await r.task;
        const id = await r.id;
        //console.log(t);
        //console.log(d);
        setTasks((prevTasks) => ({
          ...prevTasks,
          [d]: [...(prevTasks[d] || []), { task: t, completed: false,id }],
        }));
      } catch (e) {
        toast.error("Failed to add task", { id: toastId });
        console.log(e);
      }
    }
  };

  const toggleTaskCompletion = (date, taskIndex) => {
    setTasks((prevTasks) => {
      const updatedTasksForDate = prevTasks[date].map((task, index) =>
        index === taskIndex ? { ...task, completed: !task.completed } : task
      );
      return {
        ...prevTasks,
        [date]: updatedTasksForDate,
      };
    });
  };

  const handleSelectSlot = (slotInfo) => {
    setCurrentWeek(startWeek(slotInfo.start, { weekStartsOn: 1 }));
  };

  // Scroll to the left
  const scrollLeft = () => {
    containerRef.current.scrollBy({
      left: -200, // Adjust scroll distance
      behavior: "smooth",
    });
  };

  // Scroll to the right
  const scrollRight = () => {
    containerRef.current.scrollBy({
      left: 200, // Adjust scroll distance
      behavior: "smooth",
    });
  };
  const scrollRightless = () => {
    if(containerRef.current){
      containerRef.current.scrollBy({
        left: 40, 
        behavior: "smooth",
      });
    }
    
  };


  const LoadingIndicator = () => (
    <div className="relative inset-0 flex items-center justify-center bg-mybg bg-opacity-50 z-50">
      <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
    </div>
  );
  // if(isLoading){
  //   return <div><LoadingIndicator></LoadingIndicator></div>
  // }
  return (
    <div>
      <div className="container mx-auto pt-4 px-2">
        <h1 className="text-2xl font-bold text-center">Weekly Task Planner</h1>
      </div>
      <div className={`relative w-full flex items-center `}>
        {/* Left Button */}
        <button
          className={`absolute ${
            isSidebarOpen ? "left-0" : "left-0"
          } left-0  z-10 p-2 bg-gray-300 rounded-full hover:bg-gray-400`}
          onClick={scrollLeft}
        >
          &lt;
        </button>

        {/* Scrollable Container */}
        <div
          ref={containerRef}
          className="overflow-x-auto flex space-x-4 p-10 scrollbar-hide" // Use Tailwind classes
          style={{ scrollBehavior: "smooth" }} // Smooth scroll behavior
        >
          {daysOfWeek.map((day, index) => {
            const date = addDays(currentWeek, index);
            const formattedDate = getFormattedDate(date);

            return (
              <div
                key={day}
                className={`week-calendar min-w-[290px] smd:min-w-[300px] smd:overflow-y-auto bg-white border p-2 rounded-lg shadow-lg ${
                  addevent ? "md:h-[500px] h-72" : "smd:h-72 h-72"
                }`}
              >
                <h2 className="font-bold text-center mb-4 text-sm">
                  {day[0] + day[1] + day[2]} -{" "}
                  {format(date, "MMMM d").split(" ")[0][0]}
                  {format(date, "MMMM d").split(" ")[0][1]}
                  {format(date, "MMMM d").split(" ")[0][2]}/
                  {format(date, "MMMM d").split(" ")[1]}
                </h2>

                <ul className="task-list mb-4 text-center ">
                  {tasks[formattedDate] && tasks[formattedDate].length > 0 ? (
                    tasks[formattedDate].map((task, idx) => {
                      const randomNumber = Math.floor(Math.random() * 15);
                      //console.log(tasks);
                      return (
                        <li
                          key={idx}
                          className={`flex items-center overflow-x-auto justify-between text-sm mb-2 ${lightColors[randomNumber]} text-gray-700 border border-black px-1 rounded-md`}
                        >
                          <div className="flex">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() =>
                                toggleTaskCompletion(formattedDate, idx)
                              }
                              className="mr-2"
                            />
                            
                            <button onClick={async()=>{
                              const toastId = toast.loading("Deleting week task");
                              
                              const response = await axios.post(
                                "https://honoprisma.codessahil.workers.dev/deleteweektask",
                                {
                                  id:task.id
                                },
                                {
                                  headers: {
                                    Authorization: `Bearer ${localStorage.getItem(
                                      "token"
                                    )}`,
                                    "Content-Type": "application/json",
                                  },
                                }
                              );
                              toast.success("Task deleted!", { id: toastId });
                              setTasks((prevTasks) => {
                                const updatedTasks = prevTasks[formattedDate].filter((x) => x.id !== task.id);
                          
                                return {
                                  ...prevTasks,
                                  [formattedDate]: updatedTasks, // Update tasks for the specific date
                                };
                              });
                              setrender(x=>!x);
                            }}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="0.5"
                                stroke="currentColor"
                                class="size-4"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                />
                              </svg>
                            </button>
                          </div>
                          {task.completed ? <s>{task.task}</s> : task.task}
                        </li>
                      );
                    })
                  ) : (
                    <li className="text-gray-400">No tasks</li>
                  )}
                </ul>

                <button
                  onClick={() => addTask(day, date)}
                  className="w-full bg-blue-500 text-white py-1 px-4 rounded-lg hover:bg-blue-600 transition-all duration-300"
                >
                  +
                </button>
              </div>
            );
          })}
        </div>

        {/* Right Button */}
        <button
          className="absolute right-0 z-10 p-2 bg-gray-300 rounded-full hover:bg-gray-400"
          onClick={scrollRight}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
