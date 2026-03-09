import React from 'react'
import "../styles/Header.css"
import { useNavigate } from 'react-router-dom'

const Header = ({ authenticated, setAuthenticated }) => {
    let navigate = useNavigate();
    const logout = () => {
        setAuthenticated(true);
        navigate("/");
        localStorage.clear();
    }
    const name = localStorage.getItem("name");
    return (
        <div className='header-container'>
            <div className='jobfinder-header'>
                <p className='jobfinder-text'>JobFinder</p>
                {authenticated ?
                    <div style={{ display: "flex", gap: "20px" }}>
                        <button className='login-btn' onClick={() => navigate("/login")}>Login</button>
                        <button className='register-btn' onClick={() => navigate("/register")}>Register</button>
                    </div> :
                    <div style={{ display: "flex", gap: "20px" }}>
                        <span className='logout-text' onClick={logout}>Logout</span>
                        <span className='recruiter-text'>Hello! {name && name.split(" ")[0] }</span>
                        <img className='recruiter-img' src="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250" />
                    </div>}
            </div>
        </div>
    )
}

export default Header
