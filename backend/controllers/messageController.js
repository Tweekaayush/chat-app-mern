const asyncHandler = require('../middlewares/asyncHandler')
const Chat = require('../models/chatModel')
const Message = require('../models/messageModel')
const User = require('../models/userModel')

exports.sendMessage = asyncHandler(async(req, res)=>{
    const {content, chatId} = req.body

    if(!content && !chatId){
        res.status(400)
        throw new error('Invalid data sent to the route')
    }

    let newMessage = await Message.create({
        sender: req.user._id,
        content,
        chat: chatId
    })


    newMessage = await Message.findById(newMessage._id).populate('sender', 'name profile_img').populate('chat')

    newMessage = await User.populate(newMessage, {
        path: 'chat.users',
        select: 'name profile_img'
    })

    await Chat.findByIdAndUpdate(chatId, {
        latestMessage: newMessage
    })

    res.status(201).json({
        success:true,
        newMessage,
        message: 'Message Sent'
    })
})

exports.fetchMessages = asyncHandler(async(req, res)=>{
    const messages = await Message.find({chat: req.params.chatId}).populate('sender', 'name profile_img').populate('chat')
    res.json({
        success: true,
        messages
    })
})