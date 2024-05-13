import React from 'react';
import { Link } from 'react-router-dom';
import './SideBar.css';

const SideBar = () => {
    return (
        <div className="sidebar">
            <Link to="/"><h1>Home</h1></Link>
            <Link to="/about"><h1>About</h1></Link>
            <Link to="/settings"><h1>Settings</h1></Link>
            <Link to="/profile"><h1>Profile</h1></Link>
        </div>
    );
}

export default SideBar;