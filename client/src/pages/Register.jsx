import React, { useState } from 'react'
import "../styles/Register.css"
import RightBanner from '../components/RightBanner'
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"

const Register = ({ authenticated, setAuthenticated, setDisplaySuccess }) => {
  let navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [checkbox, setCheckbox] = useState("");

  const registerUserObject = {
    name,
    email,
    password,
    mobile
  }
  // 
  const validateName = () => {
    let regex = new RegExp("^[a-zA-Z\\s]*$");
    if (regex.test(name) === false) {
      toast.error("Name must be in Characters", {
        position: "top-center",
        autoClose: 1000
      })
      return true;
    }
    return false;
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

  const validateMobile = () => {
    let regex = new RegExp("^[0-9]{10}$");
    if (regex.test(mobile) === false) {
      toast.error("Mobile number must be 10 digits number", {
        position: "top-center",
        autoClose: 1000
      })
      return true;
    }
    return false;
  }

  const validateCheckbox = () => {
    if (!checkbox) {
      toast.error("Please Tick Check box if you want to proceed", {
        position: "top-center",
        autoClose: 1000
      })
      return true;
    }
    return false;
  }

  const validateAllFields = () => {
    if (!name || !email || !password || !mobile) {
      toast.error("All fields are required", {
        position: "top-center",
        autoClose: 1000
      })
      return true;
    }
    return false;
  }

  const handleSubmit = e => {
    e.preventDefault();

    if (validateAllFields() || validateName() || validateEmail() || validatePassword() || validateMobile() || validateCheckbox()) {
      return;
    }

    axios.post(`${process.env.REACT_APP_FRONTEND_URL_FOR_AUTH}register`, registerUserObject, { headers: { "Content-Type": "application/json" } })
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
    <div className='register-container'>
      <div className="left-container">
        <strong className='have-account'>Create an account</strong>
        <p className='job-finder-text'>Your personal job finder is here</p><br />


        <form className='form' onSubmit={handleSubmit}>
          <div>
            <input type="text" name="name" placeholder='Name' required value={name} className='form-input' onChange={e => setName(e.target.value)} />
          </div><br />
          <div>
            <input type="email" name="email" placeholder='Email' required value={email} className='form-input' onChange={e => setEmail(e.target.value)} />
          </div><br />
          <div>
            <input type="password" name="password" placeholder='Password' required value={password} className='form-input' onChange={e => setPassword(e.target.value)} />{/*later change type to password*/}
          </div><br />
          <div>
            <input type="tel" name="mobile" placeholder='Mobile' required value={mobile} className='form-input' maxLength={10} onChange={e => setMobile(e.target.value)} />
          </div><br />
          <div className='checked-input'>
            <input type="checkbox" checked={checkbox} required onChange={e => setCheckbox(e.target.checked)} /> <span className='checked'>By creating an account, I agree to our terms of use and privacy policy</span>
          </div>
          <button>Create Account</button>
        </form>
        <div className='no-account-div'>
          <span className='no-account'>Already have an account?</span> <Link to="/login" style={{ color: "black", fontFamily: "DM Sans" }}>Sign In</Link>
        </div>
      </div>
      <RightBanner />
      <ToastContainer />
    </div>
  )
}

export default Register
