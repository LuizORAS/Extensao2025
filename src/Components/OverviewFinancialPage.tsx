
import React, { useEffect, useState } from 'react';
import './OverviewFinancialPage.css';

type Appointment = {
    id: number;
    cliente?: number;
    cliente_nome?: string;
    data: string;
    horario_inicio?: string;
    horario_fim?: string;
    valor_corte?: number | null;
    servico?: string | null;
    notas?: string | null;
};

// AppStatuses type removed (server now persists paid/finalized)

const OverviewFinancialPage: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [activeTab, setActiveTab] = useState<'pending' | 'paid'>('pending');

    const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';

    // statuses are now persisted on the server via appointment.paid and appointment.finalized

    const fetchAppointments = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/appointments`);
            if (!res.ok) return;
            const rows = await res.json();
            setAppointments(rows || []);
        } catch (err) {
            console.error('Erro ao buscar agendamentos', err);
        }
    };

    useEffect(() => {
        fetchAppointments();
        const handler = () => fetchAppointments();
        window.addEventListener('appointments:changed', handler as EventListener);
        window.addEventListener('storage', handler as EventListener);
        return () => {
            window.removeEventListener('appointments:changed', handler as EventListener);
            window.removeEventListener('storage', handler as EventListener);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const markPaid = async (id: number) => {
        try {
            const res = await fetch(`${API_BASE}/api/appointments/${id}/confirm-payment`, { method: 'POST' });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.message || 'Falha ao marcar pagamento');
            }
            // backend updated appointment and created budget entry
            try { window.dispatchEvent(new Event('appointments:changed')); } catch (e) { /* noop */ }
            fetchAppointments();
        } catch (err) {
            alert(String(err));
        }
    };

    const today = new Date();
    const startOfTodayStr = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString().slice(0,10);

    // compute stats based on appointment fields (only paid+finalized counted)
    const computeStats = () => {
        let todaySum = 0;
        let monthSum = 0;
        const clientSet = new Set<number>();
        for (const a of appointments) {
            const paidFinal = !!(a as any).paid && !!(a as any).finalized;
            const v = Number(a.valor_corte ?? 0) || 0;
            const dStr = (a.data || '').slice(0,10);
            if (paidFinal) {
                if (dStr === startOfTodayStr) todaySum += v;
                const d = new Date(dStr);
                if (d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth()) {
                    monthSum += v;
                }
            }
            // clients this month: count unique client ids for PAID+FINALIZED appointments in this month
            try {
                const d = new Date((a.data || '').slice(0,10));
                if (d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && a.cliente && paidFinal) {
                    clientSet.add(Number(a.cliente));
                }
            } catch (err) { }
        }
        return { todaySum, monthSum, clientsCount: clientSet.size };
    };

    const { todaySum, monthSum, clientsCount } = computeStats();

    const pending = appointments.filter(a => !((a as any).paid && (a as any).finalized));
    const paid = appointments.filter(a => !!((a as any).paid && (a as any).finalized));

    return (
        <div className="financial-page-container">
            <div className="overviewfinancialpage-bg" />
            <div className="overviewfinancialpage-overlay" />
            <div className="financial-page-content">
                <div className="financial-header">
                    <div className="financial-stats">
                        <div className="stat-card">
                            <div className="stat-label">Faturamento hoje</div>
                            <div className="stat-value">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(todaySum)}</div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-label">Faturamento este mês</div>
                            <div className="stat-value">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(monthSum)}</div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-label">Clientes este mês</div>
                            <div className="stat-value">{clientsCount}</div>
                        </div>
                    </div>
                </div>

                <div className="financial-main-body">
                    <h1>Financial Overview</h1>
                    <p>On this page, you will see an overview of the barber's financial situation, including income, expenses, and overall performance.</p>

                    <div className="financial-tabs">
                        <button className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>Agendamentos pendentes</button>
                        <button className={`tab-btn ${activeTab === 'paid' ? 'active' : ''}`} onClick={() => setActiveTab('paid')}>Agendamentos pagos</button>
                    </div>

                    <div className="appointments-list">
                        {(activeTab === 'pending' ? pending : paid).map(a => (
                            <div key={a.id} className="appointment-row">
                                <div className="appointment-info">
                                    <div><strong>{a.cliente_nome ?? 'Cliente #' + a.cliente}</strong></div>
                                    <div>{a.data} {a.horario_inicio ? `- ${a.horario_inicio}` : ''} • {a.servico ?? 'Serviço'}</div>
                                </div>
                                <div className="appointment-right">
                                    <div className="appointment-value">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(a.valor_corte ?? 0))}</div>
                                    {activeTab === 'pending' ? (
                                        <button className="btn check" onClick={() => markPaid(a.id)} title="Marcar como pago e finalizado">
                                            ✓
                                        </button>
                                    ) : (
                                        <div className="badge paid">Pago</div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {((activeTab === 'pending' && pending.length === 0) || (activeTab === 'paid' && paid.length === 0)) && (
                            <div className="muted">Nenhum agendamento nesta aba.</div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default OverviewFinancialPage;