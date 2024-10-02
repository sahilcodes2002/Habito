import axios from "axios";
import { useEffect, useState } from "react";
import { info } from "../store/atoms/userinfo";
import { allusers } from "../store/atoms/contacts";
import { useRecoilState, useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
export function Notifications() {
  const [nots, setNots] = useState([]);
  const [AllUsers, setAllUsers] = useRecoilState(allusers);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [allinfo, setinfo] = useRecoilState(info);
  const navigate = useNavigate();

  useEffect(() => {
    if(!localStorage.getItem('token')){
      navigate('/')
    }
    async function getnotifs() {
      setLoading(true);
      try {
        const response = await axios.get("https://honoprisma.codessahil.workers.dev/getnotifs", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        setLoading(false);

        setNots(response.data.res);
        //console.log(response.data);
      } catch (err) {
        alert(err);
      }
    }

    async function callawaits() {
      await getnotifs();
      await fetchAllUsers();
    }

    callawaits();
  }, []);

  const fetchAllUsers = async () => {
    setLoading1(true);
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
      setLoading1(false);
      //console.log(response.data.res);
      setAllUsers(response.data.res);
    } catch (error) {
      console.error("Error fetching all users:", error);
    }
  };

  const LoadingIndicator = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
      <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
    </div>
  );

  if (loading || loading1) {
    return <div><LoadingIndicator></LoadingIndicator></div>;
  }

  return (
    <div>
      <div className="fixed top-4 right-2" onClick={()=>{
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
      <div className=" bg-neutral-100 pt-2 pb-5 text-center text-4xl font-serif ">
        Invitations
      </div>
      <div >
                  <div className="flex bg-neutral-100 justify-between p-2">
                    <div className="font-semibold">Title</div>
                    <div className="font-semibold">Invited by</div>
                    <div className="flex space-x-2">
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
                            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      </div>
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
                            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <hr></hr>
                <hr></hr>
                <hr></hr>
      <div className="">
        {nots.map((x, index) => {
          for (const it of AllUsers) {
            if (it.id == x.user_id) {
                
              return (
                <div key={index} >
                  <div className="flex justify-between p-2 pb-3">
                    <div>{x.title}</div>
                    <div>{it.name}</div>
                    <div className="flex space-x-2">
                      <div
                        onClick={async () => {
                          var invited = 0;
                          for (const y of x.projectinvite) {
                            if (y.user_id == allinfo.id) {
                              invited = y.id;
                            }
                          }
                          const response = await axios.post(
                            `https://honoprisma.codessahil.workers.dev/acceptinvite`,
                            {
                              id: invited,
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

                          //console.log(nots);
                          setNots((prevNots) =>
                            prevNots.filter((notif) => notif.id !== x.id)
                          );
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
                            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      </div>
                      <div
                        onClick={async () => {
                          var invited = 0;
                          for (const y of x.projectinvite) {
                            if (y.user_id == allinfo.id) {
                              invited = y.id;
                            }
                          }
                          const res = await axios.post(
                            `https://honoprisma.codessahil.workers.dev/removeinvite`,
                            {
                              id: invited,
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
                          //console.log(nots);
                          setNots((prevNots) =>
                            prevNots.filter((notif) => notif.id !== x.id)
                          );
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
                            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <hr></hr>
                </div>
                
              );
            }
          }
        })}
      </div>
    </div>
  );
}
