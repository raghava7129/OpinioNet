import React from 'react';
import SideBar from '../SideBar/SideBar';
import Feed from '../Feed/Feed';
import Widges from '../Widges/Widges';
import './Home.css';

const Home = () => {
  return (
      <div className='HomePage'>
        <SideBar />
        <Feed />
        <Widges />
      </div>

  );
};

export default Home;