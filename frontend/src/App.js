// src/App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import SignUp from './Pages/signUp/SignUp';
import ProtectedRoute from './Pages/ProtectedRoute';
import Notifications from './Pages/Notifications/Notifications';
import Profile from './Pages/Profile/Profile';
import Settings from './Pages/Settings/Settings';
import Feed from './Pages/Feed/Feed';
import OTP_page from './Pages/OTP_Page/OTP_page';
import Explore from './Pages/Explore/Explore';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>}>
            <Route index element={<Feed />} />
          </Route>
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>}>
            <Route index element={<Feed />} />
            <Route path="Notifications" element={<Notifications />} />
            <Route path="Profile" element={<Profile />} />
            <Route path="Settings/*" element={<Settings />} />
            <Route path="Explore" element={<Explore />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/OTPVerification" element={<OTP_page />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
