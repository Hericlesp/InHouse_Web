import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { chatApi } from '../services/api';
import './ChatView.css';

const ChatView = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadChats();
    }, []);

    const loadChats = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const data = await chatApi.getChats(user.email);
            setChats(data);
        } catch (error) {
            console.error('Failed to load chats:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) return 'Agora';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}min`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
        return date.toLocaleDateString('pt-BR');
    };

    if (loading) {
        return (
            <div className="chat-view">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Carregando conversas...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-view">
            <div className="chat-header">
                <h1>Mensagens</h1>
                <p className="chat-subtitle">{chats.length} conversas</p>
            </div>

            {chats.length > 0 ? (
                <div className="chats-list">
                    {chats.map(chat => (
                        <div
                            key={chat.id}
                            className="chat-item"
                            onClick={() => navigate(`/messages/${chat.id}`)}
                        >
                            <div className="chat-avatar">
                                {chat.other_user_email.charAt(0).toUpperCase()}
                            </div>
                            <div className="chat-content">
                                <div className="chat-top">
                                    <span className="chat-name">{chat.other_user_email}</span>
                                    <span className="chat-time">
                                        {formatTime(chat.last_message_time)}
                                    </span>
                                </div>
                                <div className="chat-message">
                                    {chat.last_message || 'Inicie uma conversa'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-icon">💬</div>
                    <h2>Nenhuma conversa ainda</h2>
                    <p>
                        Quando você iniciar conversas com proprietários ou interessados,
                        elas aparecerão aqui.
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

export default ChatView;
