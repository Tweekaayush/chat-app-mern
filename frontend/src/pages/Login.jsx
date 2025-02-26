import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosMail, IoIosLock } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../slices/userSlice";

const Login = () => {
  const {_id} = useSelector(state=>state.user.data)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    dispatch(login(formData))
  };

  useEffect(()=>{
    if(_id){
      navigate('/')
    }
  }, [_id])

  return (
    <div className="container">
      <div className="form-container">
        <h1 className="heading-1">Login</h1>
        <p className="body-text-1">We are so excited to see you!</p>
        <form onSubmit={handleSubmit} id="login">
          <label htmlFor="email" className="form-label">
            <h6>Email</h6>
            <div>
              <IoIosMail />
              <input
                type="email"
                value={formData.email}
                name="email"
                onChange={handleChange}
              />
            </div>
          </label>
          <label htmlFor="password" className="form-label">
            <h6>Password</h6>
            <div>
              <IoIosLock />
              <input
                type="password"
                value={formData.password}
                name="password"
                onChange={handleChange}
              />
            </div>
          </label>
          <button type="submit" className="button-1">Login</button>
          <p className="form-link">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
