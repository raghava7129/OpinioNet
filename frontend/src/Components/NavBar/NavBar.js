import React from 'react';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import "./NavBar.css"
import { useNavigate } from 'react-router-dom';

const NavBar = ({heading, username}) => {

    const navigate = useNavigate();

    const handleBackClick = () =>{
        navigate('/');
    }

    return (
        <div className='NavBar'>
            <ArrowBack className='BackArrow' onClick={handleBackClick} />

            <h1 className='NavBarHeading'>{heading}</h1>

            <h3 className='username'>{username}</h3>

            <ArrowDropDownIcon className='DropDown'/>

            

        </div>
    
    );
}

export default NavBar;
