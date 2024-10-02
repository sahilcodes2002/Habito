import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProjectOptions() {
    const navigate  = useNavigate();
    const [projectcout, setprojectcount] = useState(0);
    const [assigned, setAssignedcount] = useState(0);

    useEffect(()=>{
        if(!localStorage.getItem('token')){
            navigate('/')
          }
        async function getcount(){
            const res  = await axios.get('https://honoprisma.codessahil.workers.dev/getprojectcounts',{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                }
            })
            //console.log(res);
            setprojectcount(res.data.createdProjectsCount);
            setAssignedcount(res.data.assignedProjectsCount);
            
        }
        getcount();
    },[])
    return (
        <div className="relative h-screen w-screen">
            {/* SVG Button */}
            <button onClick={()=>{
                navigate('/dashboard')
            }} className="absolute top-4 left-4 p-2 bg-gray-200 rounded-full shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 text-gray-700">
                    <g data-name="play back circle">
                        <path d="M12 0a12 12 0 1 0 12 12A12 12 0 0 0 12 0zm0 22a10 10 0 1 1 10-10 10 10 0 0 1-10 10z"/>
                        <path d="M15 6H7a1 1 0 0 0 0 2h8a3 3 0 0 1 0 6H9.41l1.3-1.29a1 1 0 0 0-1.42-1.42C6 14.57 6.18 14.36 6.08 14.62a1 1 0 0 0 .21 1.09C9.41 18.82 9.42 19 10 19a1 1 0 0 0 .71-1.71L9.41 16H15a5 5 0 0 0 0-10z"/>
                    </g>
                </svg>

                
            </button>

            {/* Project Options */}
            <div className="flex justify-center items-center h-full w-full ">
                <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8">
                    <div
                        className="relative w-64 h-64 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-lg shadow-lg cursor-pointer hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                         onClick={()=>{
                            navigate('/userprojects')
                         }}
                    >
                        <div className="absolute top-0 right-0 m-3 bg-red-600 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                            {projectcout}
                        </div>
                        <div className="flex flex-col justify-center items-center h-full text-center">
                            <h2 className="text-2xl font-semibold">Your Projects</h2>
                        </div>
                    </div>

                    <div
                        className="relative w-64 h-64 bg-gradient-to-br from-green-500 to-green-700 text-white rounded-lg shadow-lg cursor-pointer hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                        onClick={()=>{
                            navigate('/assignedprojects')
                         }}
                    >
                        <div className="absolute top-0 right-0 m-3 bg-red-600 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                            {assigned}
                        </div>
                        <div className="flex flex-col justify-center items-center h-full text-center">
                            <h2 className="text-2xl font-semibold px-2">Assigned Projects</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectOptions;
