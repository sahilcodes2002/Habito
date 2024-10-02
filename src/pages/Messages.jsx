import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { contacts, allusers } from '../store/atoms/contacts';
import axios from 'axios';

export function Messages() {
  const [Contacts, setContacts] = useRecoilState(contacts);
  const [AllUsers, setAllUsers] = useRecoilState(allusers);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if(!localStorage.getItem('token')){
      navigate('/')
    }
    fetchContacts();
    fetchAllUsers();
  }, []);

  const LoadingIndicator = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
      <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
    </div>
  );

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://honoprisma.codessahil.workers.dev/getcontacts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      setContacts(response.data.res);
      setLoading(false); 
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://honoprisma.codessahil.workers.dev/getallusers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      setAllUsers(response.data.res);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching all users:', error);
    }
  };

  const handleContactClick = (userId) => {
    navigate(`/conversations/${userId}`);
  };

  const handleNewMessage = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleUserClick = (userId) => {
    navigate(`/conversations/${userId}`);
    setShowModal(false);
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="messages-container bg-gray-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={handleBackToDashboard} className="text-gray-600 hover:text-gray-800 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold">Contacts</h2>
        <button onClick={handleNewMessage} className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none">
          New chat
        </button>
      </div>
      <div className="grid gap-4">
        {loading && <div><LoadingIndicator></LoadingIndicator></div>}
        {Contacts.map(contact => (
          <div key={contact.id} className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-200" onClick={() => handleContactClick(contact.id)}>
            <div className="text-lg font-semibold">{contact.name}</div>
            <div className="text-gray-600">{contact.username}</div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-md max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">select user..</h3>
              <button onClick={handleCloseModal} className="text-gray-600 hover:text-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid gap-2">
              {AllUsers.filter(user => !Contacts.some(contact => contact.id === user.id)).map(user => (
                <div key={user.id} className="bg-gray-100 p-2 rounded-md cursor-pointer hover:bg-gray-200" onClick={() => handleUserClick(user.id)}>
                  <div className="text-lg font-semibold">{user.name}</div>
                  <div className="text-gray-600">{user.username}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
