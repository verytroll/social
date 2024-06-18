
const router = require("express").Router();
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

// CREATE
router.post("/", async(req, res) => {
    let conversation = null;
    try {
        conversation = await Conversation.findOne({
            _id: req.body.conversationId,
            members: {$in: [req.body.senderId]}
        });
        if(conversation) {
            let message = new Message(req.body);
            await message.save();
            res.status(200).json(message);
        } else {
            res.status(403).json("Conversation not found");
        }
    } catch(err) {
        if(!conversation) {res.status(403).json("Conversation not found");}
        else {res.status(500).json(err);}
    }
})

// GET
router.get("/:conversationId", async(req, res) => {
    try {
        let messages = await Message.find({
            conversationId: req.params.conversationId
        });
        res.status(200).json(messages);
    } catch(err) {
        res.status(500).json(err);
    }
})

module.exports = router;
