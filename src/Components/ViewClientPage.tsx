import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ViewClientPage.css';

type Client = {
  id: number;
  nome: string;
  sobrenome?: string;
  idade?: number;
  telefone?: string;
  quantidade_cortes?: number;
  total_gasto?: number;
  email?: string;
};

const ViewClientPage: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';
        fetch(`${API_BASE}/api/clients`)
            .then(r => r.json())
            .then(data => { if (mounted) setClients(data); })
            .catch(() => { if (mounted) setError('Erro ao buscar clientes') })
            .finally(() => { if (mounted) setLoading(false); });
        return () => { mounted = false };
    }, []);

    const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';

    const handleDelete = async (id: number) => {
        const ok = window.confirm('Tem certeza que deseja deletar este cliente?');
        if (!ok) return;
        try {
            const res = await fetch(`${API_BASE}/api/clients/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Falha ao deletar');
            setClients(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            alert('Erro ao deletar cliente');
        }
    };

    const handleEdit = (client: Client) => {
        // Navega para a página de adicionar/editar passando o cliente via state
        navigate('/client/add', { state: { client } });
    };

    return (
        <div className="view-client-page-container">
            <div className="schedulepage-bg" />
            <div className="schedulepage-overlay" />

            <div className="view-client-container">
                <h2>Visualizar Clientes</h2>
            {loading && <p>Carregando...</p>}
            {error && <p style={{color:'#ff6b6b'}}>{error}</p>}
            {!loading && !error && (
                <div className="client-list">
                    {clients.length === 0 && <p>Nenhum cliente registrado.</p>}
                    {clients.map(c => (
                        <div key={c.id} className="client-row">
                            <div className="client-row-main">
                                <div className="client-info">
                                    <strong className="client-name">{c.nome} {c.sobrenome || ''}</strong>
                                    <div className="client-meta">{c.email || '—'} • {c.telefone || '—'}</div>
                                </div>
                                <div className="client-actions">
                                    <button className="btn btn-edit" onClick={() => handleEdit(c)}>Editar</button>
                                    <button className="btn btn-delete" onClick={() => handleDelete(c.id)}>X</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            </div>
        </div>
    );
};

export default ViewClientPage;
