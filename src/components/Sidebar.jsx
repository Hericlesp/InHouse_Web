import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
    const location = useLocation();
    const { user, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const navItems = [
        { path: '/feed', icon: '', label: 'Feed', name: 'feed' },
        { path: '/marketplace', icon: '', label: 'Marketplace', name: 'marketplace' },
        { path: '/favorites', icon: '♥', label: 'Favoritos', name: 'favorites' },
        { path: '/messages', icon: '', label: 'Mensagens', name: 'messages' },
        { path: '/notifications', icon: '', label: 'Notificações', name: 'notifications' },
    ];

    const bottomNavItems = [
        { path: '/profile', icon: '', label: 'Perfil', name: 'profile' },
        { path: '/settings', icon: '', label: 'Configurações', name: 'settings' }
    ];

    const isOwner = user?.user_type === 'owner';
    const allNavItems = navItems;

    const isActive = (path) => location.pathname === path;

    return (
        <div className="sidebar">
            {/* Logo */}
            <div className="sidebar-logo">
                <h1 className="logo-text">
                    <span className="logo-in">In</span>
                    <span className="logo-house">House</span>
                </h1>
                <p className="logo-tagline">Plataforma Social Imobiliária</p>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                {allNavItems.map(item => (
                    <Link
                        key={item.name}
                        to={item.path}
                        className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                    </Link>
                ))}

                <div className="nav-separator"></div>

                {bottomNavItems.map(item => (
                    <Link
                        key={item.name}
                        to={item.path}
                        className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                    </Link>
                ))}
            </nav>

            {/* Owner Portal Button */}
            <div className="sidebar-footer">
                <Link to="/owner/dashboard" className="owner-portal-btn">
                    <span>📊</span>
                    <span>Meu Portal</span>
                </Link>

                {/* User Card */}
                {user && (
                    <div className="user-menu-container">
                        <div
                            className={`user-card ${showUserMenu ? 'active' : ''}`}
                            onClick={() => setShowUserMenu(!showUserMenu)}
                        >
                            <div className="user-avatar">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="user-info">
                                <p className="user-name">{user.name}</p>
                                <p className="user-email">{user.user_type === 'owner' ? 'Proprietário' : user.email}</p>
                            </div>
                            <span className="menu-chevron">
                                {showUserMenu ? '▼' : '▲'}
                            </span>
                        </div>

                        {showUserMenu && (
                            <div className="user-dropdown-menu">
                                {user.user_type === 'owner' && (
                                    <Link to="/owner/dashboard" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                                        <span className="item-icon">📊</span>
                                        Meu Portal
                                    </Link>
                                )}
                                <div className="dropdown-divider"></div>
                                <button className="dropdown-item logout" onClick={logout}>
                                    <span className="item-icon">🚪</span>
                                    Sair
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
