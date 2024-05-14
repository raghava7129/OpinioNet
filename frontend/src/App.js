import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import SignUp from './Pages/signUp/SignUp';
import ProtectedRoute from './Pages/ProtectedRoute';
import Explore from './Pages/Explore/Explore';
import Messages from './Pages/Messages/Messages';
import Notifications from './Pages/Notifications/Notifications';
import Profile from './Pages/Profile/Profile';
import Settings from './Pages/Settings/Settings';
import More from './Pages/More/More';


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>}/>
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>}>
              <Route path="Explore" element={<Explore />} />
              <Route path="Messages" element={<Messages />} />
              <Route path="Notifications" element={<Notifications />} />
              <Route path="Profile" element={<Profile />} />
              <Route path="Settings" element={<Settings />} />
              <Route path="More" element={<More/>} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
