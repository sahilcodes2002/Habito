import React, { useEffect, useState, useRef } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useParams } from 'react-router-dom';
import { contacts, allusers, userDetails } from '../store/atoms/contacts';
import axios from 'axios';
import { info } from '../store/atoms/userinfo';
import { useNavigate } from 'react-router-dom';

export function Conversation() {
  const { userId } = useParams(); // Get userId from URL params
  const [messages, setMessages] = useState([]);
  const allUsers = useRecoilValue(allusers);
  const allContacts = useRecoilValue(contacts);
  const [userdetails, setUserDetails] = useRecoilState(userDetails);
  const [newMessage, setNewMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const inf = useRecoilValue(info);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null); // Ref for the textarea



  useEffect(() => {
    if(!localStorage.getItem('token')){
      navigate('/')
    }
    // Fetch current user ID from local storage or API
    const fetchCurrentUserId = async () => {
      setCurrentUserId(inf.id);
    };
    fetchCurrentUserId();

    // Fetch user details based on userId
    const user = allUsers.find(user => user.id === parseInt(userId, 10)) || allContacts.find(user => user.id === parseInt(userId, 10));
    setUserDetails(user);

    // Fetch initial messages
    fetchMessages();

    const id = setInterval(fetchMessages, 3000);
    scrollToBottom();
    return () => {
      clearInterval(id);
    };
  }, [userId, allUsers, allContacts, currentUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Focus on the textarea when messages or busy state change
    if (!busy) {
      inputRef.current.focus();
    }
  }, [messages, busy]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`https://honoprisma.codessahil.workers.dev/getmessages/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      setMessages(response.data.res); 
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim() !== '' && !busy) {
      try {
        setBusy(true);
        const response = await axios.post(`https://honoprisma.codessahil.workers.dev/createmessage`, 
          {
            receiver_id: parseInt(userId, 10), 
            content: newMessage,
          }, 
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        setMessages(prevMessages => [...prevMessages, response.data.res]);
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        setBusy(false);
      }
    }
  };
  
  const handleChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!busy) {
        sendMessage();
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className='fixed flex w-full'>
        <div className='bg-gray-200 mb-4 p-4 flex flex-col justify-center'>
          <div className='flex justify-center'>
            <button onClick={() => navigate('/messages')} className="text-gray-600 hover:text-gray-800 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
        </div>
        <div className="bg-gray-200 p-2 mb-4 flex-1">
          <h2 className="text-xl font-bold">{userdetails ? userdetails.name : 'Loading...'}</h2>
          <div className="text-gray-600">{userdetails ? userdetails.username : 'Loading...'}</div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4" >
        <div >
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
  <div className="bg-gray-300 half-screen-height max-w-md p-6 rounded-lg shadow-lg">
    <h2 class="text-xl font-bold ">welcome to chat.......</h2>
  </div>
</div>
        </div>
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`mb-4 ${message.sender_id === currentUserId ? 'self-end bg-green-200' : 'self-start bg-gray-200'} p-2 rounded-md shadow-md`}
          >
            {message.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="bg-gray-200 p-4">
        <div className="flex">
          <textarea
            ref={inputRef}
            className="flex-1 p-2 rounded-md shadow-md resize-none"
            placeholder="Type your message..."
            value={newMessage}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <button
            className={`ml-2 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none`}
            onClick={() => {
              if (!busy) {
                sendMessage();
              }
            }}
          >
            {'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
