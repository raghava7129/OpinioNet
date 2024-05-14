import React from 'react';
import SideBar from '../SideBar/SideBar';
import Feed from '../Feed/Feed';
import Widges from '../Widges/Widges';
import './Home.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth  from '../../firebase.init';
import { signOut } from 'firebase/auth';
import { Outlet } from 'react-router-dom';

const Home = () => {

  const user = useAuthState(auth);
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