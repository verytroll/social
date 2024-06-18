
const router = require("express").Router();
const User = require("../models/User");
const Conversation = require("../models/Conversation");

// CREATE
router.post("/", async(req, res) => {
    let users  = null;
    try {
        users = await User.find({$or: [{_id: req.body.senderId}, {_id: req.body.receiverId}]});
        let conversation = new Conversation({
            members: [req.body.senderId, req.body.receiverId]
        });
        await conversation.save();
        res.status(200).json(conversation);
    } catch(err) {
        if(!users) {res.status(403).json("User not found");}
        else {res.status(500).json(err);}
    }
})

// GET
router.get("/:userId", async(req, res) => {
    try {
        let conversation = await Conversation.find({
            members: {$in: [req.params.userId]}
        });
        res.status(200).json(conversation);
    } catch(err) {
        res.status(500).json(err);
    }
})

// GET with two userId
router.get("/find/:firstUserId/:secondUserId", async(req, res) => {
    try {
        let conversation = await Conversation.findOne({
            members: {$all: [req.params.firstUserId, req.params.secondUserId]}
        });
        res.status(200).json(conversation);
    } catch(err) {
        res.status(500).json(err);
    }
})

module.exports = router;
