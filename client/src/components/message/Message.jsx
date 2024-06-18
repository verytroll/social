
import {format} from "timeago.js";
import "./message.css";

export default function Message({message, own}) {
    return(
        <div className={"message"+(own ? " own" : "")}>
            <div className="messageTop">
                <img src="" alt="" className="messageImage" />
                <p className="messageText">{message.text}</p>
            </div>
            <div className="messageBottom">{format(message.createdAt)}</div>
        </div>
    );
}
