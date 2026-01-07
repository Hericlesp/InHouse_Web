import { useState } from 'react';
import './PropertyPostCard.css';

const PropertyPostCard = ({ post, property, onInteraction }) => {
    const [interested, setInterested] = useState(false);

    const handleInterest = () => {
        setInterested(!interested);
        onInteraction && onInteraction(property.id, 'interest');
    };

    return (
        <div className="feed-card property-post-card">
            {/* Header */}
            <div className="feed-card-header">
                <div className="post-type-badge property">
                    Imóvel Disponível
                </div>
            </div>

            {/* Property Image */}
            {property.image_url ? (
                <div className="property-post-image">
                    <img src={property.image_url} alt={property.title} />
                    {property.status !== 'Available' && (
                        <div className="status-overlay">{property.status}</div>
                    )}
                </div>
            ) : (
                <div className="property-post-image placeholder">
                    <span className="placeholder-text">Sem imagem</span>
                </div>
            )}

            {/* Property Info */}
            <div className="property-post-info">
                <h3 className="property-post-title">{property.title}</h3>
                <p className="property-post-price">
                    R$ {property.price.toLocaleString()}/mês
                </p>
                <p className="property-post-location">
                    {property.neighborhood}, {property.city}
                </p>

                {/* Property Badges */}
                <div className="property-post-badges">
                    {property.accepts_pets && <span className="badge">Aceita Pets</span>}
                    {property.is_furnished && <span className="badge">Mobiliado</span>}
                </div>

                {/* Actions */}
                <div className="property-post-actions">
                    <button
                        className={`btn-interest ${interested ? 'interested' : ''}`}
                        onClick={handleInterest}
                    >
                        {interested ? '✓ Interesse Demonstrado' : 'Demonstrar Interesse'}
                    </button>
                    <button className="btn-view-details">
                        Ver Detalhes
                    </button>
                </div>
            </div>

            {/* Optional message from author */}
            {post.content && (
                <div className="property-post-message">
                    <p>{post.content}</p>
                </div>
            )}
        </div>
    );
};

export default PropertyPostCard;
