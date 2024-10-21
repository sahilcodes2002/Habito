import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Join from "./pages/Join";
import Codeeditor from "./pages/COdeeditor";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <>
      <div>
        <Toaster
          position="top-right"
          toastOptions={{
            success: {
              theme: {
                primary: "green",
              },
            },
          }}
        ></Toaster>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/join" element={<Join />} />
          <Route path="/editor/:roomId" element={<Codeeditor />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
