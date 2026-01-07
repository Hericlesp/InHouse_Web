import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { chatApi } from '../services/api';
import './ChatView.css';

const ChatView = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadConversations();
    }, []);

    const loadConversations = async () => {
        try {
            const data = await chatApi.getChats(user.email);
            setConversations(data);
        } catch (error) {
            console.error('Error loading conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Carregando conversas...</div>;

    return (
        <div className="chat-view-container">
            <div className="conversations-header">
                <h2>Mensagens</h2>
            </div>

            <div className="conversations-list-full">
                {conversations.length === 0 ? (
                    <div className="empty-chat">
                        <span className="empty-icon">💬</span>
                        <p>Nenhuma conversa iniciada ainda.</p>
                        <p className="subtitle">Interaja com proprietários no Marketplace para começar!</p>
                    </div>
                ) : (
                    conversations.map(conv => (
                        <div
                            key={conv.id}
                            className="conversation-card"
                            onClick={() => navigate(`/messages/${conv.id}`)}
                        >
                            <div className="conv-avatar">
                                {conv.other_user_email.charAt(0).toUpperCase()}
                            </div>
                            <div className="conv-details">
                                <div className="conv-row">
                                    <span className="conv-user">{conv.other_user_email}</span>
                                    <span className="conv-date">
                                        {conv.last_message_time ? new Date(conv.last_message_time).toLocaleDateString() : ''}
                                    </span>
                                </div>
                                <p className="conv-last-msg">
                                    {conv.last_message || 'Inicie a conversa...'}
                                </p>
                            </div>
                            <div className="conv-arrow">›</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ChatView;
