import React from "react";
import "./MainPage.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import useLoggedInUser from "../../../hooks/useLoggedInUser";
import CenterFocusWeakIcon from "@mui/icons-material/CenterFocusWeak";
import defaultCoverImage from '../../../assets/images/OpinioNetLogo.png'
import NavBar from "../../../Components/NavBar/NavBar";
import { Avatar } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";


const MainPage = ({user, profilePic}) => {

    const navigate = useNavigate();
    const [loggedInUser] = useLoggedInUser();
    const username = loggedInUser?.username ? loggedInUser?.username : user?.email.split('@')[0];
    const email = user?.email;
    const FullName = loggedInUser?.fullName;

   
        const [posts, setPosts] = useState([]);
        const [yourFavoriteVoices, setYourFavoriteVoices] = useState([]);

        useEffect(() => {
            const fetchPosts = async () => {
                try {
                    const data = await axios.get(`http://localhost:5000/posts?email=${email}`);
                    setPosts(data.data);
                } catch (error) {
                    console.error("Error fetching posts:", error);
                }
            };
            fetchPosts();
        }, [email]);

        useEffect(() => {
            const fetchYourFavoriteVoices = async () => {
                try {
                    const data = await axios.get(`http://localhost:5000/yourFavoriteVoices?email=${email}`);
                    setYourFavoriteVoices(data.data);
                } catch (error) {
                    console.error("Error fetching posts:", error);
                }
            };
            fetchYourFavoriteVoices();
        }, [email]);
    

        const handlePostClick = () => {
            const postsHeading = document.querySelector('.yourPostsHeading');
            const favoriteVoices = document.querySelector('.yourFavoriteHeading');

            const yourPosts = document.querySelector('.yourPostsSection');
            const yourFavoriteVoices = document.querySelector('.yourFavoriteVoices');

            yourPosts.style.display = "block";
            yourFavoriteVoices.style.display = "none";

            // postsHeading.style.color = "blue";
            // postsHeading.style.backgroundColor = "black";
            // postsHeading.style.borderRadius = "10px";
            // postsHeading.style.margin = "0px 10px";
            
            // favoriteVoices.style.color = "";
            // favoriteVoices.style.backgroundColor = "";
            
            postsHeading.style.borderRadius = "10px";
            postsHeading.style.borderWidth = "2px";
            postsHeading.style.borderBottom = "2px solid #949398FF";

            favoriteVoices.style.borderBottom = "none";
            favoriteVoices.style.borderWidth = "none";




        }

        const handleFavoriteClick = () => {
            const postHeading = document.querySelector('.yourPostsHeading');
            const favoriteVoices = document.querySelector('.yourFavoriteHeading');

            const yourPosts = document.querySelector('.yourPostsSection');
            const yourFavoriteVoices = document.querySelector('.yourFavoriteVoices');

            yourPosts.style.display = "none";
            yourFavoriteVoices.style.display = "block";

            // favoriteVoices.style.color = "blue";
            // favoriteVoices.style.backgroundColor = "black";
            // favoriteVoices.style.borderRadius = "10px";
            // favoriteVoices.style.margin = "0px 10px";

            // postHeading.style.color = "";
            // postHeading.style.backgroundColor = "";

            favoriteVoices.style.borderRadius = "10px";
            favoriteVoices.style.borderWidth = "2px";
            favoriteVoices.style.borderBottom = "2px solid #949398FF";

            postHeading.style.borderBottom = "none";
            postHeading.style.borderWidth = "none";
        }

        const handleUploadImage = (e) => {

        }
    

    return (
        <div classNameNameName="MainPage">
            
            <NavBar heading= "My Profile" username={username} className="NavBar"/>
            
            <div className="CoverImage">
                <img src={defaultCoverImage}/>
            </div>

            <div>
                <Avatar src={profilePic} className="profilePic"/>
            </div>

            <div className="profileCard1">
                <div className="keys">
                    <h4>username</h4>
                    <h4>Email</h4>
                </div>

                <div className="values">
                    <h4>{username}</h4>
                    <h4>{email}</h4>
                </div>

            </div>

            <div className="section">

                <div className="Headings">
                    <h4 className="yourPostsHeading" onClick={handlePostClick}>Your Posts</h4>
                    <h4 className="yourFavoriteHeading" onClick={handleFavoriteClick}>Your Favorite Voices</h4>
                </div>

                <div className="yourPostsSection">
                    <div className="yourPosts">
                        {posts && posts.length > 0 ? (
                            <ul className="postsList">
                                {posts.map((post, _id) => (
                                    <li key={_id} className="postCard">
                                        <img src={post.imageURL || defaultCoverImage} alt="Post" className="postImage" />
                                        <div className="postContent">
                                            <img src={post.profilePic} alt="Profile" className="profilePic" />
                                            <div className="postText">
                                                <p className="voiceText">{post.Voice}</p>
                                                <p className="username">{username}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                        </ul>
                        ) : (
                            <p>No posts available</p>
                        )}
                    </div>
                </div>

                <div className="yourFavoriteVoices">
                    
                    <div className="yourFavoriteVoices">
                        {yourFavoriteVoices && yourFavoriteVoices.length > 0 ? (
                            <ul>
                                {yourFavoriteVoices.map((voice, _id) => (
                                    <li key={_id}>{voice.Voice}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>No favorite voices available</p>
                        )}
                    </div>
                    
                </div>


            </div>

            
            
        </div>
    );
};

export default MainPage;