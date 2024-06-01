import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Widges.css";
import { useState } from "react";

import FreeSolo from "../../Components/solo/FreeSolo";
import axios from "axios";
import useLoggedInUser from "../../hooks/useLoggedInUser";

const Widges = () => {

    const [loggedInUser] = useLoggedInUser();

    const [inputValue, setInputValue] = useState(loggedInUser?.username);
    const [posts, setPosts] = useState([]);

    const handleInputChange = (event, newInputValue) => {
        setInputValue(newInputValue);
        console.log(newInputValue); 
    };

    useEffect(() => {
        axios.get(`http://localhost:5000/getPosts?username=${inputValue}`).then((response)=>{
            // console.log(response.data);
            setPosts(response.data);
        })
    }
    , [inputValue, loggedInUser]);


    return (
        <div className="widges">
            <h1>Widges</h1>
            <FreeSolo inputValue={inputValue} handleInputChange={handleInputChange} />

            <div className="widges__posts">
                {posts && posts?.length > 0 ? (
                    <ul>
                        {posts.map((post, _id) => (
                            <li key={_id}>{post.Voice}</li>
                        ))}
                    </ul>
                ) : (
                    <p>see Posts made by other users</p>
                )}
            </div>
            
        </div>
    );
}

export default Widges;

