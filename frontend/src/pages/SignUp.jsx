import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoIosMail, IoIosLock, IoIosPerson } from "react-icons/io";
import { Link } from "react-router-dom";
import { signup } from "../slices/userSlice";

const SignUp = () => {
  const {loading, data: {_id} } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImage = (e) => {
    const file = Array.from(e.target.files)[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setFormData({ ...formData, image: reader.result });
      }
    };

    reader.readAsDataURL(file);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    dispatch(signup({ ...formData }));
  };

  useEffect(() => {
    if (_id) {
      navigate("/");
    }
  }, [_id]);

  return (
    <div className="container">
      <div className="form-container">
        <h1 className="heading-1">Sign Up</h1>
        <p className="body-text-1">Create an account and start chatting!</p>
        <form onSubmit={handleSubmit} id="login">
          <label htmlFor="name" className="form-label">
            <h6>Name</h6>
            <div>
              <IoIosPerson />
              <input
                type="text"
                value={formData.name}
                name="name"
                onChange={handleChange}
              />
            </div>
          </label>
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
            <h6>password</h6>
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
          <label htmlFor="confirmPassword" className="form-label">
            <h6>confirm Password</h6>
            <div>
              <IoIosLock />
              <input
                type="password"
                value={formData.confirmPassword}
                name="confirmPassword"
                onChange={handleChange}
              />
            </div>
          </label>
          <label htmlFor="confirmPassword" className="form-label">
            <h6>Profile Image</h6>
            <div>
              <input type="file" name="image" onChange={handleImage} />
            </div>
          </label>
          {formData?.image !== "" && (
            <div className="profile-img">
              <img src={formData?.image} alt={formData?.name} />
            </div>
          )}
          <button type="submit" className="button-1" disabled={loading}>
            Sign Up
          </button>
          <p className="form-link">
            Already have an account? <Link to="/login">Log In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
