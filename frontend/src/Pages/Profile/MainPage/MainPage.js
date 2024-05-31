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

// const style = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: 600,
//     height: 600,
//     bgcolor: 'background.paper',
//     boxShadow: 24,
//     borderRadius: 8,
//   };
  
//   function EditChild({ dob, setDob }) {
//     const [open, setOpen] = React.useState(false);
  
  
//     const handleOpen = () => {
//       setOpen(true);
//     };
//     const handleClose = () => {
//       setOpen(false);
//     };
  
//     return (
//       <React.Fragment>
//         <div className='birthdate-section' onClick={handleOpen}>
//           <text>Edit</text>
//         </div>
//         <Modal
//           hideBackdrop
//           open={open}
//           onClose={handleClose}
//           aria-labelledby="child-modal-title"
//           aria-describedby="child-modal-description"
//         >
  
//         </Modal>
//       </React.Fragment>
//     );
//   }



const MainPage = ({user}) => {

    const navigate = useNavigate();
    const [loggedInUser] = useLoggedInUser();
    const username = loggedInUser?.username ? loggedInUser?.username : user?.email.split('@')[0];
    const email = user?.email;
    const FullName = loggedInUser?.fullName;
    const bio = loggedInUser?.bio;
    const location = loggedInUser?.location;
    const website = loggedInUser?.website;

    const [imageURL, setCoverImgURL] = useState("");
    const [isLoadedDP, setIsLoadedDP] = useState(false);
    const [isLoadedCoverImg, setIsLoadedCoverImg] = useState(false);

    const defaultProfilePic = "https://cdn.pixabay.com/photo/2024/01/10/13/08/ai-generated-8499572_960_720.jpg";

    const [profilePic, setProfilePic] = useState(loggedInUser?.profilePic || defaultProfilePic);
    const [coverImg, setCoverImg] = useState(loggedInUser?.coverImg || defaultCoverImage );

    const [isExpanded, setIsExpanded] = useState(false);

    const handleTextClick = () => {
        setIsExpanded(!isExpanded);
    };

   
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
                // try {
                //     const data = await axios.get(`http://localhost:5000/yourFavoriteVoices?email=${email}`);
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

            favoriteVoices.style.borderRadius = "10px";
            favoriteVoices.style.borderWidth = "2px";
            favoriteVoices.style.borderBottom = "2px solid #949398FF";

            postHeading.style.borderBottom = "none";
            postHeading.style.borderWidth = "none";
        }


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
                    
                    axios.patch(`http://localhost:5000/userUpdates/${email}`, userProfileDetails).then((res) => {
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
        
                    axios.patch(`http://localhost:5000/userUpdates/${email}`, userProfileDetails).then((res) => {
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

                    axios.patch(`http://localhost:5000/postUpdates/${email}`, postProfilePicInfo)
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


      
        

    return (
        <div classNameNameName="MainPage">
            
            <NavBar heading= "My Profile" username={username} className="NavBar"/>
            
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
                        {isLoadedDP ? <RotateLeftIcon style={{ fontSize: 30, color: "black"}} /> : <EditIcon/>}
                    </label>

                </div>


            </div>

            

            <div className="profileCard1">
                <div className="keys">
                    <h4>username</h4>
                    <h4>Email</h4>
                    {bio? <h4>bio</h4>:''}
                    {website? <h4>website</h4>:''}
                    {location? <h4>location</h4>:''}

                </div>

                <div className="values">
                    <h4>{username}</h4>
                    <h4>{email}</h4>

                    {bio? <h4>{bio}</h4>:''}
                    {website? <h4>{website}</h4>:''}
                    {location? <h4>{location}</h4>:''}

                    
                </div>
                
                <div>
                    <EditProfile user={user} loggedInUser={loggedInUser} className= "editProfileBtn" />
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
                                                <div className = {`postText ${isExpanded ? 'expanded' : ''}` }>
                                                    <p onClick={handleTextClick}>{post.Voice}</p>
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
