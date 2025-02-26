import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoMdArrowRoundBack } from "react-icons/io";
import {
  getSender,
  getSenderId,
  getSenderImage,
  getSenderStatus,
  getTimestamp,
  isChatBlocked,
  isUserBlocked,
} from "../utils/utils";
import { IoIosSend } from "react-icons/io";
import {
  appendMessage,
  clearActiveChat,
  fetchChatList,
  fetchMessages,
  sendMessage,
  updateNotifications,
} from "../slices/chatSlice";
import ChatDetails from "./ChatDetails";

const ChatBox = ({ setOpenAddParticipants }) => {
  let timeout;
  const ref = useRef(null);
  const [selectedChatCompare, setSelectedChatCompare] = useState(null);
  const [message, setMessage] = useState("");
  const {
    loading,
    data: { activeChat, activeChatMessages, socketConnection, notifications },
  } = useSelector((state) => state.chats);
  const {
    data: { _id },
  } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isTyping, setIsTyping] = useState(false);
  const [activeChatPage, setActiveChatPage] = useState(0);

  const handleBack = () => {
    dispatch(clearActiveChat());
  };

  const typingHandler = (e) => {
    setMessage(e.target.value);

    if (!socketConnection) return;
    if (!isTyping) {
      socketConnection.emit("typing", activeChat._id);
    }

    let lastTypingTime = new Date().getTime();
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= 3000) {
        socketConnection.emit("stop typing", activeChat._id);
      }
    }, 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    socketConnection.emit("stop typing", activeChat._id);
    dispatch(sendMessage({ chatId: activeChat._id, content: message }));
    setMessage("");
  };

  useEffect(() => {
    setSelectedChatCompare(activeChat);
    setActiveChatPage(0);
    dispatch(fetchMessages(activeChat._id));
  }, [activeChat?._id]);

  useEffect(() => {
    const receivedMessage = (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        newMessageReceived.chat._id !== activeChat?._id
      ) {
        if (!notifications.includes(newMessageReceived)) {
          dispatch(updateNotifications([...notifications, newMessageReceived.chat]));
          dispatch(fetchChatList());
        }
      } else {
        dispatch(appendMessage(newMessageReceived));
        dispatch(fetchChatList());
      }
    };
    socketConnection?.on("message received", receivedMessage);

    return () => {
      socketConnection?.off("message received", receivedMessage);
    };
  });

  useEffect(() => {
    socketConnection?.on("typing", () => setIsTyping(true));
    socketConnection?.on("stop typing", () => setIsTyping(false));
  });

  useEffect(() => {
    ref?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [activeChatMessages, isTyping]);

  return Object.keys(activeChat).length !== 0 ? (
    activeChatPage === 0 ? (
      <div className="chat-box-container">
        <div className="chat-box-header" onClick={() => setActiveChatPage(1)}>
          <span>
            <IoMdArrowRoundBack onClick={handleBack} />
          </span>
          <div>
            <div className="profile-img">
              <img
                src={
                  activeChat?.isGroupChat
                    ? activeChat?.group_img?.url
                    : getSenderImage(_id, activeChat?.users)
                }
                alt={
                  activeChat?.isGroupChat
                    ? activeChat?.chatName
                    : getSender(_id, activeChat?.users)
                }
              />
            </div>
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
        </div>
        <div className="chat-box-messages">
          <ul className="message-list">
            {activeChatMessages.map((m) => {
              return (
                <li key={m._id} className={m?.sender?._id === _id ? "owner" : ""}>
                  <div className="profile-img">
                    <img
                      src={m?.sender?.profile_img?.url}
                      alt={m?.sender?.name}
                    />
                  </div>
                  <div className="message-content">
                    {activeChat?.isGroupChat && <h6>{m?.sender?.name}</h6>}
                    <p
                      className={`message ${
                        activeChat?.isGroupChat ? "group-msg" : ""
                      }`}
                    >
                      {m?.content}
                    </p>
                    <p className="message-sent-time">
                      {getTimestamp(m?.createdAt)}
                    </p>
                  </div>
                </li>
              );
            })}
            {isTyping && (
              <div class="chat-bubble">
                <div class="typing">
                  <div class="dot"></div>
                  <div class="dot"></div>
                  <div class="dot"></div>
                </div>
              </div>
            )}
            <li ref={ref}></li>
          </ul>
        </div>
        {isUserBlocked(activeChat.users, _id) ? (
          <div className="block-msg">
            <p>You have blocked this user.</p>
          </div>
        ) : isChatBlocked(activeChat.users, _id) ? (
          <div className="block-msg">
            <p>You cannot reply to this coversation</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="chat-input">
            <label htmlFor="">
              <input
                type="text"
                name="text"
                id="text"
                placeholder="Enter message"
                value={message}
                onChange={typingHandler}
              />
            </label>
            <button type="submit">
              <IoIosSend />
            </button>
          </form>
        )}
      </div>
    ) : (
      <ChatDetails
        setActiveChatPage={setActiveChatPage}
        setOpenAddParticipants={setOpenAddParticipants}
      />
    )
  ) : (
    <div className="empty-chat-box">
      <p>Select a chat to start a conversation.</p>
    </div>
  );
};

export default ChatBox;
