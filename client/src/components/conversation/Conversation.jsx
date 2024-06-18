
import {useState, useEffect} from "react";
import axios from "axios";
import "./conversation.css";

export default function Conversation({conversation, user}) {
    let PF = process.env.REACT_APP_PUBLIC_FOLDER;
    let [otherUser, setOtherUser] = useState({});

    useEffect(() => {
        let otherId = 0;
        for(let i = 0; i < conversation.members.length; ++i) {
            if(conversation.members[i] !== user._id) {
                otherId = conversation.members[i];
                break;
            }
        }

        let getUser = async() => {
            try {
                let res = await axios.get("/users?userId="+otherId);
                setOtherUser(res.data);
            }catch (err) {
                console.log(err);
            }
        }

        getUser();
    }, [conversation, user])

    return(
        <div className="conversation">
            <img src={otherUser.profilePicture ? PF+otherUser.profilePicture : PF+"person/noAvatar.png"} alt="" className="conversationImage" />
            <span className="conversationName">{otherUser.username}</span>
        </div>
    );
}
