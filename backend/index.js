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
const cloudinary = require('cloudinary')
const app = express()
// const path = require('path')

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


app.get('/', (req, res)=>{
  res.send('Server is up and running!')
})

// const __dirname1 = path.resolve()
// if(process.env.NODE_ENV==='production'){
//   app.use(express.static(path.join(__dirname1, '/frontend/build')))

//   app.get('*', (req,res)=>{
//     res.sendFile(path.resolve(__dirname1,"frontend","build","index.html"))
//   })
// }else{
//   app.get('/', (req, res)=>{
//     res.send('Api is running successfully')
//   })
// }

//error middlewares

app.use(notFound);
app.use(errorHandler);

const server = app.listen(process.env.PORT, (req, res) => {
  console.log("Server up and running");
});

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

const onlineUser = new Set();

io.on("connection", (socket) => {
  console.log("connected to socketio");

  socket.on("setup", (user) => {
    socket.join(user?._id);

    onlineUser.add(user?._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });
  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", (newMessageReceived) => {
    let chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.users not defined");
  
    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup", (user) => {
    onlineUser.delete(user?._id);
    socket.leave(user?._id);
  });

  socket.emit("online user", Array.from(onlineUser));
});

