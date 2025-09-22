import React, { useState } from 'react';
import './OverviewClientPage.css';
import {useNavigate } from 'react-router-dom';


const OverviewClientPage: React.FC = () => {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState<'left' | 'right' | null>(null);
    return (
        <div className="client-page-container">
            <div className="split-choice-content">
                <div className="left-bg" />
                <div className="left-overlay" />
                <div className="right-bg" />
                <div className="right-overlay" />
                <div
                    className={`split-card left-card${hovered === 'left' ? ' highlighted' : hovered === 'right' ? ' dimmed' : ''}`}
                    onMouseEnter={() => setHovered('left')}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => navigate('/client/view')}
                >
                    <span className="split-card-text">Ver Clientes</span>
                </div>
                <div
                    className={`split-card right-card${hovered === 'right' ? ' highlighted' : hovered === 'left' ? ' dimmed' : ''}`}
                    onMouseEnter={() => setHovered('right')}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => navigate('/client/add')}
                >
                    <span className="split-card-text">Adicionar Cliente</span>
                </div>
            </div>
        </div>
    );
};

export default OverviewClientPage;