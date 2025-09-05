import React from 'react';
import './WelcomePage.css';
import { LuNotebookPen } from "react-icons/lu";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { BsPersonFillAdd } from "react-icons/bs";

const WelcomePage: React.FC = () => {
    return (
        <>
            <div className="welcome-bg" />
            <div className="welcome-overlay" />
            <div className="welcome-content">
                <div className="welcome-title">Planejador de Barbeiros</div>
                <div className="welcome-subtitle">Aplicação Inteligente para gestão de barbearia!</div>
                <div className="welcome-buttons">
                    <button className="welcome-btn"><LuNotebookPen size={28}/> <br />Agendar</button>
                    <button className="welcome-btn"><FaMoneyBillTrendUp size={28}/> <br />Financeiro</button>
                    <button className="welcome-btn"><FaCalendarAlt size={28}/> <br />Agendamentos</button>
                    <button className="welcome-btn"><BsPersonFillAdd size={28}/> <br />Clientes</button>
                </div>
            </div>
        </>
    );
};

export default WelcomePage;
