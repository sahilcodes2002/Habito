import { HashRouter, Routes, Route } from 'react-router-dom';
import { Signup } from './pages/Signup';
import { Signin } from './pages/Signin';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { RecoilRoot } from 'recoil';
import { Homepage } from './pages/Home';
import { Messages } from './pages/Messages';
import { Conversation } from './pages/Conversation';
import { Dashboardnotes } from './pages/Dashboardnotes';
import { Createtask } from './pages/Createtask';
import ProjectOptions from './pages/ProjectOptions';
import { Userprojects } from './pages/Userprojects';
import { ProjectDetails } from './pages/Projectdetails';
import { AssignedProjects } from './pages/AssignedProjects';
import { Notifications } from './pages/Notifications';
import { Userprofile } from './pages/Userprofile';
import { Projectmessages } from './pages/Projectmessages';
import { Workhistory } from './pages/Workhistory';
import { Colab } from './pages/Colab';
import { Join } from './pages/Join';
import Showcode from './pages/Showcode'
import CodeEditorPage from './pages/Codestore';
import { Allcodes } from './pages/Allcodes';
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div>
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
      <RecoilRoot>
        <HashRouter>
          <Routes>
            <Route path='/' element={<Homepage />} />
            {/* <Route path='/signup' element={<Signup />} /> */}
            <Route path='/signin' element={<Signin />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/dashboardnotes' element={<Dashboardnotes />} />
            <Route path='/createtask' element={<Createtask />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/messages' element={<Messages />} />
            <Route path='/projectoptions' element={<ProjectOptions />} />
            <Route path='/userprojects' element={<Userprojects />} />
            <Route path='/assignedprojects' element={<AssignedProjects />} />
            <Route path='/project/:id' element={<ProjectDetails />} />
            <Route path='/projectmessages/:userId' element={<Projectmessages />} />
            <Route path='/notifications' element={<Notifications />} />
            <Route path='/userprofile' element={<Userprofile />} />
            <Route path='/workhistory' element={<Workhistory />} />
            <Route path='/colab' element={<Colab />} />
            <Route path='/signup' element={<Join />} />
            <Route path='/code' element={<CodeEditorPage />} />
            <Route path='/showcode/:codeid' element={<Showcode />} />
            <Route path='/allcode' element={<Allcodes />} />
            <Route path='/conversations/:userId' element={<Conversation />} />
            
          </Routes>
        </HashRouter>
      </RecoilRoot>
    </div>
  );
}

export default App;
