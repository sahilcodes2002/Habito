import { useEffect, useRef, useState } from "react";
import axios from "axios";
import mailicon from "../images/mailicon.png";
import projecticon from "../images/projecticon.png";
import design from "../images/Design.jpg";
import bgImage from "../images/_c9e1d576-4556-448f-a229-1d3d32add7c3.jpeg";
import bgImage1 from "../images/_c1caaac5-0761-4310-a7bc-6daee2124cad.jpeg";
import { Topbarlogin } from "../components/Topbarlogin";
import { useNavigate } from "react-router-dom";
import MyCalendar from "../components/Calender";
import WeekCalendar from "../components/Weekcalender";
import { HorizontalSliderweek } from "../components/Sliderweek";
import { info } from "../store/atoms/userinfo";
import { useRecoilState, useRecoilValue } from "recoil";
import { Button1, Button2, Button3 } from "../components/DashboardButtons";
import toast from "react-hot-toast";

export function Dashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [inf, setInfo] = useRecoilState(info);
  const [projectinfo, setprojectinfo] = useState([]);
  const [calenderevents, setcalenderevents] = useState([]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }

    async function reget() {
      var toastId = null;
      try {
        toastId = toast.loading("Please wait, fetching data from server...");
        setLoading(true);
        axios
          .post(
            `https://honoprisma.codessahil.workers.dev/getalldashboard`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) => {
            toast.dismiss(toastId);
            //const data = await response?.data?.data;
            //setprojectinfo(data.projects);
            //console.log(projectinfo);
            //console.log(data.projects);
            setLoading(false);
            setprojectinfo(response.data.data.projects);
            setcalenderevents(response.data.data.calenderevents);
            //console.log(response.data.data.projects);
            //console.log(projectinfo);
          });
      } catch (error) {
        console.error("Error fetching dashboard data", error);
        toast.error("Failed to get data from server", { id: toastId });
        setLoading(false);
      }
    }

    reget();
  }, []);

  useEffect(() => {
    console.log("Updated projectinfo:", projectinfo);
  }, [projectinfo]);

  const LoadingIndicator = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
      <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
    </div>
  );
  if (loading) {
    return (
      <div>
        
        <LoadingIndicator></LoadingIndicator>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
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

        <div></div>
      </div>
      {/* <div className="text-black">
        hi
      </div> */}
      <div className="">
        <div className="z-50">
          <Sidebar isSidebarOpen={isSidebarOpen}></Sidebar>

          <div
            className="z-0 w-screen bg-mybg"
            onClick={() => {
              setSidebarOpen(false);
            }}
          >
            <div>
              <div className="z-0 flex justify-center">
                <div>
                  <Xyz
                    projectinfo={projectinfo}
                    isSidebarOpen={isSidebarOpen}
                    isLoading={loading}
                    calenderevents={calenderevents}
                    setcalenderevents={setcalenderevents}
                  ></Xyz>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

//boxess
function Xyz({
  isSidebarOpen,
  isLoading,
  projectinfo,
  calenderevents,
  setcalenderevents,
}) {
  const navigate = useNavigate();
  const [width, setWidth] = useState(window.innerWidth);
  const [addevent, setaddevent] = useState(false);
  //const allInfo = useRecoilValue(info);
  //console.log(allInfo)

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      console.log("New screen width:", window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div className=" mt-5  z-0 h-auto overflow-hidden">
      <div className="">
        <div className="">{/* <Quote></Quote> */}</div>
        {/* <div className="grid grid-cols-2 gap-4 md:grid-cols-2 smd:px-6 p-2 pb-4">
          <button
            onClick={() => {
              if (!isSidebarOpen) {
                navigate("/projectoptions");
              }
            }}
          >
            <Box></Box>
          </button>
          <button
            onClick={() => {
              if (!isSidebarOpen) {
                navigate("/dashboardnotes");
              }
            }}
          >
            <Boxsec />
          </button>
        </div > */}

        <div className="flex justify-center">
          <div style={{ width: `${width - 20}px` }}>
            <div className=" mt-10 mr-2">
              <HorizontalSlider
                isLoading={isLoading}
                projectinfo={projectinfo}
                isSidebarOpen={isSidebarOpen}
              ></HorizontalSlider>
            </div>
          </div>
        </div>
        <div>
          <div>
            <div
              className={`${
                isSidebarOpen
                  ? "pl-48 rounded-md md:flex mb-0 md:justify-start"
                  : "mb-0 rounded-md md:flex md:justify-start"
              } rounded-md `}
            >
              <div>
                <MyCalendar
                  addevent={addevent}
                  setaddevent={setaddevent}
                  calenderevents={calenderevents}
                  setcalenderevents={setcalenderevents}
                ></MyCalendar>
              </div>

              <div className="hidden md:block px-2 mt-8 smd:mt-0">
                {/* <WeekCalendar addevent={addevent}></WeekCalendar> */}
                <div className="flex justify-center">
                  <div
                    style={{
                      width: `${isSidebarOpen ? width - 650 : width - 450}px`,
                    }}
                  >
                    <div className="">
                      <HorizontalSliderweek
                        isSidebarOpen={isSidebarOpen}
                        addevent={addevent}
                      ></HorizontalSliderweek>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:hidden flex justify-center">
              <div style={{ width: `${width - 20}px` }}>
                <div className=" mt-10">
                  <HorizontalSliderweek
                    isSidebarOpen={isSidebarOpen}
                    addevent={addevent}
                  ></HorizontalSliderweek>
                </div>
              </div>
            </div>
            <div className="mx-5 smd:flex smd:justify-evenly">
              <div className="mb-2 smd:mb-0">
                <Button1></Button1>
              </div>
              <div>
                <Button2></Button2>
              </div>
              <div>
                <Button3></Button3>
              </div>
            </div>

            <div className="overflow-hidden mt-12">
              <div className="text-center font-bold text-3xl"> Stopwatch </div>
              <div className="overflow-hidden">
                <Box_big></Box_big>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Box_big() {
  const [savingwindow, setsavingwindow] = useState(false);
  const [h, seth] = useState("00");
  const [watch, setwatch] = useState(false);
  const [stopwatch, setstop] = useState(false);
  const [startedwatch, setstartedwatch] = useState(false);
  const [m, setm] = useState("00");
  const [s, sets] = useState("00");
  const [loading, setLoading] = useState(false);
  const [name, setname] = useState("untitled");
  const intervalRef = useRef(null);
  const [timeinnums, settimeinnums] = useState({});
  const starttime = useRef(null);
  const savingtime = useRef(null);
  const mainstarttime = useRef(null);
  const elapsedtime = useRef(0);
  const navigate = useNavigate();

  function gettime() {
    const currentDate = new Date();
    const timeDifference =
      currentDate - starttime.current + elapsedtime.current;

    const hours = Math.floor(timeDifference / 3600000);
    const minutes = Math.floor((timeDifference % 3600000) / 60000);
    const seconds = Math.floor((timeDifference % 60000) / 1000);

    settimeinnums({
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    });

    seth(hours.toString().padStart(2, "0"));
    setm(minutes.toString().padStart(2, "0"));
    sets(seconds.toString().padStart(2, "0"));
  }

  function start() {
    if (!intervalRef.current) {
      if (!localStorage.getItem("starttime")) {
        starttime.current = new Date();
        localStorage.setItem("starttime", starttime.current.toISOString());
      } else {
        starttime.current = new Date(localStorage.getItem("starttime")); // Parse back into Date object
      }
      // Set start time

      intervalRef.current = setInterval(() => {
        gettime();
      }, 1000);
    }
  }

  function stop() {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    elapsedtime.current += new Date() - starttime.current; // Accumulate elapsed time
  }

  function reset() {
    clearInterval(intervalRef.current);
    localStorage.removeItem("starttime");
    intervalRef.current = null;
    elapsedtime.current = 0;
    sets("00");
    setm("00");
    seth("00");
  }

  function resume() {
    if (!intervalRef.current) {
      if (!mainstarttime.current) {
        mainstarttime.current = starttime.current;
      }
      starttime.current = new Date(); // Reset start time without resetting elapsed time
      intervalRef.current = setInterval(() => {
        gettime();
      }, 1000);
    }
  }

  function saveTime() {
    setsavingwindow(true);

    //console.log(timeinnums);
    var sttime = starttime.current;
    if (mainstarttime.current) {
      sttime = mainstarttime.current;
    }
    //const sttime  = mainstarttime.current;
    const hst = sttime.getHours();
    const mst = sttime.getMinutes();
    const sst = sttime.getSeconds();

    const savetime = new Date();
    savingtime.current = savetime;
    const hend = savetime.getHours();
    const mend = savetime.getMinutes();
    const send = savetime.getSeconds();

    //console.log(hst + " " + mst + " " + sst);
    //console.log(hend + " " + mend + " " + send);
    //setSavedTimes([...savedTimes, `${h}:${m}:${s}`]); // Save the current time
  }

  useEffect(() => {
    if (localStorage.getItem("starttime")) {
      start();
      setstartedwatch(true);
      setwatch(true);
      setstop(false);
    }
    return () => clearInterval(intervalRef.current); // Cleanup interval on component unmount
  }, []);

  const LoadingIndicator = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
      <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="bg-white text-white rounded smd:mr-3">
      {loading && (
        <div>
          <LoadingIndicator></LoadingIndicator>
        </div>
      )}
      {savingwindow && (
        <div className="w-[500-px] bg-mybg">
          <div className="flex justify-between">
            <div className="pr-2 pt-1">
              <button
                className="text-black"
                onClick={() => {
                  setsavingwindow(false);
                }}
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
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="pr-2 pt-2">
              <button
                className="text-black"
                onClick={() => {
                  navigate("/workhistory");
                }}
              >
                <svg
                  className="w-[20px] h-[20px] fill-[#f7f7f7]"
                  viewBox="0 0 512 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM64 256c0-17.7 14.3-32 32-32H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H96c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"></path>
                </svg>
              </button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="flex flex-col max-h-max justify-center text-black">
              <div>
                <label
                  for="first_name"
                  className="block px-24 mb-2 text-center text-lg "
                >
                  Give a title
                </label>
                <input
                  onChange={(e) => {
                    setname(e.target.value);
                  }}
                  type="text"
                  id="first_name"
                  className=" border text-sm rounded-lg   block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                  placeholder="write work title"
                  required
                />
              </div>

              <div className="text-center mt-4 p-2 rounded border border-slate-300">
                <div className="text-center mb-2 font-serif text-xl">
                  Duration :
                </div>
                <div className="text-slate-500">
                  Hours : {timeinnums.hours} hours
                </div>
                <div className="text-slate-500">
                  Minutes : {timeinnums.minutes} minutes
                </div>
                <div className="text-slate-500">
                  Seconds : {timeinnums.seconds} seconds
                </div>
              </div>
            </div>

            <div></div>
          </div>
          <div className="w-full flex justify-center mt-3">
            <button
              onClick={async () => {
                setLoading(true);
                var toastId = null;
                try {
                  toastId = toast.loading("Saving record...");
                  var sttime = starttime.current;
                  const senddata = {
                    title: name,
                    hoursWorked: timeinnums.hours,
                    minsWorked: timeinnums.minutes,
                    startHour: sttime.getHours(),
                    startMinute: sttime.getMinutes(),
                    endHour: savingtime.current.getHours(),
                    endMinute: savingtime.current.getMinutes(),
                  };
                  //console.log(senddata);
                  const response = await axios.post(
                    "https://honoprisma.codessahil.workers.dev/createworkhistory",
                    {
                      title: name,
                      hoursWorked: timeinnums.hours,
                      minsWorked: timeinnums.minutes,
                      startHour: sttime.getHours(),
                      startMinute: sttime.getMinutes(),
                      endHour: savingtime.current.getHours(),
                      endMinute: savingtime.current.getMinutes(),
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
                  toast.success("Record saved successfully", { id: toastId });
                  setLoading(false);
                  setsavingwindow(false);
                  setwatch(false);
                  setstop(false);
                  setstartedwatch(false);
                  reset();
                } catch (err) {
                  toast.error("Failed to save", { id: toastId });
                  //console.log(err);
                  setLoading(false);
                }
              }}
              className="bg-purple-500 mb-2 text-white py-1 px-7 rounded"
            >
              Save
            </button>
          </div>
        </div>
      )}
      {!savingwindow && (
        <div className="bg-mybg">
          <div className="pl-2 pt-2 bg-mybg">
            <button
              onClick={() => {
                navigate("/workhistory");
              }}
            >
              <svg
                className="w-[25px] h-[25px] fill-[#5d5c5c]"
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM64 256c0-17.7 14.3-32 32-32H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H96c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"></path>
              </svg>
            </button>
          </div>
          {
            <div className=" flex items-center justify-center h-72 mb-1 rounded bg-mybg">
              <div>
                <div className="pb-4 text-black text-6xl">
                  {h} : {m} : {s}
                </div>

                <div className="text-white mt-6 pt-5 flex justify-evenly">
                  <button
                    className={`bg-green-500 text-white py-2 px-4 rounded ${
                      watch || stopwatch ? "hidden" : ""
                    }`}
                    onClick={() => {
                      start();
                      if (!startedwatch) {
                        setstartedwatch(true);
                      }
                      setwatch(true);
                    }}
                  >
                    Start
                  </button>
                  <button
                    className={`bg-red-500 text-white py-2 px-4 rounded ${
                      !watch ? "hidden" : ""
                    }`}
                    onClick={() => {
                      stop();
                      setstop(true);
                      setwatch(false);
                    }}
                  >
                    Stop
                  </button>
                  <button
                    className={` bg-orange-500 text-white py-2 px-4 rounded ${
                      !startedwatch ? "hidden" : ""
                    }`}
                    onClick={() => {
                      reset();
                      setstartedwatch(false);
                      setwatch(false);
                      setstop(false);
                    }}
                  >
                    Reset
                  </button>
                  <button
                    className={`bg-blue-500 text-white py-2 px-4 rounded ${
                      (stopwatch || !watch) && startedwatch ? "" : "hidden"
                    }`}
                    onClick={() => {
                      resume();
                      setwatch(true);
                      setstop(false);
                    }}
                  >
                    Resume
                  </button>
                  <button
                    className={`bg-purple-500 text-white py-2 px-4 rounded ${
                      startedwatch ? "" : "hidden"
                    }`}
                    onClick={() => {
                      setstop(true);
                      setwatch(false);
                      saveTime();
                      stop();
                    }}
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      )}
      {/* <div className="mt-4">
            <h2 className="text-black text-xl">Saved Times:</h2>
            <ul className="text-black">
              {savedTimes.map((time, index) => (
                <li key={index}>{time}</li>
              ))}
            </ul>
          </div> */}
    </div>
  );
}

const HorizontalSlider = ({ isSidebarOpen, isLoading, projectinfo }) => {
  // Create a reference to the scrollable container
  const containerRef = useRef(null);
  const allInfo = useRecoilValue(info);
  const workArray = [];
  const projectworkArray = [];
  const [work, setwork] = useState([]);
  const [projectwork, setprojectwork] = useState([]);

  // Scroll to the left
  useEffect(() => {
    if (projectinfo) {
      const x = projectinfo;
      console.log(x);

      for (const a of x) {
        const dd = a.workmails;
        projectworkArray.push({
          id: a.id,
          title: a.title,
          link: a.link,
          archive: a.archive,
          done: a.done,
        });
        for (const d of dd) {
          workArray.push({
            id: d.id,
            work_id: d.work_id,
            title: d.title,
            description: d.description,
            email: d.email,
            project_id: d.project_id,
          });
        }
        const ds = a.subworkmails;
        for (const d of ds) {
          workArray.push({
            id: d.id,
            work_id: d.subwork_id,
            title: d.title,
            description: d.description,
            email: d.email,
            project_id: d.project_id,
          });
        }
      }
      setwork(workArray);
      setprojectwork(projectworkArray);
      //console.log(work);
    }
  }, []);
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className={`relative w-full flex items-center ${
        isSidebarOpen ? "pl-48" : ""
      } mt-4`}
    >
      {/* Left Button */}
      <button
        className={`absolute ${
          isSidebarOpen ? "left-48" : "left-0"
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
      {work.length==0 && projectwork.length==0 && <Container0></Container0>}
        {work.map((x) => {
          //console.log(work);
          return <Container1 x={x}></Container1>;
        })}
        <div className="h-full flex flex-col justify-center">
          <div className="bg-slate-200 w-1 h-16 rounded-lg mr-3 ml-3"> </div>
        </div>
        {projectwork.map((x) => {
          console.log(work);
          return <Container x={x}></Container>;
        })}
        {/* <Container />
        <Container />
        <Container />
        <Container />
        <Container />
        <Container />
        <Container /> */}
      </div>

      {/* Right Button */}
      <button
        className="absolute right-0 z-10 p-2 bg-gray-300 rounded-full hover:bg-gray-400"
        onClick={scrollRight}
      >
        &gt;
      </button>
    </div>
  );
};


function Container0() {
  const navigate = useNavigate();
  return (
    <div onClick={()=>{
      //navigate(`/project/${x.project_id}`)
    }} className="z-0 bg-blue-600 rounded-lg cursor-pointer">
      <div className="px-8 ml-1 py-2 h-full flex justify-center space-x-10 bg-white rounded-md">
        <div className="flex flex-col text-green-700 justify-center space-x-4">
          {/* <svg
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
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg> */}
          <div className="cursor-pointer">
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
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
          </div>
        </div>
        <div className="bg-slate-200 w-1 min-h-max rounded-lg"> </div>
        <div className="flex flex-col justify-center px-2">
          <div className="text-sm text-gray-600 ">Nothing to</div>
          <div className="text-sm text-gray-600  text-center">
            Show here
          </div>
        </div>
      </div>
    </div>
  );
}


function Container1({ x }) {
  const navigate = useNavigate();
  return (
    <div onClick={()=>{
      navigate(`/project/${x.project_id}`)
    }} className="z-0 bg-blue-600 rounded-lg cursor-pointer">
      <div className="px-8 ml-1 py-2 h-full flex justify-center space-x-10 bg-white rounded-md">
        <div className="flex flex-col text-green-700 justify-center space-x-4">
          {/* <svg
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
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg> */}
          <div className="cursor-pointer">
            <img
              className="h-8 w-8 mr-6"
              src={mailicon}
              alt="team up"
            />
          </div>
        </div>
        <div className="bg-slate-200 w-1 min-h-max rounded-lg"> </div>
        <div className="flex flex-col justify-center px-2">
          <div className="text-sm text-gray-600 ">{x.title.split(" ")[0]}</div>
          <div className="text-sm text-gray-600  text-center">
            {x.title.split(" ")[1] || "."}
          </div>
        </div>
      </div>
    </div>
  );
}

function Container({ x }) {
  const navigate  = useNavigate();
  return (
    <div onClick={()=>{
      navigate(`/project/${x.id}`)
    }} className="z-0 bg-blue-200 rounded-lg cursor-pointer">
      <div className="px-8 ml-1 py-2 flex justify-center h-full space-x-10 bg-white rounded-md">
        <div className="flex flex-col justify-center space-x-4">
          {/* <svg
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
              d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
            />
          </svg> */}
          <div className="cursor-pointer">
            <img
              className="h-8 w-8 mr-6"
              src={projecticon}
              alt="team up"
            />
          </div>
        </div>
        <div className="bg-slate-200 w-1 min-h-max rounded-lg"> </div>
        <div className="flex flex-col justify-center px-2">
          <div className="text-sm text-gray-600 ">{x.title.split(" ")[0]}</div>
          <div className="text-sm text-gray-600  text-center">
            {x.title.split(" ")[1] || "."}
          </div>
        </div>
      </div>
    </div>
  );
}

function Box() {
  const [mouse, setmouse] = useState(false);
  return (
    <div
      onMouseEnter={() => {
        setmouse(true);
      }}
      onMouseLeave={() => {
        setmouse(false);
      }}
      className={`${
        mouse
          ? "z-10 border-2  border-black flex items-center justify-center h-52 rounded bg-cover bg-center hover:border-4 hover:border-blue-600"
          : " z-10 border-2  border-black flex items-center justify-center h-52 rounded bg-cover bg-center hover:border-4 hover:border-blue-600"
      } ${mouse ? "" : "grayscale-[50%]"}`}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div
        className={`${
          mouse
            ? "bg-blue-300  rounded-md  px-1 font-medium text-lg"
            : "bg-blue-300 smd:bg-blue-400 rounded-md  px-1 font-medium text-lg"
        }`}
      >
        <div className="text-sm">Advanced Task Planner</div>
      </div>
    </div>
  );
}

function Boxsec() {
  const [mouse, setmouse] = useState(false);
  return (
    <div
      onMouseEnter={() => {
        setmouse(true);
      }}
      onMouseLeave={() => {
        setmouse(false);
      }}
      className={`border-2  border-black flex items-center justify-center h-52 rounded bg-cover bg-center hover:border-4 hover:border-blue-600 ${
        mouse ? "" : "grayscale-[50%]"
      }`}
      style={{ backgroundImage: `url(${bgImage1})` }}
    >
      <div
        className={`${
          mouse
            ? "bg-blue-300 rounded-md  px-1 font-medium text-lg"
            : "bg-blue-300 smd:bg-blue-400 rounded-sm  px-1 font-medium text-lg"
        }`}
      >
        <div className="text-sm">Important Stuff</div>
      </div>
    </div>
  );
}

function Box2() {
  return (
    <div className="flex items-center justify-center h-52 rounded bg-gray-50 dark:bg-gray-800">
      <div>Advanced Task Planner</div>
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
                    <img
                      className="h-6 w-6"
                      src={design}
                      alt="Design"
                    />
                  </span>
                  <span className="ms-3 text-3xl text-mytext">abito</span>
                </div>
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

                {/* <svg
                  className="flex-shrink-0 w-5 h-5  transition duration-75  group-hover:text-white "
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
                </svg> */}
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
                href="https://github.com/sahilcodes2002/Habito"
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

// function Box_big() {
//   const [h, seth] = useState('00');
//   const [m,setm] = useState('00');
//   const [s,sets] = useState('00');
//   const intervalRef = useRef(null);

//   function gettime(){
//     const currentDate = new Date();
//     const hours = currentDate.getHours();
//     const minutes = currentDate.getMinutes();
//     const seconds = currentDate.getSeconds();

//     setm(minutes.toString().padStart(2, '0'));
//     seth(hours.toString().padStart(2, '0'));
//     sets(seconds.toString().padStart(2, '0'));

//   }

//   function callit(){
//     if (!intervalRef.current) {
//       intervalRef.current = setInterval(() => {
//         gettime();
//       }, 1000);
//     }
//   }
//   function stopit(){
//     clearInterval(intervalRef.current);
//     intervalRef.current = null;
//     sets('00');
//     setm('00');
//     seth('00');
//   }

//   useEffect(()=>{

//     return () => clearInterval(intervalRef.current);
//   },[s]);
//   return (
//     <div>
//       <div className="flex justify-between">
//         <button onClick={()=>{
//           callit();
//         }}>
//           Start
//         </button>
//         <button onClick={()=>{
//           stopit();
//         }}>
//           end
//         </button>
//       </div>
//       <div className="flex items-center justify-center h-72 mb-1 rounded bg-gray-50 dark:bg-gray-800">

//       <div className="text-white text-6xl">
//         {h} : {m} : {s}
//       </div>
//     </div>
//     </div>
//   );
// }

function Quote() {
  const [loading, setLoading] = useState(false);
  const [quote, setquote] = useState("");

  useEffect(() => {
    function getRandomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const x = getRandomNumber(1, 20);

    async function getdata({ x }) {
      setLoading(true);
      try {
        const response = await axios.post(
          `https://honoprisma.codessahil.workers.dev/getquote/${x}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        //console.log(response.data.res.quote)
        setquote(response.data.res.quote);
      } catch (error) {
        console.error("Error fetching todos", error);
      } finally {
        setLoading(false);
      }
    }

    getdata({ x });
  }, []);

  if (loading) {
    return (
      <div className="w-full lg:ml-14 mx-2 pb-1">
        <div className="flex w-screen flex-col justify-center max-w-5xl">
          <div className="flex w-screen justify-center max-w-5xl pr-6 smd:pr-0">
            <Sceleton></Sceleton>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full m-2 pb-1 smd:mr-0">
      <div className="flex flex-col justify-center">
        <div className="flex justify-center italic text-sm  smd:text-xl text-center">
          {quote}
        </div>
      </div>
    </div>
  );
}

function Sceleton() {
  return (
    <div className="flex w-full justify-center">
      <div
        role="status"
        className="pt-3 py-4 pr-12 smd:pr-12 md:pr-48 lg:pr-2 w-full animate-pulse"
      >
        <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-400 w-full mb-2 lg:mb-0"></div>
        <div className="lg:hidden h-4 bg-gray-200 rounded-full dark:bg-gray-400 w-full "></div>

        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

// function Cardbutton(){

//   return <div class="container">
//   <div class="content">
//     <a href="https://unsplash.com/photos/HkTMcmlMOUQ" target="_blank">
//       <div class="content-overlay"></div>
//       <img class="content-image" src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto">
//       </img>
//       <div class="content-details">
//         <h3 class="content-title">Advanced Task Planner<i><svg version="1.1" id="ios7_x5F_arrows_1_" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 128 128" style="enable-background:new 0 0 128 128" xml:space="preserve"><style>.st0{display:none}.st1{display:inline}</style><g id="_x31_7_1_"><path d="M42.8 37.3 37.4 41 64 64 37.4 88l5.3 2.7L72 64 42.8 37.3zM64.1 0C28.8 0 .2 28.7.2 64s28.6 64 63.9 64S128 99.3 128 64c-.1-35.3-28.7-64-63.9-64zm0 122.7C31.7 122.7 5.5 96.4 5.5 64c0-32.4 26.2-58.7 58.6-58.7 32.3 0 58.6 26.3 58.6 58.7-.1 32.4-26.3 58.7-58.6 58.7zm0-81.7 26.6 23-26.6 24 5.3 2.7L98.7 64 69.4 37.3 64.1 41z" id="icon_22_"/></g></svg></i></h3>
//       </div>
//     </a>
//   </div>
// </div>
// }
