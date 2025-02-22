import React from "react";
import { getSender, getSenderImage } from "../utils/utils";

const ChatList = ({ chatList, loggedInUser }) => {
  return (
    <div className="chat-list-container">
      <ul className="chat-list">
        {chatList?.map((chat) => {
          return (
            <li className="chat-list-item" key={chat._id}>
              <div className="chat-list-item-image">
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
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ChatList;
