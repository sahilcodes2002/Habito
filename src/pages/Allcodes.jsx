import { useEffect, useRef, useState } from "react";
import axios from "axios";
import codesave1 from "../images/codesave1.png";
import Design from "../images/Design.jpg";
import codesave from "../images/codesave.png";
import toast from "react-hot-toast";

import { Topbarlogin } from "../components/Topbarlogin";
import { useNavigate } from "react-router-dom";
import MyCalendar from "../components/Calender";
import WeekCalendar from "../components/Weekcalender";
import { HorizontalSliderweek } from "../components/Sliderweek";
import { info } from "../store/atoms/userinfo";
import { useRecoilState, useRecoilValue } from "recoil";
import { Button1, Button2 } from "../components/DashboardButtons";
import { format } from "date-fns";

export function Allcodes() {
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
        toastId = toast.loading("Please wait, fetching your codes from server...");
        setLoading(true);
        axios
          .post(
            `https://honoprisma.codessahil.workers.dev/getallcode`,
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
            setLoading(false);
            setprojectinfo(response.data.res);
            //setcalenderevents(response.data.data.calenderevents);
            //console.log(response.data.data.projects);
            //console.log(projectinfo);
          });
      } catch (error) {
        toast.error("Failed to get codes from server", { id: toastId });
        console.error("Error fetching dashboard data", error);
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
            className="z-0 bg-mybg min-h-screen"
            onClick={() => {
              setSidebarOpen(false);
            }}
          >
            <div>
              <div className="z-0">
                <div>
                  <Xyz
                    projectinfo={projectinfo}
                    isSidebarOpen={isSidebarOpen}
                    isLoading={loading}
                    setprojectinfo={setprojectinfo}
                  ></Xyz>
                  <div className="fixed bottom-8 right-4 w-12 h-12 flex items-center justify-center bg-white shadow-md rounded-full">
                    <button
                      onClick={() => {
                        navigate("/code");
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 32 32"
                        className="w-8 h-8 text-blue-500"
                      >
                        <g data-name="21-Add">
                          <path d="M25 0H7a7 7 0 0 0-7 7v18a7 7 0 0 0 7 7h18a7 7 0 0 0 7-7V7a7 7 0 0 0-7-7zm5 25a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5h18a5 5 0 0 1 5 5z" />
                          <path d="M17 6h-2v9H6v2h9v9h2v-9h9v-2h-9V6z" />
                        </g>
                      </svg>
                    </button>
                  </div>
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
function Xyz({ isSidebarOpen, isLoading, projectinfo, setprojectinfo }) {
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
        <div className="w-full flex justify-center">
          <div className="flex">
            <div className="flex flex-col justify-center mr-1.5">
              <img
                className="h-10 w-10"
                src={codesave1}
                alt="Design"
              />
            </div>
            <div className="text-2xl font-sans font-bold flex flex-col justify-center">
              {" "}
              Your code Snippets{" "}
            </div>
            <div className="flex flex-col justify-center ml-3">
              <img
                className="h-8 w-8"
                src={codesave}
                alt="Design"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        className={`${
          isSidebarOpen ? "pl-48 rounded-md " : "mb-0 rounded-md "
        } rounded-md `}
      >
        <Usercodes
          isLoading={isLoading}
          projectinfo={projectinfo}
          isSidebarOpen={isSidebarOpen}
          setprojectinfo={setprojectinfo}
        ></Usercodes>
      </div>
      <div className="">
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
          {/* <div style={{ width: `${width - 20}px` }}>
            <div className=" mt-10 mr-2">
              <HorizontalSlider
                isLoading={isLoading}
                projectinfo={projectinfo}
                isSidebarOpen={isSidebarOpen}
              ></HorizontalSlider>
            </div>
          </div> */}
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
              <div className="hidden md:block px-2 mt-8 smd:mt-0">
                {/* <WeekCalendar addevent={addevent}></WeekCalendar> */}
                {/* <div className="flex justify-center">
                  <div
                    style={{
                      width: `${isSidebarOpen ? width - 650 : width - 450}px`,
                    }}
                  >
                    
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Usercodes({ isSidebarOpen, isLoading, projectinfo, setprojectinfo }) {
  const [projects, setProjects] = useState(projectinfo);
  const [loading, setLoading] = useState(isLoading);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dummy, setDummy] = useState(projectinfo);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  //console.log("code render");
  //   useEffect(() => {
  //     if(!localStorage.getItem('token')){
  //       navigate('/')
  //     }
  //     const fetchProjects = async () => {
  //       setLoading(true);
  //       try {
  //         const response = await axios.get(
  //           "https://honoprisma.codessahil.workers.dev/getuserprojects",
  //           {
  //             headers: {
  //               Authorization: `Bearer ${localStorage.getItem("token")}`,
  //               "Content-Type": "application/json",
  //             },
  //           }
  //         );
  //         setProjects(response.data.res);
  //       } catch (error) {
  //         console.error("Error fetching projects", error);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     fetchProjects();
  //   }, []);

  const handleDelete = async (id) => {
    //console.log(id);
    setDummy(projects);
    try {
      setProjects(projects.filter((project) => project.id !== id));
      const res = await axios.post(
        `https://honoprisma.codessahil.workers.dev/deletecode`,
        {
          id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      //console.log(res);
      //setProjects(projects.filter((project) => project.id !== id));
      //setprojectinfo(projects);
    } catch (error) {
      setProjects(dummy)
      console.error("Error deleting project", error);
    }
  };

  const handleupdate = async (id, important) => {
    //console.log(id);
    try {
      const res = await axios.post(
        `https://honoprisma.codessahil.workers.dev/updatecodeimportant`,
        {
          id: id,
          important,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      //console.log(res);
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === id ? res.data.res : project
        )
      );
      //console.log(projects);
    } catch (error) {
      console.error("Error deleting project", error);
    }
  };
  useEffect(() => {
    setprojectinfo(projects);
  }, [projects]);

  const groupedProjects = {};
  projects.forEach((project) => {
    const date = format(new Date(project.created_at), "MM/dd/yyyy");
    if (!groupedProjects[date]) {
      groupedProjects[date] = [];
    }
    groupedProjects[date].push(project);
  });

  const sortedDates = Object.keys(groupedProjects).sort(
    (a, b) => new Date(b) - new Date(a)
  );
  sortedDates.forEach((date) => {
    groupedProjects[date].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  });

  const filteredGroupedProjects = {};
  Object.keys(groupedProjects).forEach((date) => {
    const filteredProjects = groupedProjects[date].filter(
      (project) =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filteredProjects.length > 0) {
      if (!selectedDate || date === selectedDate) {
        filteredGroupedProjects[date] = filteredProjects;
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

  return (
    <div className="p-4 mt-0 smd:mt-1 ">
      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="Search projects"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <div className="inline-block text-left ml-2" ref={dropdownRef}>
          <button
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            Select Date
          </button>
          {dropdownOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-32 max-h-60 overflow-y-auto rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
              <button
                onClick={() => {
                  setSelectedDate("");
                  setDropdownOpen(false);
                }}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                All Dates
              </button>
              {sortedDates.map((date) => (
                <button
                  key={date}
                  onClick={() => {
                    setSelectedDate(date);
                    setDropdownOpen(false);
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  {date}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {Object.keys(filteredGroupedProjects).length === 0 ? (
        <div>No projects found</div>
      ) : (
        sortedDates.map((date) => (
          <div key={date} className="mb-4">
            {filteredGroupedProjects[date] && (
              <h2 className="text-gray-600 text-xl font-semibold mb-2">
                {date}
              </h2>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredGroupedProjects[date] &&
                filteredGroupedProjects[date].map((project) => (
                  <div
                    key={project.id}
                    className="bg-white p-4 rounded shadow-md flex justify-between items-center cursor-pointer"
                    onClick={() => navigate(`/showcode/${project.id}`)}
                  >
                    <div>
                      <h3 className="font-semibold text-gray-600">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {project.description}
                      </p>
                    </div>
                    <div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent the click event from triggering the navigation
                          handleupdate(project.id, !project.important);
                        }}
                        className={` text-yellow-500 hover:text-yellow-700 pt-1 mr-1`}
                      >
                        <svg
                          className={``}
                          xmlns="http://www.w3.org/2000/svg"
                          fill={`${project.important ? "goldenrod" : "white"}`}
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="size-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent the click event from triggering the navigation
                          handleDelete(project.id);
                        }}
                        className="text-red-500 hover:text-red-700"
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
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))
      )}

      {loading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="text-white">Loading...</div>
        </div>
      )}
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
  const [projectwork, setprojectwork] = useState(projectinfo);
  console.log("hori rerender");
  console.log(projectwork);

  // Scroll to the left
  useEffect(() => {
    if (projectinfo) {
      const x = projectinfo;
      console.log(x);

      for (const a of x) {
        if (a.important) {
          projectworkArray.push({
            id: a.id,
            title: a.title,
            description: a.description,
            important: a.important,
          });
        }
      }
      setprojectwork(projectworkArray);
      //console.log(work);
    }
  }, [projectinfo]);

  //   if (projectinfo) {
  //     const x = projectinfo;
  //     console.log(x);

  //     for (const a of x) {
  //       if (a.important) {
  //         projectworkArray.push({
  //           id: a.id,
  //           title: a.title,
  //           description: a.description,
  //           important: a.important,
  //         });
  //       }
  //     }

  //     setprojectwork(projectworkArray);

  //console.log(work);
  //}
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
        className="overflow-x-auto flex space-x-4 p-5 scrollbar-hide" // Use Tailwind classes
        style={{ scrollBehavior: "smooth" }} // Smooth scroll behavior
      >
        {/* {work.map((x) => {
          console.log(work);
          return <Container1 x={x}></Container1>;
        })} */}

        {projectwork.length == 0 && <Containerdef></Containerdef>}

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

function Containerdef() {
  return (
    <div className="z-0 bg-blue-200 rounded-lg ml-10">
      <div className="px-5 md:px-7 ml-1 py-2 flex justify-center h-full space-x-5 bg-white rounded-md">
        <div className="flex flex-col justify-center">
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
        <div className="bg-slate-200 w-1 min-h-max rounded-lg"> </div>
        <div className="flex flex-col justify-center px-2">
          <div className="text-sm text-gray-600 ">important code</div>
          <div className="text-sm text-gray-600  text-center">appear here</div>
        </div>
      </div>
    </div>
  );
}

function Container({ x }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        navigate(`/showcode/${x.id}`);
      }}
      className="z-0 bg-blue-200 rounded-lg cursor-pointer"
    >
      <div className="px-5 md:px-7 ml-1 py-2 flex justify-center h-full space-x-5 bg-white rounded-md">
        <div className="flex flex-col justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
            />
          </svg>
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
                      src={Design}
                      alt="Design"
                    />
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
