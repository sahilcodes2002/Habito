import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { allitems } from '../store/atoms/allcards';
export function Sidebar() {
    const navigate  = useNavigate();
    const [allitm,setAllitems] = useRecoilState(allitems);
  return (
    <div className="hidden bg-opacity-30 lg:flex flex-col w-56 h-screen bg-gray-500 text-gray-500 fixed">
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <h1 className="text-2xl font-semibold">My Chits</h1>
      </div>
      <div className="flex-grow flex flex-col justify-between">
        <div className="px-4 py-2">
          <button onClick={()=>{
            setAllitems(item=>!item);
          }} className="block w-48 border-2 border-gray-500 py-2 px-4 hover:bg-gray-700 rounded">
            {allitm ? 'All Cards' : 'Create New'}
          </button>
          <button onClick={()=>{
            navigate('/settings')
          }}  className="block w-48 py-2 px-4 hover:bg-gray-700 rounded">
            Profile Settings
          </button>
          <button onClick={()=>{
            localStorage.removeItem("token");
            localStorage.removeItem("userinfo");
            navigate(`/signin`)
          }} className="block w-48 py-2 px-4 hover:bg-gray-700 rounded">
            log out
          </button>
        </div>
        <div className="px-4 py-2">
          <button 
            className="w-full bg-slate-600 hover:bg-black text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("userinfo");
              window.location.href = '/signin';
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
