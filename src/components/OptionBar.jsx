import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { allitems } from '../store/atoms/allcards';
export function Optionbar() {
    const navigate  = useNavigate();
    const [allitm,setAllitems] = useRecoilState(allitems);
  return (
    <div className="w-full  lg:hidden h-16 bg-gray-900 text-white flex items-center justify-between px-1">
      <h1 className="hidden md:flex text-2xl font-semibold">My Chits</h1>
      <div className="flex text-xs md:text-sm space-x-4">
        <button
          onClick={() => {
            setAllitems(item => !item);
          }}
          className="hover:bg-gray-700 px-4 border-2 border-inherit py-2 rounded"
        >
          {allitm ? 'All Cards' : 'Create New'}
        </button>
        <Link to="/settings" className="hover:bg-gray-700 px-4 py-2 rounded">
          Settings
        </Link>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("userinfo");
            navigate('/signin');
          }}
          className="hover:bg-gray-700 px-4 py-2 rounded"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
