import React, { useState, useEffect } from "react";
import {Avatar, Button} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import "./VoiceBox.css";
import axios from "axios";
import useLoggedInUser from "../../hooks/useLoggedInUser";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../firebase.init";

function VoiceBox(){

    const [Voice, setVoice] = useState("");
    const [imageURL, setImageURL] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);

    const [loggedInUser] = useLoggedInUser();
    const user = useAuthState(auth);

    const userEmail = user[0]?.email;
    // console.log("userEMail from VoiceBox  : "+userEmail);

    const [FullName, setFullName] = useState('');
    const [UserName, setUserName] = useState('');

    const defaultProfilePic = "https://cdn.pixabay.com/photo/2024/01/10/13/08/ai-generated-8499572_960_720.jpg";
    const [profilePic, setProfilePic] = useState(loggedInUser?.profilePic || defaultProfilePic);

    const handleImgUpload = (e) => {
        e.preventDefault();
        // console.log("inside handleImgUpload");
        setIsLoaded(true);
        const image = e.target.files[0];
        console.log(image);

        const formData = new FormData();
        formData.set('image', image);

        axios.post(`https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMGBB_API_KEY}`, formData).then((response) => {
            console.log("inside axios");
            console.log(response.data.data.display_url);
            setImageURL(response.data.data.display_url);

            setIsLoaded(false);
            e.target.value = null;

        }).catch((error) => {
            console.error("Error:", error);
               setIsLoaded(false);
        });

    }

    useEffect(() => {
        if (loggedInUser?.profilePic) {
            setProfilePic(loggedInUser.profilePic);
        }
    }, [loggedInUser]);

    const handleVoice = (e) => {
        e.preventDefault();

        console.log("VoiceBox providerID : "+user[0]?.providerData[0].providerId);

        if(user[0]?.providerData[0].providerId == 'password'){
            const usersName = loggedInUser?.username ? loggedInUser?.username : "User";
            setUserName(usersName);
            const Name = loggedInUser?.fullName ? loggedInUser?.fullName : "User fullname";
            setFullName(Name);

            const userPost = {
                profilePic: profilePic,
                Voice: Voice,
                imageURL: imageURL,
                username: usersName,
                name: Name,
                email: userEmail
            }

            console.log("from normal signUp : "+userPost);

            axios.get(`http://localhost:5000/subscriptions/user/${userEmail}`).then((response) => {
            if (response.data.length === 1) {
                const prevPostLimit = response.data[0].postLimit;

                if(prevPostLimit >0){


                    axios.patch(`http://localhost:5000/subscriptions/user/${userEmail}`, {
                        postLimit: prevPostLimit - 1
                      })
                      .then((response) => {
                        
                        fetch("http://localhost:5000/post", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(userPost),
                        }).then((response) => {
                            console.log("Response:", response);
                            
                        }).catch((error) => {
                            console.error("Error:", error);
                        });

                      }).catch((error) => {
                        console.error('Error in patch request:', error);
                        alert('from voice box Error adding subscription1');
                      });

                }
                else{
                    alert("You have reached your post limit, Please upgrade your subscription");
                }
            }
            else {
                console.error('Subscription not found or multiple subscriptions returned');
                alert('Subscription not found');
            }
        }).catch((error) => {
            console.error('Error in get request:', error);
            alert('Error adding subscription2');
        });



           

            
        

        }

        else{
            const NAME = user[0]?.displayName || "User";
            const USERNAME = user[0]?.email.split('@')[0];
            setFullName(NAME);
            setUserName(USERNAME);
            const userProfilePic = loggedInUser?.profilePic?loggedInUser?.profilePic
            : "https://cdn.pixabay.com/photo/2024/01/10/13/08/ai-generated-8499572_960_720.jpg";

            const userPost = {
                profilePic: userProfilePic,
                Voice: Voice,
                imageURL: imageURL,
                username: USERNAME,
                name: NAME,
                email: userEmail
            }

            console.log("from Google signUp : "+userPost);

            axios.get(`http://localhost:5000/subscriptions/user/${userEmail}`).then((response) => {
                if (response.data.length === 1) {
                    const prevPostLimit = response.data[0].postLimit;
    
                    if(prevPostLimit >0){
    
    
                        axios.patch(`http://localhost:5000/subscriptions/user/${userEmail}`, {
                            postLimit: prevPostLimit - 1 
                          }).then((response) => {
                            
                            fetch("http://localhost:5000/post", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(userPost),
                            }).then((response) => {
                                console.log("Response:", response);
                                
                            }).catch((error) => {
                                console.error("Error:", error);
                            });
    
                        }).catch((error) => {
                            console.error('Error in patch request:', error);
                            alert('VoiceBox Google Error adding subscription1');
                        });
    
                    }
                    else{
                        alert("You have reached your post limit, Please upgrade your subscription");
                    }
                }
                else {
                    console.error('Subscription not found or multiple subscriptions returned');
                    alert('Subscription not found');
                }
            }).catch((error) => {
                console.error('Error in get request:', error);
                alert('Error adding subscription2');
            });

            
        }

        
        setVoice("");
        setImageURL("");
    

    }


    return(
        <div className="VoiceBox">
            <form onSubmit={handleVoice}>

                <div className="VoiceBox_input">
                    <Avatar src = {profilePic}/>

                    <input type="text" 
                        id="Voice" 
                        placeholder="speak your mind"
                        onChange={(e)=>{setVoice(e.target.value)}}
                        value={Voice}
                        required
                        />


                </div>

                <div className="imageIcon_VoiceButton">
                    <label htmlFor="image" className="imageIcon">

                        {
                            isLoaded ? <p>Uploading Image...</p>: <p>{imageURL? 'image uploaded' :<AddPhotoAlternateIcon/> } </p>

                        }

                    </label>

                    <input
                     type="file"
                     id = "image"
                     className="imageInput"
                     onChange={handleImgUpload}
                    />

                    <Button className = "VoiceBox__VoiceButton"  type = "submit" >
                        Send Your Voice
                    </Button>

                </div>

            </form>
        </div>
    )
}

export default VoiceBox;