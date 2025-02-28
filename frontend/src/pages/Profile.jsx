import React, { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../slices/userSlice";
import { changeTheme } from "../slices/themeSlice";

const Profile = () => {
  const {
    loading,
    data: { _id, name, email, profile_img, status },
  } = useSelector((state) => state.user);
  const {
    theme
  } = useSelector(state=>state.theme)
  const [option, setOption] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    status: "",
    email: "",
    password: "",
    image: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile({...formData}))
    // setFormData({...formData})
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  
  const handleImage = (e) =>{
    const file = Array.from(e.target.files)[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setFormData({ ...formData, image: reader.result });
      }
    };

    reader.readAsDataURL(file);
  }

  useEffect(() => {
    setFormData({
      name: name,
      status: status,
      email: email,
      password: "",
      image: "",
    });
  }, [_id]);

    useEffect(()=>{
      document.title = 'Chit Chat - Profile'
    }, [])

  return (
    <div className="container">
      <div className="profile-container">
        <div className="profile-left-container">
          <div className="profile-head">
            <span>
              <IoMdArrowRoundBack onClick={()=>navigate('/')}/>
            </span>
            <div className="profile-img-3">
              <img src={profile_img?.url} alt={name} />
            </div>
            <h1>{name}</h1>
            <p>{email}</p>
          </div>
          <ul className="profile-options-list">
            <li
              onClick={() => setOption(0)}
              className={option ? "" : "profile-option-active"}
            >
              Profile
            </li>
            <li
              onClick={() => setOption(1)}
              className={option ? "profile-option-active" : ""}
            >
              Themes
            </li>
          </ul>
        </div>
        <div className="profile-options-container">
          {option === 0 ? (
            <>
              <h1>Profile</h1>
              <form onSubmit={handleSubmit}>
                <label htmlFor="" className="form-label">
                  <h6>name</h6>
                  <div>
                    <input
                      type="text"
                      value={formData.name}
                      name="name"
                      onChange={handleChange}
                    />
                  </div>
                </label>
                <label htmlFor="" className="form-label">
                  <h6>status</h6>
                  <div>
                    <input
                      type="text"
                      value={formData.status}
                      name="status"
                      onChange={handleChange}
                    />
                  </div>
                </label>
                <label htmlFor="" className="form-label">
                  <h6>email</h6>
                  <div>
                    <input
                      type="text"
                      value={formData.email}
                      name="email"
                      onChange={handleChange}
                    />
                  </div>
                </label>
                <label htmlFor="" className="form-label">
                  <h6>password</h6>
                  <div>
                    <input
                      type="text"
                      value={formData.password}
                      name="password"
                      onChange={handleChange}
                    />
                  </div>
                </label>
                <label htmlFor="" className="form-label">
                    <h6>Profile image</h6>
                    <div>
                        <input type="file" name="image" id="image" onChange={handleImage}/>
                    </div>
                </label>
                {formData.image !== '' && <div className="profile-img-2">
                    <img src={formData.image} alt={name} />
                </div>}
                <button type="submit" disabled={loading}>Save Changes</button>
              </form>
            </>
          ) : (
            <>
              <h1>Themes</h1>
              <ul className="theme-container">
                <li className={`theme ${theme ==='light' && 'active-theme'}`} onClick={()=>dispatch(changeTheme('light'))}>Light</li>
                <li className={`theme ${theme ==='dark' && 'active-theme'}`} onClick={()=>dispatch(changeTheme('dark'))}>Dark</li>
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

