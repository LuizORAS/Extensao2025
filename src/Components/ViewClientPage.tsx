import React, { useEffect, useState } from 'react';
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

    return (
        <div className="view-client-container">
            <h2>Visualizar Clientes</h2>
            {loading && <p>Carregando...</p>}
            {error && <p style={{color:'#ff6b6b'}}>{error}</p>}
            {!loading && !error && (
                <div className="client-list">
                    {clients.length === 0 && <p>Nenhum cliente registrado.</p>}
                    {clients.map(c => (
                        <div key={c.id} className="client-row">
                            <strong>{c.nome} {c.sobrenome || ''}</strong>
                            <div>{c.email || '—'} • {c.telefone || '—'}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ViewClientPage;
