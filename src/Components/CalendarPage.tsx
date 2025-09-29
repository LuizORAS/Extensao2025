
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CalendarPage.css';

type Appointment = {
    id: number;
    clientName: string;
    service: string;
    start: string; // ISO
    end: string;   // ISO
    raw?: any; // original server row for edit
};

const FILTERS = ['Hoje', 'Essa semana', 'Esse mês'] as const;

const CalendarPage: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [filter, setFilter] = useState<typeof FILTERS[number]>('Hoje');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE}/api/appointments`);
                if (!res.ok) throw new Error('Falha ao carregar agendamentos');
                const rows = await res.json();
                if (!mounted) return;
                const mapped: Appointment[] = rows.map((r: any) => {
                    // servidor devolve: id, cliente, cliente_nome, data, horario_inicio, horario_fim, servico, notas
                    const date = r.data || r.date || '';
                    const hi = r.horario_inicio || r.horarioInicio || r.startTime || '';
                    const hf = r.horario_fim || r.horarioFim || r.endTime || '';
                    // tente criar ISO combinado (aceita YYYY-MM-DD e HH:MM)
                    const tryISO = (d: string, t: string) => {
                        if (!d) return '';
                        if (!t) return d;
                        // normalize: if t has space, take first token
                        const cleanT = String(t).trim().split(' ')[0];
                        return `${d}T${cleanT}`;
                    };
                    return {
                        id: r.id,
                        clientName: r.cliente_nome || r.clientName || r.cliente || '—',
                        service: r.servico || r.service || '—',
                        start: tryISO(date, hi),
                        end: tryISO(date, hf),
                        raw: r,
                    };
                });
                setAppointments(mapped);
            } catch (err) {
                console.error(err);
                setAppointments([]);
                setError('Erro ao carregar agendamentos');
            } finally {
                setLoading(false);
            }
        };
        load();
        return () => { mounted = false };
    }, []);

    const now = new Date();

    const filtered = useMemo(() => {
        // aplica filtro temporal
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfToday = new Date(startOfToday); endOfToday.setDate(endOfToday.getDate() + 1);

        const startOfWeek = new Date(startOfToday);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        const endOfWeek = new Date(startOfWeek); endOfWeek.setDate(endOfWeek.getDate() + 7);

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        const inRange = (a: Appointment, s: Date, e: Date) => {
            const st = new Date(a.start);
            return st >= s && st < e;
        };

        let list = appointments.slice();
        if (filter === 'Hoje') list = list.filter(a => inRange(a, startOfToday, endOfToday));
        if (filter === 'Essa semana') list = list.filter(a => inRange(a, startOfWeek, endOfWeek));
        if (filter === 'Esse mês') list = list.filter(a => inRange(a, startOfMonth, endOfMonth));

        // ordenar do mais próximo de hoje para o mais distante (próximos futuros primeiro)
        list.sort((a, b) => {
            const da = Math.abs(new Date(a.start).getTime() - now.getTime());
            const db = Math.abs(new Date(b.start).getTime() - now.getTime());
            return da - db;
        });

        return list;
    }, [appointments, filter, now]);

    const handleDelete = async (id: number) => {
        const ok = window.confirm('Deseja realmente excluir este agendamento?');
        if (!ok) return;
        try {
            const res = await fetch(`${API_BASE}/api/appointments/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Falha ao deletar agendamento');
            setAppointments(prev => prev.filter(a => a.id !== id));
            try { window.dispatchEvent(new Event('appointments:changed')); } catch (e) { /* noop */ }
        } catch (err) {
            console.error(err);
            alert('Erro ao deletar agendamento');
        }
    };

    const handleEdit = (appt: Appointment) => {
        // preferir passar o objeto original do servidor (raw) para que SchedulePage
        // receba os campos esperados (cliente, data, horario_inicio, horario_fim ...)
        const payload = appt.raw || {
            id: appt.id,
            cliente_nome: appt.clientName,
            servico: appt.service,
            horario_inicio: appt.start,
            horario_fim: appt.end,
        };
        navigate('/schedule', { state: { appointment: payload } });
    };

    return (
        <div className="calendar-page-container">
            <div className="calendarpage-bg" />
            <div className="calendarpage-overlay" />

            <div className="calendar-card">
                <div className="calendar-card-header">
                    <h2>Agendamentos</h2>
                    <select value={filter} onChange={e => setFilter(e.target.value as any)} className="filter-select">
                        {FILTERS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                </div>
                {error && <div style={{ color: '#ff6b6b', textAlign: 'center' }}>{error}</div>}

                <div className="appointments-list">
                    {loading && <p>Carregando...</p>}
                    {!loading && filtered.length === 0 && <p>Nenhum agendamento encontrado para o filtro selecionado.</p>}
                    {!loading && filtered.map(a => (
                        <div key={a.id} className="appointment-row">
                            <div className="appointment-main">
                                <div className="appointment-datetime">
                                    <div className="appt-start">{new Date(a.start).toLocaleString()}</div>
                                    <div className="appt-end">{new Date(a.end).toLocaleTimeString()}</div>
                                </div>
                                <div className="appointment-info">
                                    <div className="appt-client">{a.clientName}</div>
                                    <div className="appt-service">{a.service}</div>
                                </div>
                                <div className="appointment-actions">
                                    <button className="appt-btn appt-edit" onClick={() => handleEdit(a)}>Editar</button>
                                    <button className="appt-btn appt-delete" onClick={() => handleDelete(a.id)}>Excluir</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;