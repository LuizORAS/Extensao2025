import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logoBarbeiros from '../assets/logoBarbeiros.png';
import { FaUserShield } from "react-icons/fa";

const Header: React.FC = () => {
    const [countWeek, setCountWeek] = useState<number>(0);
    const [expectedWeekRevenue, setExpectedWeekRevenue] = useState<number>(0);
    const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';

    const fetchCount = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/appointments`);
            if (!res.ok) return;
            const rows = await res.json();
            const now = new Date();
            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const startOfWeek = new Date(startOfToday);
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(endOfWeek.getDate() + 7);

            let count = 0;
            let revenue = 0;
            for (const r of rows) {
                const dStr = r.data || r.date || null;
                if (!dStr) continue;
                const d = new Date(dStr);
                if (d >= startOfWeek && d < endOfWeek) {
                    count += 1;
                    const v = Number(r.valor_corte ?? r.valor ?? 0) || 0;
                    revenue += v;
                }
            }
            setCountWeek(count);
            setExpectedWeekRevenue(revenue);
        } catch (err) {
            console.error('Erro ao buscar agendamentos para contador', err);
        }
    };

    useEffect(() => {
        fetchCount();
        const handler = () => fetchCount();
        window.addEventListener('appointments:changed', handler as EventListener);
        return () => window.removeEventListener('appointments:changed', handler as EventListener);
    }, []);

    return (
        <header className="header">
            <div className="logo">
                <Link to="/welcome"><img src={logoBarbeiros} alt="Logo"  height={70}/></Link>
            </div>
            <nav className="navbar">
                    <div className="navbar-boxes">
                        <div className="navbar-box">
                            <span>Agendamentos essa semana</span>
                            <span className="navbar-counter">{countWeek}</span>
                        </div>
                        <div className="navbar-box">
                            <span>Faturamento esperado essa semana</span>
                            <span className="navbar-counter">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(expectedWeekRevenue)}</span>
                        </div>
                        <div className="navbar-box">
                            <span>Faturamento total esse mês</span>
                            <span className="navbar-counter">R$ 0,00</span>
                        </div>
                    </div>
            </nav>
            <div className="sidebar">
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
