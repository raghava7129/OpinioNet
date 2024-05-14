import React from 'react';
import { Link } from 'react-router-dom';
import './SideBarOptions.css';

const SideBarOptions = ({active, Icon, text}) => {
    return (
        <div className={`sidebarOptions ${active ? 'sidebarOptions__active' : ''}`}>
            <Icon className='SideBarIcons'  />
            <h3>{text}</h3>
        </div>
    );
}

export default SideBarOptions;