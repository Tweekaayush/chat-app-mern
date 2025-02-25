import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../slices/userSlice";
import { IoIosLogOut, IoMdPerson } from "react-icons/io";
import { getSender } from "../../utils/utils";
import { FaBell } from "react-icons/fa";
import { setActiveChat, updateNotifications } from "../../slices/chatSlice";

const Navbar = () => {
  const ref= useRef(null)
  const {
    data: { _id, profile_img, name },
  } = useSelector((state) => state.user);
  const {
    data: { notifications },
  } = useSelector((state) => state.chats);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);

  const handleNotification = (notification) => {
    dispatch(
      updateNotifications(
        notifications?.filter((n) => n._id !== notification?._id)
      )
    );
    dispatch(setActiveChat(notification.chat))
    setOpen(false)
  };

  const handleClickOutside = (e) =>{
    if(ref.current && !ref.current.contains(e.target)){
      setOpen(false)
    }
  }

  useEffect(()=>{
    window.addEventListener('click', handleClickOutside, true)
    return ()=>window.removeEventListener('click', handleClickOutside, true)
  })

  return (
    <nav>
      <Link className="nav-brand" to="/">
        Chat app
      </Link>
      {_id && (
        <div className="nav-items">
          <div className="nav-notifications" ref={ref}>
            <div className="notification-icon" onClick={()=>setOpen(!open)}>
              <FaBell />
            </div>
            <ul className="notifications-list" style={{display: open?'flex':'none'}}>
              <h6>Notifications</h6>
              {notifications?.length === 0 ? (
                <li className="empty-notification">No new messages</li>
              ) : (
                notifications?.map((chat) => {
                  return (
                    <li className="notification" onClick={()=>handleNotification(chat)}>
                      New Message from{" "}
                      {chat.isGroupChat
                        ? chat.chatname
                        : getSender(_id, chat?.chat?.users)}
                    </li>
                  );
                })
              )}
            </ul>
          </div>
          <div
            className="nav-dial"
            onMouseOver={() => setActive(true)}
            onMouseOut={() => setActive(false)}
          >
            <div className="nav-dial-head">
              <img src={profile_img.url} alt={name} />
            </div>
            <ul
              className="nav-options"
              style={{ visibility: active ? "visible" : "" }}
            >
              <li onClick={() => navigate("/profile")}>
                <IoMdPerson />
              </li>
              <li onClick={() => dispatch(logout())}>
                <IoIosLogOut />
              </li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
