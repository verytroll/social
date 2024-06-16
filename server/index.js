
const path = require("path");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const userRoute = require("./routes/users");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const multer = require("multer");
const app = express();
const port = 8000;

mongoose.connect("mongodb://localhost:27017/social", {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("[Server]: Connected to MongoDB");
    })
    .catch((err) => {
        console.log("[Server]: " + err);
    });

app.use("/images", express.static(path.join(__dirname, "public", "images")));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(morgan("common"));
app.use(cors());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    }
});
const upload = multer({storage: storage});
app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
        res.status(200).json("File uploaded successfully.");
    } catch (error) {
        res.status(500).json(error);
    }
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

app.listen(port, () => {
    console.log(`[Server]: Listening on port http://localhost:${port}`);
});
