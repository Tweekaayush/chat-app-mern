import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../slices/userSlice";
import { IoIosLogOut, IoMdPerson } from "react-icons/io";

const Navbar = () => {
  const {
    data: { _id, profile_img, name },
  } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [active,setActive] = useState(false)

  return (
    <nav>
      <Link className="nav-brand" to="/">
        Chat app
      </Link>
      {_id && (
        <div className="nav-dial" onMouseOver={()=>setActive(true)} onMouseOut={()=>setActive(false)}>
          <div className="nav-dial-head">
            <img src={profile_img.url} alt={name} />
          </div>
          <ul className="nav-options" style={{visibility: active?'visible':''}}>
            <li onClick={() => navigate("/profile")}>
              <IoMdPerson />
            </li>
            <li onClick={() => dispatch(logout())}>
              <IoIosLogOut />
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
