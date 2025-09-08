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
                    <div className="navbar-boxes">
                        <div className="navbar-box">
                            <span>Agendamentos essa semana</span>
                            <span className="navbar-counter">0</span>
                        </div>
                        <div className="navbar-box">
                            <span>Faturamento esperado essa semana</span>
                            <span className="navbar-counter">R$ 0,00</span>
                        </div>
                        <div className="navbar-box">
                            <span>Faturamento total esse mês</span>
                            <span className="navbar-counter">R$ 0,00</span>
                        </div>
                    </div>
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
