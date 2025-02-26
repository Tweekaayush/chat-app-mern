import React from "react";
import { getSender, getSenderImage, getTimestamp } from "../utils/utils";
import { useDispatch } from "react-redux";
import { setActiveChat } from "../slices/chatSlice";

const ChatList = ({ chatList, loggedInUser }) => {
  const dispatch = useDispatch();
  return (
    <ul className="chat-list">
      {chatList?.map((chat) => {
        return (
          <li
            className="chat-list-item"
            key={chat._id}
            onClick={() => dispatch(setActiveChat(chat))}
          >
            <div className="profile-img">
              <img
                src={
                  chat.isGroupChat
                    ? chat?.profile_img?.url
                    : getSenderImage(loggedInUser, chat?.users)
                }
                alt={chat?.chatName}
              />
            </div>
            <div className="chat-list-item-info">
              <h3>
                {chat?.isGroupChat
                  ? chat?.chatName
                  : getSender(loggedInUser, chat.users)}
              </h3>
              <p className="latest-message">{chat?.latestMessage?.content}</p>
            </div>
            <p className="message-sent-time">{getTimestamp(chat?.latestMessage?.createdAt)}</p>
          </li>
        );
      })}
    </ul>
  );
};

export default ChatList;
