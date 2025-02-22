import React, { useState } from "react";
import { IoIosSearch, IoIosCloseCircleOutline } from "react-icons/io";
import { getSender } from "../utils/utils";

const FilterChatList = ({
  loggedInUser,
  chatList,
  filteredChatList,
  setFilteredChatList,
}) => {
  const [search, setSearch] = useState("");
  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value === "") {
      setFilteredChatList(chatList);
    } else {
      setFilteredChatList([
        ...chatList.filter((chat) => {
          const chatName = chat.isGroupChat
            ? chat.chatName
            : getSender(loggedInUser, chat.users);

          return chatName.toLowerCase().includes(value.toLowerCase());
        }),
      ]);
    }
  };
  return (
    <div className="filter-user-input">
      <label htmlFor="">
        <IoIosSearch />
        <input
          type="text"
          placeholder={`search chat...`}
          value={search}
          onChange={handleChange}
        />
        {search && <IoIosCloseCircleOutline/>}
      </label>
    </div>
  );
};

export default FilterChatList;
