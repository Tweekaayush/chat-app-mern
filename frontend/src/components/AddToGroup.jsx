import React, { useCallback, useEffect, useRef, useState } from "react";
import { IoIosSearch, IoIosCloseCircleOutline } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { addToGroup, getAllUsers } from "../slices/chatSlice";
import { IoClose } from "react-icons/io5";

const AddToGroup = ({openAddParticipants, setOpenAddParticipants}) => {
  const [search, setSearch] = useState("");
  const {
    loading,
    data: { userList, activeChat },
  } = useSelector((state) => state.chats);
  const ref = useRef(null);
  const dispatch = useDispatch();

  const searchUsers = useCallback(() => {
    dispatch(getAllUsers(search));
  }, [search]);

  const handleClickOutside = (e) =>{
    if(ref.current && !ref.current.contains(e.target)){
        setOpenAddParticipants(false)
    }
  }

  useEffect(() => {
    const timeout = setTimeout(searchUsers, 1000);
    return () => clearTimeout(timeout);
  }, [searchUsers]);

  useEffect(() => {
    window.addEventListener("click", handleClickOutside, true);
    return () => window.removeEventListener("click", handleClickOutside, true);
  }, []);

  return (
    <div className="create-chat-overlay" style={{display: openAddParticipants?'':'none'}}>
      <div className="create-chat-dialog" ref={ref}>
        <IoClose className="close-button" onClick={()=>setOpenAddParticipants(false)}/>
        <h1>Add Participants</h1>
        <div>
          <label className="search-user-input">
            <IoIosSearch />
            <input
              type="text"
              name=""
              id=""
              value={search}
              placeholder="find chatters..."
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <IoIosCloseCircleOutline onClick={() => setSearch("")} />
            )}
          </label>
        </div>
        <ul className="user-list">
          {userList?.map((user) => {
            return (
              <li key={user._id} className="user-list-item">
                <div className="profile-img">
                  <img src={user?.profile_img?.url} alt={user?.name} />
                </div>
                <h1>{user?.name}</h1>
                <button onClick={()=>[dispatch(addToGroup({userId: user?._id, groupId: activeChat?._id})), setOpenAddParticipants(false)]}>Add</button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default AddToGroup;
