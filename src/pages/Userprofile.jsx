import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Userprofile() {
  const [alluserdata, setAlluserdata] = useState({ projects: [] });
  const [loading, setLoading] = useState(false);
  const [projectdate, setprojectdate] = useState("");
  const navigate = useNavigate();




  useEffect(() => {
    if(!localStorage.getItem('token')){
      navigate('/')
    }
    async function call() {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://honoprisma.codessahil.workers.dev/getuserprojectswithworks`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        setAlluserdata(res.data.res);
        const isoDate = res.data.res.created_at;
        const date = new Date(isoDate);
        setprojectdate(
          date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        );
        //console.log(res.data.res);
        setLoading(false);
      } catch (err) {
        alert(err);
      }
    }

    call();
  }, []);

  const LoadingIndicator = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
      <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
    </div>
  );

  if (loading) {
    return <div>
      <LoadingIndicator></LoadingIndicator>
    </div>;
  }

  return (
    <div>
      <div>
        <div className="fixed top-4 right-2 z-20" onClick={()=>{
            navigate('/dashboard');
        }}>
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
        <div className="fixed left-0 right-0 top-0 z-10 bg-white">
        <div className=" mt-6 text-center text-2xl font-serif"> Profile</div>
        </div>
        <br></br>
        <br></br>
        <br></br>
        <hr></hr>

        <hr></hr>
        <div className="flex  p-4 pb-7 pt-5">
          <div>
            <svg
              className="w-[140px] h-[140px] fill-[#8e8e8e]"
              viewBox="0 0 448 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"></path>
            </svg>
          </div>
          <div className="flex flex-col justify-end space-y-2 smd:space-y-5 text-sm smd:text-md ml-8 smd:ml-20">
            <div className="pb-2">
              <span className="font-semibold">Name:</span> {alluserdata.name}
            </div>
            <div className="pb-2">
              <span className="font-semibold">Username:</span>{" "}
              {alluserdata.username}
            </div>
            <div className="pb-2">
              <span className="font-semibold">Joined on: </span>
              {projectdate}
            </div>
          </div>
        </div>
        <hr></hr>
        <div>
          <div className="font-semibold p-2 text-center text-lg mt-3 mb-2">
            Projects / Goals completion
          </div>
          <div className="grid grid-cols-12">
            {alluserdata.projects.map((x,index) => {
              var num = 0;
              var completed = 0;
              var percentage = 0;
              x.works.map((y) => {
                var found = 1;
                for (const z of x.subworks) {
                  if (z.work_id == y.id) {
                    if (z.completed == true) {
                      completed++;
                    }
                    found = 0;
                    num++;
                  }
                }
                if (found == 1) {
                  if (y.completed == true) {
                    completed++;
                  }
                }
                num += found;
              });
              percentage = parseInt((completed / num) * 100);

              return (
                <div key={index} className="border p-4 mx-6 mb-4 smd:p-4 col-span-12 smd:col-span-6 md:col-span-4">
                  <div className="text-center font-semibold pb-2">
                    {x.title}
                  </div>
                  <div className="pb-2 pl-1">Tasks: {num}</div>
                  <div className="pb-2 pl-1">Completed: {completed}</div>
                  <CompletionLine percentage={percentage}></CompletionLine>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function CompletionLine({ percentage }) {
  return (
    <div
      style={{
        width: "100%",
        height: "10px",
        backgroundColor: "#d3d3d3",
        borderRadius: "5px",
      }}
    >
      <div
        style={{
          width: `${percentage}%`,
          height: "100%",
          backgroundColor: "#4caf50", // Bright color
          borderRadius: "5px",
        }}
      ></div>
    </div>
  );
}
