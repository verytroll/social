
import Share from "../share/Share";
import Post from "../post/Post";
import "./feed.css";
import {useEffect, useState, useContext} from "react";
import {AuthContext} from "../../context/AuthContext"
import axios from "axios";

export default function Feed({username}) {
    let [posts, setPosts] = useState([]);
    let {user} = useContext(AuthContext);

    useEffect(() => {
        let fetchPosts = async () => {
            let url = username ? `posts/profile/${username}` : `posts/timeline/${user._id}`;
            let res = await axios.get(url);
            setPosts(res.data.sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }));
        }
        fetchPosts();
    }, [username, user._id]);

    return(
        <div className="feed">
            <div className="feedWrapper">
                {(!username || username === user.username) && <Share />}
                {posts.map((post) => {
                    return <Post key={post._id} post={post}/>
                })}
            </div>
        </div>
    );
}
