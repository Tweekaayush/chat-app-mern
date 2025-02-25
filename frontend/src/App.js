import React, { useEffect, useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import PrivateRoutes from "./components/PrivateRoutes";
import Chats from "./pages/Chats";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  clearUserErrors,
  clearUserSuccessMessage,
  loadUser,
} from "./slices/userSlice";
import CreateGroupChat from "./components/CreateGroupChat";
import SearchUserChat from "./components/SearchUserChat";
import AddToGroup from "./components/AddToGroup";
import Profile from "./pages/Profile";

const App = () => {
  const { successMessage: userSuccessMessage, error: userError } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const [chatOpen, setChatOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const [openAddParticipants, setOpenAddParticipants] = useState(false);

  useEffect(() => {
    if (userError) {
      toast.error(userError);
      dispatch(clearUserErrors());
    }
  }, [userError]);

  useEffect(() => {
    if (userSuccessMessage) {
      toast.success(userSuccessMessage);
      dispatch(clearUserSuccessMessage());
    }
  }, [userSuccessMessage]);

  useEffect(() => {
    dispatch(loadUser());
  }, []);

  return (
    <Router>
      <Navbar />
      <SearchUserChat setChatOpen={setChatOpen} chatOpen={chatOpen} />
      <CreateGroupChat setGroupOpen={setGroupOpen} groupOpen={groupOpen} />
      <AddToGroup
        setOpenAddParticipants={setOpenAddParticipants}
        openAddParticipants={openAddParticipants}
      />
      <Routes>
        <Route exact path="/" element={<Navigate to="/chats" replace />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<SignUp />} />
        <Route element={<PrivateRoutes />}>
          <Route
            exact
            path="/chats"
            element={
              <Chats
                setChatOpen={setChatOpen}
                setGroupOpen={setGroupOpen}
                setOpenAddParticipants={setOpenAddParticipants}
              />
            }
          />
          <Route exact path='/profile' element={<Profile/>}/>
        </Route>
      </Routes>
      <Footer />
      <ToastContainer />
    </Router>
  );
};

export default App;
