
import {useState, useEffect} from "react";
import axios from "axios";
import "./chatOnline.css";

export default function ChatOnline({onlineUsers, currentId, setCurrentConversation}) {
    let PF = process.env.REACT_APP_PUBLIC_FOLDER;
    let [friends, setFriends] = useState([]);
    let [onlineFriends, setOnlineFriends] = useState([]);

    useEffect(() => {
        let getFriends = async() => {
            try {
                let res = await axios.get("/users/friends/"+currentId);
                setFriends(res.data);
            } catch(err) {
                console.log(err);
            }
        }

        getFriends();
    }, [currentId])

    useEffect(() => {
        let arr = [];
        for(let i = 0; i < friends.length; ++i) {
            for(let j = 0; j < onlineUsers.length; ++j) {
                if(friends[i]._id === onlineUsers[j]) {
                    arr.push(friends[i]);
                }
            }
        }
        setOnlineFriends(arr);
    }, [friends, onlineUsers])
    
    let handleClick = async (user) => {
        try {
            let res = await axios.get(`/conversations/find/${currentId}/${user._id}`);
            setCurrentConversation(res.data);
        } catch(err) {
            console.log(err);
        }
    }

    return(
        <div className="chatOnline">
            {onlineFriends.map((friend) => {
                return(
                    <div key={friend._id} className="chatOnlineFriend" onClick={()=>{handleClick(friend);}} >
                        <div className="chatOnlineImageContainer">
                            <img src={friend.profilePicture ? PF+friend.profilePicture : PF+"person/noAvatar.png"} alt="" className="chatOnlineImage" />
                            <span className="chatOnlineBadge"></span>
                        </div>
                        <span className="chatOnlineName">{friend.username}</span>
                    </div>
                );
            })}
        </div>
    );
}
