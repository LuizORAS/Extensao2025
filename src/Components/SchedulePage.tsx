
import React from 'react';
import './SchedulePage.css';

const SchedulePage: React.FC = () => {
    return (
        <div className="schedule-page-container">
            <div className="page-bg" />
            <div className="page-overlay" />
            <div className="schedule-page-content">
                <header>
                    <h1>Schedule Your Barber Appointment</h1>
                </header>
                <main>
                    <p>Welcome to the scheduling page! Here you can book your next barber appointment with ease.</p>
                </main>
            </div>
        </div>
    );
};

export default SchedulePage;