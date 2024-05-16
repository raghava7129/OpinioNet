import React, { useState } from "react";
import {Avatar, Button} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import "./VoiceBox.css"

function VoiceBox(){

    const [Voice, setVoice] = useState("");
    const [imageURL, setImageURL] = useState("");

    const handleVoice = (e) => {
        e.preventDefault();
        console.log(Voice);

    }


    return(
        <div className="VoiceBox">
            <form onSubmit={handleVoice}>

                <div className="VoiceBox_input">
                    <Avatar src = "https://cdn.pixabay.com/photo/2024/01/10/13/08/ai-generated-8499572_960_720.jpg"/>

                    <input type="text"  
                        placeholder="speak your mind"
                        onChange={(e)=>{setVoice(e.target.value)}}/>


                </div>

                <div className="imageIcon_VoiceButton">
                    <label htmlFor="image" className="imageIcon">
                        <AddPhotoAlternateIcon/>
                    </label>

                    <input type="text" id = "image" className="imageInput" />

                    <Button className = "VoiceBox__VoiceButton"  type = "submit" >
                        Send Your Voice
                    </Button>

                </div>

            </form>
        </div>
    )
}

export default VoiceBox;