import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import auth from '../firebase.init';
import { useAuthState } from 'react-firebase-hooks/auth';
import LoadingPage from './LoadingPage';

const ProtectedRoute = ({children}) => {
    const [user, isLoading] = useAuthState(auth);

    if(isLoading){
        return <LoadingPage/>
    }

    if(!user){
        return <Navigate to="/login" />
    }

    return children;
}

export default ProtectedRoute;