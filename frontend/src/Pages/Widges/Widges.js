import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Widges.css";
import { useState } from "react";
import defaultCoverImage from '../../assets/images/OpinioNetLogo.png';

import FreeSolo from "../../Components/solo/FreeSolo";
import axios from "axios";
import useLoggedInUser from "../../hooks/useLoggedInUser";

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';

import { useTranslation } from 'react-i18next';

const Widges = () => {
    const { t } = useTranslation();

    const [loggedInUser] = useLoggedInUser();

    const [inputValue, setInputValue] = useState(loggedInUser?.username || "user");
    const [posts, setPosts] = useState([]);

    const handleInputChange = (event, newInputValue) => {
        setInputValue(newInputValue);
        console.log(newInputValue); 
    };

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_Backend_url}/getPosts?username=${inputValue}`).then((response)=>{
            // console.log(response.data);
            setPosts(response.data);
        })
    }
    , [inputValue, loggedInUser]);

    const [open, setOpen] = useState(null);
    const handleOpen = (id) => () => setOpen(id);
    const handleClose = () => setOpen(null);

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


    return (
        <div className="widges">
            <h1>{t("Widges")}</h1>
            <FreeSolo inputValue={inputValue} handleInputChange={handleInputChange} />

            <div className="yourPostsSection">
                    <div className="yourPosts">
                        {posts && posts.length > 0 ? (
                        <ul className="postsList">
                            {posts.map((post, index) => (
                            <li key={index} className="postCard">

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
                                                            <h2 className="header-title"> {t("Voice")} </h2>
                                                        </div>
                                                        <div className="content">

                                                            <img src={post.imageURL || defaultCoverImage} alt="Voice image" className="voiceImage" />
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
                            <p>{t("No_posts_available")}</p>
                        )}
                    </div>
                </div>
            
        </div>
    );
}

export default Widges;

