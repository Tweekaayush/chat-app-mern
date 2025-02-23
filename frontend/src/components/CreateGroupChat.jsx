import React, { useRef, useState, useEffect, useCallback } from "react";
import { IoIosCloseCircleOutline, IoIosPeople, IoIosSearch } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { createGroupChat, getAllUsers } from "../slices/chatSlice";

const CreateGroupChat = ({ groupOpen, setGroupOpen }) => {
  const [formData, setFormData] = useState({
    name: "",
    members: [],
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    members: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      dispatch(createGroupChat({ name: formData.name, users: [...formData.members, data] }))
    }
  };

  const validate = () => {
    const err = {
      name: "",
      members: "",
    };

    if (!formData.name) {
      err.name = "Please enter a group name";
    }

    if (formData.members.length === 0) {
      err.members = "Must contain 2 or more members";
    }

    setFormErrors({ ...err });

    return !err.name && !err.members;
  };

  useEffect(() => {
    const timeout = setTimeout(searchUsers, 1000);
    return () => clearTimeout(timeout);
  }, [searchUsers]);

  useEffect(() => {
    window.addEventListener("click", handleClickOutside, true);
    return () => window.removeEventListener("click", handleClickOutside, true);
  }, []);

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
            {formErrors.name && <p className="error-msg">{formErrors.name}</p>}
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
            {formErrors.members && (
              <p className="error-msg">{formErrors.members}</p>
            )}
          </label>
            {formData.members.length !== 0  && <ul className="create-group-member-list">
              {formData.members.map((member)=>{
                return <li className="create-group-member">
                  <h6>{member.name}</h6>
                  <IoIosCloseCircleOutline/>
                </li>
              })}
            </ul>}
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
