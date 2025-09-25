import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddClientPage.css';

type FormState = {
    nome: string;
    sobrenome: string;
    idade: string;
    telefone: string;
    quantidade_cortes: string;
    total_gasto: string;
    email: string;
};

const initialState: FormState = {
    nome: '',
    sobrenome: '',
    idade: '',
    telefone: '',
    quantidade_cortes: '0',
    total_gasto: '0',
    email: '',
};

const AddClientPage: React.FC = () => {
    const [form, setForm] = useState<FormState>(initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        if (!form.nome.trim()) return 'Nome é obrigatório.';
        if (form.idade && isNaN(Number(form.idade))) return 'Idade deve ser numérica.';
        if (form.quantidade_cortes && isNaN(Number(form.quantidade_cortes))) return 'Quantidade de cortes deve ser numérica.';
        if (form.total_gasto && isNaN(Number(form.total_gasto))) return 'Total gasto deve ser numérico.';
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
                quantidade_cortes: form.quantidade_cortes ? Number(form.quantidade_cortes) : 0,
                total_gasto: form.total_gasto ? Number(form.total_gasto) : 0,
                email: form.email.trim() || null,
            };

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
            // navegar para visualização do cliente criado
            if (created && created.id) {
                // opcional: navegar para /client/view ou detalhe
                setTimeout(() => navigate('/client/view'), 600);
            }
        } catch (err: any) {
            setError(err.message || 'Erro desconhecido');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-client-container">
            <h2>Adicionar Cliente</h2>
            <form onSubmit={handleSubmit} className="add-client-form">
                <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome *" />
                <input name="sobrenome" value={form.sobrenome} onChange={handleChange} placeholder="Sobrenome" />
                <input name="idade" value={form.idade} onChange={handleChange} placeholder="Idade" />
                <input name="telefone" value={form.telefone} onChange={handleChange} placeholder="Telefone" />
                <input name="quantidade_cortes" value={form.quantidade_cortes} onChange={handleChange} placeholder="Quantidade de cortes" />
                <input name="total_gasto" value={form.total_gasto} onChange={handleChange} placeholder="Total gasto" />
                <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />

                <div style={{ marginTop: 12 }}>
                    <button type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Salvar Cliente'}</button>
                </div>
            </form>

            {error && <div className="form-error">{error}</div>}
            {success && <div className="form-success">{success}</div>}
        </div>
    );
};

export default AddClientPage;
