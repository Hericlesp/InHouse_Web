import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import './MarketplaceView.css';

const MarketplaceView = () => {
    const navigate = useNavigate();
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        city: '',
        neighborhood: '',
        type: '',
        maxPrice: ''
    });

    // Mock data - TODO: Replace with API calls
    const [properties] = useState([
        {
            id: 1,
            title: 'Sunny Loft in Leblon',
            price: 6500,
            neighborhood: 'Leblon',
            city: 'Rio de Janeiro',
            state: 'RJ',
            type: 'Apartment',
            image_url: null
        },
        {
            id: 2,
            title: 'Cozy Studio Lapa',
            price: 1800,
            neighborhood: 'Lapa',
            city: 'Rio de Janeiro',
            state: 'RJ',
            type: 'Studio',
            image_url: null
        },
        {
            id: 3,
            title: 'Beach House Barra',
            price: 12000,
            neighborhood: 'Barra da Tijuca',
            city: 'Rio de Janeiro',
            state: 'RJ',
            type: 'House',
            image_url: null
        },
        {
            id: 4,
            title: 'Paulista Avenue Flat',
            price: 3500,
            neighborhood: 'Bela Vista',
            city: 'São Paulo',
            state: 'SP',
            type: 'Kitnet',
            image_url: null
        }
    ]);

    const filteredProperties = properties.filter(property => {
        if (filters.city && !property.city.toLowerCase().includes(filters.city.toLowerCase())) {
            return false;
        }
        if (filters.neighborhood && !property.neighborhood.toLowerCase().includes(filters.neighborhood.toLowerCase())) {
            return false;
        }
        if (filters.type && property.type !== filters.type) {
            return false;
        }
        if (filters.maxPrice && property.price > parseFloat(filters.maxPrice)) {
            return false;
        }
        return true;
    });

    return (
        <div className="marketplace-view">
            {/* Header */}
            <div className="marketplace-header">
                <div>
                    <h1>Marketplace</h1>
                    <p className="marketplace-subtitle">Descubra sua próxima residência dos sonhos</p>
                </div>
                <button
                    className="filter-toggle"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    🔍 Filtros
                </button>
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="filters-card">
                    <div className="filters-grid">
                        <input
                            type="text"
                            placeholder="Cidade"
                            className="filter-input"
                            value={filters.city}
                            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Bairro"
                            className="filter-input"
                            value={filters.neighborhood}
                            onChange={(e) => setFilters({ ...filters, neighborhood: e.target.value })}
                        />
                        <select
                            className="filter-select"
                            value={filters.type}
                            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                        >
                            <option value="">Todos os Tipos</option>
                            <option value="Apartment">Apartamento</option>
                            <option value="House">Casa</option>
                            <option value="Studio">Studio</option>
                            <option value="Kitnet">Kitnet</option>
                        </select>
                        <input
                            type="number"
                            placeholder="Preço Máx"
                            className="filter-input"
                            value={filters.maxPrice}
                            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                        />
                    </div>
                </div>
            )}

            {/* Properties Grid */}
            <div className="properties-grid">
                {filteredProperties.length > 0 ? (
                    filteredProperties.map(property => (
                        <PropertyCard
                            key={property.id}
                            property={property}
                            onClick={(id) => navigate(`/property/${id}`)}
                        />
                    ))
                ) : (
                    <div className="no-results">
                        <p>Nenhum imóvel encontrado com esses filtros</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarketplaceView;
