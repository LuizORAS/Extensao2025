
import React from 'react';
import './CalendarPage.css';

// CalendarPage.tsx
// Este componente servirá como a página principal para exibir o calendário de agendamentos do barbeiro.
// Ele incluirá uma visualização de calendário, opções para navegar entre datas e funcionalidade para gerenciar agendamentos.

const CalendarPage: React.FC = () => {
    return (
        <div className="calendar-page-container">
            <div className="calendarpage-bg" />
            <div className="calendarpage-overlay" />
            <div className="calendar-page-content">
                <h1>Barber Appointment Calendar</h1>
                <p>This page will display the calendar and allow users to manage appointments.</p>
            </div>
        </div>
    );
};

export default CalendarPage;