
const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        let user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });
        await user.save();
        res.status(200).json(user);
    } catch(err) {
        res.status(500).json(err);
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        let user = await User.findOne({email: req.body.email});
        if(user) {
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if(validPassword) {
                res.status(200).json(user);
            }
            else {
                res.status(400).json("Wrong password");
            }
        }
        else {
            res.status(404).json("User not found");
        }
    } catch(err) {
        res.status(500).json(err);
    }
});

module.exports = router;
