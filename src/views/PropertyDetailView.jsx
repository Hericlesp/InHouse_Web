import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { propertiesApi, favoritesApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PhotoGallery from '../components/PhotoGallery';
import './PropertyDetailView.css';

const PropertyDetailView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProperty();
    }, [id]);

    const loadProperty = async () => {
        try {
            setLoading(true);
            const data = await propertiesApi.getById(id);
            setProperty(data);
        } catch (error) {
            console.error('Failed to load property:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="property-detail-view">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Carregando detalhes do imóvel...</p>
                </div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="property-detail-view">
                <div className="error-state">
                    <h2>Imóvel não encontrado</h2>
                    <p>O imóvel que você procura não está disponível.</p>
                    <button className="btn-primary" onClick={() => navigate('/marketplace')}>
                        Voltar ao Marketplace
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="property-detail-view">
            {/* Back Button */}
            <button className="back-btn" onClick={() => navigate(-1)}>
                ← Voltar
            </button>

            {/* Header */}
            <div className="property-header">
                <div>
                    <h1>{property.title}</h1>
                    <p className="property-location-header">
                        {property.address} • {property.neighborhood}, {property.city}
                    </p>
                </div>
                <div className="property-price-header">
                    <span className="price-label">Aluguel</span>
                    <span className="price-value">R$ {property.price.toLocaleString()}/mês</span>
                </div>
            </div>

            {/* Gallery */}
            <div className="property-gallery-container">
                <PhotoGallery photos={property.photos || (property.image_url ? [property.image_url] : [])} />
            </div>

            {/* Property Details */}
            <div className="property-details-grid">
                <div className="detail-section">
                    <h3>Descrição</h3>
                    <p>
                        {property.description || `Belo ${property.type.toLowerCase()} localizado em ${property.neighborhood}, um dos bairros mais procurados de ${property.city}. Perfeito para quem busca conforto e conveniência.`}
                    </p>
                </div>

                <div className="detail-section">
                    <h3>Valores Mensais</h3>
                    <div className="price-breakdown">
                        <div className="price-item">
                            <span className="price-label">Aluguel:</span>
                            <span className="price-value">R$ {property.price.toLocaleString()}</span>
                        </div>
                        {property.condo_fee > 0 && (
                            <div className="price-item">
                                <span className="price-label">Condomínio:</span>
                                <span className="price-value">R$ {property.condo_fee.toLocaleString()}</span>
                            </div>
                        )}
                        {property.iptu > 0 && (
                            <div className="price-item">
                                <span className="price-label">IPTU:</span>
                                <span className="price-value">R$ {property.iptu.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="price-item total">
                            <span className="price-label">Total estimado:</span>
                            <span className="price-value">
                                R$ {(property.price + (property.condo_fee || 0) + (property.iptu || 0)).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="detail-section">
                    <h3>Localização</h3>
                    <div className="detail-item">
                        <span className="detail-label">Endereço:</span>
                        <span>{property.address}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Bairro:</span>
                        <span>{property.neighborhood}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Cidade:</span>
                        <span>{property.city}, {property.state}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">País:</span>
                        <span>{property.country}</span>
                    </div>
                </div>

                <div className="detail-section">
                    <h3>Características</h3>
                    <ul className="features-list">
                        <li className={property.is_furnished ? 'available' : 'unavailable'}>
                            {property.is_furnished ? '✓' : '✗'} Mobiliado
                        </li>
                        <li className={property.accepts_pets ? 'available' : 'unavailable'}>
                            {property.accepts_pets ? '✓' : '✗'} Aceita Pets
                        </li>
                        <li className="available">✓ Internet de Alta Velocidade</li>
                        <li className="available">✓ Segurança 24h</li>
                    </ul>
                </div>

                <div className="detail-section">
                    <h3>Informações Contratuais</h3>
                    <div className="detail-item">
                        <span className="detail-label">Tipo de Garantia:</span>
                        <span>{property.guarantee_type}</span>
                    </div>
                    {property.availability_date && (
                        <div className="detail-item">
                            <span className="detail-label">Disponível a partir de:</span>
                            <span>{new Date(property.availability_date).toLocaleDateString('pt-BR')}</span>
                        </div>
                    )}
                    <div className="detail-item">
                        <span className="detail-label">Status:</span>
                        <span className={`status-badge ${property.status.toLowerCase()}`}>
                            {property.status}
                        </span>
                    </div>
                </div>

                <div className="detail-section">
                    <h3>Responsável pelo Imóvel</h3>
                    <div className="owner-card">
                        <div className="avatar">P</div>
                        <div>
                            <p className="owner-name">Proprietário</p>
                            <p className="owner-email">{property.owner_email}</p>
                            <div className="owner-rating">
                                ⭐ 4.8 (24 avaliações)
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetailView;
