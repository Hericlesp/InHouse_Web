import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { favoritesApi } from '../services/api';
import './PropertyCard.css';

const PropertyCard = ({ property, onClick, isFavorited = false, onFavoriteChange }) => {
    const { user } = useAuth();
    const [favorited, setFavorited] = useState(isFavorited);
    const [loading, setLoading] = useState(false);

    const handleFavorite = async (e) => {
        e.stopPropagation(); // Prevent card click
        if (!user) return;

        setLoading(true);
        try {
            if (favorited) {
                await favoritesApi.remove(property.id, user.email);
            } else {
                await favoritesApi.add(user.email, property.id);
            }
            setFavorited(!favorited);
            onFavoriteChange && onFavoriteChange();
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="property-card" onClick={() => onClick && onClick(property.id)}>
            {/* Favorite Button */}
            <button
                className={`favorite-btn ${favorited ? 'favorited' : ''}`}
                onClick={handleFavorite}
                disabled={loading}
                title={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
                {favorited ? '❤️' : '🤍'}
            </button>

            {/* Image */}
            <div className="property-image">
                {property.image_url ? (
                    <img src={property.image_url} alt={property.title} />
                ) : (
                    <div className="image-placeholder">
                        <span>🏠</span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="property-info">
                <h3 className="property-title">{property.title}</h3>
                <p className="property-price">R$ {property.price.toLocaleString()}/mês</p>

                <div className="property-details">
                    <div className="detail-item">
                        <span className="detail-icon">📍</span>
                        <span className="detail-text">
                            {property.neighborhood}, {property.city}
                        </span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-icon">🏢</span>
                        <span className="detail-text">{property.type}</span>
                    </div>
                </div>

                {/* Property Badges */}
                {(property.accepts_pets || property.is_furnished) && (
                    <div className="property-badges">
                        {property.accepts_pets && <span className="property-badge">🐾 Aceita Pets</span>}
                        {property.is_furnished && <span className="property-badge">🛋️ Mobiliado</span>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PropertyCard;
