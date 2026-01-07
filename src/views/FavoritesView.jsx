import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { favoritesApi } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import './FavoritesView.css';

const FavoritesView = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const data = await favoritesApi.getAll(user.email);
            setFavorites(data);
        } catch (error) {
            console.error('Failed to load favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="favorites-view">
                <div className="loading-state">Carregando favoritos...</div>
            </div>
        );
    }

    return (
        <div className="favorites-view">
            <div className="favorites-header">
                <h1>Meus Favoritos</h1>
                <p className="favorites-subtitle">
                    Imóveis que você demonstrou interesse
                </p>
            </div>

            {favorites.length > 0 ? (
                <div className="favorites-grid">
                    {favorites.map(fav => (
                        <PropertyCard
                            key={fav.property_id}
                            property={fav}
                            onClick={(id) => navigate(`/property/${id}`)}
                            isFavorited={true}
                            onFavoriteChange={loadFavorites}
                        />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-icon">❤️</div>
                    <h2>Nenhum favorito ainda</h2>
                    <p>
                        Quando você favoritar imóveis, eles aparecerão aqui para fácil acesso.
                    </p>
                    <button
                        className="btn-primary"
                        onClick={() => navigate('/marketplace')}
                    >
                        Explorar Imóveis
                    </button>
                </div>
            )}
        </div>
    );
};

export default FavoritesView;
