
import "./online.css"

export default function Online({user}) {
    let PF = process.env.REACT_APP_PUBLIC_FOLDER;
    return(
        <li className="rightbarFriendListItem">
            <div className="rightbarProfileImageContainer">
                <img className="rightbarProfileImage" src={PF+user.profilePicture} alt="" />
                <span className="rightbarOnline"></span>
            </div>
            <span className="rightbarUsername">{user.username}</span>
        </li>
    );
}
