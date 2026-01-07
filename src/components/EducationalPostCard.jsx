import './EducationalPostCard.css';

const EducationalPostCard = ({ post }) => {
    return (
        <div className="feed-card educational-post-card">
            {/* Header */}
            <div className="feed-card-header">
                <div className="post-type-badge educational">
                    Conteúdo Educativo
                </div>
            </div>

            {/* Content */}
            <div className="educational-content">
                <h3 className="educational-title">
                    {post.title || 'Dica Importante'}
                </h3>
                <p className="educational-text">{post.content}</p>

                {post.image && (
                    <div className="educational-image">
                        <img src={post.image} alt="Educational" />
                    </div>
                )}

                <div className="educational-footer">
                    <button className="btn-learn-more">
                        Leia Mais →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EducationalPostCard;
