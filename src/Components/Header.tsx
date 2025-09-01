import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logoBarbeiros from '../assets/logoBarbeiros.png';
import { FaUserShield } from "react-icons/fa";

const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="logo">
                <Link to="/welcome"><img src={logoBarbeiros} alt="Logo"  height={70}/></Link>
            </div>
            <nav className="navbar">
                <Link to="/welcome" className="nav-item">Home</Link>
                <Link to="/services" className="nav-item">Services</Link>
                <Link to="/about" className="nav-item">About</Link>
                <Link to="/contact" className="nav-item">Contact</Link>
                <Link to="/profile" className="nav-item">Profile</Link>
            </nav>
            <div className="sidebar">
                {/* <img
                    src="https://via.placeholder.com/40"
                    alt="Profile"
                    className="profile-pic"
                /> */}
                <FaUserShield size={40} style={{ color: '#fff', marginLeft: '15px', marginRight: '10px', cursor: 'pointer' }}/>
                <div className="options">
                    <Link to="/settings" className="option">Settings</Link>
                    <Link to="/logout" className="option">Logout</Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
