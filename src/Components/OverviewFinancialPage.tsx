
import React from 'react';
import './OverviewFinancialPage.css';

const OverviewFinancialPage: React.FC = () => {
    return (
        <div className="financial-page-container">
            <div className="overviewfinancialpage-bg" />
            <div className="overviewfinancialpage-overlay" />
            <div className="financial-page-content">
                <div className="financial-header">
                    <div className="financial-stats">
                        <div className="stat-card">
                            <div className="stat-label">Faturamento hoje</div>
                            <div className="stat-value">R$ 0,00</div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-label">Faturamento este mês</div>
                            <div className="stat-value">R$ 0,00</div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-label">Clientes este mês</div>
                            <div className="stat-value">0</div>
                        </div>
                    </div>
                </div>

                <div className="financial-main-body">
                    <h1>Financial Overview</h1>
                    <p>On this page, you will see an overview of the barber's financial situation, including income, expenses, and overall performance.</p>

                    {/* espaço para conteúdo futuro */}
                </div>
            </div>
        </div>
    );
};

export default OverviewFinancialPage;