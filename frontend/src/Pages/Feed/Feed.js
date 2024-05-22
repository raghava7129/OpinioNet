import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Feed.css";
import VoiceBox from "./VoiceBox";
import Post from "./Post/Post";

const Feed = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/post')
            .then((response) => response.json())
            .then((data) => {
                // console.log(data);
                setPosts(data);
            })
            .catch((error) => console.error('Error fetching posts:', error));
    }, [posts]);

    return (
        <div className='FeedPage'>
            <div className='Header'>
                <h1 className='Title'>Your Feed</h1>
            </div>
                <VoiceBox className='VoiceBox' />
            <div className='Content'>
                {posts.length > 0 ? (
                    posts.map((post) => <Post key={post._id} post={post} />)
                ) : (
                    <p>No posts available</p>
                )}
            </div>
        </div>
    );
}

export default Feed;
