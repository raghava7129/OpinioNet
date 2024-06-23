import React, { useEffect, useState } from 'react';
import './Settings.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Subscription from './Subscription/Subscription';
import NavBar from '../../Components/NavBar/NavBar';
import useLoggedInUser from "../../hooks/useLoggedInUser";
import i18n from '../../i18n';

import { useTranslation } from 'react-i18next';

const Settings = () => {

     const {t} = useTranslation();

    const [loggedInUser] = useLoggedInUser();
    const username = loggedInUser?.username ? loggedInUser.username : "User";

    const [optionsClicked, setOptionsClicked] = useState(false);
    const [language, setLanguage] = useState(i18n.language || 'en');
    const navigate = useNavigate();

    const handleOptionClick = (path) => {
        setOptionsClicked(true);
        navigate(path);
    };

    const handleLanguageChange = (event) => {
        const selectedLanguage = event.target.value;
        setLanguage(selectedLanguage);
        i18n.changeLanguage(selectedLanguage); 
    };

    useEffect(() => {
        return () => {
            setOptionsClicked(false);
        };
    }, []);

    const handleBackClick = () =>{
        navigate('/home');
    }

    return (
        <div className='SettingsPage'>
            <NavBar heading={t("sidebar_settings")} username={username} handleBackClick={handleBackClick} />

            <div className='settings-content'>
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
                
                {optionsClicked ? (
                    <Routes>
                        <Route path='subscription' element={<Subscription />} />
                    </Routes>
                ) : (
                    <div className='settings_options'>
                        <button onClick={() => handleOptionClick('subscription')}> {t("Subscriptions")} </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;
