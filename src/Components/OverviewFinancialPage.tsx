
import React from 'react';
import './OverviewFinancialPage.css';

const OverviewFinancialPage: React.FC = () => {
    return (
        <div className="financial-page-container">
            <div className="page-bg" />
            <div className="page-overlay" />
            <div className="financial-page-content">
                <h1>Financial Overview</h1>
                <p>On this page, you will see an overview of the barber's financial situation, including income, expenses, and overall performance.</p>
            </div>
        </div>
    );
};

export default OverviewFinancialPage;