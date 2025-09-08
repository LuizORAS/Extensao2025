import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';
import { LuNotebookPen } from "react-icons/lu";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { BsPersonFillAdd } from "react-icons/bs";

const WelcomePage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <>
            <div className="welcome-bg" />
            <div className="welcome-overlay" />
            <div className="welcome-content">
                <div className="welcome-title">Planejador de Barbeiros</div>
                <div className="welcome-subtitle">Aplicação Inteligente para gestão de barbearia!</div>
                <div className="welcome-buttons">
                    <button className="welcome-btn" onClick={() => navigate('/calendar')}><FaCalendarAlt size={28}/> <br />Agendamentos</button>
                    <button className="welcome-btn" onClick={() => navigate('/schedule')}><LuNotebookPen size={28}/> <br />Agendar</button>
                    <button className="welcome-btn" onClick={() => navigate('/financial')}><FaMoneyBillTrendUp size={28}/> <br />Financeiro</button>
                    <button className="welcome-btn" onClick={() => navigate('/client')}><BsPersonFillAdd size={28}/> <br />Clientes</button>
                </div>
                <div className="welcome-links">
                    <a href="/about" className="welcome-link">Sobre Nós</a>
                    <a href="/contact" className="welcome-link">Contato</a>
                </div>
            </div>
        </>
    );
};

export default WelcomePage;
