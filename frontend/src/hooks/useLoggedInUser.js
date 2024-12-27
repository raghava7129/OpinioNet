import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Widget from "../Pages/Widges/Widges";
import auth from "../firebase.init";
import axios from "axios";

const useLoggedInUser = () => {
    const user = useAuthState(auth);
    const email = user[0]?.email;
    // console.log("email from auth in useLoggedInUser : " + email);
    const [loggedInUser, setLoggedInUser] = useState({});

    useEffect(() => {
        const backendUrl = process.env.REACT_APP_Backend_url;
        if (!backendUrl) {
            console.error("REACT_APP_Backend_url is not defined");
        } else {
            console.log(`Backend url : ${backendUrl}`);

            axios.get(`${backendUrl}/loggedInUser?email=${email}`).then((response) => {
                setLoggedInUser(response.data[0]);
            }).catch((error) => {
                console.error("Error:", error);
            });
        }
    }, [email]);

    return [loggedInUser, setLoggedInUser];
};

export default useLoggedInUser;