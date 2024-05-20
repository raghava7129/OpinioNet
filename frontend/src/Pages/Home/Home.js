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

const Home = () => {

  // const [getUsername, setUsername] = useLoggedInUser();

  // console.log(getUsername);

  // console.log(auth);

  const user = useAuthState(auth);
  // console.log(user);
  const handleLogout = () => {
    signOut(auth);
  }

  return (
      <div className='HomePage'>
        <SideBar handleLogout = {handleLogout} user = {user} className='sideBar'/>
        <Outlet />
        <Widges />
      </div>

  );
};

export default Home;