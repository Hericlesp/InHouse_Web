import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ownerApi } from '../services/api';
import StatsCard from '../components/StatsCard';
import './OwnerDashboardView.css';

const OwnerDashboardView = () => {
    const { user } = useAuth();
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const data = await ownerApi.getDashboard(user.email);
            setDashboard(data);
        } catch (error) {
            console.error('Failed to load dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="owner-dashboard-view">
                <div className="loading-state">Carregando dashboard...</div>
            </div>
        );
    }

    if (!dashboard) {
        return (
            <div className="owner-dashboard-view">
                <div className="error-state">Erro ao carregar dashboard</div>
            </div>
        );
    }

    return (
        <div className="owner-dashboard-view">
            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <h1>Meu Portal</h1>
                    <p className="dashboard-subtitle">
                        Bem-vindo de volta, {user?.name}
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <StatsCard
                    icon="🏠"
                    value={dashboard.total_properties}
                    label="Imóveis Cadastrados"
                    color="pink"
                />
                <StatsCard
                    icon="📊"
                    value={dashboard.total_leads}
                    label="Leads Totais"
                    color="blue"
                />
                <StatsCard
                    icon="👀"
                    value={dashboard.total_views}
                    label="Visualizações"
                    color="green"
                />
                <StatsCard
                    icon="✓"
                    value={dashboard.properties_by_status?.Available || 0}
                    label="Disponíveis"
                    color="orange"
                />
            </div>

            {/* Quick Links */}
            <div className="dashboard-sections">
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2>Ações Rápidas</h2>
                    </div>
                    <div className="quick-links">
                        <Link to="/owner/properties" className="quick-link-card">
                            <span className="link-icon">🏘️</span>
                            <span className="link-title">Gerenciar Imóveis</span>
                            <span className="link-description">
                                {dashboard.total_properties} propriedades
                            </span>
                        </Link>
                        <Link to="/owner/leads" className="quick-link-card">
                            <span className="link-icon">📬</span>
                            <span className="link-title">Ver Leads</span>
                            <span className="link-description">
                                {dashboard.total_leads} interessados
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboardView;
