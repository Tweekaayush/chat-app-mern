import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../slices/userSlice";

const Navbar = () => {
  const { _id } = useSelector((state) => state.user.data);
  const dispatch = useDispatch()
  return (
    <nav>
      <Link className="nav-brand" to="/">
        Chat app
      </Link>
      {_id ? <button onClick={()=>dispatch(logout())}>Logout</button> : <></>}
    </nav>
  );
};

export default Navbar;
