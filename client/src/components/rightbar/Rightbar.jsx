
import "./rightbar.css";
import Online from "../online/Online"
import {Users} from "../../dummyData";
import {useEffect, useState, useContext} from "react";
import {Link} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import {Follow, Unfollow} from "../../context/AuthActions"
import {Add, Remove} from "@mui/icons-material";
import axios from "axios";

export default function Rightbar({user}) {
    let PF = process.env.REACT_APP_PUBLIC_FOLDER;
    let [friends, setFriends] = useState([]);
    let [followed, setFollowed] = useState(false);
    let {user:currentUser, dispatch} = useContext(AuthContext);

    useEffect(() => {
        if(user?._id) {
            let hasFollowed = false;
            for(let i = 0; i < currentUser.followings.length; ++i) {
                if(currentUser.followings[i] === user._id) {
                    hasFollowed = true;
                    break;
                }
            }
            setFollowed(hasFollowed);
        }
    }, [user])

    useEffect(() => {
        let getFriends = async () => {
            if(user?.id) {
                try {
                    let friendList = await axios.get("users/friends/" + user._id);
                    setFriends(friendList.data);
                } catch(err) {
                    console.log(err);
                }
            }
        }

        getFriends();
    }, [user])

    let html = "";
    if(user) {
        let isCurrentUser = (user.username !== currentUser.username);
        let handleClick = async () => {
            try {
                if(followed) {
                    await axios.put("/users/"+user._id+"/unfollow", {userId: currentUser._id});
                    dispatch(Unfollow(user._id));
                    setFollowed(false);
                } else {
                    await axios.put("/users/"+user._id+"/follow", {userId: currentUser._id});
                    dispatch(Follow(user._id));
                    setFollowed(true);
                }
            } catch(err) {
                console.log(err);
            }
        }
        
        html = (
            <>
                {isCurrentUser && (
                <button className="rightbarFollowButton" onClick={handleClick}>
                    {followed ? "Unfollow" : "Follow"}{followed ? <Remove /> : <Add />}
                </button>
                )}
                <h4 className="rightbarTitle">User infomation</h4>
                <div className="rightbarInfo">
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">City:</span>
                        <span className="rightbarInfoValue">{user.city || "-"}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">From:</span>
                        <span className="rightbarInfoValue">{user.from || "-"}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">Relationship:</span>
                        <span className="rightbarInfoValue">{(user.relationship === 1) ? "Single" : (user.relationship === 2) ? "Married" : "-"}</span>
                    </div>
                </div>
                <h4 className="rightbarTitle">User friends</h4>
                <div className="rightbarFollowings">
                    {friends.map((friend) => {
                        return(
                            <Link key={friend._id} to={"/profile/"+friend.username} style={{color:"black", textDecoration:"none"}}>
                                <div className="rightbarFollowing">
                                    <img src={friend.profilePicture ? PF+friend.profilePicture : PF+"person/noAvatar.png"} alt="" className="rightbarFollowingImage" />
                                    <span className="rightbarFollowingName">{friend.username}</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </>
        );
    }
    else {
        html = (
            <>
                <div className="birthdayContainer">
                    <img className="birthdayImage" src="/assets/gift.png" alt="" />
                    <span className="birthdayText">
                        <b>Pola Foster</b> and <b>3 other friends</b> have a birthday today.
                    </span>
                </div>
                <img className="rightbarAd" src="/assets/ad.png" alt="" />
                <h4 className="rightbarTitle">Online Friends</h4>
                <ul className="rightbarFriendList">
                    {Users.map((user) => {
                        return <Online key={user.id} user={user}/>
                    })}
                </ul>
            </>
        );
    }

    return(
        <div className="rightbar">
            <div className="rightbarWrapper">
                {html}
            </div>
        </div>
    );
}

