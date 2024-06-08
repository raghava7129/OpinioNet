import React, { useEffect, useState } from 'react';
import './Settings.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Subscription from './Subscription/Subscription';
import NavBar from '../../Components/NavBar/NavBar';
import useLoggedInUser from "../../hooks/useLoggedInUser";

const Settings = () => {
    const [loggedInUser] = useLoggedInUser();
    const username = loggedInUser?.username ? loggedInUser.username : "User";

    const [optionsClicked, setOptionsClicked] = useState(false);
    const navigate = useNavigate();

    const handleOptionClick = (path) => {
        setOptionsClicked(true);
        navigate(path);
    };

    useEffect(() => {
        return () => {
            setOptionsClicked(false);
        };
    }, []);

    return (
        <div className='SettingsPage'>
            <NavBar heading="Settings" username={username} />

            <div className='settings-content'>
                {optionsClicked ? (
                    <Routes>
                        <Route path='subscription' element={<Subscription />} />
                    </Routes>
                ) : (
                    <div className='settings_options'>
                        <button onClick={() => handleOptionClick('subscription')}>Subscription</button>
                    </div>
                )}
            </div>
        </div>
    );  
};

export default Settings;
