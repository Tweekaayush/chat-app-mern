import React, { useEffect, useState } from "react";
import FilterUsers from "../components/FilterChatList";
import { useDispatch, useSelector } from "react-redux";
import { fetchChatList } from "../slices/chatSlice";
import ChatList from "../components/ChatList";
import { IoAdd } from "react-icons/io5";
import { IoIosPeople } from "react-icons/io";
import ChatBox from "../components/ChatBox";

const Chats = ({ setChatOpen, setGroupOpen }) => {
  const {
    loading,
    data: { chatList },
  } = useSelector((state) => state.chats);
  const {
    data: { _id },
  } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [filteredChatList, setFilteredChatList] = useState([]);

  useEffect(() => {
    dispatch(fetchChatList());
  }, []);

  useEffect(() => {
    setFilteredChatList(chatList);
  }, [chatList]);

  return (
    <div className="container">
      <div className="chats-container">
        <div className="chats-container-left">
          <FilterUsers
            chatList={chatList}
            filteredChatList={filteredChatList}
            setFilteredChatList={setFilteredChatList}
            loggedInUser={_id}
          />
          <ChatList chatList={filteredChatList} loggedInUser={_id} />
          <div className="create-chats">
            <button onClick={() => setChatOpen(true)}>
              <IoAdd />
            </button>
            <button onClick={() => setGroupOpen(true)}>
              <IoIosPeople />
            </button>
          </div>
        </div>
        <ChatBox />
      </div>
    </div>
  );
};

export default Chats;
