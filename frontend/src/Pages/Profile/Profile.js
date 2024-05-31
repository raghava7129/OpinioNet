import React from 'react';
import './profile.css';
import MainPage from './MainPage/MainPage';
import EditProfile from './EditProfile/EditProfile';
import { useAuthState } from 'react-firebase-hooks/auth';
import  auth  from '../../firebase.init';
import useLoggedInUser from "../../hooks/useLoggedInUser";
 
const Profile = () => {

    const [user] = useAuthState(auth);
    const [loggedInUser] = useLoggedInUser();
    const userProfilePic = loggedInUser?.profilePic?loggedInUser.profilePic: "https://cdn.pixabay.com/photo/2024/01/10/13/08/ai-generated-8499572_960_720.jpg";

    return (
        <div className='ProfilePage'>
            <MainPage user = {user} profilePic = {userProfilePic} />
        </div>
    );
};

export default Profile;