import React from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { getSender, getSenderImage, getSenderStatus } from "../utils/utils";
import { IoTrash } from "react-icons/io5";
import { removeFromGroup } from "../slices/chatSlice";

const ChatDetails = ({ setActiveChatPage, setOpenAddParticipants }) => {
  const {
    data: { _id },
  } = useSelector((state) => state.user);
  const {
    data: { activeChat },
  } = useSelector((state) => state.chats);

  const dispatch = useDispatch();

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
          {activeChat?.isGroupChat
            ? activeChat?.chatName
            : getSender(_id, activeChat?.users)}
        </h1>
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
                  {activeChat?.groupAdmin._id === _id && activeChat?.groupAdmin._id !== member?._id && (
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
        </div>
      )}
      <div className="chat-details-buttons">
        {activeChat?.isGroupChat ? (
          <>
            <button className="button-success" onClick={()=>setOpenAddParticipants(true)}>Add Participants</button>
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
          <button>Block</button>
        )}
      </div>
    </div>
  );
};

export default ChatDetails;
