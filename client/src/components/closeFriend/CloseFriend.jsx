
import "./closeFriend.css";

export default function CloseFriend({user}) {
    let PF = process.env.REACT_APP_PUBLIC_FOLDER;
    return(
        <li className="leftbarFriendListItem">
            <img className="leftbarFriendImage" src={PF+user.profilePicture} alt="" />
            <span className="leftbarFriendName">{user.username}</span>
        </li>
    );
}
