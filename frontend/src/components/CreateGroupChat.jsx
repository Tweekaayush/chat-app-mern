import React, { useRef, useState, useEffect, useCallback } from "react";
import { IoIosPeople, IoIosSearch } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { getAllUsers } from "../slices/chatSlice";

const CreateGroupChat = ({ groupOpen, setGroupOpen }) => {
  const [formData, setFormData] = useState({
    name: "",
    members: [],
  });
  const [search, setSearch] = useState("");
  const {
    loading,
    data: { userList },
  } = useSelector((state) => state.chats);
  const { data } = useSelector((state) => state.user);
  const ref = useRef(null);
  const dispatch = useDispatch();

  const searchUsers = useCallback(() => {
    dispatch(getAllUsers(search));
  }, [search]);

  const handleClickOutside = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      setGroupOpen(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(searchUsers, 1000);
    return () => clearTimeout(timeout);
  }, [searchUsers]);

  useEffect(() => {
    window.addEventListener("click", handleClickOutside, true);
    return () => window.removeEventListener("click", handleClickOutside, true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({...formData, members: [...formData.members, data]});
  };
  return (
    <div
      className="create-chat-overlay"
      style={{ display: groupOpen ? "" : "none" }}
    >
      <div className="create-group-dialog" ref={ref}>
        <IoClose className="close-button" />
        <h1>Create Group Chat</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="" className="form-label">
            <h6>Group Name</h6>
            <div>
              <IoIosPeople />
              <input
                type="text"
                name="name"
                id=""
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Group Name"
              />
            </div>
          </label>
          <label className="form-label">
            <h6>Members:</h6>
            <div>
              <IoIosSearch />
              <input
                type="text"
                name=""
                id=""
                value={search}
                placeholder="Find Chatters..."
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </label>
          <ul className="user-list">
            {userList
              ?.filter(
                (user) =>
                  formData?.members?.findIndex((u) => u._id === user._id) === -1
              )
              .map((user) => {
                return (
                  <li key={user._id} className="user-list-item">
                    <div className="user-list-item-image">
                      <img src={user?.profile_img?.url} alt={user?.name} />
                    </div>
                    <h1>{user?.name}</h1>
                    <button
                      onClick={() =>
                        setFormData({
                          ...formData,
                          members: [...formData.members, user],
                        })
                      }
                    >
                      Add
                    </button>
                  </li>
                );
              })}
          </ul>
          <button type="submit" className="button-1">
            create group
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupChat;
