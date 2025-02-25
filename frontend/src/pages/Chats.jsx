import React, { useEffect, useState } from "react";
import FilterUsers from "../components/FilterChatList";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChatList,
  setOnlineUsers,
  setSocketConnection,
} from "../slices/chatSlice";
import ChatList from "../components/ChatList";
import { IoAdd } from "react-icons/io5";
import { IoIosPeople } from "react-icons/io";
import ChatBox from "../components/ChatBox";
import io from "socket.io-client";

const Chats = ({ setChatOpen, setGroupOpen, setOpenAddParticipants }) => {
  const {
    loading,
    data: { chatList },
  } = useSelector((state) => state.chats);
  const {
    data: { _id },
    data: user,
  } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [filteredChatList, setFilteredChatList] = useState([]);

  useEffect(() => {
    dispatch(fetchChatList());

    const socket = io(process.env.REACT_APP_SERVER_URL);

    socket.emit("setup", user);

    socket.on("connected", () => {
      dispatch(setSocketConnection(socket));
    });

    socket.on("online user", (data) => {
      dispatch(setOnlineUsers(data));
      console.log(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleResize = () =>{
    const width = window.innerWidth
  }

  useEffect(() => {
    setFilteredChatList(chatList);
  }, [chatList]);

  useEffect(()=>{
    window.addEventListener('resize', handleResize, true)
    return ()=>window.removeEventListener('resize', handleResize, true)
  }, [])

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
        <ChatBox setOpenAddParticipants={setOpenAddParticipants} />
      </div>
    </div>
  );
};

export default Chats;
