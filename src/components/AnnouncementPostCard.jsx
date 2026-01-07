import './AnnouncementPostCard.css';

const AnnouncementPostCard = ({ post }) => {
    return (
        <div className="feed-card announcement-post-card">
            {/* Header */}
            <div className="feed-card-header">
                <div className="post-type-badge announcement">
                    Comunicado Oficial
                </div>
            </div>

            {/* Content */}
            <div className="announcement-content">
                <h3 className="announcement-title">
                    {post.title || 'Atualização Importante'}
                </h3>
                <p className="announcement-text">{post.content}</p>

                {post.image && (
                    <div className="announcement-image">
                        <img src={post.image} alt="Announcement" />
                    </div>
                )}

                <div className="announcement-footer">
                    <span className="announcement-author">
                        Equipe InHouse • {post.time}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementPostCard;
