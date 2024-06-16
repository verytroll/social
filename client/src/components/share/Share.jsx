
import "./share.css"
import {PermMedia, Label, Room, EmojiEmotions, Cancel} from "@mui/icons-material"
import {useContext, useRef, useState} from "react";
import {AuthContext} from "../../context/AuthContext";
import axios from "axios";

export default function Share() {
    let PF = process.env.REACT_APP_PUBLIC_FOLDER;
    let {user} = useContext(AuthContext);
    let [file, setFile] = useState(null);
    let desc = useRef();

    let handleSubmit = async (event) => {
        event.preventDefault();
        let post = {
            userId: user._id,
            desc: desc.current.value,
        }

        if(file) {
            let data = new FormData();
            let fileName = Date.now() + file.name;
            data.append("name", fileName);
            data.append("file", file);
            post.image = fileName;
            try {
                await axios.post("/upload", data);
            } catch(error) {
                console.log(error);
            }
        }

        try {
            await axios.post("/posts", post);
            window.location.reload();
        } catch(error) {
            console.log(error);
        }
    }

    return(
        <div className="share">
            <div className="shareWrapper">
                <div className="shareTop">
                    <img className="shareProfileImage" src={user.profilePicture ? PF+user.profilePicture : PF+"person/noAvatar.png"} alt="" />
                    <input ref={desc} placeholder={"What's in your mind " + user.username + "?"} className="shareInput" />
                </div>
                <hr className="shareHr" />
                {file && (
                <div className="shareImageContainer">
                    <img src={URL.createObjectURL(file)} alt="" className="shareImage" />
                    <Cancel className="shareImageCancel" onClick={() => {setFile(null);}} />
                </div>
                )}
                <form className="shareBottom" onSubmit={handleSubmit} >
                    <div className="shareOptions">
                        <label htmlFor="file" className="shareOption">
                            <PermMedia htmlColor="tomato" className="shareOptionIcon" />
                            <span className="shareOptionText">Photo or Video</span>
                            <input hidden type="file" id="file" accept=".png,.jpeg,.jpg" onChange={(event) => {setFile(event.target.files[0])}} />
                        </label>
                        <div className="shareOption">
                            <Label htmlColor="blue" className="shareOptionIcon" />
                            <span className="shareOptionText">Tag</span>
                        </div>
                        <div className="shareOption">
                            <Room htmlColor="green" className="shareOptionIcon" />
                            <span className="shareOptionText">Location</span>
                        </div>
                        <div className="shareOption">
                            <EmojiEmotions htmlColor="goldenrod" className="shareOptionIcon" />
                            <span className="shareOptionText">Feelings</span>
                        </div>
                    </div>
                    <button className="shareButton" type="submit">Share</button>
                </form>
            </div>
        </div>
    );
}
