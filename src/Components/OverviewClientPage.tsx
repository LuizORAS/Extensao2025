
import React from 'react';
import './OverviewClientPage.css';

const OverviewClientPage: React.FC = () => {
    return (
        <div className="overview-client-container">
            <h1>Client Dashboard</h1>
            <p>Welcome! This page will display an overview of your clients.</p>
            <p>Here, you will be able to manage your clients and view their details.</p>
            <button className="overview-client-btn">
                Add Client
            </button>
            <button className="overview-client-btn">
                View Clients
            </button>
        </div>
    );
};

export default OverviewClientPage;