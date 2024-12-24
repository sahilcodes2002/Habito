import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { info } from "../store/atoms/userinfo";
import { allusers } from "../store/atoms/contacts";
import toast from "react-hot-toast";
//import { set } from "date-fns";
var projectdata1 = null;
var projectdate = null;
export function ProjectDetails() {
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadinginvite, setLoadinginvite] = useState(false);
  const { id } = useParams();
  const [AllUsers, setAllUsers] = useRecoilState(allusers);
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const navigate = useNavigate();
  const [invitedusers, setinvitedusers] = useState([]);
  const [allinfo, setinfo] = useRecoilState(info);
  const [coreprojectdata, setcoredata] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [refresh1, setRefresh1] = useState(false);
  const [showinfo, setShowinfo] = useState(false);
  const [showinfo1, setShowinfo1] = useState(false);
  const [mailworks, setmailworks] = useState([]);
  const [mailsubworks, setmailsubworks] = useState([]);
  const [tasks, setTasks] = useState(null);
  
  const invitedUsersRef = useRef(invitedusers);

  // Update ref whenever invitedusers state changes
  useEffect(() => {
    invitedUsersRef.current = invitedusers;
  }, [invitedusers]);

  useEffect(()=>{
    console.log(projectData);
  },[projectData])

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }

    var intervalId = null;

    async function start() {
      setLoading(true);
      await fetchProjectData();
      setLoading(false);
      
      try {
        const response1 = await axios.post(
          `https://honoprisma.codessahil.workers.dev/getmailwork`,
          {
            id: parseInt(id),
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        const response2 = await axios.post(
          `https://honoprisma.codessahil.workers.dev/getmailsubwork`,
          {
            id: parseInt(id),
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        setmailworks(response1.data.res);
        console.log(response1.data);
        console.log(response2.data);
        setmailsubworks(response2.data.res);
      } catch (err) {
        console.log(err);
      }
      await fetchAllUsers();
      fetchInvitedUsers().then(() => {
        intervalId = setInterval(async () => {
          console.log(invitedUsersRef.current.length); 
          if (projectdata1 != null && invitedUsersRef.current.length > 0) {
            const dd = await checktoupdate();
            if (dd === true) {
              fetchProjectData();
              fetchAllUsers();
              fetchInvitedUsers();
            }
          }
        }, 5000);
        
      });
      
      
    }

    start();

    return () => clearInterval(intervalId);
  }, [refresh]);

  // useEffect(()=>{
  //   console.log("refreshing");
  // },[projectData])

  // useEffect(() => {
  //   if (!localStorage.getItem("token")) {
  //     navigate("/");
  //   }

  //   var intervalId=null;

  //   async function start(){
  //       setLoading(true);
  //       await fetchAllUsers();

  //       //console.log(invitedusers);

  //       await fetchProjectData();
  //       fetchInvitedUsers().then(()=>{
  //         intervalId = setInterval(async () => {
  //           console.log(invitedusers.length);
  //           if (projectdata1 != null && invitedusers.length>0) {
  //             //console.log(projectdata1);
  //             const dd = await checktoupdate();
  //             //console.log(dd);
  //             if (dd == true) {
  //               fetchProjectData();
  //               fetchAllUsers();
  //               fetchInvitedUsers();
  //             }
  //           }
  //         }, 5000);
  //       })

  //   }

  //   start();
  //   return () => clearInterval(intervalId);
  // }, [refresh]);

  async function checktoupdate() {
    if (projectdata1 || projectdata1 != null) {
      const simplifiedWorks = projectdata1.works.map((work) => ({
        id: work.id,
        assignto: work.assignto,
        completed: work.completed,
      }));

      const simplifiedSubworks = projectdata1.subworks.map((subwork) => ({
        id: subwork.id,
        assignto: subwork.assignto,
        completed: subwork.completed,
      }));
      try {
        const response = await axios.post(
          `https://honoprisma.codessahil.workers.dev/checkforupdate`,
          {
            simplifiedWorks,
            simplifiedSubworks,
            id: projectdata1.id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Get the data from the response
        const data = await response.data.res;
        return data;
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setLoading(false);
      }
    } else {
      return false;
    }
  }

  const fetchProjectData = async () => {
    try {
      // Start loading
      // projectdata1 = projectData;
      setProjectData(null);
      // Make the request to the backend
      const response = await axios.get(
        `https://honoprisma.codessahil.workers.dev/getproject/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.data.res;
      projectdata1 = data;
      if (projectdate == null) {
        const isoDate = data.created_at;
        const date = new Date(isoDate);
        projectdate = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }

      //console.log(data);

      const transformedTasks = await transformTasks(data.works, data.subworks);
      setTasks(transformedTasks);
      setProjectData({
        title: data.title,
        tasks: transformedTasks,
        user_id: data.user_id,
        id: data.id,
        folder_id: data.folder_id,
        description: data.description,
        link: data.link,
        archive: data.archive,
        done: data.done,
        created_at: data.created_at,
      });
      //setTasks(transformedTasks);
    } catch (error) {
      console.error("Error fetching project data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvitedUsers = async () => {
    try {
      const res = await axios.post(
        `https://honoprisma.codessahil.workers.dev/invitedusers`,
        {
          project_id: parseInt(id),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      setinvitedusers(res.data.res);
    } catch (err) {
      alert(err);
      //console.log("Error fetching invited user data:", err);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(
        "https://honoprisma.codessahil.workers.dev/getallusers",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      setAllUsers(response.data.res);
    } catch (error) {
      console.error("Error fetching all users:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleCloseModal1 = () => {
    setShowModal1(false);
  };

  const handleUserClick = async (userId) => {
    setLoadinginvite(true);
    const res = await axios.post(
      `https://honoprisma.codessahil.workers.dev/inviteUserToProject`,
      {
        project_id: parseInt(id),
        user_id: userId,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    // setShowModal(false);
    setLoadinginvite(false);
   
    toast.success("Invitation sent");
    setinvitedusers((prevInvitedUsers) => [...prevInvitedUsers, res.data.res]);
    setAllUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    setShowModal(false);
  };
  const handleUserClick1 = async (id) => {
    setLoadinginvite(true);
    const res = await axios.post(
      `https://honoprisma.codessahil.workers.dev/removeinvite`,
      {
        id: parseInt(id),
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    // setShowModal(false);
    fetchInvitedUsers();
    toast.success("User removed");
    fetchAllUsers();
    setShowModal1(false);
    setLoadinginvite(false);
  };

  const transformTasks = async (works, subworks) => {
    //console.log(works);
    return works.map((work) => ({
      id: work.id,
      title: work.work,
      description: work.description,
      completed: work.completed,
      assignto: work.assignto,
      subtasks: subworks
        .filter((subwork) => subwork.work_id === work.id)
        .map((subwork) => ({
          id: subwork.id,
          title: subwork.subwork,
          description: subwork.subdescription,
          assignto: subwork.assignto,
          completed: subwork.completed,
          work_id: subwork.work_id
        })),
    }));
  };

  const LoadingIndicator = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
      <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
    </div>
  );
  if (loading)
    return (
      <div>
        <LoadingIndicator></LoadingIndicator>
      </div>
    );

  if (projectData == null)
    return (
      <div>
        <div className="flex justify-center">
          <div className="flex flex-col justify-center h-screen">
            Getting team changes
          </div>
        </div>
      </div>
    );

  return (
    <div className="bg-mybg min-h-screen">
      <div className="flex justify-between">
        <div
          className="p-2 mt-3 ml-1 cursor-pointer"
          onClick={() => {
            if (projectData.user_id === allinfo.id) {
              navigate("/userprojects");
            } else {
              navigate("/assignedprojects");
            }
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
              d="M12 9.75 14.25 12m0 0 2.25 2.25M14.25 12l2.25-2.25M14.25 12 12 14.25m-2.58 4.92-6.374-6.375a1.125 1.125 0 0 1 0-1.59L9.42 4.83c.21-.211.497-.33.795-.33H19.5a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25h-9.284c-.298 0-.585-.119-.795-.33Z"
            />
          </svg>
        </div>
        <div className="p-2">
          <button
            className={`mr-2 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-3 border border-gray-400 rounded shadow ${
              allinfo.id != projectData.user_id ? "hidden" : "bg-blue-400"
            }`}
            onClick={() => {
              //console.log(projectData)
              //console.log(allinfo);
              console.log(invitedusers.length);
              setShowModal1((x) => !x);
            }}
          >
            People
          </button>
          <button
            className={`bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-3 border border-gray-400 rounded shadow ${
              allinfo.id != projectData.user_id ? "hidden" : "bg-blue-400"
            }`}
            onClick={() => {
              //console.log(projectData)
              //console.log(allinfo);
              setShowModal((x) => !x);
            }}
          >
            Invite
          </button>
          <button
            className={`mr-2 ml-2 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-3 border border-gray-400 rounded shadow `}
            onClick={() => {
              //console.log(projectData)
              //console.log(typeof(projectData.id));
              navigate(`/projectmessages/${projectData.id}`);
            }}
          >
            Messages
          </button>
        </div>
      </div>
      <div className="mt-3 flex justify-center">
        <div className="font-serif text-2xl smd:text-4xl">
          {projectData.title} :{" "}
          <span className="text-lg smd:text-2xl font-light pb-1 text-gray-600">
            {projectdate}
          </span>
        </div>
      </div>
      <div>
        {/* <ProjectTitlebar setShowModal={setShowModal} projectname ={projectData.title} ></ProjectTitlebar> */}
        {projectData && (
          <ProjectTaskManager
            setShowinfo={setShowinfo}
            setShowinfo1={setShowinfo1}
            showinfo1={showinfo1}
            showinfo={showinfo}
            setRefresh={setRefresh}
            setRefresh1={setRefresh1}
            id={id}
            projectTitle={projectData.title}
            tasks={tasks}
            setTasks={setTasks}
            projectData={projectData}
            setProjectData={setProjectData}
            allinfo={allinfo}
            invitedusers={invitedusers}
            projectdata1={projectdata1}
            mailworks={mailworks}
            setmailworks={setmailworks}
            mailsubworks={mailsubworks}
            setmailsubworks={setmailsubworks}
          />
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-md max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Invite user..</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-600 hover:text-gray-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="grid gap-2">
              {loadinginvite && <div className="flex justify-center">
                <div className="flex flex-col justify-center">
                Loading...
                </div>
                </div>}
              {!loadinginvite && AllUsers.filter(
                (user) =>
                  !invitedusers.some((invite) => invite.user_id === user.id)
              ).map((user) => (
                <div
                  key={user.id}
                  className="bg-gray-100 p-2 rounded-md cursor-pointer hover:bg-gray-200"
                  onClick={() => handleUserClick(user.id)}
                >
                  <div className="text-lg font-semibold">{user.name}</div>
                  <div className="text-gray-600">{user.username}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {showModal1 && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-md max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Invited users..</h3>
              <button
                onClick={handleCloseModal1}
                className="text-gray-600 hover:text-gray-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="grid gap-2">
            {loadinginvite && <div className="flex justify-center">
                <div className="flex flex-col justify-center">
                Loading...
                </div>
                </div>}
              {!loadinginvite&& invitedusers.map((user) => (
                <div
                  key={user.id}
                  className={`${
                    user.accepted ? "bg-green-300" : "bg-gray-100"
                  } p-2 rounded-md cursor-pointer hover:opacity-70`}
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="text-lg font-semibold">
                        {user.user.name}
                      </div>
                      <div className="text-gray-600">{user.user.username}</div>
                    </div>
                    <div
                      className="flex flex-col justify-center"
                      onClick={() => handleUserClick1(user.id)}
                    >
                      <div>
                        <svg
                          className="w-6 h-6"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 32 32"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g data-name="22-Remove">
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M25 0H7a7 7 0 0 0-7 7v18a7 7 0 0 0 7 7h18a7 7 0 0 0 7-7V7a7 7 0 0 0-7-7zm5 25a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5h18a5 5 0 0 1 5 5z"
                            />
                            <path d="M6 15h20v2H6z" />
                          </g>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectTaskManager({
  id,
  setShowinfo,
  setShowinfo1,
  showinfo,
  showinfo1,
  setRefresh,
  setRefresh1,
  projectTitle,
  tasks,
  setTasks,
  projectData,
  setProjectData,
  allinfo,
  invitedusers,
  projectdata1,
  mailworks,
  setmailworks,
  setmailsubworks,
  mailsubworks,
}) {
  console.log(projectData);
  console.log(tasks);
  //const [tasks, setTasks] = useState(initialTasks);
  const [loading, setLoading] = useState(false);
  const [refresh2, setRefresh2] = useState(false);
  const [showinfoofid, setShowinfoofid] = useState(null);
  const [isediting, setIsediting] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Toggle the completed state of a task or subtask
  // const handleCheckboxChange = async (taskId, parentId) => {
  //   const updateTaskCompleted = (taskList, taskId) => {
  //     if (parentId === null) {
  //       for (const it of projectdata1.works) {
  //         if (it.id == taskId) {
  //           it.completed = !it.completed;
  //         }
  //       }
  //     } else {
  //       for (const it of projectdata1.subworks) {
  //         if (it.id == taskId) {
  //           it.completed = !it.completed;
  //         }
  //       }
  //     }
  //     return taskList.map((task) => {
  //       if (task.id === taskId) {
  //         return { ...task, completed: !task.completed };
  //       }
  //       if (task.subtasks && task.subtasks.length > 0) {
  //         return {
  //           ...task,
  //           subtasks: updateTaskCompleted(task.subtasks, taskId),
  //         };
  //       }
  //       return task;
  //     });
  //   };

  //   const findTask = (taskList, id) => {
  //     for (const task of taskList) {
  //       if (task.id === id) return task;
  //       if (task.subtasks && task.subtasks.length > 0) {
  //         const foundTask = findTask(task.subtasks, id);
  //         if (foundTask) return foundTask;
  //       }
  //     }
  //     return null;
  //   };

  //   const taskToUpdate = findTask(tasks, taskId);

  //   if (taskToUpdate) {
  //     // Update the local state first
  //     const updatedTasks = updateTaskCompleted(tasks, taskId);
  //     setTasks(updatedTasks);

  //     try {
  //       // Check if the task is a `work` or `subwork`
  //       const isSubwork = parentId != null; // Example logic: adjust as needed

  //       // console.log(`Task ID: ${taskId}, Is Subwork: ${isSubwork}`); // Debugging

  //       if (isSubwork) {
  //         // It's a subwork
  //         try {
  //           await axios.post(
  //             "https://honoprisma.codessahil.workers.dev/updateSubWorkCompletion",
  //             {
  //               subworkId: taskId,
  //               completed: !taskToUpdate.completed,
  //             },
  //             {
  //               headers: {
  //                 Authorization: `Bearer ${localStorage.getItem("token")}`,
  //                 "Content-Type": "application/json",
  //               },
  //             }
  //           );
  //         } catch (err) {
  //           alert(err);
  //         }
  //       } else {
  //         // It's a work
  //         await axios.post(
  //           "https://honoprisma.codessahil.workers.dev/updateWorkCompletion",
  //           {
  //             workId: taskId,
  //             completed: !taskToUpdate.completed,
  //           },
  //           {
  //             headers: {
  //               Authorization: `Bearer ${localStorage.getItem("token")}`,
  //               "Content-Type": "application/json",
  //             },
  //           }
  //         );
  //       }
  //     } catch (error) {
  //       console.error("Error updating task completion:", error);
  //       // Optionally revert the local state if needed
  //       setTasks(tasks);
  //     }
  //   }
  // };

  // useEffect(()=>{
  //   console.log("refreshing");
  //   setRefresh2((x)=>!x);
  // },[projectData])
  const handleCheckboxChange = async (taskId, parentId) => {
    const updateTaskCompleted = (taskList, taskId, parentId) => {
      return taskList.map((task) => {
        if (parentId === null && task.id === taskId) {
          // It's a `work` and matches the taskId
          return { ...task, completed: !task.completed };
        }
        if (task.subtasks && task.subtasks.length > 0) {
          // Check subtasks only if `parentId` matches the current task's id
          if (task.id === parentId) {
            return {
              ...task,
              subtasks: task.subtasks.map((subtask) =>
                subtask.id === taskId
                  ? { ...subtask, completed: !subtask.completed }
                  : subtask
              ),
            };
          } else {
            // Continue looking for the right subtask
            return {
              ...task,
              subtasks: updateTaskCompleted(task.subtasks, taskId, parentId),
            };
          }
        }
        return task;
      });
    };

    const findTask = (taskList, id, parentId) => {
      for (const task of taskList) {
        if (parentId === null && task.id === id) return task; // It's a work
        if (task.subtasks && task.subtasks.length > 0) {
          if (task.id === parentId) {
            // Found the parent, now find the subtask
            return task.subtasks.find((subtask) => subtask.id === id);
          }
          const foundTask = findTask(task.subtasks, id, parentId);
          if (foundTask) return foundTask;
        }
      }
      return null;
    };

    const taskToUpdate = findTask(tasks, taskId, parentId);

    if (taskToUpdate) {
      // Update the local state first
      const updatedTasks = updateTaskCompleted(tasks, taskId, parentId);
      setTasks(updatedTasks);
      //const oldtask = tasks;
      //tasks = updatedTasks;

      try {
        const isSubwork = parentId != null;

        if (isSubwork) {
          // Update subwork
          await axios.post(
            "https://honoprisma.codessahil.workers.dev/updateSubWorkCompletion",
            {
              subworkId: taskId,
              completed: !taskToUpdate.completed,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            }
          );
        } else {
          // Update work
          await axios.post(
            "https://honoprisma.codessahil.workers.dev/updateWorkCompletion",
            {
              workId: taskId,
              completed: !taskToUpdate.completed,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            }
          );
        }
      } catch (error) {
        console.error("Error updating task completion:", error);
        // Optionally revert the local state if needed
        setTasks(tasks);
        //tasks = oldtask;
      }
    }
  };

  async function updatetaskdetails(taskId, parentId) {
    // Helper function to update task details in the local state
    const newTitle = title;
    const newDescription = description;
    const updateTaskDetails = (taskList, taskId, parentId) => {
      return taskList.map((task) => {
        if (parentId === null && task.id === taskId) {
          // Update the work (top-level task)
          return { ...task, title: newTitle, description: newDescription };
        }
        if (task.subtasks && task.subtasks.length > 0) {
          // Check subtasks only if `parentId` matches the current task's id
          if (task.id === parentId) {
            return {
              ...task,
              subtasks: task.subtasks.map((subtask) =>
                subtask.id === taskId
                  ? { ...subtask, title: newTitle, description: newDescription }
                  : subtask
              ),
            };
          } else {
            // Continue looking for the right subtask
            return {
              ...task,
              subtasks: updateTaskDetails(task.subtasks, taskId, parentId),
            };
          }
        }
        return task;
      });
    };

    // Helper function to find the task
    const findTask = (taskList, id, parentId) => {
      for (const task of taskList) {
        if (parentId === null && task.id === id) return task; // It's a work (top-level task)
        if (task.subtasks && task.subtasks.length > 0) {
          if (task.id === parentId) {
            // Found the parent, now find the subtask
            return task.subtasks.find((subtask) => subtask.id === id);
          }
          const foundTask = findTask(task.subtasks, id, parentId);
          if (foundTask) return foundTask;
        }
      }
      return null;
    };

    const taskToUpdate = findTask(tasks, taskId, parentId);

    if (taskToUpdate) {
      // Update the local state first
      const updatedTasks = updateTaskDetails(tasks, taskId, parentId);
      setTasks(updatedTasks);

      try {
        const isSubwork = parentId != null;

        if (isSubwork) {
          // Update subwork title and description
          await axios.post(
            "https://honoprisma.codessahil.workers.dev/updateSubWork",
            {
              subworkId: taskId,
              title: title,
              description: description,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            }
          );
          setTitle("");
          setDescription("");
        } else {
          // Update work (top-level task) title and description
          await axios.post(
            "https://honoprisma.codessahil.workers.dev/updateWork",
            {
              workId: taskId,
              title: title,
              description: description,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            }
          );
          setTitle("");
          setDescription("");
        }
      } catch (error) {
        console.error("Error updating task details:", error);
        // Optionally revert the local state if needed
        setTasks(tasks);
      }
    }
  }

  async function deletefrommail(taskid, parentId) {
    const isSubwork = parentId != null;
    if (isSubwork) {
      try {
        await axios.post(
          "https://honoprisma.codessahil.workers.dev/deletemailsubwork",
          {
            id: taskid,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        setmailsubworks((prevSubworks) =>
          prevSubworks.filter((subwork) => subwork.subwork_id !== taskid)
        );
        alert(" removed from mail reminder");
      } catch (err) {
        alert("error removing from mail reminder");
      }
    } else {
      try {
        await axios.post(
          "https://honoprisma.codessahil.workers.dev/deletemailwork",
          {
            id: taskid,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        setmailworks((prevWorks) =>
          prevWorks.filter((work) => work.work_id !== taskid)
        );
        alert(" removed from mail reminder");
      } catch (err) {
        alert("error removing from mail reminder");
      }
    }
  }

  async function addtomail(
    taskId,
    parentId,
    title,
    description,
    projectid,
    mail
  ) {
    const isSubwork = parentId != null;
    if (isSubwork) {
      try {
        const res = await axios.post(
          "https://honoprisma.codessahil.workers.dev/addmailsubwork",
          {
            subwork_id: taskId,
            title: title,
            description: description,
            email: mail,
            project_id: parseInt(projectid),
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        setmailsubworks((prevSubworks) => [...prevSubworks, res.data.res]);
        alert(" added to mail reminder");
      } catch (err) {
        alert("error adding to mail reminder");
      }
    } else {
      try {
        const res = await axios.post(
          "https://honoprisma.codessahil.workers.dev/addmailwork",
          {
            work_id: taskId,
            title: title,
            description: description,
            email: mail,
            project_id: parseInt(projectid),
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        setmailworks((prevWorks) => [...prevWorks, res.data.res]);
        alert(" added to mail reminder");
      } catch (err) {
        alert("error adding to mail reminder");
      }
    }
  }

  // Render tasks and subtasks
  async function handlesubtaskdelete(id, work_id) {
    try {
      //setLoading(true);
      await axios.post(
        `https://honoprisma.codessahil.workers.dev/deletesubwork`,
        {
          id: parseInt(id),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      //setLoading(false);
      //const [newprojectdata, setnew] = useState(null)
      // console.log("Before setProjectData");
      // const prevProjectData = projectData;
      // var yy = {
      //   ...prevProjectData,
      //   tasks:prevProjectData.tasks.map((task) => {
      //     if (task.id === work_id) {
      //       // Update the task's subtasks by filtering out the subtask with the given id
      //       const updatedSubtasks = task.subtasks.filter((subtask) => subtask.id !== id);
      //       return {
      //         ...task,
      //         subtasks: updatedSubtasks,
      //       };
      //     }
      //     return task; // Return the other tasks as-is
      //   })
      // }
      // //setProjectData(nu);
      // setProjectData(yy);
      // setProjectData((prevProjectData) => {
      //   const updatedTasks = prevProjectData.tasks.map((task) => {
      //     if (task.id === work_id) {
      //       // Update the task's subtasks by filtering out the subtask with the given id
      //       const updatedSubtasks = task.subtasks.filter((subtask) => subtask.id !== id);
      //       return {
      //         ...task,
      //         subtasks: updatedSubtasks,
      //       };
      //     }
      //     return task; // Return the other tasks as-is
      //   });
      
      //   return {
      //     ...prevProjectData,
      //     tasks: updatedTasks,
      //   };
      // });
      

      
      

    } catch (err) {
      alert(err);
    }
  }
  async function handletaskdelete(id) {
    const prevtask = tasks;
    try {
      setTasks(tasks.filter((task)=>task.id!==id));
      //setLoading(true);
      await axios.post(
        `https://honoprisma.codessahil.workers.dev/deletework`,
        {
          id: parseInt(id),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      //setLoading(false);
      //filter((subtask) => subtask.id !== id),
      setProjectData((prevProjectData) => ({
        ...prevProjectData,
        tasks: prevProjectData.tasks.filter((task) => task.id !== id)
      }));
      
    } catch (err) {
      setTasks(prevtask);
      alert(err);
    }
  }
  const renderTasks = (taskList, parentId = null) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isUsing, setIsusing] = useState("");
    const [istask, setisTask] = useState(parentId);
    //const [showinfo, setShowinfo] = useState(false);

    //console.log(taskList);
    return (
      <div
        className={`relative ${
          parentId ? "ml:6 smd:ml-8" : "ml-2 smd:ml-4"
        } pl-[6px] border-l border-gray-500`}
      >
        {showinfo && (
          <div className="fixed inset-0 flex items-center justify-center z-40 bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded shadow-lg relative">
              <button
                onClick={() => setShowinfo(false)}
                className="absolute top-2 right-2 text-gray-600"
              >
                ✕
              </button>
              <ShowingInfo
                setRefresh={setRefresh}
                id={id}
                showinfoofid={showinfoofid}
                setShowinfo={setShowinfo}
              />
            </div>
          </div>
        )}
        {showinfo1 && (
          <div className="fixed inset-0 flex items-center justify-center z-40 bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded shadow-lg relative">
              <button
                onClick={() => setShowinfo1(false)}
                className="absolute top-2 right-2 text-gray-600"
              >
                ✕
              </button>
              <ShowingInfo1
                setRefresh={setRefresh}
                id={id}
                setShowinfo1={setShowinfo1}
              />
            </div>
          </div>
        )}
        {taskList.map((task, index) => {
          var done = false;
          if (parentId) {
            for (const it of mailsubworks) {
              if (it.subwork_id === task.id) {
                done = true;
              }
            }
          } else {
            for (const it of mailworks) {
              if (it.work_id === task.id) {
                done = true;
              }
            }
          }
          return (
            <div key={task.id} className="relative mt-4">
              {/* Line connecting to the previous task */}
              {index >= 0 && (
                <div className="absolute -left-1 top-0 h-full border-l border-gray-500"></div>
              )}
              {/* Task Box */}

              <div className="flex">
                <div className="flex flex-col justify-center">
                  <button
                    className={`${
                      allinfo.id == projectData.user_id ? "" : "hidden"
                    } `}
                    onClick={async () => {
                      if (parentId) {
                        console.log(task);
                        
                        await handlesubtaskdelete(task.id, task.work_id);
                        setRefresh((x) => !x);
                        //setRefresh1((x)=>!x);
                      } else {
                        await handletaskdelete(task.id);
                        //setRefresh((x) => !x);
                      }
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="3 0 24 24"
                      stroke-width="0.5"
                      stroke="currentColor"
                      class={` size-5 smd:size-6`}
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
                <div
                  className={`relative flex-1 pl-1 pr-2 border rounded shadow-sm ${
                    parentId ? "border-gray-400" : "border-gray-200"
                  } ${
                    task.completed == false ? "bg-blue-200" : "bg-green-200"
                  }`}
                >
                  <div className="flex items-center">
                    <div className="flex flex-col ">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => {
                          //console.log(projectData);
                          if (
                            projectData.user_id == parseInt(allinfo.id) ||
                            allinfo.id == task.assignto
                          ) {
                            handleCheckboxChange(task.id, parentId);
                          }
                        }}
                        className={`${
                          isediting === task.id ? "hidden" : ""
                        } form-checkbox h-5 w-5 text-blue-500`}
                      />
                      {isediting === task.id && (
                        <div
                          onClick={() => {
                            setIsediting(null);
                            setTitle("");
                            setDescription("");
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
                        </div>
                      )}
                      <div
                        onClick={() => {
                          if (isediting === task.id) {
                            updatetaskdetails(task.id, parentId);
                            setIsediting(null);

                            return;
                          }
                          setIsediting(task.id);
                          setTitle(task.title);
                          if (task.description) {
                            setDescription(task.description);
                          }
                        }}
                        className="mt-1 cursor cursor-pointer "
                      >
                        {(isediting != task.id && isediting===null && allinfo.id == projectData.user_id) && (
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
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                            />
                          </svg>
                        )}

                        {isediting === task.id && (
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
                              d="m4.5 12.75 6 6 9-13.5"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className="m-2 w-full">
                      <div
                        className={`${
                          task.completed == false ? "bg-white" : "bg-green-100"
                        } ml-1 p-1 border w-full flex-grow rounded-md`}
                      >
                        <input
                          onChange={(e) => {
                            setTitle(e.target.value);
                          }}
                          value={
                            isediting && isediting === task.id
                              ? title
                              : task.title
                          }
                          className="w-full"
                          disabled={isediting !== task.id}
                        ></input>
                        {/* {task.title} */}
                      </div>
                    </div>
                    <div>
                      <div
                        className={`${
                          allinfo.id != projectData.user_id &&
                          task.assignto == allinfo.id
                            ? ""
                            : "hidden"
                        } `}
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
                            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                          />
                        </svg>
                      </div>

                      <div>
                        <div
                          className={`px-[1px] pt-[2px] rounded-md   ${
                            allinfo.id != projectData.user_id ? "hidden" : ""
                          }`}
                        >
                          <div className="pb-1 inline-block text-left">
                            {/* Circular Icon */}
                            <div className=" flex h-full">
                              <div className="flex flex-col ">
                                <button
                                  className={`${parentId ? "hidden" : ""}`}
                                  onClick={() => {
                                    //console.log(task.id);
                                    setShowinfoofid(task.id);
                                    setShowinfo(true);
                                  }}
                                >
                                  <div>
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
                                        d="M12 4.5v15m7.5-7.5h-15"
                                      />
                                    </svg>
                                  </div>
                                </button>
                                <div className="flex w-full justify-center">
                                  <button
                                    onClick={() => {
                                      setIsOpen(!isOpen);
                                      setIsusing(task.id);
                                      setisTask(parentId);
                                    }}
                                    className="flex items-center justify-center w-5 h-6  bg-gray-300 rounded-full focus:outline-none"
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
                                        d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              <div
                                onClick={() => {
                                  var done = false;
                                  if (parentId) {
                                    for (const it of mailsubworks) {
                                      if (it.subwork_id === task.id) {
                                        done = true;
                                        deletefrommail(task.id, parentId);
                                      }
                                    }
                                  } else {
                                    for (const it of mailworks) {
                                      if (it.work_id === task.id) {
                                        done = true;
                                        deletefrommail(task.id, parentId);
                                      }
                                    }
                                  }
                                  if (!done) {
                                    addtomail(
                                      task.id,
                                      parentId,
                                      task.title,
                                      task.description,
                                      id,
                                      allinfo.username
                                    );
                                  }
                                }}
                                className={`cursor-pointer  ml-1 h-full flex flex-col justify-center my-auto ${
                                  done ? "text-black" : "text-black"
                                }`}
                              >
                                {/* <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill={`${done?"#90EE90":"none"}`}
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="size-5"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3"
                                />
                              </svg> */}
                                <svg
                                  className="mt-1"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 64 64"
                                  width="20"
                                  height="29"
                                  
                                >
                                  <g>
                                    <rect
                                      x="8"
                                      y="24"
                                      width="48"
                                      height="32"
                                      rx="4"
                                      ry="4"
                                      fill={`${done?"#009e00":"none"}`}
                                      stroke="currentColor"
                                      stroke-width="2"
                                    />
                                    <polyline
                                      points="8 24 32 44 56 24"
                                      fill="none"
                                      stroke="currentColor"
                                      stroke-width="2"
                                    />
                                  </g>

                                  <g transform="translate(20, -9) scale(0.8)">
                                    <path
                                      fill={`${done?"#009e00":"none"}`}
                                      stroke="currentColor"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      d="M22 36c1.333 0 2.667 1 4 3h-8c1.333-2 2.667-3 4-3zM22 4a9 9 0 0 1 9 9v7a13 13 0 0 0 5 10v1H8v-1a13 13 0 0 0 5-10V13a9 9 0 0 1 9-9z"
                                    />
                                  </g>
                                </svg>
                              </div>
                            </div>

                            {/* Dropdown Menu */}
                            {isOpen &&
                              isUsing == task.id &&
                              istask == parentId && (
                                <div className="absolute right-0 z-10 w-48 mt-2 origin-top-right bg-white border border-gray-300 rounded-md shadow-lg">
                                  <div className="py-1">
                                    <button
                                      onClick={async () => {
                                        //task id
                                        //parentid
                                        //x.user.id
                                        if (parentId == null) {
                                          try {
                                            setLoading(true);
                                            await axios.post(
                                              `https://honoprisma.codessahil.workers.dev/updatework`,
                                              {
                                                workid: task.id,
                                                userid: allinfo.id,
                                              },
                                              {
                                                headers: {
                                                  Authorization: `Bearer ${localStorage.getItem(
                                                    "token"
                                                  )}`,
                                                  "Content-Type":
                                                    "application/json",
                                                },
                                              }
                                            );
                                            task.assignto = allinfo.id;
                                            setIsOpen(false);
                                            setLoading(false);
                                          } catch (err) {
                                            alert(err);
                                          }
                                        } else {
                                          try {
                                            setLoading(true);
                                            const res = await axios.post(
                                              `https://honoprisma.codessahil.workers.dev/updatesubwork`,
                                              {
                                                workid: task.id,
                                                userid: allinfo.id,
                                              },
                                              {
                                                headers: {
                                                  Authorization: `Bearer ${localStorage.getItem(
                                                    "token"
                                                  )}`,
                                                  "Content-Type":
                                                    "application/json",
                                                },
                                              }
                                            );
                                            task.assignto = allinfo.id;
                                            setIsOpen(false);
                                            setLoading(false);
                                          } catch (err) {
                                            alert(err);
                                          }
                                        }
                                      }}
                                      // Adding a key prop is recommended when rendering lists
                                      className={`${
                                        task.assignto == allinfo.id
                                          ? "bg-green-300"
                                          : ""
                                      } block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100`}
                                    >
                                      Myself
                                    </button>
                                    {invitedusers
                                      .filter((x) => {
                                        //console.log(invitedusers[0].name);
                                        return x.accepted === true;
                                      })
                                      .map((x) => (
                                        <button
                                          onClick={async () => {
                                            //task id
                                            //parentid
                                            //x.user.id
                                            if (parentId == null) {
                                              try {
                                                setLoading(true);
                                                const res = await axios.post(
                                                  `https://honoprisma.codessahil.workers.dev/updatework`,
                                                  {
                                                    workid: task.id,
                                                    userid: x.user.id,
                                                  },
                                                  {
                                                    headers: {
                                                      Authorization: `Bearer ${localStorage.getItem(
                                                        "token"
                                                      )}`,
                                                      "Content-Type":
                                                        "application/json",
                                                    },
                                                  }
                                                );
                                                task.assignto = x.user.id;
                                                setIsOpen(false);
                                                setLoading(false);
                                              } catch (err) {
                                                alert(err);
                                              }
                                            } else {
                                              try {
                                                setLoading(true);
                                                const res = await axios.post(
                                                  `https://honoprisma.codessahil.workers.dev/updatesubwork`,
                                                  {
                                                    workid: task.id,
                                                    userid: x.user.id,
                                                  },
                                                  {
                                                    headers: {
                                                      Authorization: `Bearer ${localStorage.getItem(
                                                        "token"
                                                      )}`,
                                                      "Content-Type":
                                                        "application/json",
                                                    },
                                                  }
                                                );

                                                task.assignto = x.user.id;
                                                setIsOpen(false);
                                                setLoading(false);
                                              } catch (err) {
                                                alert(err);
                                              }
                                            }
                                          }}
                                          key={x.id} // Adding a key prop is recommended when rendering lists
                                          className={`${
                                            task.assignto == x.user.id
                                              ? "bg-green-300"
                                              : ""
                                          } block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100`}
                                        >
                                          {x.user.name}
                                        </button>
                                      ))}
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {(task.description || isediting === task.id) && (
                    <div className="pr-2 pt-1">
                      <textarea
                        onChange={(e) => {
                          setDescription(e.target.value);
                        }}
                        className={`${
                          task.completed == false ? "bg-while" : "bg-green-100"
                        } ml-2 p-1 border rounded w-full`}
                        placeholder="Task description"
                        value={
                          isediting && isediting === task.id
                            ? description
                            : task.description
                        }
                        readOnly={isediting !== task.id}
                      />
                    </div>
                  )}
                  {/* Render subtasks */}
                  {task.subtasks && task.subtasks.length > 0 && (
                    <div className="mt-2 pl-6 border-l border-gray-300">
                      {renderTasks(task.subtasks, task.id)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  const LoadingIndicator = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
      <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
    </div>
  );
  return (
    <div className="p-2 pl-1 smd:pl-2 pt-5">
      <h2 className="text-xl font-bold mb-4">{projectTitle}</h2>
      <div>{renderTasks(tasks)}</div>
      {loading  && <LoadingIndicator />}
      <div className={`flex justify-center ${projectData.user_id == parseInt(allinfo.id)?"flex justify-center":"hidden"}`}>
        <button
          onClick={() => {
            setShowinfo1(true);
          }}
          className="mt-4 mb-4"
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
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

function ShowingInfo({ setRefresh, showinfoofid, id, setShowinfo }) {
  const [title, setTitle] = useState("");
  const [description, setDiscription] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current.focus(); }, []);
  //console.log(showinfoofid);
  if (loading) {
    return (
      <div>
        {/* <LoadingIndicator></LoadingIndicator> */}
        <div className="flex justify-center bg-gray-50">
          <div className="flex flex-col justify-center"></div>
          Loading....
        </div>
      </div>
    );
  }
  return (
    <div>
      {!loading && (
        <div className=" text-slate-700 pb-2 smd:w-80 md:w-96">
          <label
            for="email"
            class="block mb-1 text-sm font-medium text-gray-900 "
          >
            subtask title
          </label>
          <input
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            type="email"
            ref={inputRef}
            id="email"
            className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 placeholder-gray-400 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="you title"
          />
          <label
            for="email"
            class="block mb-1 text-sm font-medium text-gray-900 "
          >
            subtask description
          </label>
          <textarea
            onChange={(e) => {
              setDiscription(e.target.value);
            }}
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 placeholder-gray-400 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="your discription"
          />
          <button
            onClick={async () => {
              setLoading(true);
              //setShowinfo(false);
              try {
                const res = await axios.post(
                  `https://honoprisma.codessahil.workers.dev/addsubwork`,
                  {
                    work_id: showinfoofid,
                    title: title,
                    description: description,
                    project_id: parseInt(id),
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                      "Content-Type": "application/json",
                    },
                  }
                );
                setLoading(false);
                setRefresh((x) => !x);
                setShowinfo(false);
              } catch (err) {
                setShowinfo(true);
                alert(err);
              }
            }}
            type="submit"
            class="mt-2 text-white focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}

function ShowingInfo1({ setRefresh, id, setShowinfo1 }) {
  const [title, setTitle] = useState("");
  const [description, setDiscription] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current.focus(); }, []);
  if (loading) {
    return (
      <div>
        {/* <LoadingIndicator></LoadingIndicator> */}
        <div className="flex justify-center bg-gray-50">
          <div className="flex flex-col justify-center"></div>
          Loading....
        </div>
      </div>
    );
  }
  return (
    <div>
      {!loading && (
        <div className=" text-slate-700 pb-2 smd:w-80 md:w-96">
          <label class="block mb-1 text-sm font-medium text-gray-900 ">
            title
          </label>
          <input
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            type="email"
            ref={inputRef}
            id="email"
            className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 placeholder-gray-400 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="you title"
          />
          <label
            for="email"
            class="block mb-1 text-sm font-medium text-gray-900 "
          >
            description
          </label>
          <textarea
            onChange={(e) => {
              setDiscription(e.target.value);
            }}
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 placeholder-gray-400 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="your discription"
          />
          <button
            onClick={async () => {
              setLoading(true);
              //setShowinfo(false);
              try {
                const res = await axios.post(
                  `https://honoprisma.codessahil.workers.dev/addwork`,
                  {
                    title: title,
                    description: description,
                    project_id: parseInt(id),
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                      "Content-Type": "application/json",
                    },
                  }
                );
                setLoading(false);
                setRefresh((x) => !x);
                setShowinfo1(false);
              } catch (err) {
                setShowinfo1(true);
                alert(err);
              }
            }}
            type="submit"
            class="mt-2 text-white focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}

const LoadingIndicator = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50 bg-transparent">
    <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
  </div>
);

export default ProjectTaskManager;





// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import { useRecoilState, useRecoilValue } from "recoil";
// import { info } from "../store/atoms/userinfo";
// import { allusers } from "../store/atoms/contacts";
// //import { set } from "date-fns";
// var projectdata1 = null;
// var projectdate = null;
// export function ProjectDetails() {
//   const [projectData, setProjectData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const { id } = useParams();
//   const [AllUsers, setAllUsers] = useRecoilState(allusers);
//   const [showModal, setShowModal] = useState(false);
//   const [showModal1, setShowModal1] = useState(false);
//   const navigate = useNavigate();
//   const [invitedusers, setinvitedusers] = useState([]);
//   const [allinfo, setinfo] = useRecoilState(info);
//   const [coreprojectdata, setcoredata] = useState(null);
//   const [refresh, setRefresh] = useState(false);
//   const [refresh1, setRefresh1] = useState(false);
//   const [showinfo, setShowinfo] = useState(false);
//   const [showinfo1, setShowinfo1] = useState(false);
//   const [mailworks, setmailworks] = useState([]);
//   const [mailsubworks, setmailsubworks] = useState([]);
//   const [tasks, setTasks] = useState(null);

//   const invitedUsersRef = useRef(invitedusers);

//   // Update ref whenever invitedusers state changes
//   useEffect(() => {
//     invitedUsersRef.current = invitedusers;
//   }, [invitedusers]);

//   useEffect(()=>{
//     console.log(projectData);
//   },[projectData])

//   useEffect(() => {
//     if (!localStorage.getItem("token")) {
//       navigate("/");
//     }

//     var intervalId = null;

//     async function start() {
//       setLoading(true);
//       await fetchProjectData();
//       setLoading(false);
      
//       try {
//         const response1 = await axios.post(
//           `https://honoprisma.codessahil.workers.dev/getmailwork`,
//           {
//             id: parseInt(id),
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         const response2 = await axios.post(
//           `https://honoprisma.codessahil.workers.dev/getmailsubwork`,
//           {
//             id: parseInt(id),
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         setmailworks(response1.data.res);
//         console.log(response1.data);
//         console.log(response2.data);
//         setmailsubworks(response2.data.res);
//       } catch (err) {
//         console.log(err);
//       }
//       await fetchAllUsers();
//       fetchInvitedUsers().then(() => {
//         intervalId = setInterval(async () => {
//           console.log(invitedUsersRef.current.length); 
//           if (projectdata1 != null && invitedUsersRef.current.length > 0) {
//             const dd = await checktoupdate();
//             if (dd === true) {
//               fetchProjectData();
//               fetchAllUsers();
//               fetchInvitedUsers();
//             }
//           }
//         }, 5000);
        
//       });
      
      
//     }

//     start();

//     return () => clearInterval(intervalId);
//   }, [refresh]);

//   // useEffect(()=>{
//   //   console.log("refreshing");
//   // },[projectData])

//   // useEffect(() => {
//   //   if (!localStorage.getItem("token")) {
//   //     navigate("/");
//   //   }

//   //   var intervalId=null;

//   //   async function start(){
//   //       setLoading(true);
//   //       await fetchAllUsers();

//   //       //console.log(invitedusers);

//   //       await fetchProjectData();
//   //       fetchInvitedUsers().then(()=>{
//   //         intervalId = setInterval(async () => {
//   //           console.log(invitedusers.length);
//   //           if (projectdata1 != null && invitedusers.length>0) {
//   //             //console.log(projectdata1);
//   //             const dd = await checktoupdate();
//   //             //console.log(dd);
//   //             if (dd == true) {
//   //               fetchProjectData();
//   //               fetchAllUsers();
//   //               fetchInvitedUsers();
//   //             }
//   //           }
//   //         }, 5000);
//   //       })

//   //   }

//   //   start();
//   //   return () => clearInterval(intervalId);
//   // }, [refresh]);

//   async function checktoupdate() {
//     if (projectdata1 || projectdata1 != null) {
//       const simplifiedWorks = projectdata1.works.map((work) => ({
//         id: work.id,
//         assignto: work.assignto,
//         completed: work.completed,
//       }));

//       const simplifiedSubworks = projectdata1.subworks.map((subwork) => ({
//         id: subwork.id,
//         assignto: subwork.assignto,
//         completed: subwork.completed,
//       }));
//       try {
//         const response = await axios.post(
//           `https://honoprisma.codessahil.workers.dev/checkforupdate`,
//           {
//             simplifiedWorks,
//             simplifiedSubworks,
//             id: projectdata1.id,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         // Get the data from the response
//         const data = await response.data.res;
//         return data;
//       } catch (error) {
//         console.error("Error fetching project data:", error);
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       return false;
//     }
//   }

//   const fetchProjectData = async () => {
//     try {
//       // Start loading
//       // projectdata1 = projectData;
//       setProjectData(null);
//       // Make the request to the backend
//       const response = await axios.get(
//         `https://honoprisma.codessahil.workers.dev/getproject/${id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const data = await response.data.res;
//       projectdata1 = data;
//       if (projectdate == null) {
//         const isoDate = data.created_at;
//         const date = new Date(isoDate);
//         projectdate = date.toLocaleDateString("en-US", {
//           year: "numeric",
//           month: "long",
//           day: "numeric",
//         });
//       }

//       //console.log(data);

//       const transformedTasks = await transformTasks(data.works, data.subworks);
//       setTasks(transformedTasks);
//       setProjectData({
//         title: data.title,
//         tasks: transformedTasks,
//         user_id: data.user_id,
//         id: data.id,
//         folder_id: data.folder_id,
//         description: data.description,
//         link: data.link,
//         archive: data.archive,
//         done: data.done,
//         created_at: data.created_at,
//       });
//       //setTasks(transformedTasks);
//     } catch (error) {
//       console.error("Error fetching project data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchInvitedUsers = async () => {
//     try {
//       const res = await axios.post(
//         `https://honoprisma.codessahil.workers.dev/invitedusers`,
//         {
//           project_id: parseInt(id),
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       setinvitedusers(res.data.res);
//     } catch (err) {
//       alert(err);
//       //console.log("Error fetching invited user data:", err);
//     }
//   };

//   const fetchAllUsers = async () => {
//     try {
//       const response = await axios.get(
//         "https://honoprisma.codessahil.workers.dev/getallusers",
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       setAllUsers(response.data.res);
//     } catch (error) {
//       console.error("Error fetching all users:", error);
//     }
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//   };
//   const handleCloseModal1 = () => {
//     setShowModal1(false);
//   };

//   const handleUserClick = async (userId) => {
//     const res = await axios.post(
//       `https://honoprisma.codessahil.workers.dev/inviteUserToProject`,
//       {
//         project_id: parseInt(id),
//         user_id: userId,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     // setShowModal(false);
//     setinvitedusers((prevInvitedUsers) => [...prevInvitedUsers, res.data.res]);
//     setAllUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
//     setShowModal(false);
//   };
//   const handleUserClick1 = async (id) => {
//     const res = await axios.post(
//       `https://honoprisma.codessahil.workers.dev/removeinvite`,
//       {
//         id: parseInt(id),
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     // setShowModal(false);
//     fetchInvitedUsers();
//     fetchAllUsers();
//     setShowModal1(false);
//   };

//   const transformTasks = async (works, subworks) => {
//     //console.log(works);
//     return works.map((work) => ({
//       id: work.id,
//       title: work.work,
//       description: work.description,
//       completed: work.completed,
//       assignto: work.assignto,
//       subtasks: subworks
//         .filter((subwork) => subwork.work_id === work.id)
//         .map((subwork) => ({
//           id: subwork.id,
//           title: subwork.subwork,
//           description: subwork.subdescription,
//           assignto: subwork.assignto,
//           completed: subwork.completed,
//           work_id: subwork.work_id
//         })),
//     }));
//   };

//   const LoadingIndicator = () => (
//     <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
//       <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
//     </div>
//   );
//   if (loading)
//     return (
//       <div>
//         <LoadingIndicator></LoadingIndicator>
//       </div>
//     );

//   if (projectData == null)
//     return (
//       <div>
//         <div className="flex justify-center">
//           <div className="flex flex-col justify-center h-screen">
//             Getting team changes
//           </div>
//         </div>
//       </div>
//     );

//   return (
//     <div className="bg-mybg min-h-screen">
//       <div className="flex justify-between">
//         <div
//           className="p-2 mt-3 ml-1 cursor-pointer"
//           onClick={() => {
//             if (projectData.user_id === allinfo.id) {
//               navigate("/userprojects");
//             } else {
//               navigate("/assignedprojects");
//             }
//           }}
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke-width="1.5"
//             stroke="currentColor"
//             class="size-6"
//           >
//             <path
//               stroke-linecap="round"
//               stroke-linejoin="round"
//               d="M12 9.75 14.25 12m0 0 2.25 2.25M14.25 12l2.25-2.25M14.25 12 12 14.25m-2.58 4.92-6.374-6.375a1.125 1.125 0 0 1 0-1.59L9.42 4.83c.21-.211.497-.33.795-.33H19.5a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25h-9.284c-.298 0-.585-.119-.795-.33Z"
//             />
//           </svg>
//         </div>
//         <div className="p-2">
//           <button
//             className={`mr-2 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-3 border border-gray-400 rounded shadow ${
//               allinfo.id != projectData.user_id ? "hidden" : "bg-blue-400"
//             }`}
//             onClick={() => {
//               //console.log(projectData)
//               //console.log(allinfo);
//               console.log(invitedusers.length);
//               setShowModal1((x) => !x);
//             }}
//           >
//             People
//           </button>
//           <button
//             className={`bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-3 border border-gray-400 rounded shadow ${
//               allinfo.id != projectData.user_id ? "hidden" : "bg-blue-400"
//             }`}
//             onClick={() => {
//               //console.log(projectData)
//               //console.log(allinfo);
//               setShowModal((x) => !x);
//             }}
//           >
//             Invite
//           </button>
//           <button
//             className={`mr-2 ml-2 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-3 border border-gray-400 rounded shadow `}
//             onClick={() => {
//               //console.log(projectData)
//               //console.log(typeof(projectData.id));
//               navigate(`/projectmessages/${projectData.id}`);
//             }}
//           >
//             Messages
//           </button>
//         </div>
//       </div>
//       <div className="mt-3 flex justify-center">
//         <div className="font-serif text-2xl smd:text-4xl">
//           {projectData.title} :{" "}
//           <span className="text-lg smd:text-2xl font-light pb-1 text-gray-600">
//             {projectdate}
//           </span>
//         </div>
//       </div>
//       <div>
//         {/* <ProjectTitlebar setShowModal={setShowModal} projectname ={projectData.title} ></ProjectTitlebar> */}
//         {projectData && (
//           <ProjectTaskManager
//             setShowinfo={setShowinfo}
//             setShowinfo1={setShowinfo1}
//             showinfo1={showinfo1}
//             showinfo={showinfo}
//             setRefresh={setRefresh}
//             setRefresh1={setRefresh1}
//             id={id}
//             projectTitle={projectData.title}
//             tasks={tasks}
//             setTasks={setTasks}
//             projectData={projectData}
//             setProjectData={setProjectData}
//             allinfo={allinfo}
//             invitedusers={invitedusers}
//             projectdata1={projectdata1}
//             mailworks={mailworks}
//             setmailworks={setmailworks}
//             mailsubworks={mailsubworks}
//             setmailsubworks={setmailsubworks}
//           />
//         )}
//       </div>
//       {showModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
//           <div className="bg-white p-4 rounded-lg shadow-md max-h-96 overflow-y-auto">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-bold">Invite user..</h3>
//               <button
//                 onClick={handleCloseModal}
//                 className="text-gray-600 hover:text-gray-800"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-6 w-6"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </button>
//             </div>
//             <div className="grid gap-2">
//               {AllUsers.filter(
//                 (user) =>
//                   !invitedusers.some((invite) => invite.user_id === user.id)
//               ).map((user) => (
//                 <div
//                   key={user.id}
//                   className="bg-gray-100 p-2 rounded-md cursor-pointer hover:bg-gray-200"
//                   onClick={() => handleUserClick(user.id)}
//                 >
//                   <div className="text-lg font-semibold">{user.name}</div>
//                   <div className="text-gray-600">{user.username}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//       {showModal1 && (
//         <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
//           <div className="bg-white p-4 rounded-lg shadow-md max-h-96 overflow-y-auto">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-bold">Invited users..</h3>
//               <button
//                 onClick={handleCloseModal1}
//                 className="text-gray-600 hover:text-gray-800"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-6 w-6"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </button>
//             </div>
//             <div className="grid gap-2">
//               {invitedusers.map((user) => (
//                 <div
//                   key={user.id}
//                   className={`${
//                     user.accepted ? "bg-green-300" : "bg-gray-100"
//                   } p-2 rounded-md cursor-pointer hover:opacity-70`}
//                 >
//                   <div className="flex justify-between">
//                     <div>
//                       <div className="text-lg font-semibold">
//                         {user.user.name}
//                       </div>
//                       <div className="text-gray-600">{user.user.username}</div>
//                     </div>
//                     <div
//                       className="flex flex-col justify-center"
//                       onClick={() => handleUserClick1(user.id)}
//                     >
//                       <div>
//                         <svg
//                           className="w-6 h-6"
//                           aria-hidden="true"
//                           fill="currentColor"
//                           viewBox="0 0 32 32"
//                           xmlns="http://www.w3.org/2000/svg"
//                         >
//                           <g data-name="22-Remove">
//                             <path
//                               fillRule="evenodd"
//                               clipRule="evenodd"
//                               d="M25 0H7a7 7 0 0 0-7 7v18a7 7 0 0 0 7 7h18a7 7 0 0 0 7-7V7a7 7 0 0 0-7-7zm5 25a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5h18a5 5 0 0 1 5 5z"
//                             />
//                             <path d="M6 15h20v2H6z" />
//                           </g>
//                         </svg>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// function ProjectTaskManager({
//   id,
//   setShowinfo,
//   setShowinfo1,
//   showinfo,
//   showinfo1,
//   setRefresh,
//   setRefresh1,
//   projectTitle,
//   tasks,
//   setTasks,
//   projectData,
//   setProjectData,
//   allinfo,
//   invitedusers,
//   projectdata1,
//   mailworks,
//   setmailworks,
//   setmailsubworks,
//   mailsubworks,
// }) {
//   console.log(projectData);
//   console.log(tasks);
//   //const [tasks, setTasks] = useState(initialTasks);
//   const [loading, setLoading] = useState(false);
//   const [refresh2, setRefresh2] = useState(false);
//   const [showinfoofid, setShowinfoofid] = useState(null);
//   const [isediting, setIsediting] = useState(null);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");

//   // Toggle the completed state of a task or subtask
//   // const handleCheckboxChange = async (taskId, parentId) => {
//   //   const updateTaskCompleted = (taskList, taskId) => {
//   //     if (parentId === null) {
//   //       for (const it of projectdata1.works) {
//   //         if (it.id == taskId) {
//   //           it.completed = !it.completed;
//   //         }
//   //       }
//   //     } else {
//   //       for (const it of projectdata1.subworks) {
//   //         if (it.id == taskId) {
//   //           it.completed = !it.completed;
//   //         }
//   //       }
//   //     }
//   //     return taskList.map((task) => {
//   //       if (task.id === taskId) {
//   //         return { ...task, completed: !task.completed };
//   //       }
//   //       if (task.subtasks && task.subtasks.length > 0) {
//   //         return {
//   //           ...task,
//   //           subtasks: updateTaskCompleted(task.subtasks, taskId),
//   //         };
//   //       }
//   //       return task;
//   //     });
//   //   };

//   //   const findTask = (taskList, id) => {
//   //     for (const task of taskList) {
//   //       if (task.id === id) return task;
//   //       if (task.subtasks && task.subtasks.length > 0) {
//   //         const foundTask = findTask(task.subtasks, id);
//   //         if (foundTask) return foundTask;
//   //       }
//   //     }
//   //     return null;
//   //   };

//   //   const taskToUpdate = findTask(tasks, taskId);

//   //   if (taskToUpdate) {
//   //     // Update the local state first
//   //     const updatedTasks = updateTaskCompleted(tasks, taskId);
//   //     setTasks(updatedTasks);

//   //     try {
//   //       // Check if the task is a `work` or `subwork`
//   //       const isSubwork = parentId != null; // Example logic: adjust as needed

//   //       // console.log(`Task ID: ${taskId}, Is Subwork: ${isSubwork}`); // Debugging

//   //       if (isSubwork) {
//   //         // It's a subwork
//   //         try {
//   //           await axios.post(
//   //             "https://honoprisma.codessahil.workers.dev/updateSubWorkCompletion",
//   //             {
//   //               subworkId: taskId,
//   //               completed: !taskToUpdate.completed,
//   //             },
//   //             {
//   //               headers: {
//   //                 Authorization: `Bearer ${localStorage.getItem("token")}`,
//   //                 "Content-Type": "application/json",
//   //               },
//   //             }
//   //           );
//   //         } catch (err) {
//   //           alert(err);
//   //         }
//   //       } else {
//   //         // It's a work
//   //         await axios.post(
//   //           "https://honoprisma.codessahil.workers.dev/updateWorkCompletion",
//   //           {
//   //             workId: taskId,
//   //             completed: !taskToUpdate.completed,
//   //           },
//   //           {
//   //             headers: {
//   //               Authorization: `Bearer ${localStorage.getItem("token")}`,
//   //               "Content-Type": "application/json",
//   //             },
//   //           }
//   //         );
//   //       }
//   //     } catch (error) {
//   //       console.error("Error updating task completion:", error);
//   //       // Optionally revert the local state if needed
//   //       setTasks(tasks);
//   //     }
//   //   }
//   // };

//   // useEffect(()=>{
//   //   console.log("refreshing");
//   //   setRefresh2((x)=>!x);
//   // },[projectData])
//   const handleCheckboxChange = async (taskId, parentId) => {
//     const updateTaskCompleted = (taskList, taskId, parentId) => {
//       return taskList.map((task) => {
//         if (parentId === null && task.id === taskId) {
//           // It's a `work` and matches the taskId
//           return { ...task, completed: !task.completed };
//         }
//         if (task.subtasks && task.subtasks.length > 0) {
//           // Check subtasks only if `parentId` matches the current task's id
//           if (task.id === parentId) {
//             return {
//               ...task,
//               subtasks: task.subtasks.map((subtask) =>
//                 subtask.id === taskId
//                   ? { ...subtask, completed: !subtask.completed }
//                   : subtask
//               ),
//             };
//           } else {
//             // Continue looking for the right subtask
//             return {
//               ...task,
//               subtasks: updateTaskCompleted(task.subtasks, taskId, parentId),
//             };
//           }
//         }
//         return task;
//       });
//     };

//     const findTask = (taskList, id, parentId) => {
//       for (const task of taskList) {
//         if (parentId === null && task.id === id) return task; // It's a work
//         if (task.subtasks && task.subtasks.length > 0) {
//           if (task.id === parentId) {
//             // Found the parent, now find the subtask
//             return task.subtasks.find((subtask) => subtask.id === id);
//           }
//           const foundTask = findTask(task.subtasks, id, parentId);
//           if (foundTask) return foundTask;
//         }
//       }
//       return null;
//     };

//     const taskToUpdate = findTask(tasks, taskId, parentId);

//     if (taskToUpdate) {
//       // Update the local state first
//       const updatedTasks = updateTaskCompleted(tasks, taskId, parentId);
//       setTasks(updatedTasks);
//       //const oldtask = tasks;
//       //tasks = updatedTasks;

//       try {
//         const isSubwork = parentId != null;

//         if (isSubwork) {
//           // Update subwork
//           await axios.post(
//             "https://honoprisma.codessahil.workers.dev/updateSubWorkCompletion",
//             {
//               subworkId: taskId,
//               completed: !taskToUpdate.completed,
//             },
//             {
//               headers: {
//                 Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 "Content-Type": "application/json",
//               },
//             }
//           );
//         } else {
//           // Update work
//           await axios.post(
//             "https://honoprisma.codessahil.workers.dev/updateWorkCompletion",
//             {
//               workId: taskId,
//               completed: !taskToUpdate.completed,
//             },
//             {
//               headers: {
//                 Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 "Content-Type": "application/json",
//               },
//             }
//           );
//         }
//       } catch (error) {
//         console.error("Error updating task completion:", error);
//         // Optionally revert the local state if needed
//         setTasks(tasks);
//         //tasks = oldtask;
//       }
//     }
//   };

//   async function updatetaskdetails(taskId, parentId) {
//     // Helper function to update task details in the local state
//     const newTitle = title;
//     const newDescription = description;
//     const updateTaskDetails = (taskList, taskId, parentId) => {
//       return taskList.map((task) => {
//         if (parentId === null && task.id === taskId) {
//           // Update the work (top-level task)
//           return { ...task, title: newTitle, description: newDescription };
//         }
//         if (task.subtasks && task.subtasks.length > 0) {
//           // Check subtasks only if `parentId` matches the current task's id
//           if (task.id === parentId) {
//             return {
//               ...task,
//               subtasks: task.subtasks.map((subtask) =>
//                 subtask.id === taskId
//                   ? { ...subtask, title: newTitle, description: newDescription }
//                   : subtask
//               ),
//             };
//           } else {
//             // Continue looking for the right subtask
//             return {
//               ...task,
//               subtasks: updateTaskDetails(task.subtasks, taskId, parentId),
//             };
//           }
//         }
//         return task;
//       });
//     };

//     // Helper function to find the task
//     const findTask = (taskList, id, parentId) => {
//       for (const task of taskList) {
//         if (parentId === null && task.id === id) return task; // It's a work (top-level task)
//         if (task.subtasks && task.subtasks.length > 0) {
//           if (task.id === parentId) {
//             // Found the parent, now find the subtask
//             return task.subtasks.find((subtask) => subtask.id === id);
//           }
//           const foundTask = findTask(task.subtasks, id, parentId);
//           if (foundTask) return foundTask;
//         }
//       }
//       return null;
//     };

//     const taskToUpdate = findTask(tasks, taskId, parentId);

//     if (taskToUpdate) {
//       // Update the local state first
//       const updatedTasks = updateTaskDetails(tasks, taskId, parentId);
//       setTasks(updatedTasks);

//       try {
//         const isSubwork = parentId != null;

//         if (isSubwork) {
//           // Update subwork title and description
//           await axios.post(
//             "https://honoprisma.codessahil.workers.dev/updateSubWork",
//             {
//               subworkId: taskId,
//               title: title,
//               description: description,
//             },
//             {
//               headers: {
//                 Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 "Content-Type": "application/json",
//               },
//             }
//           );
//           setTitle("");
//           setDescription("");
//         } else {
//           // Update work (top-level task) title and description
//           await axios.post(
//             "https://honoprisma.codessahil.workers.dev/updateWork",
//             {
//               workId: taskId,
//               title: title,
//               description: description,
//             },
//             {
//               headers: {
//                 Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 "Content-Type": "application/json",
//               },
//             }
//           );
//           setTitle("");
//           setDescription("");
//         }
//       } catch (error) {
//         console.error("Error updating task details:", error);
//         // Optionally revert the local state if needed
//         setTasks(tasks);
//       }
//     }
//   }

//   async function deletefrommail(taskid, parentId) {
//     const isSubwork = parentId != null;
//     if (isSubwork) {
//       try {
//         await axios.post(
//           "https://honoprisma.codessahil.workers.dev/deletemailsubwork",
//           {
//             id: taskid,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         setmailsubworks((prevSubworks) =>
//           prevSubworks.filter((subwork) => subwork.subwork_id !== taskid)
//         );
//         alert(" removed from mail reminder");
//       } catch (err) {
//         alert("error removing from mail reminder");
//       }
//     } else {
//       try {
//         await axios.post(
//           "https://honoprisma.codessahil.workers.dev/deletemailwork",
//           {
//             id: taskid,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         setmailworks((prevWorks) =>
//           prevWorks.filter((work) => work.work_id !== taskid)
//         );
//         alert(" removed from mail reminder");
//       } catch (err) {
//         alert("error removing from mail reminder");
//       }
//     }
//   }

//   async function addtomail(
//     taskId,
//     parentId,
//     title,
//     description,
//     projectid,
//     mail
//   ) {
//     const isSubwork = parentId != null;
//     if (isSubwork) {
//       try {
//         const res = await axios.post(
//           "https://honoprisma.codessahil.workers.dev/addmailsubwork",
//           {
//             subwork_id: taskId,
//             title: title,
//             description: description,
//             email: mail,
//             project_id: parseInt(projectid),
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         setmailsubworks((prevSubworks) => [...prevSubworks, res.data.res]);
//         alert(" added to mail reminder");
//       } catch (err) {
//         alert("error adding to mail reminder");
//       }
//     } else {
//       try {
//         const res = await axios.post(
//           "https://honoprisma.codessahil.workers.dev/addmailwork",
//           {
//             work_id: taskId,
//             title: title,
//             description: description,
//             email: mail,
//             project_id: parseInt(projectid),
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         setmailworks((prevWorks) => [...prevWorks, res.data.res]);
//         alert(" added to mail reminder");
//       } catch (err) {
//         alert("error adding to mail reminder");
//       }
//     }
//   }

//   // Render tasks and subtasks
//   async function handlesubtaskdelete(id, work_id) {
//     try {
//       //setLoading(true);
//       await axios.post(
//         `https://honoprisma.codessahil.workers.dev/deletesubwork`,
//         {
//           id: parseInt(id),
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       //setLoading(false);
//       //const [newprojectdata, setnew] = useState(null)
//       // console.log("Before setProjectData");
//       // const prevProjectData = projectData;
//       // var yy = {
//       //   ...prevProjectData,
//       //   tasks:prevProjectData.tasks.map((task) => {
//       //     if (task.id === work_id) {
//       //       // Update the task's subtasks by filtering out the subtask with the given id
//       //       const updatedSubtasks = task.subtasks.filter((subtask) => subtask.id !== id);
//       //       return {
//       //         ...task,
//       //         subtasks: updatedSubtasks,
//       //       };
//       //     }
//       //     return task; // Return the other tasks as-is
//       //   })
//       // }
//       // //setProjectData(nu);
//       // setProjectData(yy);
//       // setProjectData((prevProjectData) => {
//       //   const updatedTasks = prevProjectData.tasks.map((task) => {
//       //     if (task.id === work_id) {
//       //       // Update the task's subtasks by filtering out the subtask with the given id
//       //       const updatedSubtasks = task.subtasks.filter((subtask) => subtask.id !== id);
//       //       return {
//       //         ...task,
//       //         subtasks: updatedSubtasks,
//       //       };
//       //     }
//       //     return task; // Return the other tasks as-is
//       //   });
      
//       //   return {
//       //     ...prevProjectData,
//       //     tasks: updatedTasks,
//       //   };
//       // });
      

      
      

//     } catch (err) {
//       alert(err);
//     }
//   }
//   async function handletaskdelete(id) {
//     const prevtask = tasks;
//     try {
//       setTasks(tasks.filter((task)=>task.id!==id));
//       //setLoading(true);
//       await axios.post(
//         `https://honoprisma.codessahil.workers.dev/deletework`,
//         {
//           id: parseInt(id),
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       //setLoading(false);
//       //filter((subtask) => subtask.id !== id),
//       setProjectData((prevProjectData) => ({
//         ...prevProjectData,
//         tasks: prevProjectData.tasks.filter((task) => task.id !== id)
//       }));
      
//     } catch (err) {
//       setTasks(prevtask);
//       alert(err);
//     }
//   }
//   const renderTasks = (taskList, parentId = null) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [isUsing, setIsusing] = useState("");
//     const [istask, setisTask] = useState(parentId);
//     //const [showinfo, setShowinfo] = useState(false);

//     //console.log(taskList);
//     return (
//       <div
//         className={`relative ${
//           parentId ? "ml:6 smd:ml-8" : "ml-2 smd:ml-4"
//         } pl-[6px] border-l border-gray-500`}
//       >
//         {showinfo && (
//           <div className="fixed inset-0 flex items-center justify-center z-40 bg-black bg-opacity-50">
//             <div className="bg-white p-5 rounded shadow-lg relative">
//               <button
//                 onClick={() => setShowinfo(false)}
//                 className="absolute top-2 right-2 text-gray-600"
//               >
//                 ✕
//               </button>
//               <ShowingInfo
//                 setRefresh={setRefresh}
//                 id={id}
//                 showinfoofid={showinfoofid}
//                 setShowinfo={setShowinfo}
//               />
//             </div>
//           </div>
//         )}
//         {showinfo1 && (
//           <div className="fixed inset-0 flex items-center justify-center z-40 bg-black bg-opacity-50">
//             <div className="bg-white p-5 rounded shadow-lg relative">
//               <button
//                 onClick={() => setShowinfo1(false)}
//                 className="absolute top-2 right-2 text-gray-600"
//               >
//                 ✕
//               </button>
//               <ShowingInfo1
//                 setRefresh={setRefresh}
//                 id={id}
//                 setShowinfo1={setShowinfo1}
//               />
//             </div>
//           </div>
//         )}
//         {taskList.map((task, index) => {
//           var done = false;
//           if (parentId) {
//             for (const it of mailsubworks) {
//               if (it.subwork_id === task.id) {
//                 done = true;
//               }
//             }
//           } else {
//             for (const it of mailworks) {
//               if (it.work_id === task.id) {
//                 done = true;
//               }
//             }
//           }
//           return (
//             <div key={task.id} className="relative mt-4">
//               {/* Line connecting to the previous task */}
//               {index >= 0 && (
//                 <div className="absolute -left-1 top-0 h-full border-l border-gray-500"></div>
//               )}
//               {/* Task Box */}

//               <div className="flex">
//                 <div className="flex flex-col justify-center">
//                   <button
//                     className={`${
//                       allinfo.id == projectData.user_id ? "" : "hidden"
//                     } `}
//                     onClick={async () => {
//                       if (parentId) {
//                         console.log(task);
                        
//                         await handlesubtaskdelete(task.id, task.work_id);
//                         setRefresh((x) => !x);
//                         //setRefresh1((x)=>!x);
//                       } else {
//                         await handletaskdelete(task.id);
//                         //setRefresh((x) => !x);
//                       }
//                     }}
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="3 0 24 24"
//                       stroke-width="0.5"
//                       stroke="currentColor"
//                       class={` size-5 smd:size-6`}
//                     >
//                       <path
//                         stroke-linecap="round"
//                         stroke-linejoin="round"
//                         d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
//                       />
//                     </svg>
//                   </button>
//                 </div>
//                 <div
//                   className={`relative flex-1 pl-1 pr-2 border rounded shadow-sm ${
//                     parentId ? "border-gray-400" : "border-gray-200"
//                   } ${
//                     task.completed == false ? "bg-blue-200" : "bg-green-200"
//                   }`}
//                 >
//                   <div className="flex items-center">
//                     <div className="flex flex-col ">
//                       <input
//                         type="checkbox"
//                         checked={task.completed}
//                         onChange={() => {
//                           //console.log(projectData);
//                           if (
//                             projectData.user_id == parseInt(allinfo.id) ||
//                             allinfo.id == task.assignto
//                           ) {
//                             handleCheckboxChange(task.id, parentId);
//                           }
//                         }}
//                         className={`${
//                           isediting === task.id ? "hidden" : ""
//                         } form-checkbox h-5 w-5 text-blue-500`}
//                       />
//                       {isediting === task.id && (
//                         <div
//                           onClick={() => {
//                             setIsediting(null);
//                             setTitle("");
//                             setDescription("");
//                           }}
//                         >
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke-width="1.5"
//                             stroke="currentColor"
//                             class="size-6"
//                           >
//                             <path
//                               stroke-linecap="round"
//                               stroke-linejoin="round"
//                               d="M6 18 18 6M6 6l12 12"
//                             />
//                           </svg>
//                         </div>
//                       )}
//                       <div
//                         onClick={() => {
//                           if (isediting === task.id) {
//                             updatetaskdetails(task.id, parentId);
//                             setIsediting(null);

//                             return;
//                           }
//                           setIsediting(task.id);
//                           setTitle(task.title);
//                           if (task.description) {
//                             setDescription(task.description);
//                           }
//                         }}
//                         className="mt-1 cursor cursor-pointer "
//                       >
//                         {(isediting != task.id && isediting===null && allinfo.id == projectData.user_id) && (
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke-width="1.5"
//                             stroke="currentColor"
//                             class="size-4"
//                           >
//                             <path
//                               stroke-linecap="round"
//                               stroke-linejoin="round"
//                               d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
//                             />
//                           </svg>
//                         )}

//                         {isediting === task.id && (
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke-width="1.5"
//                             stroke="currentColor"
//                             class="size-6"
//                           >
//                             <path
//                               stroke-linecap="round"
//                               stroke-linejoin="round"
//                               d="m4.5 12.75 6 6 9-13.5"
//                             />
//                           </svg>
//                         )}
//                       </div>
//                     </div>
//                     <div className="m-2 w-full">
//                       <div
//                         className={`${
//                           task.completed == false ? "bg-white" : "bg-green-100"
//                         } ml-1 p-1 border w-full flex-grow rounded-md`}
//                       >
//                         <input
//                           onChange={(e) => {
//                             setTitle(e.target.value);
//                           }}
//                           value={
//                             isediting && isediting === task.id
//                               ? title
//                               : task.title
//                           }
//                           className="w-full"
//                           disabled={isediting !== task.id}
//                         ></input>
//                         {/* {task.title} */}
//                       </div>
//                     </div>
//                     <div>
//                       <div
//                         className={`${
//                           allinfo.id != projectData.user_id &&
//                           task.assignto == allinfo.id
//                             ? ""
//                             : "hidden"
//                         } `}
//                       >
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke-width="1.5"
//                           stroke="currentColor"
//                           class="size-6"
//                         >
//                           <path
//                             stroke-linecap="round"
//                             stroke-linejoin="round"
//                             d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
//                           />
//                         </svg>
//                       </div>

//                       <div>
//                         <div
//                           className={`px-[1px] pt-[2px] rounded-md   ${
//                             allinfo.id != projectData.user_id ? "hidden" : ""
//                           }`}
//                         >
//                           <div className="pb-1 inline-block text-left">
//                             {/* Circular Icon */}
//                             <div className=" flex h-full">
//                               <div className="flex flex-col ">
//                                 <button
//                                   className={`${parentId ? "hidden" : ""}`}
//                                   onClick={() => {
//                                     //console.log(task.id);
//                                     setShowinfoofid(task.id);
//                                     setShowinfo(true);
//                                   }}
//                                 >
//                                   <div>
//                                     <svg
//                                       xmlns="http://www.w3.org/2000/svg"
//                                       fill="none"
//                                       viewBox="0 0 24 24"
//                                       stroke-width="1.5"
//                                       stroke="currentColor"
//                                       class="size-6"
//                                     >
//                                       <path
//                                         stroke-linecap="round"
//                                         stroke-linejoin="round"
//                                         d="M12 4.5v15m7.5-7.5h-15"
//                                       />
//                                     </svg>
//                                   </div>
//                                 </button>
//                                 <div className="flex w-full justify-center">
//                                   <button
//                                     onClick={() => {
//                                       setIsOpen(!isOpen);
//                                       setIsusing(task.id);
//                                       setisTask(parentId);
//                                     }}
//                                     className="flex items-center justify-center w-5 h-6  bg-gray-300 rounded-full focus:outline-none"
//                                   >
//                                     <svg
//                                       xmlns="http://www.w3.org/2000/svg"
//                                       fill="none"
//                                       viewBox="0 0 24 24"
//                                       stroke-width="1.5"
//                                       stroke="currentColor"
//                                       class="size-6"
//                                     >
//                                       <path
//                                         stroke-linecap="round"
//                                         stroke-linejoin="round"
//                                         d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
//                                       />
//                                     </svg>
//                                   </button>
//                                 </div>
//                               </div>
//                               <div
//                                 onClick={() => {
//                                   var done = false;
//                                   if (parentId) {
//                                     for (const it of mailsubworks) {
//                                       if (it.subwork_id === task.id) {
//                                         done = true;
//                                         deletefrommail(task.id, parentId);
//                                       }
//                                     }
//                                   } else {
//                                     for (const it of mailworks) {
//                                       if (it.work_id === task.id) {
//                                         done = true;
//                                         deletefrommail(task.id, parentId);
//                                       }
//                                     }
//                                   }
//                                   if (!done) {
//                                     addtomail(
//                                       task.id,
//                                       parentId,
//                                       task.title,
//                                       task.description,
//                                       id,
//                                       allinfo.username
//                                     );
//                                   }
//                                 }}
//                                 className={`cursor-pointer  ml-1 h-full flex flex-col justify-center my-auto ${
//                                   done ? "text-black" : "text-black"
//                                 }`}
//                               >
//                                 {/* <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 fill={`${done?"#90EE90":"none"}`}
//                                 viewBox="0 0 24 24"
//                                 stroke-width="1.5"
//                                 stroke="currentColor"
//                                 class="size-5"
//                               >
//                                 <path
//                                   stroke-linecap="round"
//                                   stroke-linejoin="round"
//                                   d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3"
//                                 />
//                               </svg> */}
//                                 <svg
//                                   className="mt-1"
//                                   xmlns="http://www.w3.org/2000/svg"
//                                   viewBox="0 0 64 64"
//                                   width="20"
//                                   height="29"
                                  
//                                 >
//                                   <g>
//                                     <rect
//                                       x="8"
//                                       y="24"
//                                       width="48"
//                                       height="32"
//                                       rx="4"
//                                       ry="4"
//                                       fill={`${done?"#009e00":"none"}`}
//                                       stroke="currentColor"
//                                       stroke-width="2"
//                                     />
//                                     <polyline
//                                       points="8 24 32 44 56 24"
//                                       fill="none"
//                                       stroke="currentColor"
//                                       stroke-width="2"
//                                     />
//                                   </g>

//                                   <g transform="translate(20, -9) scale(0.8)">
//                                     <path
//                                       fill={`${done?"#009e00":"none"}`}
//                                       stroke="currentColor"
//                                       stroke-width="2"
//                                       stroke-linecap="round"
//                                       stroke-linejoin="round"
//                                       d="M22 36c1.333 0 2.667 1 4 3h-8c1.333-2 2.667-3 4-3zM22 4a9 9 0 0 1 9 9v7a13 13 0 0 0 5 10v1H8v-1a13 13 0 0 0 5-10V13a9 9 0 0 1 9-9z"
//                                     />
//                                   </g>
//                                 </svg>
//                               </div>
//                             </div>

//                             {/* Dropdown Menu */}
//                             {isOpen &&
//                               isUsing == task.id &&
//                               istask == parentId && (
//                                 <div className="absolute right-0 z-10 w-48 mt-2 origin-top-right bg-white border border-gray-300 rounded-md shadow-lg">
//                                   <div className="py-1">
//                                     <button
//                                       onClick={async () => {
//                                         //task id
//                                         //parentid
//                                         //x.user.id
//                                         if (parentId == null) {
//                                           try {
//                                             setLoading(true);
//                                             await axios.post(
//                                               `https://honoprisma.codessahil.workers.dev/updatework`,
//                                               {
//                                                 workid: task.id,
//                                                 userid: allinfo.id,
//                                               },
//                                               {
//                                                 headers: {
//                                                   Authorization: `Bearer ${localStorage.getItem(
//                                                     "token"
//                                                   )}`,
//                                                   "Content-Type":
//                                                     "application/json",
//                                                 },
//                                               }
//                                             );
//                                             task.assignto = allinfo.id;
//                                             setIsOpen(false);
//                                             setLoading(false);
//                                           } catch (err) {
//                                             alert(err);
//                                           }
//                                         } else {
//                                           try {
//                                             setLoading(true);
//                                             const res = await axios.post(
//                                               `https://honoprisma.codessahil.workers.dev/updatesubwork`,
//                                               {
//                                                 workid: task.id,
//                                                 userid: allinfo.id,
//                                               },
//                                               {
//                                                 headers: {
//                                                   Authorization: `Bearer ${localStorage.getItem(
//                                                     "token"
//                                                   )}`,
//                                                   "Content-Type":
//                                                     "application/json",
//                                                 },
//                                               }
//                                             );
//                                             task.assignto = allinfo.id;
//                                             setIsOpen(false);
//                                             setLoading(false);
//                                           } catch (err) {
//                                             alert(err);
//                                           }
//                                         }
//                                       }}
//                                       // Adding a key prop is recommended when rendering lists
//                                       className={`${
//                                         task.assignto == allinfo.id
//                                           ? "bg-green-300"
//                                           : ""
//                                       } block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100`}
//                                     >
//                                       Myself
//                                     </button>
//                                     {invitedusers
//                                       .filter((x) => {
//                                         //console.log(invitedusers[0].name);
//                                         return x.accepted === true;
//                                       })
//                                       .map((x) => (
//                                         <button
//                                           onClick={async () => {
//                                             //task id
//                                             //parentid
//                                             //x.user.id
//                                             if (parentId == null) {
//                                               try {
//                                                 setLoading(true);
//                                                 const res = await axios.post(
//                                                   `https://honoprisma.codessahil.workers.dev/updatework`,
//                                                   {
//                                                     workid: task.id,
//                                                     userid: x.user.id,
//                                                   },
//                                                   {
//                                                     headers: {
//                                                       Authorization: `Bearer ${localStorage.getItem(
//                                                         "token"
//                                                       )}`,
//                                                       "Content-Type":
//                                                         "application/json",
//                                                     },
//                                                   }
//                                                 );
//                                                 task.assignto = x.user.id;
//                                                 setIsOpen(false);
//                                                 setLoading(false);
//                                               } catch (err) {
//                                                 alert(err);
//                                               }
//                                             } else {
//                                               try {
//                                                 setLoading(true);
//                                                 const res = await axios.post(
//                                                   `https://honoprisma.codessahil.workers.dev/updatesubwork`,
//                                                   {
//                                                     workid: task.id,
//                                                     userid: x.user.id,
//                                                   },
//                                                   {
//                                                     headers: {
//                                                       Authorization: `Bearer ${localStorage.getItem(
//                                                         "token"
//                                                       )}`,
//                                                       "Content-Type":
//                                                         "application/json",
//                                                     },
//                                                   }
//                                                 );

//                                                 task.assignto = x.user.id;
//                                                 setIsOpen(false);
//                                                 setLoading(false);
//                                               } catch (err) {
//                                                 alert(err);
//                                               }
//                                             }
//                                           }}
//                                           key={x.id} // Adding a key prop is recommended when rendering lists
//                                           className={`${
//                                             task.assignto == x.user.id
//                                               ? "bg-green-300"
//                                               : ""
//                                           } block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100`}
//                                         >
//                                           {x.user.name}
//                                         </button>
//                                       ))}
//                                   </div>
//                                 </div>
//                               )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   {(task.description || isediting === task.id) && (
//                     <div className="pr-2 pt-1">
//                       <textarea
//                         onChange={(e) => {
//                           setDescription(e.target.value);
//                         }}
//                         className={`${
//                           task.completed == false ? "bg-while" : "bg-green-100"
//                         } ml-2 p-1 border rounded w-full`}
//                         placeholder="Task description"
//                         value={
//                           isediting && isediting === task.id
//                             ? description
//                             : task.description
//                         }
//                         readOnly={isediting !== task.id}
//                       />
//                     </div>
//                   )}
//                   {/* Render subtasks */}
//                   {task.subtasks && task.subtasks.length > 0 && (
//                     <div className="mt-2 pl-6 border-l border-gray-300">
//                       {renderTasks(task.subtasks, task.id)}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     );
//   };
//   const LoadingIndicator = () => (
//     <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
//       <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
//     </div>
//   );
//   return (
//     <div className="p-2 pl-1 smd:pl-2 pt-5">
//       <h2 className="text-xl font-bold mb-4">{projectTitle}</h2>
//       <div>{renderTasks(tasks)}</div>
//       {loading  && <LoadingIndicator />}
//       <div className={`flex justify-center ${projectData.user_id == parseInt(allinfo.id)?"flex justify-center":"hidden"}`}>
//         <button
//           onClick={() => {
//             setShowinfo1(true);
//           }}
//           className="mt-4 mb-4"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke-width="1.5"
//             stroke="currentColor"
//             class="size-6"
//           >
//             <path
//               stroke-linecap="round"
//               stroke-linejoin="round"
//               d="M12 4.5v15m7.5-7.5h-15"
//             />
//           </svg>
//         </button>
//       </div>
//     </div>
//   );
// }

// function ShowingInfo({ setRefresh, showinfoofid, id, setShowinfo }) {
//   const [title, setTitle] = useState("");
//   const [description, setDiscription] = useState("");
//   const [loading, setLoading] = useState(false);
//   const inputRef = useRef(null);

//   useEffect(() => { inputRef.current.focus(); }, []);
//   //console.log(showinfoofid);
//   if (loading) {
//     return (
//       <div>
//         {/* <LoadingIndicator></LoadingIndicator> */}
//         <div className="flex justify-center bg-gray-50">
//           <div className="flex flex-col justify-center"></div>
//           Loading....
//         </div>
//       </div>
//     );
//   }
//   return (
//     <div>
//       {!loading && (
//         <div className=" text-slate-700 pb-2 smd:w-80 md:w-96">
//           <label
//             for="email"
//             class="block mb-1 text-sm font-medium text-gray-900 "
//           >
//             subtask title
//           </label>
//           <input
//             onChange={(e) => {
//               setTitle(e.target.value);
//             }}
//             type="email"
//             ref={inputRef}
//             id="email"
//             className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 placeholder-gray-400 dark:text-white focus:ring-blue-500 focus:border-blue-500"
//             placeholder="you title"
//           />
//           <label
//             for="email"
//             class="block mb-1 text-sm font-medium text-gray-900 "
//           >
//             subtask description
//           </label>
//           <textarea
//             onChange={(e) => {
//               setDiscription(e.target.value);
//             }}
//             type="email"
//             id="email"
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 placeholder-gray-400 dark:text-white focus:ring-blue-500 focus:border-blue-500"
//             placeholder="your discription"
//           />
//           <button
//             onClick={async () => {
//               setLoading(true);
//               //setShowinfo(false);
//               try {
//                 const res = await axios.post(
//                   `https://honoprisma.codessahil.workers.dev/addsubwork`,
//                   {
//                     work_id: showinfoofid,
//                     title: title,
//                     description: description,
//                     project_id: parseInt(id),
//                   },
//                   {
//                     headers: {
//                       Authorization: `Bearer ${localStorage.getItem("token")}`,
//                       "Content-Type": "application/json",
//                     },
//                   }
//                 );
//                 setLoading(false);
//                 setRefresh((x) => !x);
//                 setShowinfo(false);
//               } catch (err) {
//                 setShowinfo(true);
//                 alert(err);
//               }
//             }}
//             type="submit"
//             class="mt-2 text-white focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
//           >
//             Submit
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// function ShowingInfo1({ setRefresh, id, setShowinfo1 }) {
//   const [title, setTitle] = useState("");
//   const [description, setDiscription] = useState("");
//   const [loading, setLoading] = useState(false);
//   const inputRef = useRef(null);

//   useEffect(() => { inputRef.current.focus(); }, []);
//   if (loading) {
//     return (
//       <div>
//         {/* <LoadingIndicator></LoadingIndicator> */}
//         <div className="flex justify-center bg-gray-50">
//           <div className="flex flex-col justify-center"></div>
//           Loading....
//         </div>
//       </div>
//     );
//   }
//   return (
//     <div>
//       {!loading && (
//         <div className=" text-slate-700 pb-2 smd:w-80 md:w-96">
//           <label class="block mb-1 text-sm font-medium text-gray-900 ">
//             title
//           </label>
//           <input
//             onChange={(e) => {
//               setTitle(e.target.value);
//             }}
//             type="email"
//             ref={inputRef}
//             id="email"
//             className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 placeholder-gray-400 dark:text-white focus:ring-blue-500 focus:border-blue-500"
//             placeholder="you title"
//           />
//           <label
//             for="email"
//             class="block mb-1 text-sm font-medium text-gray-900 "
//           >
//             description
//           </label>
//           <textarea
//             onChange={(e) => {
//               setDiscription(e.target.value);
//             }}
//             type="email"
//             id="email"
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 placeholder-gray-400 dark:text-white focus:ring-blue-500 focus:border-blue-500"
//             placeholder="your discription"
//           />
//           <button
//             onClick={async () => {
//               setLoading(true);
//               //setShowinfo(false);
//               try {
//                 const res = await axios.post(
//                   `https://honoprisma.codessahil.workers.dev/addwork`,
//                   {
//                     title: title,
//                     description: description,
//                     project_id: parseInt(id),
//                   },
//                   {
//                     headers: {
//                       Authorization: `Bearer ${localStorage.getItem("token")}`,
//                       "Content-Type": "application/json",
//                     },
//                   }
//                 );
//                 setLoading(false);
//                 setRefresh((x) => !x);
//                 setShowinfo1(false);
//               } catch (err) {
//                 setShowinfo1(true);
//                 alert(err);
//               }
//             }}
//             type="submit"
//             class="mt-2 text-white focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
//           >
//             Submit
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// const LoadingIndicator = () => (
//   <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50 bg-transparent">
//     <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
//   </div>
// );

// export default ProjectTaskManager;




