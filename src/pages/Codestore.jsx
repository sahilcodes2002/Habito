

import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const CodeEditor = () => {
  const [code, setCode] = useState("// Write your code here");
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("vs-light"); // Default to dark theme
  const [width, setWidth] = useState(window.innerHeight);
  const [savingwindow, setsavingwindow] = useState(false);
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");


  const navigate  = useNavigate();


  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
    const handleResize = () => {
      setWidth(window.innerHeight);
      console.log("New screen width:", window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {}, [savingwindow]);
  // Function to handle saving the code to the backend


  const saveCodeToDatabase = async () => {
    if(title==="" || description===""){
        alert("Please fill in the title and description");
        return;
    }
    var toastId = null;
    try {
      toastId = toast.loading("Saving ur code snippet...");
      const response = await axios.post("https://honoprisma.codessahil.workers.dev/savecode", {
        code,
        language,
        title:title,
        description:description
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      if (response.data.success) {
        //alert("Code saved successfully!");
        setsavingwindow(false);
        toast.success("Code snippet saved successfully", { id: toastId });
        navigate('/allcode');
        
      } else {
        alert("Error saving code.");
        setsavingwindow(false);
      }
    } catch (error) {
      toast.error("Failed to save, please try again!!", { id: toastId });
      console.error("Error saving code:", error);
    }
  };

  // Toggle between dark and light themes
  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  return (
    <div className="p-4 ">
      <div className={``}>
        {!savingwindow && <div className="flex justify-between">
            <div className="flex flex-col justify-center">
            <h2 className="mb-2 text-xl font-semibold">Code Editor</h2>
            </div>
            <div className="my-3 mr-2 flex justify-center">
                    <button
                      onClick={() => {
                        navigate("/allcode")
                      }}
                      className={`px-3 py-1 text-sm bg-gray-400 text-white rounded`}
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
            </div>}

        {/* Language Selection */}
        {!savingwindow && (
          <div>
            <div className="mb-4 smd:text-xl text-sm">
              <label className="mr-2">Language:</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="ml-2 border p-1 max-h-60 overflow-y-auto text-sm md:text-md"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="json">JSON</option>
                <option value="markdown">Markdown</option>
                <option value="xml">XML</option>
                <option value="csharp">C#</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="php">PHP</option>
                <option value="go">Go</option>
                <option value="ruby">Ruby</option>
                <option value="swift">Swift</option>
                <option value="sql">SQL</option>
                <option value="razor">Razor</option>
                <option value="shell">Shell</option>
                <option value="kotlin">Kotlin</option>
                <option value="rust">Rust</option>
                <option value="dart">Dart</option>
                <option value="objective-c">Objective-C</option>
                <option value="lua">Lua</option>
                <option value="scss">Sass/SCSS</option>
                <option value="perl">Perl</option>
              </select>

              {/* Theme Selection */}
              <label className="ml-4 mr-2">Theme:</label>
              <select
                value={theme}
                onChange={handleThemeChange}
                className="ml-2 border p-1 text-sm md:text-md"
              >
                <option value="vs-dark">Dark</option>
                <option value="vs-light">Light</option>
              </select>
            </div>

            {/* Monaco Editor */}
            <div className="border-2 p-1">
              <Editor
                height={`${width - 200}px`}
                language={language}
                value={code}
                theme={theme} // Apply selected theme
                onChange={(value) => setCode(value)}
              />
            </div>
          </div>
        )}

        {/* Save Button */}
        {savingwindow && (
          <div className=" text-center"> 
            <h2 className="mb-2 text-xl font-semibold font-dancing">Save code</h2>
            <label
              for="first_name"
              className="block mb-2  font-medium text-gray-900 "
            >
              title
            </label>
            <div className="w-full flex justify-center">
              <input
                maxLength="50"
                onChange={(e) => {
                  settitle(e.target.value);
                }}
                type="text"
                className=" w-[250px] bg-gray-50 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 "
                placeholder="John"
                required
              />
            </div>
            <label
              for="first_name"
              className="block mb-2  font-medium text-gray-900 "
            >
              description
            </label>
            <div className="w-full flex justify-center">
              <input
                maxLength="50"
                onChange={(e) => {
                  setdescription(e.target.value);
                }}
                type="text"
                className=" w-[250px] bg-gray-50 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 "
                placeholder="John"
                required
              />
            </div>
            <div className="flex justify-center mt-4">
              <div className="flex  w-64">
                <div className="mt-4 w-full flex justify-center">
                  <button
                    onClick={() => {
                      saveCodeToDatabase();
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    save
                  </button>
                </div>
                <div className="mt-4 w-full flex justify-center">
                  <button
                    onClick={() => {
                      setsavingwindow(false);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {!savingwindow && (
          <div className="mt-4 w-full flex justify-center">
            <button
              onClick={() => {
                setsavingwindow(true);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;


