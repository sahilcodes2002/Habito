import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { RecoilRoot, useRecoilState, useRecoilValue } from "recoil"
import { todos } from "../store/atoms/todos";
import { info } from "../store/atoms/userinfo"
import { Link } from "react-router-dom"

export function Join() {
    const [verified, setVerified] = useState(false)
    const [codematch, setCodematch] = useState(false);
    const [firstName, setFirstName] = useState("")
    const [verifytry, setVerifytry] = useState(0)
    const [username, setUsername] = useState("")
    const [verifyCode, setVerifyCode] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [todo,setTodoList] = useRecoilState(todos);
    const [inf, setInfo] = useRecoilState(info)
 
    useEffect(()=>{
        const token  = localStorage.getItem("token");
        if(token){
        //navigate("/dashboard")
        }
    },[])

    return (
        <div>
            <div className="bg-gray-100 min-h-screen ">
      {/* Top Bar Section */}
      <div className="h-screen bg-white  pb-2">
      
        <div className='py-4 px-6 fixed top-0 bg-white left-0 right-0 flex justify-between items-center'>
        <h1 onClick={()=>{
            navigate('/')
        }} className="cursor-pointer text-3xl font-bold text-gray-800"><div className='flex'>
          <span className='flex flex-col justify-center'>
          <img className="h-7 w-7" src="src/images/Design.jpg" alt="Design" />
          </span>
          <span style={{ color: 'rgb(63, 222, 156)' }} className='font-sans'>
          Habito
          </span>
          </div></h1>
        <nav>
          <ul className="flex space-x-1 md:space-x-4">
            <li><Link to="/signin"  className="  text-black text-opacity-70 py-[15px] rounded-md transition duration-300  font-semibold border-none text-md"> Sign in</Link></li>
            {/* <li><Link to="/signin" className="bg-blue-500 hover:bg-blue-600 text-white  py-2 px-2 md:py-2 md:px-4 rounded-lg transition duration-300 text-xs ">Sign In</Link></li> */}
          </ul>
        </nav>
        </div>
        <br></br>
        <br></br>
        
        <br className={`${codematch?"hidden":""}`}></br>
        <br className={`${codematch?"hidden":""}`}A></br>
        <div className='flex justify-center'>
          <div style={{ width: '90vw' }} className='flex justify-center'>
          <div className="mx-auto">
            <div className="max-w-5xl mx-auto mt-5">
                <div className="max-w-2xl text-center mx-auto p-3">
                    <p style={{ fontWeight: 650 }} className=' text-center font-sans  leading-tight text-[30px] smd:text-[39px] text-black text-opacity-80'>
                    Create your account and start using Habito for free
                    </p>
                    <p style={{ fontWeight: 650 }} className='mt-3 text-center font-sans  leading-tight text-[15px]  text-black text-opacity-80'>
                    Already have a Habito Account? <Link to="/signin" className="font-normal text-blue-600 underline hover:no-underline block sm:inline"> Log in to Habito</Link>
                    </p>
                </div>
                <div className={`text-center ${codematch?"mt-3":"mt-10"} mx-5 `}>
                    <label for="first_name" className="block mb-2  font-medium text-gray-900 ">Email</label>
                    <div className="w-full flex justify-center">
                        <input onChange={(e)=>{
                            setUsername(e.target.value)
                        }} type="text"  className={`w-[250px] bg-gray-50 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 ${
                            loading || verified || codematch ? "opacity-50 cursor-not-allowed" : ""
                          }`  } placeholder="John@gmail.com" required />
                    </div>
                    <br className={`${codematch?"hidden":""}`}></br>
                    
                    {!verified &&<button onClick={async()=>{
                        if( username==""){
                            alert("fill all the credentials")
                        }
                        else{
                            console.log(username)
                            setLoading(true)
                            setVerifytry(x=>x+1);
                        try {
                            const response = await axios.post("https://honoprisma.codessahil.workers.dev/varification", {
                                email:username.trim()
                            })
                            if(response.data.success == true){
                                console.log(response.data)
                                setVerified(true);
                                

                            }
                            setLoading(false)
                            

                            //localStorage.setItem("token", response.data.token)
                            //setTodoList(response.data.res.todo);
                            // setInfo({
                            //     name:response.data.res.name,
                            //     username:response.data.res.username,
                            //     id:response.data.res.id
                                
                            // })
                            //navigate(`/dashboard`)
                        } catch (error) {
                            console.error("Error during signup", error)
                        } finally {
                            setLoading(false)
                        }
                        }
                    }} className={`bg-[rgb(47,141,113)] hover:bg-[rgb(18,107,70)] text-white py-[16px] px-20 md:py-[16px] md:px-20 rounded-md transition duration-300 font-semibold border-none text-sm ${
                        loading || verified ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={loading || verified}>
                    {!loading && <p>{verifytry>0 &&<p>Try again</p>}{verifytry==0 &&<p>Send verification code</p>}</p>}
                    {loading && <p>Loading..</p>}
                </button>}
                {verified && !codematch && <div>
                    <div>
                        Verification code is sent to your mail
                    </div>
                    <div>
                    <label for="first_name" className="block mb-2  font-medium text-gray-900 ">Enter 4 digit code</label>
                    <div className="w-full flex justify-center">
                        <input onChange={(e)=>{
                            setVerifyCode(e.target.value)
                        }} type="text"  className=" w-[100px] bg-gray-50 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 " placeholder="" required />
                    </div>
                        
                    </div >
                    {!codematch &&<button onClick={async()=>{
                        if( username==""){
                            alert("please enter the code")
                        }
                        else{
                            console.log(username)
                            setLoading(true)
                            setVerifytry(x=>x+1);
                        try {
                            const response = await axios.post("https://honoprisma.codessahil.workers.dev/varifycode", {
                                email:username.trim(),
                                code:verifyCode.trim()
                            })
                            if(response.data.success == true){
                                console.log(response.data)
                                setCodematch(true);

                            }else{
                                setVerified(false);
                                setCodematch(false);
                            }
                            setLoading(false)
                            

                            //localStorage.setItem("token", response.data.token)
                            //setTodoList(response.data.res.todo);
                            // setInfo({
                            //     name:response.data.res.name,
                            //     username:response.data.res.username,
                            //     id:response.data.res.id
                                
                            // })
                            //navigate(`/dashboard`)
                        } catch (error) {
                            console.error("Error during signup", error)
                        } finally {
                            setLoading(false)
                        }
                        }
                    }} className={`bg-[rgb(47,141,113)] hover:bg-[rgb(18,107,70)] text-white py-[16px] mt-4 px-20 md:py-[16px] md:px-20 rounded-md transition duration-300 font-semibold border-none text-sm ${
                        loading || codematch ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={loading || codematch}>
                    {!loading && <p>Send verification code</p>}
                    {loading && <p>Loading..</p>}
                </button>}
                <div>

                </div>
                </div>}
                {codematch &&<div>
                    <label for="first_name" className="block mb-2  font-medium text-gray-900 ">Name</label>
                    <div className="w-full flex justify-center">
                        <input maxLength="50" onChange={(e)=>{
                            setFirstName(e.target.value)
                        }} type="text"  className=" w-[250px] bg-gray-50 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 " placeholder="John" required />
                    </div>
                    <label for="first_name" className="block mb-2  font-medium text-gray-900 ">Password</label>
                    <div className="w-full flex justify-center">
                        <input onChange={(e)=>{
                            setPassword(e.target.value)
                        }} type="password"  className=" w-[250px] bg-gray-50 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 " placeholder="*********" required />
                    </div>
                    <button onClick={async () => {
                                if(firstName=="" || username=="" ||password==""){
                                    alert("fill all the credentials")
                                    
                                }
                                else{
                                    setLoading(true)
                                try {
                                    const response = await axios.post("https://honoprisma.codessahil.workers.dev/signup", {
                                        name: firstName,
                                        username,
                                        password
                                    })
                                    console.log(response.data)
                                    if(response.data.message && response.data.message=="username already exists"){
                                        setVerified(false)
                                        setCodematch(false)
                                        alert("alreay used email")
                                        
                                    }else{
                                        localStorage.setItem("token", response.data.token)
                                        setTodoList(response.data.res.todo);
                                        setInfo({
                                            name: response.data.data.name,
                                            username:response.data.data.username,
                                            id:response.data.data.id,
                                            created_at:response.data.data.created_at,
                                            todo:response.data.data.todo,
                                            projects:response.data.data.projects,
                                            workhistory:response.data.data.workhistory,
                                            weeklytask:response.data.data.weeklytask,
                                            calenderevents:response.data.data.calenderevents,
                                            
                                        })
                                        setLoading(false)
                                        navigate(`/dashboard`)
                                    }
                                    

                                } catch (error) {
                                    console.error("Error during signup", error)
                                } finally {
                                    setLoading(false)
                                }
                                }
                            }} className={`mt-4 bg-[rgb(47,141,113)] hover:bg-[rgb(18,107,70)] text-white py-[13px] px-20 md:py-[16px] md:px-20 rounded-md transition duration-300 font-semibold border-none text-sm ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={loading}>
                    {!loading && <p>Sign up</p>}
                    {loading && <p>Loading..</p>}
                </button>
                    
                </div>}
                </div>
                
                
            </div>
        </div>
           </div>
            
        </div>
        </div>

      </div>
            
        </div>
    )
}
