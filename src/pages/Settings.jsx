import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { info } from '../store/atoms/userinfo';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';

export function Settings() {
  const [modalType, setModalType] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [allInfo,setInfo] = useRecoilState(info);
  const navigate = useNavigate();

  useEffect(()=>{
    if(!localStorage.getItem('token')){
      navigate('/')
    }
  },[])
  const handleOpenModal = (type) => {
    setModalType(type);
    setInputValue('');
  };

  const handleCloseModal = () => {
    setModalType(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Here you would make an API request to update the corresponding field
    try {
      let response;
      if (modalType === 'password') {
        //console.log(allInfo.id);
        response = await axios.post('https://honoprisma.codessahil.workers.dev/updateuserpassword', { id:allInfo.id,password: inputValue },{headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          }});
      } else if (modalType === 'username') {
        response = await axios.post('https://honoprisma.codessahil.workers.dev/updateuserusername', { id:allInfo.id,username: inputValue },{headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          }});

          localStorage.setItem("token", response.data.token);
      } else if (modalType === 'name') {
        response = await axios.post('https://honoprisma.codessahil.workers.dev/updateusername', { id:allInfo.id,name: inputValue },{headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          }});
      }
      //console.log(response.data);
      setInfo({
        id:response.data.res.id,
        name:response.data.res.name,
        username:response.data.res.username
    })
      handleCloseModal();
    } catch (error) {
      console.error('Error updating information', error);
    } finally {
        
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center">
        <button className='m-5 p-3 border-2 border-inherit rounded-xl text-3xl' onClick={()=>{
            navigate('/dashboard')
        }}>Back</button>
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <div className="w-full max-w-md space-y-4">
        <button
          onClick={() => handleOpenModal('password')}
          className="w-full py-2 px-4 bg-gray-800 rounded hover:bg-gray-700 transition"
        >
          Change Password
        </button>
        <button
          onClick={() => handleOpenModal('username')}
          className="w-full py-2 px-4 bg-gray-800 rounded hover:bg-gray-700 transition"
        >
          Change Username
        </button>
        <button
          onClick={() => handleOpenModal('name')}
          className="w-full py-2 px-4 bg-gray-800 rounded hover:bg-gray-700 transition"
        >
          Change Name
        </button>
      </div>

      {modalType && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-gray-900 p-8 rounded shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {`Change ${modalType.charAt(0).toUpperCase() + modalType.slice(1)}`}
            </h2>
            <input
              type={modalType === 'password' ? 'password' : 'text'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full p-2 mb-4 text-gray-900 rounded"
              placeholder={`Enter new ${modalType}`}
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCloseModal}
                className="py-2 px-4 bg-gray-700 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="py-2 px-4 bg-blue-600 rounded hover:bg-blue-500 transition"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
