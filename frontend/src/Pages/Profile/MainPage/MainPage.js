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
import EditIcon from '@mui/icons-material/Edit';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import EditProfile from "../EditProfile/EditProfile";

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';

import { useTranslation } from "react-i18next";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    height: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 8,
  };

const MainPage = ({user}) => {

    const {t} = useTranslation();

    const navigate = useNavigate();
    const [loggedInUser, setLoggedInUser] = useLoggedInUser();
    const username = loggedInUser?.username ? loggedInUser?.username : user?.email.split('@')[0];
    const email = user?.email;
    const FullName = loggedInUser?.fullName;
    const bio = loggedInUser?.bio;
    const location = loggedInUser?.location;

    const [profileData, setProfileData] = useState({
        name: loggedInUser?.name,
        bio: loggedInUser?.bio,
        location: loggedInUser?.location,
        dob: loggedInUser?.dob,
      });

      const handleProfileSave = (updatedData) => {
        setProfileData((prevData) => ({
          ...prevData,
          ...updatedData,
        }));
        setLoggedInUser((prevUser) => ({
          ...prevUser,
          ...updatedData,
        }));
      };

    const [imageURL, setCoverImgURL] = useState("");
    const [isLoadedDP, setIsLoadedDP] = useState(false);
    const [isLoadedCoverImg, setIsLoadedCoverImg] = useState(false);

    const defaultProfilePic = "https://cdn.pixabay.com/photo/2024/01/10/13/08/ai-generated-8499572_960_720.jpg";

    const [profilePic, setProfilePic] = useState(loggedInUser?.profilePic || defaultProfilePic);
    const [coverImg, setCoverImg] = useState(loggedInUser?.coverImg || defaultCoverImage );
   
        const [posts, setPosts] = useState([]);
        const [yourFavoriteVoices, setYourFavoriteVoices] = useState([]);

        useEffect(() => {
            const fetchPosts = async () => {
                try {
                    const data = await axios.get(`${process.env.REACT_APP_Backend_url}/posts?email=${email}`);
                    setPosts(data.data);
                } catch (error) {
                    console.error("Error fetching posts:", error);
                }
            };
            fetchPosts();
        }, [email]);

        useEffect(() => {
            const fetchYourFavoriteVoices = async () => {
                // try {
                //     const data = await axios.get(`${process.env.REACT_APP_Backend_url}/yourFavoriteVoices?email=${email}`);
                //     setYourFavoriteVoices(data.data);
                // } catch (error) {
                //     console.error("Error fetching posts:", error);
                // }
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
            
            postsHeading.style.borderRadius = "10px";
            postsHeading.style.borderWidth = "2px";
            postsHeading.style.borderBottom = "2px solid #62fcb7";

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

            favoriteVoices.style.borderRadius = "10px";
            favoriteVoices.style.borderWidth = "2px";
            favoriteVoices.style.borderBottom = "2px solid #62fcb7";

            postHeading.style.borderBottom = "none";
            postHeading.style.borderWidth = "none";
        }

        useEffect(() => {
            handlePostClick();
        }, []);
          
        useEffect(() => {
            if (loggedInUser?.coverImg) {
                setCoverImg(loggedInUser.coverImg);
            }
        }, [loggedInUser]);

        const handleUploadCoverImage = (e) => {
            e.preventDefault();
            console.log("inside handleUploadCoverImage");
            setIsLoadedCoverImg(true);
            const image = e.target.files[0];
            console.log(image);
        
            const formData = new FormData();
            formData.set('image', image);
        
            axios.post(`https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMGBB_API_KEY}`, formData).then((response) => {
                console.log("inside axios");
                console.log(response.data.data.display_url);

                
        
                const userProfileDetails = {
                    username: username,
                    fullname : FullName,
                    email: email,
                    coverImg: response.data.data.display_url
                };
        
                if (response.data.data.display_url) {

                    
                    // console.log(loggedInUser);
                    // console.log(userProfileDetails);
                    
                    axios.patch(`${process.env.REACT_APP_Backend_url}/userUpdates/${email}`, userProfileDetails).then((res) => {
                        console.log("inside axios patch");
                        console.log(res);
                        console.log(res.data);
                        
                        setCoverImg(response.data.data.display_url);

                        setIsLoadedCoverImg(false);
                        e.target.value = null;
                    }).catch((error) => {
                        console.error("Error:", error);
                        setIsLoadedCoverImg(false);
                    });
                }

            }).catch((error) => {
                console.error("Error:", error);
                setIsLoadedCoverImg(false);
            });
        }

        const handleUploadProfileImage = (e) => {
            e.preventDefault();
            // console.log("inside handleUploadProfileImage");
            setIsLoadedDP(true);
            const image = e.target.files[0];
            console.log(image);
        
            const formData = new FormData();
            formData.set('image', image);
        
            axios.post(`https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMGBB_API_KEY}`, formData).then((response) => {
                console.log("inside axios");
                console.log(response.data.data.display_url);
        
                const userProfileDetails = {
                    username: username,
                    fullname : FullName,
                    email: email,
                    profilePic: response.data.data.display_url
                };
        
                if (response.data.data.display_url) {

                    // console.log(loggedInUser);
                    // console.log(userProfileDetails);
        
                    axios.patch(`${process.env.REACT_APP_Backend_url}/userUpdates/${email}`, userProfileDetails).then((res) => {
                        console.log("inside axios patch");
                        // console.log(response);
                        console.log(res.data);

                        setProfilePic(response.data.data.display_url);

                        setIsLoadedDP(false);
                        e.target.value = null;
                    }).catch((error) => {
                        console.error("Error:", error);
                        setIsLoadedDP(false);
                    });


                    const postProfilePicInfo = { profilePic: response.data.data.display_url };

                    axios.patch(`${process.env.REACT_APP_Backend_url}/postUpdates/${email}`, postProfilePicInfo)
                        .then((res) => {
                            console.log(res.data);
                        })
                        .catch((error) => {
                            console.error("Error:", error);
                        });


                }

            }).catch((error) => {
                console.error("Error:", error);
                setIsLoadedDP(false);
            });

            
        };

        useEffect(() => {
            if (loggedInUser?.profilePic) {
                setProfilePic(loggedInUser.profilePic);
            }
        }, [loggedInUser]);

        const [open, setOpen] = useState(null);
        const handleOpen = (id) => () => setOpen(id);
        const handleClose = () => setOpen(null);

        const handleBackClick = () =>{
            navigate('/home');
        }
        

    return (
        <div classNameNameName="MainPage">
            
            <NavBar heading= {t("My_Profile")} username={username} handleBackClick={handleBackClick} className="NavBar"/>
            
            <div className="CoverImage">
                <div className="onHoverDiv">
                    <input type="file" id="picUpload" accept="image/*" onChange={handleUploadCoverImage} />
                    <img src={coverImg} alt="Cover"  />    

                    <label htmlFor="picUpload" className="uploadIcon">
                        {isLoadedCoverImg ? <RotateLeftIcon style={{ fontSize: 40, color: "#fff200"}} /> : <CenterFocusWeakIcon style={{ fontSize: 48, color: "#fff200"}} />}

                    </label>
                </div>
            </div>

            <div className="profilePicContainer">
                <div className="onHoverDiv">
                    <input type="file" id="profilePicUpload" accept="image/*" onChange={handleUploadProfileImage} />
                    <Avatar src= {profilePic} className="profilePic"/>

                </div>

                <div className="editProfile">
                    <label htmlFor="profilePicUpload" className="editProfileIcon">
                        {isLoadedDP ? <RotateLeftIcon style={{ fontSize: 40, color: "black"}} /> : <EditIcon/>}
                    </label>

                </div>
            </div>

            <EditProfile user={user} loggedInUser={loggedInUser} onProfileSave={handleProfileSave} className="editProfileBtn" />

                <div className="profileCard1">
                    <div className="keys">
                        <h4 title="Username"> {t("Username")} </h4>
                        <h4 title="Email"> {t("Email")} </h4>
                        {bio && <h4 title="Bio">  {t("Bio")}  </h4>}
                        {location && <h4 title="Location"> {t("Location")} </h4>}
                    </div>
                    <div className="values">
                        <h4 title={username}>{username}</h4>
                        <h4 title={email}>{email}</h4>
                        {bio && <h4 title={bio}>{bio}</h4>}
                        {location && <h4 title={location}>{location}</h4>}
                    </div>
                </div>

            <div className="section">

                <div className="Headings">
                    <h4 className="yourPostsHeading" onClick={handlePostClick}> {t("Your_Posts")} </h4>
                    <h4 className="yourFavoriteHeading" onClick={handleFavoriteClick}> {t("Your_Favorite_Voices")} </h4>
                </div>

                <div className="yourPostsSection">
                    <div className="yourPosts">
                        {posts && posts.length > 0 ? (
                        <ul className="postsList">
                            {posts.map((post, index) => (
                            <li key={index} className="postCard">
                                <img
                                    src={post.imageURL || defaultCoverImage}
                                    alt="Post"
                                    className="postImage"
                                />

                                    <div className="postContent">
                                        
                                        <p className="postText" >{post.Voice}</p>

                                        <button className="voiceViewBtn" onClick={handleOpen(index)}>
                                            {t("View_Full_Voice")}
                                        </button>

                                        <Modal
                                            open={open === index}
                                            hideBackdrop
                                            onClose={handleClose}
                                            aria-labelledby="modal-modal-title"
                                            aria-describedby="modal-modal-description">

                                            <div className="overlay" onClick={handleClose}>

                                                <Box sx={style} className="modalBox" onClick={(e) => e.stopPropagation()}>
                                                    <div className="modalBoxContent">
                                                        <div className="header">
                                                            <IconButton onClick={handleClose} className="closeBtn">
                                                                <CloseIcon />
                                                            </IconButton>
                                                            <h2 className="header-title">Voice</h2>
                                                        </div>
                                                        <div className="content">
                                                            <p className="voiceText">{post.Voice}</p>
                                                        </div>
                                                    </div>
                                                    
                                                </Box>
                                            </div>

                                        </Modal>


                                    </div>
                            </li>
                            ))}
                        </ul>
                        ) : (
                            <p> {t("No_Posts_Avail")} </p>
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
                            <p> {t("No_fav_avail")} </p>
                        )}
                    </div>
                    
                </div>


            </div>

            
            
        </div>
    );
};

export default MainPage;
