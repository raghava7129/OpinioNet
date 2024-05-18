import React, { useState } from "react";
import {Avatar, Button} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import "./VoiceBox.css";
import axios from "axios";

function VoiceBox(){

    const [Voice, setVoice] = useState("");
    const [imageURL, setImageURL] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);

    const handleImgUpload = (e) => {
        setIsLoaded(true);
        e.preventDefault();
        const image = e.target.files[0];
        console.log(image);

        const formData = new FormData();
        formData.set('image', image);

        axios.post(`https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMGBB_API_KEY}`, formData).then((response) => {
            console.log(response.data.data.display_url);
            setImageURL(response.data.data.display_url);
            setIsLoaded(false);
        }).catch((error) => {
            console.error("Error:", error);
               setIsLoaded(false);
        });

    }

    const handleVoice = (e) => {
        e.preventDefault();
        if(Voice === "" && imageURL === ""){
            return;
        }
        else{
            const userPost = {
                Voice: Voice,
                imageURL: imageURL,
            }
    
            console.log(userPost);
    
            fetch("http://localhost:5000/post", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userPost),
            }).then((response) => {
                console.log("Response:", response);
                setVoice("");
                setImageURL("");
                
            }).catch((error) => {
                console.error("Error:", error);
            });
        }
    

    }


    return(
        <div className="VoiceBox">
            <form onSubmit={handleVoice}>

                <div className="VoiceBox_input">
                    <Avatar src = "https://cdn.pixabay.com/photo/2024/01/10/13/08/ai-generated-8499572_960_720.jpg"/>

                    <input type="text" 
                        id="Voice" 
                        placeholder="speak your mind"
                        onChange={(e)=>{setVoice(e.target.value)}}/>


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
                     onChange={handleImgUpload}/>

                    <Button className = "VoiceBox__VoiceButton"  type = "submit" >
                        Send Your Voice
                    </Button>

                </div>

            </form>
        </div>
    )
}

export default VoiceBox;