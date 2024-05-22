import React from 'react';
import './Post.css';
import { Avatar } from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import RepeatIcon from '@mui/icons-material/Repeat';
import FavBorderIcon from '@mui/icons-material/FavoriteBorder';
import PublishIcon from '@mui/icons-material/Publish';

const Post = ({ post }) => {

    const {name, username, imageURL, Voice, profilePic} = post;

    return (
        <div className="post">
            <div className="post_avatar">
                <Avatar src={profilePic} />
            </div>
            <div className="post_body">
                <div className="post_header">
                    <div className="post_headerText">
                        <h3>
                            {name}{" "}
                            <span className='post_headerSpecial'>
                                <VerifiedUserIcon className="post_badge" /> @{username}
                            </span>
                        </h3>
                    </div>

                    <div className="post_headerDescription">
                        <p>{Voice}</p>
                    </div>
                    
                    <img src={imageURL} alt="" width = '500'/>
                    <div className="post_footer">
                        <ChatBubbleOutlineIcon className="post_footerIcon" fontSize='small'/>
                        <RepeatIcon className="post_footerIcon" fontSize='small'/>
                        <FavBorderIcon className="post_footerIcon" fontSize='small'/>
                        <PublishIcon className="post_footerIcon" fontSize='small'/>
                        
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Post;