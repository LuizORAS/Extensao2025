import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logoBarbeiros from '../assets/logoBarbeiros.png';
import logoBarbeirosWhite from '../assets/logoBarbeiros-WHITE.png';
import { FaUserShield, FaChevronUp, FaChevronDown } from "react-icons/fa";

const Header: React.FC = () => {
    const [countWeek, setCountWeek] = useState<number>(0);
    const [expectedWeekRevenue, setExpectedWeekRevenue] = useState<number>(0);
    const [monthRevenue, setMonthRevenue] = useState<number>(0);
    const [isOpen, setIsOpen] = useState<boolean>(false);
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
            endOfWeek.setDate(startOfWeek.getDate() + 7);

            let count = 0;
            let revenue = 0;
            let monthRev = 0;
            for (const r of rows) {
                const dStr = r.data || r.date || null;
                if (!dStr) continue;
                const d = new Date(dStr);
                if (d >= startOfWeek && d < endOfWeek) {
                    count += 1;
                    const v = Number(r.valor_corte ?? 0) || 0;
                    revenue += v;
                }
                // compute month revenue only for appointments that are marked paid+finalized
                try {
                    if (r.paid && r.finalized) {
                        const now2 = new Date();
                        if (d.getFullYear() === now2.getFullYear() && d.getMonth() === now2.getMonth()) {
                            monthRev += Number(r.valor_corte ?? 0) || 0;
                        }
                    }
                } catch (err) { /* ignore */ }
            }
            setCountWeek(count);
            setExpectedWeekRevenue(revenue);
            setMonthRevenue(monthRev);
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

    // close dropdown when clicking outside
    useEffect(() => {
        const onDocClick = () => setIsOpen(false);
        document.addEventListener('click', onDocClick);
        return () => document.removeEventListener('click', onDocClick);
    }, []);

    // load local profile from localStorage (if user saved in Settings)
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [profileName, setProfileName] = useState<string>('Usuário');
    useEffect(() => {
        try {
            const raw = localStorage.getItem('app_user_profile');
            if (raw) {
                const obj = JSON.parse(raw);
                if (obj?.avatarUrl) setAvatarUrl(obj.avatarUrl);
                if (obj?.name) setProfileName(obj.name);
            }
        } catch (err) {
            // ignore
        }
    }, []);

    // listen for profile changes dispatched from Settings or other tabs
    useEffect(() => {
            const onProfileChanged = (e: Event) => {
            // CustomEvent may have detail
            try {
                const detail = (e as CustomEvent).detail;
                if (detail?.avatarUrl !== undefined) {
                        setAvatarUrl(detail.avatarUrl ?? null);
                        if (detail?.name !== undefined) setProfileName(detail.name ?? 'Usuário');
                    return;
                }
            } catch (err) { /* ignore */ }

            // fallback: re-read localStorage
            try {
                const raw = localStorage.getItem('app_user_profile');
                if (raw) {
                    const obj = JSON.parse(raw);
                    setAvatarUrl(obj?.avatarUrl ?? null);
                }
            } catch (err) { /* ignore */ }
        };

                const onStorage = (e: StorageEvent) => {
                    if (e.key === 'app_user_profile') {
                        try {
                            const obj = e.newValue ? JSON.parse(e.newValue) : null;
                            setAvatarUrl(obj?.avatarUrl ?? null);
                            if (obj?.name) setProfileName(obj.name);
                        } catch (err) { /* ignore */ }
                    }
                };

        window.addEventListener('profile:changed', onProfileChanged as EventListener);
        window.addEventListener('storage', onStorage as EventListener);
        return () => {
            window.removeEventListener('profile:changed', onProfileChanged as EventListener);
            window.removeEventListener('storage', onStorage as EventListener);
        };
    }, []);

    // theme-aware logo: read current theme from dataset or localStorage
    const [theme, setTheme] = useState<string>(() => {
        return (document.documentElement?.dataset?.theme as string) || localStorage.getItem('app_theme') || 'dark';
    });

    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.key === 'app_theme') setTheme(e.newValue ?? 'dark');
        };
        const observer = new MutationObserver(() => {
            setTheme(document.documentElement?.dataset?.theme || localStorage.getItem('app_theme') || 'dark');
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        window.addEventListener('storage', onStorage);
        return () => {
            observer.disconnect();
            window.removeEventListener('storage', onStorage);
        };
    }, []);

    const logoSrc = theme === 'light' ? logoBarbeirosWhite : logoBarbeiros;

    return (
        <header className="header">
            <div className="logo">
                <Link to="/welcome"><img src={logoSrc} alt="Logo" className={`header-logo ${theme === 'light' ? 'header-logo--white' : ''}`} /></Link>
            </div>
            <nav className="navbar">
                    <div className="navbar-boxes">
                            <Link to="/schedule" className="navbar-box" aria-label="Ir para Agendamentos">
                                <span>Agendamentos essa semana</span>
                                <span className="navbar-counter">{countWeek}</span>
                            </Link>
                            <Link to="/financial" className="navbar-box" aria-label="Ir para Financeiro">
                                <span>Faturamento esperado essa semana</span>
                                <span className="navbar-counter">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(expectedWeekRevenue)}</span>
                            </Link>
                            <Link to="/financial" className="navbar-box" aria-label="Ir para Financeiro">
                                <span>Faturamento total esse mês</span>
                                <span className="navbar-counter">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(monthRevenue)}</span>
                            </Link>
                    </div>
            </nav>
            <div className="sidebar">
                <div className="header-profile">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar" className="header-avatar" />
                    ) : (
                        <FaUserShield size={40} style={{ color: '#fff', marginLeft: '15px', marginRight: '10px', cursor: 'pointer' }}/>
                    )}
                    <div className="header-greeting">Olá, {profileName}!</div>
                </div>
                <div className="options" id="header-options">
                    {/* Dropdown trigger: shows up arrow when NOT clicked (default) and down arrow when clicked/open */}
                    <button
                        className="options-toggle"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(prev => !prev);
                        }}
                        aria-expanded={isOpen}
                        aria-controls="options-menu"
                    >
                        <span className="options-label">Menu</span>
                        {isOpen ? <FaChevronDown className="options-arrow" /> : <FaChevronUp className="options-arrow" />}
                    </button>

                    <div
                        id="options-menu"
                        className={`dropdown-menu ${isOpen ? 'open' : ''}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Link to="/settings" className="dropdown-item" onClick={() => setIsOpen(false)}>Configurações</Link>
                        <Link to="/logout" className="dropdown-item" onClick={() => setIsOpen(false)}>Logout</Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
