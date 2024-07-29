import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Widget from "../Pages/Widges/Widges";
import auth from "../firebase.init";
import axios from "axios";

const useLoggedInUser = () => {
    const user = useAuthState(auth);
    const email = user[0]?.email;
    // console.log("email from auth in useLoggedInUser : "+email);
    const [loggedInUser, setLoggedInUser] = useState({});

    useEffect(()=>{
        axios.get(`${process.env.REACT_APP_Backend_url}/loggedInUser?email=${email}`).then((response) => {
            
            // console.log("response from loggedInUser : "+response.data[0]);
            setLoggedInUser(response.data[0]);
        }).catch((error) => {
            console.error("Error:", error); 
        });
    }, [email]);

    return [loggedInUser, setLoggedInUser];

};

export default useLoggedInUser; 