
const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");

// GET timeline posts
router.get("/timeline/:userId", async (req, res) => {
    let user = null;
    try {
        user = await User.findById(req.params.userId);
        let userPostList = await Post.find({userId: user._id});
        let followingPostList = new Array(user.followings.length);
        for(let followingIndex = 0; followingIndex < user.followings.length; ++followingIndex) {
            followingPostList[followingIndex] = await Post.find({userId: user.followings[followingIndex]});
        }

        res.status(200).json(userPostList.concat(...followingPostList));
    } catch(err) {
        if(!user) {res.status(403).json("User doesn't exits.");}
        else {res.status(500).json(err);}
    }
})

// GET user's all posts
router.get("/profile/:username", async (req, res) => {
    let user = null;
    try {
        user = await User.findOne({username: req.params.username});
        let userPostList = await Post.find({userId: user._id});
        res.status(200).json(userPostList);
    } catch(err) {
        if(!user) {res.status(403).json("User doesn't exits.");}
        else {res.status(500).json(err);}
    }
})

// LIKE / UNLIKE
router.put("/:id/like", async (req, res) => {
    let user = null;
    let post = null;
    try {
        user = await Post.findById(req.body.userId);
        post = await Post.findById(req.params.id);

        let hasLiked = false;
        for(let i = 0; i < post.likes.length; ++i) {
            if(post.likes[i] === req.body.userId) {
                hasLiked = true;
                break;
            }
        }

        let action = hasLiked ? {$pull: {likes: req.body.userId}} : {$push: {likes: req.body.userId}};
        await post.updateOne(action);
        res.status(200).json(`Post has been ${hasLiked ? "unliked" : "liked"}`);
    } catch(err) {
        if(!user) {res.status(403).json("User doesn't exits.");}
        else if(!post) {res.status(403).json("Post doesn't exits.");}
        else {res.status(500).json(err);}
    }
})

// UPDATE
router.put("/:id", async (req, res) => {
    let post = null;
    try {
        post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId) {
            await post.updateOne({$set: req.body});
            res.status(200).json("Post has been updated");
        }
        else {
            res.status(403).json("You can update only your post");
        }
    } catch(err) {
        if(!post) {res.status(403).json("Post doesn't exits.");}
        else {res.status(500).json(err);}
    }
})

// DELETE
router.delete("/:id", async (req, res) => {
    let post = null;
    try {
        post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId) {
            await post.deleteOne({$set: req.body});
            res.status(200).json("Post has been deleted");
        }
        else {
            res.status(403).json("You can delete only your post");
        }
    } catch(err) {
        if(!post) {res.status(403).json("Post doesn't exits.");}
        else {res.status(500).json(err);}
    }
})

// GET a post
router.get("/:id", async (req, res) => {
    let post = null;
    try {
        post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch(err) {
        if(!post) {res.status(403).json("Post doesn't exits.");}
        else {res.status(500).json(err);}
    }
})

// CREATE
router.post("/", async (req, res) => {
    let user = null;
    try {
        user = await User.findById(req.body.userId);
        let post = new Post(req.body);
        await post.save();
        res.status(200).json(post);
    } catch(err) {
        if(!user) {res.status(403).json("User doesn't exits.");}
        else {res.status(500).json(err);}
    }
})

module.exports = router;
