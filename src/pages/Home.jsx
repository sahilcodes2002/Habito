// import React, { useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import designImage from "../images/Design.jpg";
// import ss from "../images/ss.png";
// import { motion } from 'framer-motion';
// import '../index.css'


// export function Homepage(){
//   const navigate = useNavigate(); 
//   useEffect(()=>{
//     const token  = localStorage.getItem("token");
//     if(token){
//       //console.log(token);
//       navigate("/dashboard")
//     }
//   },[])
//   return (
//     <div className="bg-gray-100 min-h-screen">
//       {/* Top Bar Section */}
//       <header className="h-screen bg-white  pb-2">
      
//         <div className='py-4 px-6 fixed top-0 bg-white left-0 right-0 flex justify-between items-center'>
//         <h1 className="text-3xl font-bold text-gray-800"><div className='flex'>
//           <span className='flex flex-col justify-center'>
//           <img className="h-7 w-7" src={designImage} alt="Design" />
//           </span>
//           <span style={{ color: 'rgb(63, 222, 156)' }} className='font-sans'>
//           Habito
//           </span>
//           </div></h1>
//         <nav>
//           <ul className="flex space-x-1 md:space-x-4">
//             <li><Link to="/signup"  className="bg-[rgb(47,141,113)]  hover:bg-[rgb(18,107,70)]  text-white py-[15px] px-8 md:py-[15px] md:px-8 rounded-md transition duration-300  font-semibold border-none text-sm"> Try now</Link></li>
//             {/* <li><Link to="/signin" className="bg-blue-500 hover:bg-blue-600 text-white  py-2 px-2 md:py-2 md:px-4 rounded-lg transition duration-300 text-xs ">Sign In</Link></li> */}
//           </ul>
//         </nav>
//         </div>
//         <br/>
//         <br/>
//         <br/>
//         <br/>
//         <div className='md:flex'>
//           <div className='flex flex-col justify-center sm:mx-10'>
//             <div >
//               <div style={{ fontWeight: 650 }} className='font-sans ml-6 leading-tight text-[40px] smd:text-[50px] text-black text-opacity-80'>
//                 One tool for managing it all, together
//               </div>
//               <br></br>
//               <div style={{ fontWeight: 625 }} className=' ml-6 mr-10 leading-8 text-[27px] text-black text-opacity-80 mb-4'>
//               Habito is the task management tool and more..
//               </div>
//               <br></br>
//               <div>
//               <Link to="/signup"  className="ml-6 bg-[rgb(47,141,113)]  hover:bg-[rgb(18,107,70)]  text-white py-[16px] px-20 md:py-[16px] md:px-20 rounded-md transition duration-300  font-semibold border-none text-sm"> Try it free</Link>
//               </div>
//               <br></br>
//               <br></br>
//             </div>
//           </div>
//           <div className='px-6 mt-4 rounded-lg '>
//           <img className="rounded-md" src={ss} alt="Design" />
//           </div>
//         </div>
        

//       </header>

//       {/* Hero Section */}
//       <section className="py-7 px-6 md:px-20">
//         <div className="max-w-3xl mx-auto text-center">
//           <motion.h2
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//             className="text-3xl md:text-5xl font-bold text-gray-800 mb-4"
//           >
//             Track Your Progress, Important Notes and Collaborate
//           </motion.h2>
//           <motion.p
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.4 }}
//             className="text-lg text-gray-600 mb-8"
//           >
//             Turn Your Goals into Daily Habits, and Achieve More Together with Habito!
//           </motion.p>
//           <br></br>
//           <Link to="/signup" className=" bg-[rgb(47,141,113)]  hover:bg-[rgb(18,107,70)]  text-white py-[15px] px-16 md:py-[15px] md:px-8 rounded-md transition duration-300  font-semibold border-none text-sm">
//             Get Started
//           </Link>
//         </div>
//       </section>

//       {/* About Section */}
//       <section id="about" className="bg-gray-200 py-20 px-6 md:px-20">
//         <div className="max-w-3xl mx-auto text-center">
//           <motion.h2
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//             className="text-4xl font-bold text-gray-800 mb-4"
//           >
//             What We Offer
//           </motion.h2>
//           <motion.p
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.4 }}
//             className="text-lg text-gray-600 mb-8"
//           >
//             Habito provides a simple yet powerful platform to:
//           </motion.p>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
//             <motion.div
//               whileHover={{ scale: 1.05 }}
//               className="p-6 rounded-lg bg-white shadow-md"
//             >
//               <h3 className="text-2xl font-bold mb-4">Track Daily Progress</h3>
//               <p className="text-gray-700">Write and store your daily progress, learnings, and achievements. Reflect and review your productivity over time.</p>
//             </motion.div>
//             <motion.div
//               whileHover={{ scale: 1.05 }}
//               className="p-6 rounded-lg bg-white shadow-md"
//             >
//               <h3 className="text-2xl font-bold mb-4">Manage Projects and Goals</h3>
//               <p className="text-gray-700">Create and efficiently manage your tasks, projects, goals and collaborate with others with our optimal features.</p>
//             </motion.div>
//             <motion.div
//               whileHover={{ scale: 1.05 }}
//               className="p-6 rounded-lg bg-white shadow-md"
//             >
//               <h3 className="text-2xl font-bold mb-4">Store Important Notes & Codes</h3>
//               <p className="text-gray-700">Save your important notes and code snippets effortlessly. Access them anytime, anywhere with ease.</p>
//             </motion.div>
//             <motion.div
//               whileHover={{ scale: 1.05 }}
//               className="p-6 rounded-lg bg-white shadow-md"
//             >
//               <h3 className="text-2xl font-bold mb-4">Regular Reminders</h3>
//               <p className="text-gray-700">Set regular reminders effortlessly and stay on top of your tasks. Choose exactly what you want to be reminded about. </p>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section id="features" className="py-20 px-6 md:px-20">
//         <div className="max-w-3xl mx-auto text-center">
//           <motion.h2
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//             className="text-4xl font-bold text-gray-800 mb-8"
//           >
//             Key Features
//           </motion.h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
//             <motion.div
//               whileHover={{ scale: 1.05 }}
//               className="p-6 rounded-lg bg-white shadow-md"
//             >
//               <h3 className="text-2xl font-bold mb-4">Simple and Intuitive Interface</h3>
//               <p className="text-gray-700">Easy-to-use interface designed for seamless daily logging and note-taking.</p>
//             </motion.div>
//             <motion.div
//               whileHover={{ scale: 1.05 }}
//               className="p-6 rounded-lg bg-white shadow-md"
//             >
//               <h3 className="text-2xl font-bold mb-4">Secure and Private</h3>
//               <p className="text-gray-700">Your data is securely stored and accessible only to you. Privacy and data protection are our top priorities.</p>
//             </motion.div>
//             <motion.div
//               whileHover={{ scale: 1.05 }}
//               className="p-6 rounded-lg bg-white shadow-md"
//             >
//               <h3 className="text-2xl font-bold mb-4">Collaborative space</h3>
//               <p className="text-gray-700">Connect and collaborate in real-time with integrated one-on-one and group chat while working on shared projects and goals.</p>
//             </motion.div>
//             <motion.div
//               whileHover={{ scale: 1.05 }}
//               className="p-6 rounded-lg bg-white shadow-md"
//             >
//               <h3 className="text-2xl font-bold mb-4">Mobile Friendly</h3>
//               <p className="text-gray-700">Access Habito on-the-go with our responsive design. Works seamlessly on all devices.</p>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Sign Up Section */}
//       <section id="signup" className="bg-gray-200 py-20 px-6 md:px-20">
//         <div className="max-w-3xl mx-auto text-center">
//           <motion.h2
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//             className="text-4xl font-bold text-gray-800 mb-8"
//           >
//             Sign Up Now
//           </motion.h2>
//           <motion.p
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.4 }}
//             className="text-lg text-gray-600 mb-8"
//           >
//             Join thousands of users who are improving their productivity and organization with Habito.
//           </motion.p>
//           <Link to="/signup"  className="bg-[rgb(47,141,113)]  hover:bg-[rgb(18,107,70)]  text-white py-[15px] px-20 md:py-[15px] md:px-20 rounded-md transition duration-300  font-semibold border-none text-sm"> Try now</Link>
//           {/* <Link to="/signup" className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-8 rounded-lg text-lg transition duration-300 inline-block">
//             Get Started
//           </Link> */}
//         </div>
//       </section>

//       {/* Footer Section */}
//       <footer className="bg-gray-800 text-gray-300 text-center py-6">
//         <p>&copy; 2024 Habito. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import designImage from "../images/Design.jpg";
import ss from "../images/ss.png";
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import '../index.css';

// Animation components
const FadeInWhenVisible = ({ children, delay = 0 }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      transition={{ duration: 0.8, delay }}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 }
      }}
    >
      {children}
    </motion.div>
  );
};

const FeatureCard = ({ title, children, delay }) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.3 }
      }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay }}
      className="p-8 rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300"
    >
      <h3 className="text-2xl font-bold mb-4 text-gray-800">{title}</h3>
      <p className="text-gray-600">{children}</p>
    </motion.div>
  );
};

export function Homepage() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[rgb(47,141,113)] opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 -left-40 w-80 h-80 bg-[rgb(63,222,156)] opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-[rgb(18,107,70)] opacity-10 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4'}`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <img className="h-8 w-8" src={designImage} alt="Design" />
            <span className="text-2xl font-bold bg-gradient-to-r from-[rgb(47,141,113)] to-[rgb(63,222,156)] bg-clip-text text-transparent">
              Habito
            </span>
          </motion.div>
          
          <nav>
            <ul className="flex space-x-4">
              <li>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/signup" 
                    className="bg-gradient-to-r from-[rgb(47,141,113)] to-[rgb(63,222,156)] hover:from-[rgb(18,107,70)] hover:to-[rgb(47,141,113)] text-white py-3 px-6 rounded-full transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
                  >
                    Try now
                  </Link>
                </motion.div>
              </li>
            </ul>
          </nav>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center pt-16 pb-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight mb-6"
              >
                One tool for <span className="bg-gradient-to-r from-[rgb(47,141,113)] to-[rgb(63,222,156)] bg-clip-text text-transparent">managing it all</span>, together
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl text-gray-600 mb-8"
              >
                Habito is the all-in-one task management tool that helps you build better habits, track progress, and collaborate seamlessly.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/signup" 
                    className="bg-gradient-to-r from-[rgb(47,141,113)] to-[rgb(63,222,156)] hover:from-[rgb(18,107,70)] hover:to-[rgb(47,141,113)] text-white py-4 px-8 rounded-full transition-all duration-300 font-semibold shadow-md hover:shadow-lg inline-block text-center"
                  >
                    Get Started Free
                  </Link>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a 
                    href="#demo" 
                    className="border-2 border-[rgb(47,141,113)] text-[rgb(47,141,113)] hover:bg-[rgb(47,141,113)] hover:text-white py-4 px-8 rounded-full transition-all duration-300 font-semibold inline-block text-center"
                  >
                    Watch Demo
                  </a>
                </motion.div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="mt-10 flex items-center space-x-4"
              >
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white"></div>
                  ))}
                </div>
                <p className="text-gray-600">Join <span className="font-semibold text-[rgb(47,141,113)]">10,000+</span> happy users</p>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="md:w-1/2 relative"
            >
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={ss} 
                  alt="Habito Dashboard" 
                  className="w-full h-auto"
                />
              </div>
              
              {/* Floating elements */}
              <motion.div 
                animate={{ 
                  y: [0, -15, 0],
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 6,
                  ease: "easeInOut"
                }}
                className="absolute -top-6 -left-6 bg-white p-4 rounded-xl shadow-lg z-20"
              >
                <div className="w-4 h-4 rounded-full bg-green-400"></div>
              </motion.div>
              
              <motion.div 
                animate={{ 
                  y: [0, 15, 0],
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 5,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg z-20"
              >
                <div className="w-4 h-4 rounded-full bg-blue-400"></div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Logo Cloud Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center text-gray-500 mb-12"
          >
            Trusted by teams at
          </motion.p>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-60">
            {['Company 1', 'Company 2', 'Company 3', 'Company 4', 'Company 5'].map((company, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="h-12 bg-gray-200 rounded-lg flex items-center justify-center"
              >
                {company}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <FadeInWhenVisible>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Why teams choose Habito
              </h2>
            </FadeInWhenVisible>
            
            <FadeInWhenVisible delay={0.2}>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                From habit tracking to project management, Habito provides everything you need to stay organized and productive.
              </p>
            </FadeInWhenVisible>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard title="Track Daily Progress" delay={0.1}>
              Write and store your daily progress, learnings, and achievements. Reflect and review your productivity over time.
            </FeatureCard>
            
            <FeatureCard title="Manage Projects" delay={0.2}>
              Create and efficiently manage your tasks, projects, goals and collaborate with others with our optimal features.
            </FeatureCard>
            
            <FeatureCard title="Store Important Notes" delay={0.3}>
              Save your important notes and code snippets effortlessly. Access them anytime, anywhere with ease.
            </FeatureCard>
            
            <FeatureCard title="Regular Reminders" delay={0.4}>
              Set regular reminders effortlessly and stay on top of your tasks. Choose exactly what you want to be reminded about.
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* Feature Highlight Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <FadeInWhenVisible>
                <h2 className="text-4xl font-bold text-gray-800 mb-6">
                  Simple and intuitive interface
                </h2>
              </FadeInWhenVisible>
              
              <FadeInWhenVisible delay={0.2}>
                <p className="text-xl text-gray-600 mb-6">
                  Our clean design helps you focus on what matters most - building better habits and getting work done.
                </p>
              </FadeInWhenVisible>
              
              <FadeInWhenVisible delay={0.4}>
                <ul className="space-y-4">
                  {['Drag-and-drop functionality', 'Customizable workflows', 'Real-time collaboration', 'Cross-platform sync'].map((item, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                      viewport={{ once: true }}
                      className="flex items-center"
                    >
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </FadeInWhenVisible>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="md:w-1/2 relative"
            >
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="w-full h-80 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Visualize Your Progress</h3>
                    <p className="text-gray-600">See your habits and tasks in beautiful, easy-to-understand charts and graphs.</p>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -left-6 w-32 h-32 rounded-full bg-green-100 opacity-50 z-0"></div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-blue-100 opacity-50 z-0"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <FadeInWhenVisible>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Loved by thousands of users
              </h2>
            </FadeInWhenVisible>
            
            <FadeInWhenVisible delay={0.2}>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Don't just take our word for it. Here's what our users have to say about Habito.
              </p>
            </FadeInWhenVisible>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
                  <div>
                    <h4 className="font-semibold">User Name</h4>
                    <p className="text-gray-500">Position, Company</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "Habito has completely transformed how our team manages projects and tracks progress. We're more productive than ever!"
                </p>
                <div className="flex mt-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[rgb(47,141,113)] to-[rgb(63,222,156)] opacity-90"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-white mb-6"
            >
              Ready to transform your productivity?
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-white mb-10"
            >
              Join thousands of users who are achieving more with Habito.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/signup" 
                  className="bg-white text-[rgb(47,141,113)] hover:bg-gray-100 py-4 px-8 rounded-full transition-all duration-300 font-semibold shadow-md hover:shadow-lg inline-block"
                >
                  Get Started Free
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a 
                  href="#demo" 
                  className="border-2 border-white text-white hover:bg-white hover:text-[rgb(47,141,113)] py-4 px-8 rounded-full transition-all duration-300 font-semibold inline-block"
                >
                  Schedule a Demo
                </a>
              </motion.div>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-white mt-8"
            >
              No credit card required. Free forever plan available.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img className="h-8 w-8" src={designImage} alt="Design" />
                <span className="text-2xl font-bold text-white">Habito</span>
              </div>
              <p className="mb-4">The all-in-one productivity platform for individuals and teams.</p>
              <div className="flex space-x-4">
                {['twitter', 'facebook', 'instagram', 'linkedin'].map((social, index) => (
                  <a key={index} href="#" className="text-gray-400 hover:text-white transition-colors">
                    <span className="sr-only">{social}</span>
                    <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
                  </a>
                ))}
              </div>
            </div>
            
            {['Product', 'Company', 'Resources', 'Legal'].map((category, index) => (
              <div key={index}>
                <h3 className="text-white font-semibold mb-4">{category}</h3>
                <ul className="space-y-2">
                  {[1, 2, 3, 4].map((item) => (
                    <li key={item}>
                      <a href="#" className="hover:text-white transition-colors">Link {item}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p>&copy; 2024 Habito. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
