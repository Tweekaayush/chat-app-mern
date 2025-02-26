const asyncHandler = require("../middlewares/asyncHandler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

exports.accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400);
    throw new Error("User id param not present");
  }

  let chat = await Chat.findOne({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  chat = await User.populate(chat, {
    path: "latestMessage.sender",
    select: "name email profile_img",
  });

  if (chat) {
    res.status(200).json({
      success: true,
      chat,
    });
  } else {
    const newChat = await Chat.create({
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    });

    const createdChat = await Chat.findById(newChat._id).populate(
      "users",
      "-password"
    );

    res.status(201).json({
      success: true,
      chat: createdChat,
    });
  }
});

exports.fetchChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find({
    users: { $elemMatch: { $eq: req.user._id } },
  })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 });

  res.status(200).json({
    success: true,
    chats,
  });
});

exports.createGroupChat = asyncHandler(async (req, res) => {
  const { name, users } = req.body;

  const groupChat = await Chat.create({
    chatName: name,
    users: users,
    isGroupChat: true,
    groupAdmin: req.user._id,
    group_img: {
      id: "1",
      url: "../assets/group-chat.png",
    },
  });

  const createdGroupChat = await Chat.findById(groupChat._id)
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.status(201).json({
    success: true,
    groupChat: createdGroupChat,
  });
});

exports.renameGroupChat = asyncHandler(async (req, res) => {
  const { name, groupId } = req.body;

  const groupChat = await Chat.findByIdAndUpdate(
    groupId,
    {
      chatName: name,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!groupChat) {
    res.status(404);
    throw new Error("not found");
  }

  res.status(201).json({
    success: true,
    groupChat,
  });
});

exports.addToGroup = asyncHandler(async (req, res) => {
  const { userId, groupId } = req.body;
  const groupChat = await Chat.findByIdAndUpdate(
    groupId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (groupChat) {
    res.status(200).json({ success: true, groupChat });
  } else {
    res.status(404);
    throw new Error("Group Chat not found!");
  }
});

exports.removeFromGroup = asyncHandler(async (req, res) => {
  const { userId, groupId } = req.body;
  
  const groupChat = await Chat.findByIdAndUpdate(
    groupId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (groupChat) {
    res.status(200).json({ success: true, groupChat });
  } else {
    res.status(404);
    throw new Error("Group Chat not found!");
  }
});

exports.blockUserToggle = asyncHandler(async (req, res) => {
  const { userId, groupId } = req.body;
  
  let user = await User.findById(req.user._id);
  
  if (user.blockList.includes(userId)) {
    user.blockList = user.blockList.filter((id) => id.toString() !== userId);
  } else {
    user.blockList = [...user.blockList, userId];
  }

  const updatedUser = await user.save();

  const chat = await Chat.findById(groupId).populate('users', '-password')

  res.status(200).json({
    success: true,
    chat,
  });
});
