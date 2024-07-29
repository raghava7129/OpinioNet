import React from "react";
import './Notifications.css';
import useLoggedInUser from "../../hooks/useLoggedInUser"
import { useAuthState } from 'react-firebase-hooks/auth';
import auth  from '../../firebase.init';
import { useEffect, useState } from "react";
import { use } from "i18next";
import axios from "axios";

const Notifications = () => {

    const [loggedInUser] = useLoggedInUser();
    const user = useAuthState(auth);

    const email = user[0]?.email;

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!loggedInUser?.username) return;
    
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/notifications`, {
                    params: {
                        username: loggedInUser.username,
                        email: email
                    }
                });
                setNotifications(response.data);
            } catch (error) {
                setError(error.message);
                console.error('Error fetching notifications:', error.response ? error.response.data : error.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchNotifications();
    
        console.log("useEffect in Notifications.js");
        console.log("username: " + loggedInUser?.username);
        console.log("email: " + email);

        console.log("baseURL: "+`${process.env.REACT_APP_Backend_url}`);
    
    }, [loggedInUser, email]);


    if (loading) {
        return <div>Loading...</div>;
      }
    
      if (error) {
        return <div>Error: {error}</div>;
      }
    

    return (
        <div className='page'>
            <h1 className="pageHeading">Your Notifications</h1>
            <ul className="notificationsList">
                {notifications.map(notification => (
                    <li key={notification.id} className="notificationItem">
                        {notification.message}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Notifications;
