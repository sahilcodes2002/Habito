import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import designImage from "../images/Design.jpg";
import ss from "../images/ss.png";
import { motion } from 'framer-motion';
import '../index.css'


export function Homepage(){
  const navigate = useNavigate(); 
  useEffect(()=>{
    const token  = localStorage.getItem("token");
    if(token){
      //console.log(token);
      navigate("/dashboard")
    }
  },[])
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Top Bar Section */}
      <header className="h-screen bg-white  pb-2">
      
        <div className='py-4 px-6 fixed top-0 bg-white left-0 right-0 flex justify-between items-center'>
        <h1 className="text-3xl font-bold text-gray-800"><div className='flex'>
          <span className='flex flex-col justify-center'>
          <img className="h-7 w-7" src={designImage} alt="Design" />
          </span>
          <span style={{ color: 'rgb(63, 222, 156)' }} className='font-sans'>
          Habito
          </span>
          </div></h1>
        <nav>
          <ul className="flex space-x-1 md:space-x-4">
            <li><Link to="/signup"  className="bg-[rgb(47,141,113)]  hover:bg-[rgb(18,107,70)]  text-white py-[15px] px-8 md:py-[15px] md:px-8 rounded-md transition duration-300  font-semibold border-none text-sm"> Try now</Link></li>
            {/* <li><Link to="/signin" className="bg-blue-500 hover:bg-blue-600 text-white  py-2 px-2 md:py-2 md:px-4 rounded-lg transition duration-300 text-xs ">Sign In</Link></li> */}
          </ul>
        </nav>
        </div>
        <br/>
        <br/>
        <br/>
        <br/>
        <div className='md:flex'>
          <div className='flex flex-col justify-center sm:mx-10'>
            <div >
              <div style={{ fontWeight: 650 }} className='font-sans ml-6 leading-tight text-[40px] smd:text-[50px] text-black text-opacity-80'>
                One tool for managing it all, together
              </div>
              <br></br>
              <div style={{ fontWeight: 625 }} className=' ml-6 mr-10 leading-8 text-[27px] text-black text-opacity-80 mb-4'>
              Habito is the task management tool and more..
              </div>
              <br></br>
              <div>
              <Link to="/signup"  className="ml-6 bg-[rgb(47,141,113)]  hover:bg-[rgb(18,107,70)]  text-white py-[16px] px-20 md:py-[16px] md:px-20 rounded-md transition duration-300  font-semibold border-none text-sm"> Try it free</Link>
              </div>
              <br></br>
              <br></br>
            </div>
          </div>
          <div className='px-6 mt-4 rounded-lg '>
          <img className="rounded-md" src={ss} alt="Design" />
          </div>
        </div>
        

      </header>

      {/* Hero Section */}
      <section className="py-7 px-6 md:px-20">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl md:text-5xl font-bold text-gray-800 mb-4"
          >
            Track Your Progress, Important Notes and Collaborate
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg text-gray-600 mb-8"
          >
            Turn Your Goals into Daily Habits, and Achieve More Together with Habito!
          </motion.p>
          <br></br>
          <Link to="/signup" className=" bg-[rgb(47,141,113)]  hover:bg-[rgb(18,107,70)]  text-white py-[15px] px-16 md:py-[15px] md:px-8 rounded-md transition duration-300  font-semibold border-none text-sm">
            Get Started
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-gray-200 py-20 px-6 md:px-20">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl font-bold text-gray-800 mb-4"
          >
            What We Offer
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg text-gray-600 mb-8"
          >
            Habito provides a simple yet powerful platform to:
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-lg bg-white shadow-md"
            >
              <h3 className="text-2xl font-bold mb-4">Track Daily Progress</h3>
              <p className="text-gray-700">Write and store your daily progress, learnings, and achievements. Reflect and review your productivity over time.</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-lg bg-white shadow-md"
            >
              <h3 className="text-2xl font-bold mb-4">Manage Projects and Goals</h3>
              <p className="text-gray-700">Create and efficiently manage your tasks, projects, goals and collaborate with others with our optimal features.</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-lg bg-white shadow-md"
            >
              <h3 className="text-2xl font-bold mb-4">Store Important Notes & Codes</h3>
              <p className="text-gray-700">Save your important notes and code snippets effortlessly. Access them anytime, anywhere with ease.</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-lg bg-white shadow-md"
            >
              <h3 className="text-2xl font-bold mb-4">Regular Reminders</h3>
              <p className="text-gray-700">Set regular reminders effortlessly and stay on top of your tasks. Choose exactly what you want to be reminded about. </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 md:px-20">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl font-bold text-gray-800 mb-8"
          >
            Key Features
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-lg bg-white shadow-md"
            >
              <h3 className="text-2xl font-bold mb-4">Simple and Intuitive Interface</h3>
              <p className="text-gray-700">Easy-to-use interface designed for seamless daily logging and note-taking.</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-lg bg-white shadow-md"
            >
              <h3 className="text-2xl font-bold mb-4">Secure and Private</h3>
              <p className="text-gray-700">Your data is securely stored and accessible only to you. Privacy and data protection are our top priorities.</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-lg bg-white shadow-md"
            >
              <h3 className="text-2xl font-bold mb-4">Collaborative space</h3>
              <p className="text-gray-700">Connect and collaborate in real-time with integrated one-on-one and group chat while working on shared projects and goals.</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-lg bg-white shadow-md"
            >
              <h3 className="text-2xl font-bold mb-4">Mobile Friendly</h3>
              <p className="text-gray-700">Access Habito on-the-go with our responsive design. Works seamlessly on all devices.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sign Up Section */}
      <section id="signup" className="bg-gray-200 py-20 px-6 md:px-20">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl font-bold text-gray-800 mb-8"
          >
            Sign Up Now
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg text-gray-600 mb-8"
          >
            Join thousands of users who are improving their productivity and organization with Habito.
          </motion.p>
          <Link to="/signup"  className="bg-[rgb(47,141,113)]  hover:bg-[rgb(18,107,70)]  text-white py-[15px] px-20 md:py-[15px] md:px-20 rounded-md transition duration-300  font-semibold border-none text-sm"> Try now</Link>
          {/* <Link to="/signup" className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-8 rounded-lg text-lg transition duration-300 inline-block">
            Get Started
          </Link> */}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-gray-300 text-center py-6">
        <p>&copy; 2024 Habito. All rights reserved.</p>
      </footer>
    </div>
  );
};


