
const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

// UPDATE
router.put("/:id", async (req, res) => {
    if((req.body.userId === req.params.id) || req.body.isAdmin) {
        if(req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch(err) {
                res.status(500).json(err);
            }
        }

        try {
            let user = await User.findByIdAndUpdate(req.params.id, {$set: req.body});
            res.status(200).json("Account has been updated");
        } catch(err) {
            res.status(500).json(err);
        }
    }
    else {
        res.status(403).json("You can update only your account!");
    }
});

// DELETE
router.delete("/:id", async (req, res) => {
    if((req.body.userId === req.params.id) || req.body.isAdmin) {
        try {
            let user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted");
        } catch(err) {
            res.status(500).json(err);
        }
    }
    else {
        res.status(403).json("You can delete only your account!");
    }
});

// GET
router.get("/", async (req, res) => {
    let userId = req.query.userId;
    let username = req.query.username;
    try {
        let user = userId ? await User.findById(userId) : await User.findOne({username: username});
        let {password, updatedAt, ...output} = user._doc;
        res.status(200).json(output);
    } catch(err) {
        res.status(500).json(err);
    }
});

// Follow
router.put("/:id/follow", async (req, res) => {
    if(req.body.userId !== req.params.id) {
        try {
            let otherUser = await User.findById(req.params.id);
            let currentUser = await User.findById(req.body.userId);

            if(otherUser && currentUser) {
                let hasFollowed = false;
                for(let i = 0; i < otherUser.followers.length; ++i) {
                    if(otherUser.followers[i] === req.body.userId) {
                        hasFollowed = true;
                        break;
                    }
                }

                if(!hasFollowed) {
                    await otherUser.updateOne({$push: {followers: req.body.userId}});
                    await currentUser.updateOne({$push: {followings: req.params.id}});
                    res.status(200).json("User has been followed");
                } else {
                    res.status(403).json("You already follow this user");
                }
            }
        } catch(err) {
            res.status(500).json(err);
        }
    }
    else {
        res.status(403).json("You can't follow yourself");
    }
});

// Unfollow
router.put("/:id/unfollow", async (req, res) => {
    if(req.body.userId !== req.params.id) {
        try {
            let otherUser = await User.findById(req.params.id);
            let currentUser = await User.findById(req.body.userId);

            if(otherUser && currentUser) {
                let hasFollowed = false;
                for(let i = 0; i < otherUser.followers.length; ++i) {
                    if(otherUser.followers[i] === req.body.userId) {
                        hasFollowed = true;
                        break;
                    }
                }

                if(hasFollowed) {
                    await otherUser.updateOne({$pull: {followers: req.body.userId}});
                    await currentUser.updateOne({$pull: {followings: req.params.id}});
                    res.status(200).json("User has been unfollowed");
                } else {
                    res.status(403).json("You haven't followed this user");
                }
            }
        } catch(err) {
            res.status(500).json(err);
        }
    }
    else {
        res.status(403).json("You can't unfollow yourself");
    }
});

// GET friends
router.get("/friends/:userId", async (req, res) => {
    let user = null;
    try {
        user = await User.findById(req.params.userId);
        let followingList = new Array(user.followings.length);
        for(let followingIndex = 0; followingIndex < user.followings.length; ++followingIndex) {
            let {_id, username, profilePicture} = await User.findById(user.followings[followingIndex]);
            followingList[followingIndex] = {_id, username, profilePicture};
        }
        
        res.status(200).json(followingList);
    } catch(err) {
        if(!user) {res.status(403).json("User doesn't exits.")}
        else {res.status(500).json(err);}
    }
})

module.exports = router;
