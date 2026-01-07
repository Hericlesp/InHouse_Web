import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './ProfileView.css';

const ProfileView = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    if (!user) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="profile-view">
            {/* Profile Header */}
            <div className="profile-header">
                <div className="profile-avatar-large">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="profile-info">
                    <h1>{user.name}</h1>
                    <p className="profile-email">{user.email}</p>
                    <div className="profile-badges">
                        {user.user_type === 'owner' && (
                            <span className="badge-owner">Proprietário</span>
                        )}
                        {user.verified && (
                            <span className="badge-verified">✓ Verificado</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="profile-stats">
                <div className="stat-card">
                    <div className="stat-value">{user.points || 0}</div>
                    <div className="stat-label">Pontos</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">⭐ {user.stars?.toFixed(1) || '5.0'}</div>
                    <div className="stat-label">Avaliação</div>
                </div>
                {user.user_type === 'owner' && (
                    <div className="stat-card">
                        <div className="stat-value">-</div>
                        <div className="stat-label">Imóveis Ativos</div>
                    </div>
                )}
            </div>

            {/* Personal Information */}
            <div className="profile-section">
                <div className="section-header">
                    <h2>Informações Pessoais</h2>
                    <button
                        className="btn-edit"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? 'Cancelar' : 'Editar'}
                    </button>
                </div>

                <div className="info-grid">
                    <div className="info-item">
                        <label>Nome Completo</label>
                        {isEditing ? (
                            <input type="text" defaultValue={user.name} />
                        ) : (
                            <p>{user.name}</p>
                        )}
                    </div>

                    <div className="info-item">
                        <label>Email</label>
                        <p>{user.email}</p>
                    </div>

                    <div className="info-item">
                        <label>Telefone</label>
                        {isEditing ? (
                            <input type="tel" defaultValue={user.phone || ''} placeholder="(00) 00000-0000" />
                        ) : (
                            <p>{user.phone || 'Não informado'}</p>
                        )}
                    </div>

                    <div className="info-item">
                        <label>Tipo de Conta</label>
                        <p className="account-type">
                            {user.user_type === 'owner' ? 'Proprietário' : 'Inquilino'}
                        </p>
                    </div>
                </div>

                {isEditing && (
                    <div className="form-actions">
                        <button className="btn-primary">Salvar Alterações</button>
                    </div>
                )}
            </div>

            {/* Activity Section */}
            <div className="profile-section">
                <h2>Atividade Recente</h2>
                <div className="activity-list">
                    <div className="activity-item">
                        <div className="activity-icon">❤️</div>
                        <div className="activity-content">
                            <p className="activity-title">Favoritou um imóvel</p>
                            <p className="activity-time">Há 2 dias</p>
                        </div>
                    </div>
                    <div className="activity-item">
                        <div className="activity-icon">👍</div>
                        <div className="activity-content">
                            <p className="activity-title">Demonstrou interesse em um imóvel</p>
                            <p className="activity-time">Há 5 dias</p>
                        </div>
                    </div>
                    <div className="activity-item">
                        <div className="activity-icon">⭐</div>
                        <div className="activity-content">
                            <p className="activity-title">Ganhou 50 pontos</p>
                            <p className="activity-time">Há 1 semana</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Settings Link */}
            <div className="profile-section">
                <h2>Configurações da Conta</h2>
                <div className="settings-links">
                    <a href="/settings" className="settings-link">
                        Preferências e Privacidade →
                    </a>
                    <a href="/settings" className="settings-link">
                        Notificações →
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
