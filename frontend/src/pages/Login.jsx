import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosMail, IoIosLock } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../slices/userSlice";

const Login = () => {
  const { _id } = useSelector((state) => state.user.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const err = {
      email: "",
      password: "",
    };

    if (!pattern.test(formData.email)) {
      err.email = "Please enter a valid email.";
    }
    if (formData.password.length === 0) {
      err.password = "Please enter your password";
    }
    setFormErrors({ ...err });

    return !err.email && !err.password;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      dispatch(login(formData));
    }
  };

  useEffect(() => {
    if (_id) {
      navigate("/");
    }
  }, [_id]);

  useEffect(() => {
    document.title = "Chit Chat - Login";
  }, []);

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
                placeholder="youremail@gmail.com"
              />
            </div>
            {formErrors.email && (
              <p className="error-msg">{formErrors.email}</p>
            )}
          </label>
          <label htmlFor="password" className="form-label">
            <h6>Password</h6>
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
          <button type="submit" className="button-1">
            Login
          </button>
          <p className="form-link">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
