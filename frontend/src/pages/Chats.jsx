import React, { useEffect, useState } from "react";
import FilterUsers from "../components/FilterChatList";
import { useDispatch, useSelector } from "react-redux";
import { fetchChatList } from "../slices/chatSlice";
import ChatList from "../components/ChatList";
import { IoAdd } from "react-icons/io5";
import { IoIosPeople } from "react-icons/io";

const Chats = ({setChatOpen, setGroupOpen}) => {
  const {
    loading,
    data: { chatList },
  } = useSelector((state) => state.chats);
  const {
    data: { _id },
  } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [filteredChatList, setFIlteredChatList] = useState([]);

  useEffect(() => {
    dispatch(fetchChatList());
  }, []);

  useEffect(() => {
    setFIlteredChatList(chatList);
  }, [chatList]);

  return (
    <div className="container">
      <div className="chats-container">
        <div className="chats-container-left">
          <FilterUsers
            chatList={chatList}
            filteredChatList={filteredChatList}
            setFilteredChatList={setFIlteredChatList}
            loggedInUser={_id}
          />
          <ChatList chatList={filteredChatList} loggedInUser={_id} />
          <div className="create-chats">
            <button onClick={()=>setChatOpen(true)}>
              <IoAdd />
            </button>
            <button onClick={()=>setGroupOpen(true)}>
              <IoIosPeople />
            </button>
          </div>
        </div>
        <div className="chats-container-right">f</div>
      </div>
    </div>
  );
};

export default Chats;
