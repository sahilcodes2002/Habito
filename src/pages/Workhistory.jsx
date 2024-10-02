import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


function WorkDurationGraph({ data }) {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [infofordate, setinfofordate] = useState({});
  const [showinfo, setShowinfo] = useState(false);

  const calculatePercentage = (hoursWorked, minsWorked) => {
    const totalMinutesWorked = hoursWorked * 60 + minsWorked;
    const percentage = (totalMinutesWorked / (24 * 60)) * 100;
    if(percentage > 100){
      return 100;
    }
    return percentage;
  };

  useEffect(() => {
    if(!localStorage.getItem('token')){
      navigate('/')
    }
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  const groupedData = data.reduce((acc, current) => {
    //console.log(current);
    const date1 = new Date(current.dateCreated);
      var day = date1.getDate().toString(); 
    var month = (date1.getMonth() + 1).toString(); 
    var year = date1.getFullYear().toString();
    const date  = month+'/'+day+'/'+year; 
    //console.log(current.dateCreated);
    //console.log(date);
    if (!acc[date]) {
      acc[date] = { totalMinutes: 0, entries: [] };
    }
    acc[date].entries.push(current);
    acc[date].totalMinutes += current.hoursWorked * 60 + current.minsWorked;
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedData).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  const sections = [];
  let x = 5;
  if (screenWidth <= 640) {
    x = 5;
  } else if (screenWidth <= 768) {
    x = 8;
  } else if (screenWidth <= 850) {
    x = 11;
  } else if (screenWidth <= 950) {
    x = 12;
  } else if (screenWidth <= 1050) {
    x = 13;
  } else {
    x = 15;
  }
  for (let i = 0; i < Math.min(3, Math.ceil(sortedDates.length / x)); i++) {
    const sectionData = sortedDates.slice(i * x, (i + 1) * x);
    sections.push(sectionData);
  }
  //console.log(sections);

  return (
    <div className="flex flex-col items-center justify-center space-y-12">
      {showinfo && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded shadow-lg relative">
            <button
              onClick={() => setShowinfo(false)}
              className="absolute top-2 right-2 text-gray-600"
            >
              ✕
            </button>
            <ShowingInfo data={data} infofordate={infofordate} />
          </div>
        </div>
      )}
      {sections.map((section, sectionIndex) => (
        <div
          key={sectionIndex}
          className="border border-slate-500 rounded bg-slate-400 p-4 flex space-x-3"
        >
          {section.map((date, index) => {
            const dat = date.split("/");
            const percentage = calculatePercentage(
              Math.floor(groupedData[date].totalMinutes / 60),
              groupedData[date].totalMinutes % 60
            );
            return (
              <div key={index} className="flex flex-col items-center">
                <button
                  onClick={() => {
                    const tdate = date.split("/");
                    const day = parseInt(tdate[1]);
                    const month = parseInt(tdate[0]);
                    const year = parseInt(tdate[2]);
                    setinfofordate({ day, month, year });
                    setShowinfo(true);
                  }}
                >
                  <div
                    className="w-3 text-[11px] bg-gray-300 relative"
                    style={{ height: "240px" }}
                  >
                    <div className="flex pt-24 justify-center align-middle">
                      <div>
                        <div className="text-black transform -rotate-90 inline-block">
                          {percentage.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                    <div
                      className="bg-green-500 opacity-40 absolute bottom-0 left-0 w-full"
                      style={{ height: `${percentage}%` }}
                    ></div>
                  </div>
                </button>
                <span className="text-[10px] mt-2">
                  {dat[1].length === 1 ? "0" : ""}
                  {dat[1]}/{dat[0].length === 1 ? "0" : ""}
                  {dat[0]}/{dat[2]}
                </span>
                <span className="text-[10px] mt-2">
                  {(groupedData[date].totalMinutes / 60).toFixed(0)}
                  {(groupedData[date].totalMinutes / 60).toFixed(0) > 1
                    ? "hrs"
                    : "hr"}{" "}
                  {groupedData[date].totalMinutes % 60}
                  {groupedData[date].totalMinutes % 60 > 1 ? "mins" : "min"}
                </span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function ShowingInfo({ data, infofordate }) {
  return (
    <div>
      <div className=" text-slate-700 pb-2">
        
        {infofordate.day}/{infofordate.month}/{infofordate.year}
        
      </div>
      {data.map((x) => {
        const date = new Date(x.dateCreated);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        
        if (
          day === infofordate.day &&
          month === infofordate.month &&
          year === infofordate.year
        ) {
          //console.log(day+" "+month+" "+" "+year);
          return (
            <div key={x.id} className=" border-b mb-[2px] text-black justify-between ">
              <div className="flex space-x-10">
                <div>{x.name}</div>
                <div>-</div>
                <div>
                  {x.hoursWorked}
                  {x.hoursWorked > 1 ? "hrs" : "hr"} {x.minsWorked}
                  {x.minsWorked > 1 ? "mins" : "min"}
                </div>
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

export function Workhistory() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [backendData, setbackendData] = useState({});



  useEffect(() => {
    if(!localStorage.getItem('token')){
      navigate('/')
    }
    setLoading(true);
    async function getdata() {
        setLoading(true);
      try {
        const response = await axios.post(
          "https://honoprisma.codessahil.workers.dev/getworkhistory",{},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        //console.log(response.data);
        setbackendData(response.data);

        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    }
    getdata();
  },[]);
  const backendData1 = {
    res: [
      {
        id: 1,
        name: "adgdagadr",
        user_id: 5,
        hoursWorked: 3,
        minsWorked: 30,
        startHour: 16,
        startMinute: 38,
        endHour: 16,
        endMinute: 38,
        dateCreated: "2024-08-30T11:11:33.310Z",
      },
      {
        id: 2,
        name: "adgdagadr",
        user_id: 5,
        hoursWorked: 5,
        minsWorked: 0,
        startHour: 16,
        startMinute: 38,
        endHour: 16,
        endMinute: 38,
        dateCreated: "2024-08-29T11:11:47.417Z",
      },
      {
        id: 3,
        name: "adgdagadr",
        user_id: 5,
        hoursWorked: 0,
        minsWorked: 9,
        startHour: 16,
        startMinute: 38,
        endHour: 16,
        endMinute: 38,
        dateCreated: "2024-08-28T11:13:03.182Z",
      },
      {
        id: 3,
        name: "adgdagadr",
        user_id: 5,
        hoursWorked: 0,
        minsWorked: 3,
        startHour: 16,
        startMinute: 38,
        endHour: 16,
        endMinute: 38,
        dateCreated: "2024-08-27T11:13:03.182Z",
      },
      {
        id: 3,
        name: "adgdagadr",
        user_id: 5,
        hoursWorked: 4,
        minsWorked: 0,
        startHour: 16,
        startMinute: 38,
        endHour: 16,
        endMinute: 38,
        dateCreated: "2024-08-26T11:13:03.182Z",
      },
      {
        id: 3,
        name: "adgdagadr",
        user_id: 5,
        hoursWorked: 5,
        minsWorked: 0,
        startHour: 16,
        startMinute: 38,
        endHour: 16,
        endMinute: 38,
        dateCreated: "2024-08-25T11:13:03.182Z",
      },
      {
        id: 3,
        name: "adgdagadr",
        user_id: 5,
        hoursWorked: 4,
        minsWorked: 45,
        startHour: 16,
        startMinute: 38,
        endHour: 16,
        endMinute: 38,
        dateCreated: "2024-08-25T11:13:03.182Z",
      },
      {
        id: 3,
        name: "adgdagadr",
        user_id: 5,
        hoursWorked: 2,
        minsWorked: 0,
        startHour: 16,
        startMinute: 38,
        endHour: 16,
        endMinute: 38,
        dateCreated: "2024-08-24T11:13:03.182Z",
      },
      {
        id: 3,
        name: "adgdagadr",
        user_id: 5,
        hoursWorked: 4,
        minsWorked: 0,
        startHour: 16,
        startMinute: 38,
        endHour: 16,
        endMinute: 38,
        dateCreated: "2024-08-23T11:13:03.182Z",
      },
      {
        id: 3,
        name: "adgdagadr",
        user_id: 5,
        hoursWorked: 4,
        minsWorked: 0,
        startHour: 16,
        startMinute: 38,
        endHour: 16,
        endMinute: 38,
        dateCreated: "2024-08-22T11:13:03.182Z",
      },
      {
        id: 3,
        name: "adgdagadr",
        user_id: 5,
        hoursWorked: 4,
        minsWorked: 0,
        startHour: 16,
        startMinute: 38,
        endHour: 16,
        endMinute: 38,
        dateCreated: "2024-08-21T11:13:03.182Z",
      },
      {
        id: 3,
        name: "adgdagadr",
        user_id: 5,
        hoursWorked: 4,
        minsWorked: 0,
        startHour: 16,
        startMinute: 38,
        endHour: 16,
        endMinute: 38,
        dateCreated: "2024-08-20T11:13:03.182Z",
      },
      {
        id: 3,
        name: "adgdagadr",
        user_id: 5,
        hoursWorked: 4,
        minsWorked: 0,
        startHour: 16,
        startMinute: 38,
        endHour: 16,
        endMinute: 38,
        dateCreated: "2024-08-19T11:13:03.182Z",
      },
      {
        id: 3,
        name: "adgdagadr",
        user_id: 5,
        hoursWorked: 4,
        minsWorked: 0,
        startHour: 16,
        startMinute: 38,
        endHour: 16,
        endMinute: 38,
        dateCreated: "2024-08-18T11:13:03.182Z",
      },
      {
        id: 3,
        name: "adgdagadr",
        user_id: 5,
        hoursWorked: 4,
        minsWorked: 0,
        startHour: 16,
        startMinute: 38,
        endHour: 16,
        endMinute: 38,
        dateCreated: "2024-08-17T11:13:03.182Z",
      },
      {
        id: 3,
        name: "adgdagadr",
        user_id: 5,
        hoursWorked: 4,
        minsWorked: 0,
        startHour: 16,
        startMinute: 38,
        endHour: 16,
        endMinute: 38,
        dateCreated: "2024-08-16T11:13:03.182Z",
      },
      {
        id: 3,
        name: "adgdagadr",
        user_id: 5,
        hoursWorked: 4,
        minsWorked: 0,
        startHour: 16,
        startMinute: 38,
        endHour: 16,
        endMinute: 38,
        dateCreated: "2024-08-15T11:13:03.182Z",
      },
      {
        id: 3,
        name: "adgdagadr",
        user_id: 5,
        hoursWorked: 4,
        minsWorked: 0,
        startHour: 16,
        startMinute: 38,
        endHour: 16,
        endMinute: 38,
        dateCreated: "2024-08-14T11:13:03.182Z",
      },
      {
        id: 3,
        name: "adgdagadr",
        user_id: 5,
        hoursWorked: 4,
        minsWorked: 0,
        startHour: 16,
        startMinute: 38,
        endHour: 16,
        endMinute: 38,
        dateCreated: "2024-08-16T11:13:03.182Z",
      },
      {
        id: 3,
        name: "adgdagadr",
        user_id: 5,
        hoursWorked: 4,
        minsWorked: 0,
        startHour: 16,
        startMinute: 38,
        endHour: 16,
        endMinute: 38,
        dateCreated: "2024-08-13T11:13:03.182Z",
      },
      {
        id: 3,
        name: "adgdagadr",
        user_id: 5,
        hoursWorked: 4,
        minsWorked: 0,
        startHour: 16,
        startMinute: 38,
        endHour: 16,
        endMinute: 38,
        dateCreated: "2024-08-12T11:13:03.182Z",
      },
      {
        id: 3,
        name: "adgdagadr",
        user_id: 5,
        hoursWorked: 4,
        minsWorked: 0,
        startHour: 16,
        startMinute: 38,
        endHour: 16,
        endMinute: 38,
        dateCreated: "2024-08-11T11:13:03.182Z",
      },
      {
        id: 3,
        name: "adgdagadr",
        user_id: 5,
        hoursWorked: 4,
        minsWorked: 0,
        startHour: 16,
        startMinute: 38,
        endHour: 16,
        endMinute: 38,
        dateCreated: "2024-08-10T11:13:03.182Z",
      },
      {
        id: 3,
        name: "adgdagadr",
        user_id: 5,
        hoursWorked: 4,
        minsWorked: 0,
        startHour: 16,
        startMinute: 38,
        endHour: 16,
        endMinute: 38,
        dateCreated: "2024-08-09T11:13:03.182Z",
      },
      {
        id: 3,
        name: "adgdagadr",
        user_id: 5,
        hoursWorked: 4,
        minsWorked: 0,
        startHour: 16,
        startMinute: 38,
        endHour: 16,
        endMinute: 38,
        dateCreated: "2024-08-08T11:13:03.182Z",
      },
      {
        id: 3,
        name: "adgdagadr",
        user_id: 5,
        hoursWorked: 4,
        minsWorked: 0,
        startHour: 16,
        startMinute: 38,
        endHour: 16,
        endMinute: 38,
        dateCreated: "2024-08-07T11:13:03.182Z",
      },
      {
        id: 3,
        name: "adgdagadr",
        user_id: 5,
        hoursWorked: 4,
        minsWorked: 0,
        startHour: 16,
        startMinute: 38,
        endHour: 16,
        endMinute: 38,
        dateCreated: "2024-08-06T11:13:03.182Z",
      },
      {
        id: 3,
        name: "adgdagadr",
        user_id: 5,
        hoursWorked: 4,
        minsWorked: 0,
        startHour: 16,
        startMinute: 38,
        endHour: 16,
        endMinute: 38,
        dateCreated: "2024-08-05T11:13:03.182Z",
      },
      {
        id: 3,
        name: "adgdagadr",
        user_id: 5,
        hoursWorked: 4,
        minsWorked: 0,
        startHour: 16,
        startMinute: 38,
        endHour: 16,
        endMinute: 38,
        dateCreated: "2024-08-04T11:13:03.182Z",
      },
      {
        id: 3,
        name: "adgdagadr",
        user_id: 5,
        hoursWorked: 4,
        minsWorked: 0,
        startHour: 16,
        startMinute: 38,
        endHour: 16,
        endMinute: 38,
        dateCreated: "2024-08-03T11:13:03.182Z",
      },
      {
        id: 3,
        name: "adgdagadr",
        user_id: 5,
        hoursWorked: 4,
        minsWorked: 0,
        startHour: 16,
        startMinute: 38,
        endHour: 16,
        endMinute: 38,
        dateCreated: "2024-08-02T11:13:03.182Z",
      },
      {
        id: 3,
        name: "adgdagadr",
        user_id: 5,
        hoursWorked: 4,
        minsWorked: 0,
        startHour: 16,
        startMinute: 38,
        endHour: 16,
        endMinute: 38,
        dateCreated: "2024-08-01T11:13:03.182Z",
      },
      {
        id: 3,
        name: "adgdagadr",
        user_id: 5,
        hoursWorked: 4,
        minsWorked: 0,
        startHour: 16,
        startMinute: 38,
        endHour: 16,
        endMinute: 38,
        dateCreated: "2024-07-30T11:13:03.182Z",
      },
      {
        id: 3,
        name: "adgdagadr",
        user_id: 5,
        hoursWorked: 4,
        minsWorked: 0,
        startHour: 16,
        startMinute: 38,
        endHour: 16,
        endMinute: 38,
        dateCreated: "2024-07-29T11:13:03.182Z",
      },
      {
        id: 3,
        name: "boob press",
        user_id: 5,
        hoursWorked: 3,
        minsWorked: 0,
        startHour: 16,
        startMinute: 38,
        endHour: 16,
        endMinute: 38,
        dateCreated: "2024-08-30T11:13:03.182Z",
      }
    ]
  }


const LoadingIndicator = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
      <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
    </div>
  );

if(loading){
    return<div>
        <LoadingIndicator></LoadingIndicator>
    </div>
}

  return (
    <div className="bg-zinc-700 h-screen">
        <div className="bg-zinc-700 text-white  p-1 pb-3 ">
      <div>
        <button
          className=" mt-2 ml-1"
          onClick={() => {
            navigate("/dashboard");
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
      <h1 className="mt-6 text-2xl text-center text-white font-bold mb-10">
        The Daily Grind
      </h1>
      <WorkDurationGraph data={backendData.res} />
    </div>
    </div>
  );
}
