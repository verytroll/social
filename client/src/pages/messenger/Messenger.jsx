
import {useState, useEffect, useContext, useRef} from "react";
import {AuthContext} from "../../context/AuthContext";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversation/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import axios from "axios";
import {io} from "socket.io-client";
import "./messenger.css";

export default function Messenger() {
    let [conversations, setConversations] = useState([]);
    let [currentConversation, setCurrentConversation] = useState(null);
    let [messages, setMessages] = useState([]);
    let [newMessage, setNewMessage] = useState("");
    let [arrivalMessage, setArrivalMessage] = useState(null);
    let [onlineUsers, setOnlineUsers] = useState([]);
    let socket = useRef();
    let scrollRef = useRef();
    let {user} = useContext(AuthContext);

    useEffect(() => {
        socket.current = io("ws://localhost:8100"); 
        socket.current.on("getMessage", (data) => {
            setArrivalMessage({
                senderId: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            });
        })
    }, []);

    useEffect(() => {
        socket.current.emit("addUser", user._id);
        socket.current.on("getUsers", (data) => {
            let arr = [];
            for(let i = 0; i < user.followings.length; ++i) {
                for(let j = 0; j < data.length; ++j) {
                    if(user.followings[i] === data[j].userId) {
                        arr.push(data[j].userId);
                    }
                }
            }
            setOnlineUsers(arr);
        });
    }, [user])

    useEffect(() => {
        let getConversations = async() => {
            try {
                let res = await axios.get("/conversations/"+user._id);
                setConversations(res.data);
            } catch(err) {
                console.log(err);
            }
        }

        getConversations();
    }, [user._id])

    useEffect(() => {
        let getMessages = async() => {
            try {
                let res = await axios.get("/messages/"+currentConversation._id);
                setMessages(res.data);
            } catch(err) {
                console.log(err);
            }
        }

        if(currentConversation) {getMessages();}
    }, [currentConversation])

    useEffect(() => {
        if(scrollRef.current) {scrollRef.current.scrollIntoView({behavior: "smooth"});}
    }, [messages])

    useEffect(() => {
        if(arrivalMessage && currentConversation) {
            let idValid = false;
            for(let i = 0; i < currentConversation.members.length; ++i) {
                if(currentConversation.members[i] === arrivalMessage.senderId) {
                    idValid = true;
                    break;
                }
            }

            if(idValid) {
                setMessages((prev) => {
                    return [...prev, arrivalMessage];
                });
            }
        }
    }, [arrivalMessage, currentConversation])

    let handleSubmit = async (event) => {
        event.preventDefault();
        let message = {
            conversationId: currentConversation._id,
            senderId: user._id,
            text: newMessage,
        };

        try {
            let res = await axios.post("/messages", message);

            let receiverId = 0;
            for(let i = 0; i < currentConversation.members.length; ++i) {
                if(currentConversation.members[i] !== user._id) {
                    receiverId = currentConversation.members[i];
                    break;
                }
            }
            socket.current.emit("sendMessage", {
                senderId: user._id,
                receiverId: receiverId,
                text: newMessage,
            });

            setMessages([...messages, res.data]);
            setNewMessage("");
        } catch(err) {
            console.log(err);
        }
    }

    return(
        <>
            <Topbar />
            <div className="messenger">
                <div className="chatMenu">
                    <div className="chatMenuWrapper">
                        <input placeholder="Search for friends" className="charMenuInput" />
                        {conversations.map((conversation) => {
                            return (
                                <div key={conversation._id} onClick={() => {setCurrentConversation(conversation)}}>
                                    <Conversation conversation={conversation} user={user} />
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="chatBox">
                    <div className="chatBoxWrapper">
                        {currentConversation
                        ? <>
                            <div className="chatBoxTop">
                            {messages.map((message) => {
                                let isCurrentUser = (message.senderId === user._id);
                                return(
                                    <div key={message._id} ref={scrollRef}>
                                        <Message message={message} own={isCurrentUser} />
                                    </div>
                                );
                            })}
                            </div>
                            <div className="chatBoxBottom">
                                <textarea
                                    className="chatMessageInput"
                                    placeholder="write something..."
                                    onChange={(event) => {setNewMessage(event.target.value)}}
                                    value={newMessage}
                                ></textarea>
                                <button className="chatSubmitButton" onClick={handleSubmit}>Send</button>
                            </div>
                        </>
                        : <span className="noConversationText">Open a conversation to start a chat</span>
                        }
                    </div>
                </div>
                <div className="chatOnline">
                    <div className="chatOnlineWrapper">
                        <ChatOnline
                            onlineUsers={onlineUsers}
                            currentId={user._id}
                            setCurrentConversation={setCurrentConversation}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
