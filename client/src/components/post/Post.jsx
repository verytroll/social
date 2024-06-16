
import "./post.css";
import {MoreVert} from "@mui/icons-material";
import {useState, useEffect, useContext} from "react";
import {Link} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import axios from "axios";
import {format} from "timeago.js";

export default function Post({post}) {
    let [like, setLike] = useState(post.likes.length);
    let [isLiked, setIsLiked] = useState(false);
    let [user, setUser] = useState({});
    let {user:currentUser} = useContext(AuthContext);
    let PF = process.env.REACT_APP_PUBLIC_FOLDER;

    useEffect(() => {
        let hasLiked = false;
        for(let i = 0; i < post.likes.length; ++i) {
            if(post.likes[i] === currentUser._id) {
                hasLiked = true;
                break;
            }
        }
        setIsLiked(hasLiked);
    }, [currentUser._id, post.likes])

    useEffect(() => {
        let fetchUser = async () => {
            let res = await axios.get(`users?userId=${post.userId}`);
            setUser(res.data);
        }
        fetchUser();
    }, [post.userId]);

    let likeHandler = async () => {
        try {
            await axios.put(`posts/${post._id}/like`, {userId: currentUser._id});
        } catch (error) {
            console.log(error);
        }
        setLike(isLiked ? like - 1 : like + 1);
        setIsLiked(!isLiked);
    }

    return(
        <div className="post">
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <Link to={`/profile/${user.username}`}>
                            <img className="postProfileImage" src={user.profilePicture ? PF+user.profilePicture : PF+"person/noAvatar.png"} alt="" />
                        </Link>
                        <span className="postUserName">{user.username}</span>
                        <span className="postDate">{format(post.createdAt)}</span>
                    </div>
                    <div className="postTopRight">
                        <MoreVert />
                    </div>
                </div>
                <div className="postCenter">
                    <div className="postText">{post?.desc}</div>
                    <img className="postImage" src={PF+post.image} alt="" />
                </div>
                <div className="postBottom">
                    <div className="postBottomLeft">
                        <img className="likeIcon" src={`${PF}like.png`} alt="" onClick={likeHandler} />
                        <img className="likeIcon" src={`${PF}heart.png`} alt="" onClick={likeHandler} />
                        <span className="postLikeCounter">{like} people like it</span>
                    </div>
                    <div className="postBottomRight">
                        <div className="postCommentText">{post.comment} comments</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
