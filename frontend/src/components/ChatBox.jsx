import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoMdArrowRoundBack } from "react-icons/io";
import { getSender, getSenderStatus } from "../utils/utils";
import { IoIosSend } from "react-icons/io";
import { sendMessage } from "../slices/chatSlice";

const ChatBox = () => {
  const [message, setMessage] = useState("");
  const {
    loading,
    data: { activeChat, activeChatMessages },
  } = useSelector((state) => state.chats);
  const {
    data: { _id },
  } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(sendMessage({ chatId: activeChat._id, content: message }));
    setMessage("");
  };

  return Object.keys(activeChat).length !== 0 ? (
    <div className="chat-box-container">
      <div className="chat-box-header">
        <span>
          <IoMdArrowRoundBack />
        </span>
        <div className="chat-box-header-info">
          <h2>
            {activeChat?.isGroupChat
              ? activeChat?.chatName
              : getSender(_id, activeChat?.users)}
          </h2>
          <p>
            {activeChat?.isGroupChat
              ? "Tap to see group info"
              : getSenderStatus(_id, activeChat?.users)}
          </p>
        </div>
      </div>
      <div className="chat-box-messages">
        <ul className="message-list">
          {activeChatMessages.map((m) => {
            return (
              <li className={m?.sender?._id === _id?'owner':''}>
                <div className="profile-img">
                  <img
                    src={m?.sender?.profile_img?.url}
                    alt={m?.sender?.name}
                  />
                </div>
                <div className="message-content">
                  <p className="message">{m?.content}</p>
                  <p className="message-sent-time">{m?.createdAt}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <form onSubmit={handleSubmit} className="chat-input">
        <label htmlFor="">
          <input
            type="text"
            name="text"
            id="text"
            placeholder="Enter message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>
        <button type="submit">
          <IoIosSend />
        </button>
      </form>
    </div>
  ) : (
    <div className="empty-chat-box">
      <p>Select a chat to start a conversation.</p>
    </div>
  );
};

export default ChatBox;
