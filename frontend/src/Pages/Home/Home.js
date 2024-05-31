import React from 'react';
import SideBar from '../SideBar/SideBar';
import Feed from '../Feed/Feed';
import Widges from '../Widges/Widges';
import './Home.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth  from '../../firebase.init';
import { signOut } from 'firebase/auth';
import { Outlet } from 'react-router-dom';
import useLoggedInUser from '../../hooks/useLoggedInUser';
import { useEffect, useState } from 'react';

import profilePic from '../../Pages/Profile/MainPage/MainPage'

const Home = () => {

 


  // const [getUsername, setUsername] = useLoggedInUser();

  // console.log(getUsername);

  // console.log(auth);

  const user = useAuthState(auth);
  // console.log(user);
  const handleLogout = () => {
    signOut(auth);
  }

  const [loggedInUser] = useLoggedInUser();

  const defaultProfilePic = "https://cdn.pixabay.com/photo/2024/01/10/13/08/ai-generated-8499572_960_720.jpg";

    const [profilePic, setProfilePic] = useState(loggedInUser?.profilePic || defaultProfilePic);

  useEffect(() => {
    if (loggedInUser?.profilePic) {
        setProfilePic(loggedInUser.profilePic);
    }
}, [loggedInUser]);

  return (
      <div className='HomePage'>
        <SideBar handleLogout = {handleLogout} user = {user} profilePic =
           {profilePic} className='sideBar'/>
        <Outlet />
        <Widges />
      </div>

  );
};

export default Home;