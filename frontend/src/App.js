import React, { useEffect } from 'react'
import './App.css'
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import PrivateRoutes from './components/PrivateRoutes'
import Chats from './pages/Chats'
import Navbar from './components/Layout/Navbar'
import Footer from './components/Layout/Footer'
import {toast, ToastContainer} from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { clearUserErrors, clearUserSuccessMessage, loadUser } from './slices/userSlice'

const App = () => {

  const {successMessage: userSuccessMessage, error:userError} = useSelector(state=>state.user)
  const dispatch = useDispatch()
  useEffect(()=>{
    if(userError){
      toast.error(userError)
      dispatch(clearUserErrors())
    }
  },[userError])

  useEffect(()=>{
    if(userSuccessMessage){
      toast.success(userSuccessMessage)
      dispatch(clearUserSuccessMessage())
    }
  },[userSuccessMessage])

  useEffect(()=>{
    dispatch(loadUser())
  }, [])

  return (
   <Router>
    <Navbar/>
    <Routes>
      <Route exact path='/' element={<Navigate to='/chats' replace/>}/>
      <Route exact path='/login' element={<Login/>}/>
      <Route exact path='/signup' element={<SignUp/>}/>
      <Route element={<PrivateRoutes/>}>
        <Route exact path='/chats' element={<Chats/>}/>
      </Route>
    </Routes>
    <Footer/>
    <ToastContainer/>
   </Router> 
  )
}

export default App