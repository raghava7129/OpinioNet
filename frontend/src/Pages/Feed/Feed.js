import React from "react";
import { Link } from "react-router-dom";
import "./Feed.css";
import VoiceBox from "./VoiceBox";

const Feed = () => {
    return (
        <div className = 'FeedPage'>
                <h1 className='Title'>Your Feed</h1>
                <VoiceBox className = 'VoiceBox' />
        </div>
        

    );
}

export default Feed;