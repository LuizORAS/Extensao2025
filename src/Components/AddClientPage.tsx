import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AddClientPage.css';

type Client = {
    id: number;
    nome: string;
    sobrenome?: string;
    idade?: number;
    telefone?: string;
    email?: string;
};

type FormState = {
    nome: string;
    sobrenome: string;
    idade: string;
    telefone: string;
    email: string;
};

const initialState: FormState = {
    nome: '',
    sobrenome: '',
    idade: '',
    telefone: '',
    email: '',
};

const AddClientPage: React.FC = () => {
    const [form, setForm] = useState<FormState>(initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const [editingId, setEditingId] = useState<number | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        if (!form.nome.trim()) return 'Nome é obrigatório.';
        if (form.idade && isNaN(Number(form.idade))) return 'Idade deve ser numérica.';
        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Email inválido.';
        return null;
    };

        const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';

        const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        const v = validate();
        if (v) return setError(v);
        setLoading(true);
        try {
            const payload = {
                nome: form.nome.trim(),
                sobrenome: form.sobrenome.trim() || null,
                idade: form.idade ? Number(form.idade) : null,
                telefone: form.telefone.trim() || null,
                email: form.email.trim() || null,
            };

            if (editingId) {
                // editar cliente existente
                const res = await fetch(`${API_BASE}/api/clients/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                if (!res.ok) {
                    const body = await res.json().catch(() => ({}));
                    throw new Error(body.message || 'Erro ao atualizar cliente');
                }
                setSuccess('Cliente atualizado com sucesso.');
                // voltar para lista após breve espera
                setTimeout(() => navigate('/client/view'), 700);
            } else {
                // criar novo cliente
                const res = await fetch(`${API_BASE}/api/clients`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                if (!res.ok) {
                    const body = await res.json().catch(() => ({}));
                    throw new Error(body.message || 'Erro ao criar cliente');
                }
                const created = await res.json();
                setSuccess('Cliente criado com sucesso.');
                setForm(initialState);
                if (created && created.id) setTimeout(() => navigate('/client/view'), 600);
            }
        } catch (err: any) {
            setError(err.message || 'Erro desconhecido');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // se navegou para cá com um cliente no state, preencher o formulário para editar
        const maybe = (location.state as any)?.client as Client | undefined;
        if (maybe && maybe.id) {
            setForm({
                nome: maybe.nome || '',
                sobrenome: maybe.sobrenome || '',
                idade: maybe.idade != null ? String(maybe.idade) : '',
                telefone: maybe.telefone || '',
                email: maybe.email || '',
            });
            setEditingId(maybe.id);
        }
    }, []);

    return (
        <div className="add-client-page-container">
            <div className="schedulepage-bg" />
            <div className="schedulepage-overlay" />

            <div className="add-client-container">
                <h2>{editingId ? 'Editar Cliente' : 'Adicionar Cliente'}</h2>
                <form onSubmit={handleSubmit} className="add-client-form">
                    <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome *" />
                    <input name="sobrenome" value={form.sobrenome} onChange={handleChange} placeholder="Sobrenome" />
                    <input name="idade" value={form.idade} onChange={handleChange} placeholder="Idade" />
                    <input name="telefone" value={form.telefone} onChange={handleChange} placeholder="Telefone" />
                    <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />

                    <div style={{ marginTop: 14, width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <button type="submit" disabled={loading} className="save-button">{loading ? 'Salvando...' : (editingId ? 'Salvar Alterações' : 'Salvar Cliente')}</button>
                    </div>
                </form>

                {error && <div className="form-error">{error}</div>}
                {success && <div className="form-success">{success}</div>}
            </div>
        </div>
    );
};

export default AddClientPage;
