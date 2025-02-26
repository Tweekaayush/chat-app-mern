const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require("cookie-parser");
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const connectDB = require("./config/db");
const user = require("./routes/userRoutes");
const chat = require("./routes/chatRoutes");
const message = require("./routes/messageRoutes");
const { errorHandler, notFound } = require("./middlewares/errorHandler");
const { app, server } = require("./config/socket");
const cloudinary = require('cloudinary')
// const app = express()

//connect database

connectDB();

// cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

//middlewares

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(fileUpload());

//routes

app.use("/api/v1/users", user);
app.use("/api/v1/chats", chat);
app.use("/api/v1/messages", message);

//error middlewares

app.use(notFound);
app.use(errorHandler);

server.listen(process.env.PORT, (req, res) => {
  console.log("Server up and running");
});
