import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { propertiesApi } from '../services/api';
import './OwnerPropertiesView.css';

const OwnerPropertiesView = () => {
    const { user } = useAuth();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadProperties();
    }, []);

    const loadProperties = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const data = await propertiesApi.getAll({ owner_email: user.email });
            setProperties(data);
        } catch (error) {
            console.error('Failed to load properties:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProperties = filter === 'all'
        ? properties
        : properties.filter(p => p.status === filter);

    if (loading) {
        return (
            <div className="owner-properties-view">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Carregando imóveis...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="owner-properties-view">
            {/* Header */}
            <div className="properties-header">
                <div>
                    <h1>Meus Imóveis</h1>
                    <p className="properties-subtitle">{properties.length} propriedades cadastradas</p>
                </div>

                <select
                    className="filter-select"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">Todos os Status</option>
                    <option value="Available">Disponível</option>
                    <option value="Reserved">Reservado</option>
                    <option value="Rented">Alugado</option>
                </select>
            </div>

            {/* Properties Grid */}
            {filteredProperties.length > 0 ? (
                <div className="properties-grid">
                    {filteredProperties.map(property => (
                        <div key={property.id} className="property-card-owner">
                            <div className="property-image-owner">
                                {property.image_url ? (
                                    <img src={property.image_url} alt={property.title} />
                                ) : (
                                    <div className="image-placeholder">
                                        <span>Sem imagem</span>
                                    </div>
                                )}
                                <span className={`status-badge ${property.status.toLowerCase()}`}>
                                    {property.status}
                                </span>
                            </div>

                            <div className="property-content">
                                <h3>{property.title}</h3>
                                <p className="property-price">R$ {property.price.toLocaleString()}/mês</p>
                                <p className="property-location">{property.neighborhood}, {property.city}</p>

                                {/* Metrics */}
                                <div className="property-metrics">
                                    <div className="metric">
                                        <span className="metric-value">{property.views || 0}</span>
                                        <span className="metric-label">Views</span>
                                    </div>
                                    <div className="metric">
                                        <span className="metric-value">{property.favorites || 0}</span>
                                        <span className="metric-label">Favoritos</span>
                                    </div>
                                    <div className="metric">
                                        <span className="metric-value">{property.leads || 0}</span>
                                        <span className="metric-label">Leads</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <h2>Nenhum imóvel encontrado</h2>
                    <p>
                        {filter === 'all'
                            ? 'Você ainda não possui imóveis cadastrados.'
                            : `Nenhum imóvel com status "${filter}".`}
                    </p>
                </div>
            )}
        </div>
    );
};

export default OwnerPropertiesView;
