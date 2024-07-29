import {React, useState, useEffect} from 'react';
import './SideBar.css';
import SideBarOptions from './SideBarOptions';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import ProfileIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout'
import { Avatar, Divider, Icon, IconButton, ListItem, ListItemIcon, Menu, MenuItem } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DoneIcon from '@mui/icons-material/Done';
import NotificationIcon from '@mui/icons-material/Notifications';
import MailOutLineIcon from '@mui/icons-material/MailOutline';
import MoreIcon from '@mui/icons-material/More';
import ExploreIcon from '@mui/icons-material/Explore';
import CustomLink from '../CustomLink';
import { useLocation } from 'react-router-dom';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import useLoggedInUser from '../../hooks/useLoggedInUser';
import { EmailAuthCredential } from 'firebase/auth';
import auth from '../../firebase.init';
import { useAuthState } from 'react-firebase-hooks/auth';

import {useTranslation} from 'react-i18next';


const handleHover = () => {
    console.log(`Hovered`);
}

const SideBar = ({handleLogout, user, profilePic}) => {

    const {t} = useTranslation();

    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const location = useLocation();

    const [loggedInUser] = useLoggedInUser();
    
    const emailPrefix = user[0]?.email.split('@')[0];
    const usersName = loggedInUser?.username ? loggedInUser?.username : "User";
    // console.log("username : "+usersName);
    // console.log("emailPrefix : "+emailPrefix);
    // console.log("user : "+user[0]);

    // const User = useAuthState(auth);
    // console.log("user email from SideBar : "+User[0]?.email);


    return (
        <div className='sidebar'>

            <CustomLink to="/home">
                <SideBarOptions active={location.pathname === '/home'} Icon={HomeIcon} text={t("sidebar_home")} />
            </CustomLink>

            <CustomLink to='/home/Explore'>
                <SideBarOptions active={location.pathname === '/home/Explore'} Icon={ExploreIcon} text={t("sidebar_explore")} />
            </CustomLink>

            <CustomLink to='/home/Notifications'>
                <SideBarOptions active={location.pathname === '/home/Notifications'} Icon={NotificationIcon} text={t("sidebar_notifications")} />
            </CustomLink>
            
            <CustomLink to='/home/Profile'>
                <SideBarOptions active={location.pathname === '/home/Profile'} Icon={ProfileIcon} text={t("sidebar_profile")} />
            </CustomLink>

            <CustomLink to='/home/Settings'>
                <SideBarOptions active={location.pathname === '/home/Settings'} Icon={SettingsIcon} text={t("sidebar_settings")} />
            </CustomLink>

            <Link to='/' className='VoiceBoxBtn'>
                {t("speak_your_mind")}
            </Link>
            
            <div className='profileContainer'> 
                <div className='ProfileInfo'>
                    <Avatar style={{
                        width: '60px',
                        height: '60px'                
                    }} src={profilePic} className='pic1'/>
                    <div className='userInfo'>
                        <div className='userInfoDiv1'>
                            <h2>{emailPrefix}</h2>
                            <h4>@{usersName}</h4>
                        </div>

                        <IconButton
                            size='small'
                            sx={{ ml: 2 }}
                            aria-controls={openMenu ? 'menu' : undefined}
                            aria-haspopup='true'
                            aria-expanded={openMenu ? 'true' : undefined}
                            onClick={handleClick}
                        >

                            <div className='userInfoDiv2'>
                                <MoreHorizIcon />
                            </div>
                            
                        </IconButton>

                    <Menu
                        id='basic-menu'
                        className='menu'
                        anchorEl={anchorEl}
                        open={openMenu}
                        onClick={handleClose}
                        onClose={handleClose}
                    >
                        <MenuItem className='profileInfo1'> 
                            <div className='ProfileInfo'>
                                <Avatar style={{
                                    width: '60px',
                                    height: '60px'                
                                }} src={profilePic} className='pic2'/>
                                <div className='subUserInfo'>
                                    <h2>{emailPrefix}</h2>
                                    <h4>@{usersName}</h4>
                                </div>
                            
                            </div>
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick = {handleLogout}> {t("Logout")} @{usersName}</MenuItem>

                    </Menu>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default SideBar;