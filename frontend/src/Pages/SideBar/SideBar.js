import {React, useState} from 'react';
import { Link } from 'react-router-dom';
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


const handleHover = () => {
    console.log(`Hovered`);
}

const SideBar = ({handleLogout, user}) => {

    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    return (
        <div className='sidebar'>

            <Link to="/home" style={{ textDecoration: 'none' }}>
                <SideBarOptions active Icon={HomeIcon} text="Home" />
            </Link>

            <Link to='/home/Explore' style={{ textDecoration: 'none' }}>
                <SideBarOptions active Icon={ExploreIcon} text='Explore' />
            </Link>

            <Link to='/home/Messages' style={{ textDecoration: 'none' }}>
                <SideBarOptions active Icon={MailOutLineIcon} text='Messages' />
            </Link>

            <Link to='/home/Notifications' style={{ textDecoration: 'none' }}>
                <SideBarOptions active Icon={NotificationIcon} text='Notification' />
            </Link>
            
            <Link to='/home/Profile' style={{ textDecoration: 'none' }}>
                <SideBarOptions active Icon={ProfileIcon} text='Profile' />
            </Link>

            <Link to='/home/Settings' style={{ textDecoration: 'none' }}>
                <SideBarOptions active Icon={SettingsIcon} text='Settings' />
            </Link>

            <Link to='/home/More' style={{ textDecoration: 'none' }}>
                <SideBarOptions active Icon={MoreIcon} text='More' />
            </Link>
            
            <div className='profileContainer'>
                <div className='ProfileInfo'>
                    <Avatar style={{
                        width: '60px',
                        height: '60px'                
                    }} src='https://cdn.pixabay.com/photo/2024/01/10/13/08/ai-generated-8499572_960_720.jpg'/>
                    <div className='userInfo'>
                        <div className='userInfoDiv1'>
                            <h2>Raghava</h2>
                            <h4>@RJustinSain</h4>
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
                                }} src='https://cdn.pixabay.com/photo/2024/01/10/13/08/ai-generated-8499572_960_720.jpg'/>
                                <div className='subUserInfo'>
                                    <h2>Raghava</h2>
                                    <h4>@RJustinSain</h4>
                                </div>
                            
                            </div>
                        </MenuItem>

                        <ListItemIcon className='doneIcon'><DoneIcon /></ListItemIcon>

                        <Divider />
                        <MenuItem onClick={handleClose}>Add an existing account</MenuItem>
                        <MenuItem onClick = {handleLogout}>Log out @RJustinSain</MenuItem>

                    </Menu>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default SideBar;