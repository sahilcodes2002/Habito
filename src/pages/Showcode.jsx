import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { info } from "../store/atoms/userinfo";
import { useRecoilValue } from "recoil";
import toast from "react-hot-toast";

const Showcode = () => {
  const allInfo = useRecoilValue(info);
  const { codeid } = useParams();
  const [codeData, setCodeData] = useState({
    id: "",
    user_id: 0,
    title: "",
    description: "",
    code: "//loading.........",
    language: "javascript",
    created_at: "2024-09-29T09:37:58.862Z",
  });
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [code, setCode] = useState("// Write your code here");
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("vs-light"); // Default to dark theme
  const [savingwindow, setsavingwindow] = useState(false);
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [wordwrap, setwordwrap] = useState(false);
  const [height, setheight] = useState(window.innerHeight);
  const [width, setwidth] = useState(window.innerHeight);

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  useEffect(() => {
    const fetchCode = async () => {
      var toastId = null;
      try {
        toastId = toast.loading("Please wait, Fetching code from server...");
        const response = await axios.post(
          "https://honoprisma.codessahil.workers.dev/getcode",
          {
            id: parseInt(codeid),
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        if(response.data.res===null){
          navigate('/allcode')
          return;
        }
        toast.dismiss(toastId);
        console.log(response.data);
        setCodeData(response.data.res);
        setLanguage(codeData.language);
        settitle(codeData.title);
        setdescription(codeData.description);
      } catch (error) {
        toast.error("Failed to get code snippet from server", { id: toastId });
        console.error("Error fetching code data", error);
      }
    };

    fetchCode();
  }, []);
  useEffect(() => {
    console.log(codeid);
    setLanguage(codeData.language);
    settitle(codeData.title);
    setdescription(codeData.description);
    setCode(codeData.code);
  }, [codeData]);

  useEffect(() => {
    const handleResize = () => {
      setheight(window.innerHeight);
      setwidth(window.innerWidth);

      console.log("New screen width:", window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const updatecode = async () => {
    if (title === "") {
      alert("Please fill in the title and description");
      return;
    }
    try {
      const response = await axios.post(
        "https://honoprisma.codessahil.workers.dev/updatecode",
        {
          code,
          language,
          title: title,
          description: description,
          id: parseInt(codeid),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      if (response.data.success) {
        alert("Code saved successfully!");
        const newdata = codeData;
        newdata.language = language;
        newdata.code = code;
        newdata.title = title;
        newdata.description = description;
        setCodeData(newdata);
        setEditing(false);
      } else {
        alert("Error saving code.");
        setEditing(false);
      }
    } catch (error) {
      console.error("Error saving code:", error);
    }
  };

  //useEffect(() => {}, [savingwindow]);
  //if (!codeData) return <p>Loading...</p>;

  return (
    <div className="p-4">
      {editing && (
        <div>
          <div className="mb-4 text-sm">
            <label className="mr-2">Language:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="ml-2 border p-1 max-h-48 overflow-y-auto"
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
              className="ml-2 border p-1"
            >
              <option value="vs-dark">Dark</option>
              <option value="vs-light">Light</option>
            </select>
          </div>
          <div className="md:flex gap-3 md:mb-3">
            <div className="flex gap-x-2 mb-2 md:mb-0">
              <label
                for="first_name"
                className="block mb-2  font-medium text-gray-900 "
              >
                title:
              </label>
              <div className="w-full flex justify-center">
                <input
                  maxLength="25"
                  value={title}
                  onChange={(e) => {
                    settitle(e.target.value);
                  }}
                  type="text"
                  className={`w-[250px] bg-gray-50 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1`}
                  placeholder="John"
                  required
                />
              </div>
            </div>
            <div className="flex gap-x-2">
              <label className="block mb-2  font-medium text-gray-900 ">
                description:
              </label>
              <div className="w-full flex justify-center">
                <input
                  maxLength="100"
                  value={description}
                  onChange={(e) => {
                    setdescription(e.target.value);
                  }}
                  type="text"
                  className="w-[250px] bg-gray-50 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1 "
                  placeholder="John"
                  required
                />
              </div>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="border-2 p-1">
            <Editor
              height={`${height - 200}px`}
              language={language}
              value={codeData.code}
              theme={theme} // Apply selected theme
              onChange={(value) => setCode(value)}
            />
          </div>

          <div className="w-full flex justify-center mt-4 space-x-4">
            <button
              onClick={() => {
                updatecode();
              }}
              className="px-5 py-1 bg-blue-500 text-white rounded"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditing(false);
              }}
              className="px-5 py-1 bg-blue-500 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div>
        {!editing && (
          <div>
            <div className=" bg-gray-100 border border-gray-300 rounded-md shadow-md mb-2">
              <div className="flex justify-between gap-x-5">
                <div className=" gap-x-2">
                  <div>
                    <h2 className="ml-1 text-sm md:text-xl   text-gray-800 ">
                      <div>
                        <span className="font-bold">Title:</span>{" "}
                        {codeData.title}
                      </div>
                    </h2>
                  </div>
                  {codeData.description && (
                    <div className="ml-1 pt-1">
                      <p className="text-gray-600 text-sm md:text-lg ">
                        <div>
                          <span>Description:</span>{" "}
                          <span className="italic">{codeData.description}</span>
                        </div>
                      </p>
                    </div>
                  )}
                </div>
                <div className="hidden smd:flex">
                  <div className=" my-3 mr-2 flex justify-center">
                    <button
                      onClick={() => {
                        setEditing(true);
                      }}
                      className="px-5 py-1 bg-blue-500 text-white rounded text-sm md:text-md"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="my-3 mr-2 flex justify-center">
                    <button
                      onClick={() => {
                        setwordwrap((x) => !x);
                      }}
                      className={`px-5 py-1 text-sm ${
                        wordwrap ? "bg-green-500" : "bg-gray-400"
                      }  text-white rounded`}
                    >
                      Word wrap
                    </button>
                  </div>
                  <div className="my-3 mr-2 flex justify-center">
                    <button
                      onClick={() => {
                        navigate("/allcode");
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
                </div>
              </div>
            </div>

            {/* Monaco Editor for rendering the code */}
            <Editor
              height={`${height - 125}px`}
              language={codeData.language}
              value={codeData.code}
              theme="vs-dark" // or "vs-light" based on your preference
              options={{
                readOnly: true, // Disable editing
                minimap: { enabled: true }, // Hide the minimap if not needed
                wordWrap: wordwrap,
              }}
            />
            <div className="w-full flex justify-center">
              <div className="smd:hidden flex">
                <div className=" my-3 mr-2 flex justify-center">
                  <button
                    onClick={() => {
                      setEditing(true);
                    }}
                    className="px-5 py-1 bg-blue-500 text-white rounded text-sm md:text-md"
                  >
                    Edit
                  </button>
                </div>
                <div className="my-3 mr-2 flex justify-center">
                  <button
                    onClick={() => {
                      setwordwrap((x) => !x);
                    }}
                    className={`px-5 py-1 text-sm ${
                      wordwrap ? "bg-green-500" : "bg-gray-400"
                    }  text-white rounded`}
                  >
                    Word wrap
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Showcode;
