import React from "react";
import "./MainHome.css";

import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../../firebase.init";
import { signOut } from "firebase/auth";
import { Outlet } from "react-router-dom";


const MainHome = () => {
    const user = useAuthState(auth);
    const handleLogout = () => {
        signOut(auth);
    };
    
    return (
        <div className="MainHome">
        <Outlet />
        </div>
    );
};