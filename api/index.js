//creating express server as:-
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multer = require("multer"); //this library is used for to upload images
const path = require("path");
//to use dotenv write as:-
dotenv.config();

app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "/images")));

//connect with mongDB as and if connected then print "Connected to MongoDB" and otherwise if some error occur then catch the error and print error:-
mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

//code for uplode images as:-

//btana hoga ki image ko kha upload krna h.us folder ka path.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images"); //bta rahe ki jo api k ander imgages folder hai usme image ko upload krna hai.
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

//finally file or pic ko hum uplod krenge imgaes folder me as:-
//ye post method hoga:-
const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});

//es endpoint pe ye authRoute imported file ka code chlega as:-
app.use("/api/auth", authRoute);
//es endpoint pe ye userRoute imported file ka code chlega as:-
app.use("/api/users", userRoute);
//es endpoint pe ye userRoute imported file ka code chlega as:-
app.use("/api/posts", postRoute);
//es endpoint pe ye userRoute imported file ka code chlega as:-
app.use("/api/categories", categoryRoute);

//lesning express server in port 5000 as:-
app.listen("5000", () => {
  console.log("Backend is running");
});
