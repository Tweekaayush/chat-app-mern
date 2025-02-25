const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");
const asyncHandler = require("../middlewares/asyncHandler");
const User = require("../models/userModel");
const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

const onlineUser = new Set();

io.on("connection", (socket) => {
  console.log("connected to socketio");

  socket.on("setup", (user) => {
    socket.join(user?._id);
    console.log(user?._id);
    onlineUser.add(user?._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
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
    console.log(newMessageReceived, chat);
    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup", (user) => {
    console.log("User Disconnected");
    onlineUser.delete(user?._id);
    socket.leave(user?._id);
  });

  socket.emit("online user", Array.from(onlineUser));
});

module.exports = { app, server };
