import React, { useState } from 'react';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import "./NavBar.css"
import { useNavigate } from 'react-router-dom';

import { Link } from 'react-router-dom';

import { signOut } from 'firebase/auth';
import auth  from '../../firebase.init';

import { useTranslation } from 'react-i18next';

const NavBar = ({heading, username, handleBackClick}) => {

    const {t} = useTranslation();


    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleDropdownToggle = () =>{
        setIsDropdownOpen(!isDropdownOpen);
    }

    const handleMenuItemClick = () => {
        setIsDropdownOpen(false);
      };

    const handleLogout = () => {
        signOut(auth);
      }

    return (
        <div className='NavBar'>
            <ArrowBack className='BackArrow' onClick={handleBackClick} />

            <h1 className='NavBarHeading'>{heading}</h1>

            <h3 className='username'>{username}</h3>

            <div className= 'DropdownContainer'>
                {isDropdownOpen ? (
                    <ArrowDropUpIcon className='DropDown' onClick={handleDropdownToggle} />
                    ):( <ArrowDropDownIcon className='DropDown' onClick={handleDropdownToggle} />)
                } 

                {isDropdownOpen && (
                     <div className='dropdownMenu'>
                        <Link to='/home/Notifications' onClick={handleMenuItemClick}> {t("sidebar_notifications")} </Link>
                        <Link to='/home/Settings' onClick={handleMenuItemClick}> {t("sidebar_settings")} </Link>
                        <Link to='/' onClick={handleLogout}> {t("Logout")} </Link>

                    </div>
                )}

            </div>    

        </div>
    
    );
}

export default NavBar;
