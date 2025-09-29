
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SchedulePage.css';

type Client = { id: number; nome: string };

const SchedulePage: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [clienteId, setClienteId] = useState<number | ''>('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [service, setService] = useState('');
    const [valor, setValor] = useState('');
    const [notas, setNotas] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';

    useEffect(() => {
        // carregar clientes para o select
        let mounted = true;
        const load = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/clients`);
                const json = await res.json();
                if (!mounted) return;
                setClients(json || []);
            } catch (err) {
                console.error(err);
            }
        };
        load();
        // se navegou com appointment para editar (via state), preencher alguns campos
        const maybe = (location.state as any)?.appointment;
        if (maybe) {
            // save editing id if provided
            if (maybe.id) setEditingId(Number(maybe.id));
            if (maybe.cliente) setClienteId(Number(maybe.cliente));
            if (maybe.data) setDate(maybe.data);
            if (maybe.horario_inicio) setStartTime(maybe.horario_inicio);
            if (maybe.horario_fim) setEndTime(maybe.horario_fim);
            if (maybe.servico) setService(maybe.servico);
            if (maybe.valor_corte) setValor(String(maybe.valor_corte));
            if (maybe.notas) setNotas(maybe.notas);
        }
        return () => { mounted = false };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const parseDateTime = (d: string, t: string) => {
        if (!d) return null;
        if (!t) return new Date(d);
        // assume d is YYYY-MM-DD and t is HH:MM or HH:MM:SS
        return new Date(`${d}T${t}`);
    };

    const checkConflict = async (d: string, hi: string, hf: string) => {
        // busca agendamentos do servidor e checa overlap na mesma data
        try {
            const res = await fetch(`${API_BASE}/api/appointments`);
            if (!res.ok) return false; // não bloquear criação se falhar em checar
            const rows = await res.json();
            const sNew = parseDateTime(d, hi);
            const eNew = parseDateTime(d, hf);
            if (!sNew || !eNew) return false;
            for (const r of rows) {
                const dateR = r.data;
                if (!dateR) continue;
                // comparar somente se mesma data (string begins)
                if (String(dateR) !== String(d)) continue;
                // se estamos editando, ignore o próprio registro
                if (editingId && Number(r.id) === Number(editingId)) continue;
                const sR = parseDateTime(r.data, r.horario_inicio);
                const eR = parseDateTime(r.data, r.horario_fim);
                if (!sR || !eR) continue;
                // overlap check: start < other_end && end > other_start
                if (sNew < eR && eNew > sR) return true;
            }
            return false;
        } catch (err) {
            console.error('Erro ao checar conflitos', err);
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        // validações básicas
        if (!clienteId) return setError('Escolha um cliente');
        if (!date) return setError('Escolha uma data');
        if (!startTime || !endTime) return setError('Informe horário de início e fim');
        const s = parseDateTime(date, startTime);
        const f = parseDateTime(date, endTime);
        if (!s || !f) return setError('Formato de data/hora inválido');
        if (f <= s) return setError('Horário de fim deve ser depois do início');

        setLoading(true);
        // checar conflitos
        const hasConflict = await checkConflict(date, startTime, endTime);
        if (hasConflict) {
            setLoading(false);
            return setError('Horário conflita com outro agendamento');
        }

        try {
            const payload = {
                cliente: clienteId,
                data: date,
                horario_inicio: startTime,
                horario_fim: endTime,
                valor_corte: valor ? Number(valor) : null,
                servico: service || null,
                notas: notas || null,
            };
            let res: Response;
            if (editingId) {
                res = await fetch(`${API_BASE}/api/appointments/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            } else {
                res = await fetch(`${API_BASE}/api/appointments`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            }
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.message || (editingId ? 'Erro ao alterar agendamento' : 'Erro ao criar agendamento'));
            }
            setSuccess(editingId ? 'Agendamento alterado com sucesso' : 'Agendamento criado com sucesso');
            // notify other components (header, calendar) that appointments changed
            try { window.dispatchEvent(new Event('appointments:changed')); } catch (e) { /* noop */ }
            // limpar formulário
            setClienteId(''); setDate(''); setStartTime(''); setEndTime(''); setService(''); setValor(''); setNotas('');
            // opcional: navegar de volta ou atualizar lista
            setTimeout(() => navigate('/calendar'), 700);
        } catch (err: any) {
            setError(err.message || 'Erro desconhecido');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="schedule-page-container">
            <div className="schedulepage-bg" />
            <div className="schedulepage-overlay" />
            <div className="schedule-page-content schedule-form-card">
                <h2>{editingId ? 'Alterar Agendamento' : 'Criar Agendamento'}</h2>
                <form className="schedule-form" onSubmit={handleSubmit}>
                    <label>Cliente</label>
                    <select value={clienteId} onChange={e => setClienteId(e.target.value ? Number(e.target.value) : '')}>
                        <option value="">-- selecione --</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                    </select>

                    <label>Data</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} />

                    <div className="time-row">
                        <div>
                            <label style={{marginRight: '8px'}}>Horario de Início:</label>
                            <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
                        </div>
                        <div>
                            <label style={{marginRight: '8px'}}>Horario de Fim:</label>
                            <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
                        </div>
                    </div>

                    <label>Serviço</label>
                    <input value={service} onChange={e => setService(e.target.value)} placeholder="ex: Corte, Sobrancelha" />

                    <label>Valor</label>
                    <input type="number" value={valor} onChange={e => setValor(e.target.value)} placeholder="R$" />

                    <label>Observação</label>
                    <textarea value={notas} onChange={e => setNotas(e.target.value)} placeholder="Notas..." />

                    <div className="form-actions">
                        <button type="submit" disabled={loading}>{loading ? (editingId ? 'Salvando...' : 'Salvando...') : (editingId ? 'Alterar Agendamento' : 'Criar Agendamento')}</button>
                    </div>
                </form>
                {error && <div className="form-error">{error}</div>}
                {success && <div className="form-success">{success}</div>}
            </div>
        </div>
    );
};

export default SchedulePage;