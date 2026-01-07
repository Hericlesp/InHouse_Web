import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ownerApi } from '../services/api';
import './OwnerLeadsView.css';

const OwnerLeadsView = () => {
    const { user } = useAuth();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadLeads();
    }, []);

    const loadLeads = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const data = await ownerApi.getLeads(user.email);
            setLeads(data);
        } catch (error) {
            console.error('Failed to load leads:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (leadId, newStatus) => {
        try {
            await ownerApi.updateLead(leadId, newStatus);
            // Reload leads
            loadLeads();
        } catch (error) {
            console.error('Failed to update lead:', error);
        }
    };

    const filteredLeads = filter === 'all'
        ? leads
        : leads.filter(lead => lead.status === filter);

    const statusOptions = ['Novo', 'Contatado', 'Visitado', 'Fechado'];

    if (loading) {
        return (
            <div className="owner-leads-view">
                <div className="loading-state">Carregando leads...</div>
            </div>
        );
    }

    return (
        <div className="owner-leads-view">
            {/* Header */}
            <div className="leads-header">
                <div>
                    <h1>Gestão de Leads</h1>
                    <p className="leads-subtitle">{leads.length} interessados no total</p>
                </div>

                {/* Filter */}
                <select
                    className="filter-select"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">Todos os Status</option>
                    <option value="Novo">Novo</option>
                    <option value="Contatado">Contatado</option>
                    <option value="Visitado">Visitado</option>
                    <option value="Fechado">Fechado</option>
                </select>
            </div>

            {/* Leads Table */}
            {filteredLeads.length > 0 ? (
                <div className="leads-table-container">
                    <table className="leads-table">
                        <thead>
                            <tr>
                                <th>Interessado</th>
                                <th>Imóvel</th>
                                <th>Data</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLeads.map(lead => (
                                <tr key={lead.id}>
                                    <td>
                                        <div className="lead-user">
                                            <div className="lead-avatar">
                                                {lead.user_name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="lead-name">{lead.user_name}</div>
                                                <div className="lead-email">{lead.user_email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="lead-property">
                                            <div className="property-name">{lead.property_title}</div>
                                            <div className="property-location">{lead.property_neighborhood}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="lead-date">
                                            {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            className={`status-select status-${lead.status.toLowerCase()}`}
                                            value={lead.status}
                                            onChange={(e) => handleStatusUpdate(lead.id, e.target.value)}
                                        >
                                            {statusOptions.map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <button className="btn-chat">
                                            Iniciar Conversa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="empty-state">
                    <h2>Nenhum lead encontrado</h2>
                    <p>
                        {filter === 'all'
                            ? 'Quando usuários demonstrarem interesse, eles aparecerão aqui.'
                            : `Nenhum lead com status "${filter}".`}
                    </p>
                </div>
            )}
        </div>
    );
};

export default OwnerLeadsView;
