import { useState } from 'react';
import './FeedCard.css';

const FeedCard = ({ post, onLike }) => {
    const [liked, setLiked] = useState(post.liked_by_me);
    const [likes, setLikes] = useState(post.likes);

    const handleLike = () => {
        const newLiked = !liked;
        setLiked(newLiked);
        setLikes(prev => newLiked ? prev + 1 : prev - 1);
        onLike && onLike(post.id, newLiked);
    };

    return (
        <div className="feed-card">
            {/* Header */}
            <div className="feed-card-header">
                <div className="author-info">
                    <div className="avatar">{post.author.charAt(0).toUpperCase()}</div>
                    <div className="author-details">
                        <p className="author-name">{post.author}</p>
                        <p className="post-time">{post.time} • {post.type}</p>
                        {post.tagged_property && (
                            <div className="property-tag">
                                <span>🏠</span>
                                <span>Morando em {post.tagged_property.title}</span>
                            </div>
                        )}
                    </div>
                </div>
                <button className="more-btn">⋯</button>
            </div>

            {/* Content */}
            <div className="feed-card-content">
                <p>{post.content}</p>
            </div>

            {/* Image */}
            {post.image && (
                <div className="feed-card-image">
                    <img src={post.image} alt="Post" />
                </div>
            )}

            {/* Actions */}
            <div className="feed-card-actions">
                <button
                    className={`action-btn ${liked ? 'liked' : ''}`}
                    onClick={handleLike}
                >
                    <span className="action-icon">{liked ? '❤️' : '🤍'}</span>
                    <span className="action-label">
                        {liked ? 'Aprovado' : 'Aprovar'} ({likes})
                    </span>
                </button>
                <button className="action-btn">
                    <span className="action-icon">💬</span>
                    <span className="action-label">Comentar</span>
                </button>
                <button className="action-btn">
                    <span className="action-icon">📤</span>
                    <span className="action-label">Compartilhar</span>
                </button>
            </div>
        </div>
    );
};

export default FeedCard;
