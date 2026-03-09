import React, { useState } from 'react'
import "../styles/Login.css"
import RightBanner from '../components/RightBanner'
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"
import { LuEye, LuEyeOff } from "react-icons/lu"


const Login = ({ setAuthenticated, setDisplaySuccess, authenticated }) => {
  let navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginUserObject = {
    email,
    password
  }
  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address", {
        position: "top-center",
        autoClose: 2000
      })
      return true;
    }
    return false;
  };

  const validatePassword = () => {
    let regex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");
    if (regex.test(password) === false) {
      toast.error("Password should contain atleast 1 uppercase,1 lowercase,1 symbol and 1 numeric and minimum 8 characters long", {
        position: "top-center",
        autoClose: 2000
      })
      return true;
    }
    return false;

  }
  const handleSubmit = e => {
    e.preventDefault();
    if (validateEmail() || validatePassword()) {
      return;
    }
    axios.post(`${process.env.REACT_APP_FRONTEND_URL_FOR_AUTH}login`, loginUserObject, { headers: { "Content-Type": "application/json" } })
      .then(response => {
        navigate("/");
        localStorage.setItem("jwttoken", response.data.jwtToken);
        localStorage.setItem("name", response.data.recruiterName);
        setDisplaySuccess(response.data.message);
        setAuthenticated(false);
      })
      .catch(error => toast.error(error.response.data.message, {
        position: "top-center",
        autoClose: 1000
      }))
  }


  return (
    <div className='login-container'>
      <div className='left-container'>
        <strong className='have-account'>Already have an account?</strong>
        <p className='job-finder-text'>Your personal job finder is here</p><br />
        <form className='form' onSubmit={handleSubmit}>
          <div>
            <input type="email" name="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder='Email' className='form-input' />
          </div><br />
          <div>
            {/* <input type="password" name="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder='Password' className='form-input' /> */}
            <input type={showPassword ? "text" : "password"} name="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder='Password' className='form-input' />
            {showPassword ? <LuEyeOff onClick={() => setShowPassword(false)} className='eye'/> : <LuEye className='eye' onClick={() => setShowPassword(true)}/>}
          </div><br />
          <button>Sign in</button>
        </form>
        <div className='no-account-div'>
          <span className='no-account'>Don’t have an account?</span><Link to="/register" style={{ color: "black", fontFamily: "DM Sans" }}>Sign Up</Link>
        </div>
      </div>
      <RightBanner />
      <ToastContainer />
    </div>
  )
}

export default Login
