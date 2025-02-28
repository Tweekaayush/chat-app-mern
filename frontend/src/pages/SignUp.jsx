import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoIosMail, IoIosLock, IoIosPerson } from "react-icons/io";
import { Link } from "react-router-dom";
import { signup } from "../slices/userSlice";

const SignUp = () => {
  const {
    loading,
    data: { _id },
  } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: "",
  });
  const [showPassword, setShowPassword] = useState(false);

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

  const validate = () => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const err = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      image: "",
    };

    if (formData.name === "") {
      err.name = "Please enter your name.";
    }
    if (!pattern.test(formData.email)) {
      err.email = "Please enter a valid email.";
    }
    if (formData.password.length < 8) {
      err.password = "Your password should be atleast 8 characters long.";
    }
    if (formData.confirmPassword !== formData.password) {
      err.confirmPassword = "Your passwords do not match";
    }
    if (formData.image === "") {
      err.image = "Please upload a profile image.";
    }

    setFormErrors({ ...err });

    return (
      !err.name &&
      !err.email &&
      !err.password &&
      !err.confirmPassword &&
      !err.image
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      dispatch(signup({ ...formData }));
    }
  };

  useEffect(() => {
    if (_id) {
      navigate("/");
    }
  }, [_id]);

  useEffect(() => {
    document.title = "Chit Chat - Profile";
  }, []);

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
                placeholder="Your Name"
              />
            </div>
            {formErrors.name && <p className="error-msg">{formErrors.name}</p>}
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
                placeholder="youremail@gmail.com"
              />
            </div>
            {formErrors.email && (
              <p className="error-msg">{formErrors.email}</p>
            )}
          </label>
          <label htmlFor="password" className="form-label">
            <h6>password</h6>
            <div>
              <IoIosLock />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                name="password"
                onChange={handleChange}
                placeholder="********"
              />
            </div>
            {formErrors.password && (
              <p className="error-msg">{formErrors.password}</p>
            )}
          </label>
          <label htmlFor="confirmPassword" className="form-label">
            <h6>confirm Password</h6>
            <div>
              <IoIosLock />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                name="confirmPassword"
                onChange={handleChange}
                placeholder="********"
              />
            </div>
            {formErrors.confirmPassword && (
              <p className="error-msg">{formErrors.confirmPassword}</p>
            )}
          </label>
          <label htmlFor="showPassword" className="show-password-check">
            <input
              type="checkbox"
              name="showPassword"
              id="showPassword"
              checked={showPassword}
              onClick={() => setShowPassword(!showPassword)}
            />
            <span></span>
            <p>Show Password</p>
          </label>
          <label htmlFor="confirmPassword" className="form-label">
            <h6>Profile Image</h6>
            <div>
              <input type="file" name="image" onChange={handleImage} />
            </div>
            {formErrors.image && (
              <p className="error-msg">{formErrors.image}</p>
            )}
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
