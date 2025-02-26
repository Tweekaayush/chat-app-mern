import React, { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  commonGroups,
  getSender,
  getSenderImage,
  getSenderStatus,
} from "../utils/utils";
import { IoTrash } from "react-icons/io5";
import { removeFromGroup, renameGroup, setActiveChat } from "../slices/chatSlice";
import { MdOutlineModeEditOutline } from "react-icons/md";

const ChatDetails = ({ setActiveChatPage, setOpenAddParticipants }) => {
  const {
    data: { _id },
  } = useSelector((state) => state.user);
  const {
    data: { activeChat,chatList },
  } = useSelector((state) => state.chats);
  const [groupName, setGroupName] = useState("");
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (activeChat?.isGroupChat) {
      setGroupName(activeChat?.chatName);
    }
  }, [activeChat?._id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(renameGroup({ name: groupName, groupId: activeChat?._id }));
    setOpen(false);
  };

  return (
    <div className="chat-details">
      <span>
        <IoMdArrowRoundBack onClick={() => setActiveChatPage(0)} />
      </span>
      <div className="chat-details-head">
        <div className="profile-img-2">
          <img
            src={
              activeChat?.isGroupChat
                ? activeChat?.chatName
                : getSenderImage(_id, activeChat?.users)
            }
            alt={
              activeChat?.isGroupChat
                ? activeChat?.chatName
                : getSender(_id, activeChat?.users)
            }
          />
        </div>
        <h1>
          {activeChat?.isGroupChat ? (
            <>
              {activeChat?.chatName}
              <MdOutlineModeEditOutline onClick={() => setOpen(!open)} />
            </>
          ) : (
            getSender(_id, activeChat?.users)
          )}
        </h1>
        {activeChat?.isGroupChat && (
          <form
            style={{ display: open ? "flex" : "none" }}
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              value={groupName}
              name="chatname"
              onChange={(e) => setGroupName(e.target.value)}
              className="group-name-input"
            />
            <button type="submit">save</button>
          </form>
        )}
        <p>
          {activeChat?.isGroupChat
            ? ""
            : getSenderStatus(_id, activeChat?.users)}
        </p>
      </div>
      {activeChat?.isGroupChat ? (
        <div className="chat-group-info">
          <h1>Members</h1>
          <ul className="member-list">
            {activeChat?.users.map((member) => {
              return (
                <li className="group-member">
                  <div className="profile-img">
                    <img src={member.profile_img.url} alt={member.name} />
                  </div>
                  <h2>{member.name}</h2>
                  {activeChat?.groupAdmin._id === member._id && <h4>Admin</h4>}
                  {activeChat?.groupAdmin._id === _id &&
                    activeChat?.groupAdmin._id !== member?._id && (
                      <IoTrash
                        onClick={() =>
                          dispatch(
                            removeFromGroup({
                              userId: member._id,
                              groupId: activeChat?._id,
                            })
                          )
                        }
                      />
                    )}
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="chat-group-info">
          <h1>Common group(s)</h1>
          <ul className="common-group-list">
            {commonGroups(chatList, activeChat?.users).map((group) => {
              return (
                <li onClick={()=>dispatch(setActiveChat(group))}>
                  <div className="profile-img">
                    <img src="" alt={group.chatName} />
                  </div>
                  <h2>{group.chatName}</h2>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <div className="chat-details-buttons">
        {activeChat?.isGroupChat ? (
          <>
            <button
              className="button-success"
              onClick={() => setOpenAddParticipants(true)}
            >
              Add Participants
            </button>
            <button
              onClick={() =>
                dispatch(
                  removeFromGroup({ userId: _id, groupId: activeChat?._id })
                )
              }
              className="button-danger"
            >
              Leave Group
            </button>
          </>
        ) : (
          <button className="button-danger">Block</button>
        )}
      </div>
    </div>
  );
};

export default ChatDetails;
