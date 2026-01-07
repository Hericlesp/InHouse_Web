import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { chatApi } from '../services/api';
import './ChatWindow.css';

const ChatWindow = () => {
    const { chatId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        loadMessages();
    }, [chatId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadMessages = async () => {
        try {
            setLoading(true);
            const data = await chatApi.getMessages(chatId);
            setMessages(data);
        } catch (error) {
            console.error('Failed to load messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const sent = await chatApi.sendMessage(chatId, user.email, newMessage.trim(), 'text', null);
            setMessages([...messages, sent]);
            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) {
        return (
            <div className="chat-window">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Carregando conversa...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-window">
            {/* Header */}
            <div className="chat-window-header">
                <button className="back-btn" onClick={() => navigate('/messages')}>
                    ← Voltar
                </button>
                <h2>Conversa</h2>
            </div>

            {/* Messages */}
            <div className="messages-container">
                {messages.length > 0 ? (
                    messages.map(msg => (
                        <div
                            key={msg.id}
                            className={`message ${msg.sender_email === user.email ? 'sent' : 'received'}`}
                        >
                            <div className="message-bubble">
                                <p>{msg.content}</p>
                                <span className="message-time">{formatTime(msg.created_at)}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-messages">
                        <p>Nenhuma mensagem ainda. Inicie a conversa!</p>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form className="message-input-form" onSubmit={handleSend}>
                <input
                    type="text"
                    className="message-input"
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
                    Enviar
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
