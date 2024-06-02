import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Feed.css";
import VoiceBox from "./VoiceBox";
import Post from "./Post/Post";
import { Button } from "@mui/material";

const Feed = () => {
    const [posts, setPosts] = useState([]);

    const fetchPosts = () => {
        fetch('http://localhost:5000/post')
            .then((response) => response.json())
            .then((data) => {
                setPosts(data);
            })
            .catch((error) => console.error('Error fetching posts:', error));
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className='FeedPage'>
            <div className='Header'>
                <h1 className='Title'>Your Feed</h1>
            </div>
                <VoiceBox className='VoiceBox' />
                <Button className="refreshBtn" onClick={fetchPosts}>Refresh feed</Button>
            <div className='Content'>
                {posts && posts.length > 0 ? (
                    posts.map((post) => <Post key={post._id} post={post} />)
                ) : (
                    <p>No posts available</p>
                )}
            </div>
        </div>
    );
}

export default Feed;
