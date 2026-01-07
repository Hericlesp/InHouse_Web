import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './NotificationsView.css';

const NotificationsView = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const response = await fetch(`http://localhost:3001/api/notifications?user_email=${user.email}`);
            const data = await response.json();
            setNotifications(data);
        } catch (error) {
            console.error('Failed to load notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await fetch(`http://localhost:3001/api/notifications/${id}/read`, {
                method: 'PUT'
            });

            setNotifications(notifications.map(n =>
                n.id === id ? { ...n, read: 1 } : n
            ));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'new_lead':
                return '📬';
            case 'message':
                return '💬';
            case 'property_update':
                return '🏠';
            default:
                return '🔔';
        }
    };

    const handleNotificationClick = (notification) => {
        markAsRead(notification.id);

        // Navigate based on type
        if (notification.type === 'new_lead') {
            navigate('/owner/leads');
        } else if (notification.type === 'message') {
            navigate('/messages');
        } else if (notification.related_id) {
            navigate(`/properties/${notification.related_id}`);
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) return 'Agora';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}min atrás`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h atrás`;
        return date.toLocaleDateString('pt-BR');
    };

    if (loading) {
        return (
            <div className="notifications-view">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Carregando notificações...</p>
                </div>
            </div>
        );
    }

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="notifications-view">
            <div className="notifications-header">
                <h1>Notificações</h1>
                {unreadCount > 0 && (
                    <span className="unread-badge">{unreadCount} não lidas</span>
                )}
            </div>

            {notifications.length > 0 ? (
                <div className="notifications-list">
                    {notifications.map(notification => (
                        <div
                            key={notification.id}
                            className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                            onClick={() => handleNotificationClick(notification)}
                        >
                            <div className="notification-icon">
                                {getNotificationIcon(notification.type)}
                            </div>
                            <div className="notification-content">
                                <div className="notification-title">{notification.title}</div>
                                <div className="notification-message">{notification.message}</div>
                                <div className="notification-time">{formatTime(notification.created_at)}</div>
                            </div>
                            {!notification.read && <div className="unread-dot"></div>}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-icon">🔔</div>
                    <h2>Nenhuma notificação</h2>
                    <p>Você será notificado sobre novos leads e mensagens.</p>
                </div>
            )}
        </div>
    );
};

export default NotificationsView;
