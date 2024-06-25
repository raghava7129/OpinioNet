import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Feed.css";
import NavBar from '../../Components/NavBar/NavBar';
import VoiceBox from "./VoiceBox";
import Post from "./Post/Post";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";
import useLoggedInUser from "../../hooks/useLoggedInUser";
import  auth  from '../../firebase.init';
import { useAuthState } from 'react-firebase-hooks/auth';
import i18next from 'i18next';
import axios from 'axios';



const Feed = () => {

    const {t} = useTranslation();

    const [posts, setPosts] = useState([]);
    const [translatedPosts, setTranslatedPosts] = useState([]);

    const [user] = useAuthState(auth);
    const [loggedInUser, setLoggedInUser] = useLoggedInUser();
    const username = loggedInUser?.username ? loggedInUser?.username : user?.email.split('@')[0];

    const translateText = async (text, targetLanguage) => {
    
        try {
          const response = await axios.post(`${process.env.REACT_APP_Backend_url}/translate`, {
            text,
            targetLanguage
          });
    
          const translatedText = response.data.translatedText;
    
          return {
            text: translatedText
          };
        } catch (error) {
          console.log('Error translating text:', error);
          return text;
        }
      };

    const fetchPosts = () => {
        fetch(`${process.env.REACT_APP_Backend_url}/post`)
            .then((response) => response.json())
            .then((data) => {
                setPosts(data);
            })
            .catch((error) => console.error('Error fetching posts:', error));
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // useEffect(() => {
        
    //     const fetchTranslatedPosts = async () => {
    //         const translatedPosts = await Promise.all(
    //             posts.map(async (post) => {
    //                 const translatedVoice = await translateText(post.Voice, i18next.language);
    //                 return {
    //                     ...post,
    //                     Voice: translatedVoice
    //                 };
    //             })
    //         );
        
    //         setTranslatedPosts(translatedPosts);
    //       };

    //     if(posts.length > 0) {
    //         fetchTranslatedPosts();
    //     }
            
    // }  , [i18next.language, posts]);

    const navigate = useNavigate();

    const handleBackClick = () =>{
        navigate('/home');
    }

    return (
        <div className='FeedPage'>
            <div className='Header'>
                <NavBar heading={t("Your_Feed")} username={username} handleBackClick={handleBackClick}/>
            </div>

                <VoiceBox className='VoiceBox' />
                <Button className="refreshBtn" onClick={fetchPosts}> {t("Refresh_Feed")} </Button>
            <div className='Content'>
                {posts && posts.length > 0 ? (
                    posts.map((post) => <Post key={post._id} post={post} />)
                ) : (
                    <p> {t("No_Posts_Avail")} </p>
                )}
            </div>
        </div>
    );
}

export default Feed;
