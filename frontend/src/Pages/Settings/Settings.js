import React, { useEffect, useState } from 'react';
import './Settings.css';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Subscription from './Subscription/Subscription';
import NavBar from '../../Components/NavBar/NavBar';
import useLoggedInUser from "../../hooks/useLoggedInUser";
import i18n from '../../i18n';
import axios from 'axios';

import { useTranslation } from 'react-i18next';

const Settings = () => {

    const {t} = useTranslation();
    const location = useLocation();

    const [loggedInUser] = useLoggedInUser();
    const username = loggedInUser?.username ? loggedInUser.username : "User";

    const [language, setLanguage] = useState(i18n.language || 'en');
    const navigate = useNavigate();

    const handleOptionClick = (path) => {
        navigate(path);
    };

    const handleLanguageChange = (event) => {

        const selectedLanguage = event.target.value;
        navigate('/OTPVerification', {
            state: {
                navigateTo: '/home/Settings',
                email_msg: 'OpinioNet OTP Verification Code For Language change : ',
                language: selectedLanguage
            }
        });

    };

    const handleBackClick = () =>{
        if(location.pathname === '/home/Settings/subscription'){
            navigate('/home/Settings');
        }
        else{
            navigate('/home');
        }
    }

    return (
        <div className='SettingsPage'>
            <NavBar heading={t("sidebar_settings")} username={username} handleBackClick={handleBackClick} />

            <div className='settings-content'>
                
                <Routes>
                    <Route path='/' element={

                        <>
                        <div className='language-selection'>
                            <label htmlFor='language-select'>Select Language: </label>
                            <select id='language-select' value={language} onChange={handleLanguageChange}>
                                <option value='en'>English</option>
                                <option value='es'>Spanish</option>
                                <option value='hi'>Hindi</option>
                                <option value='pt'>Portuguese</option>
                                <option value='ta'>Tamil</option>
                                <option value='bn'>Bengali</option>
                                <option value='fr'>French</option>
                            </select>
                        </div>

                        <div className='settings_options'>
                            <button onClick={() => handleOptionClick('subscription')}> {t("Subscriptions")} </button>
                        </div>

                        </>
                    } />
                    <Route path='/subscription' element={<Subscription />} />
                </Routes>
            </div>
        </div>
    );
};

export default Settings;
