
const io = require("socket.io")(8100, {
    cors: {
        origin: "*"
    }
});

// {userId: , socketID: }
let users = [];

function addUser(socketId, userId) {
    let hasAdded = false;
    for(let i = 0; i < users.length; ++i) {
        if(users[i].userId === userId) {
            hasAdded = true;
            break;
        }
    }

    if(!hasAdded) {
        users.push({userId, socketId});
    }
}

function removeUser(socketId, userId) {
    for(let i = 0; i < users.length; ++i) {
        if(users[i].socketId === socketId) {
            users.splice(i, 1);
            break;
        }
    }
}

function getUser(userId) {
    let result = null;
    for(let i = 0; i < users.length; ++i) {
        if(users[i].userId === userId) {
            result = users[i];
            break;
        }
    }
    return(result);
}

io.on("connection", (socket) => {
    console.log("A user connected.");

    socket.on("addUser", (userId) => {
        addUser(socket.id, userId);
        io.emit("getUsers", users);
    });

    socket.on("sendMessage", ({senderId, receiverId, text}) => {
        let user = getUser(receiverId);
        io.to(user.socketId).emit("getMessage", {
            senderId,
            text,
        });
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected!");
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
})
