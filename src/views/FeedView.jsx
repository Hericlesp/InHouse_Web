import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import FeedCard from '../components/FeedCard';
import './FeedView.css';

const FeedView = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([
        // Mock data - TODO: Replace with API calls
        {
            id: 1,
            author: 'Justino Admin',
            time: '2 hours ago',
            type: 'Update',
            content: 'Just moved into my new apartment in Leblon! The view is amazing 🌅',
            image: null,
            likes: 12,
            liked_by_me: false,
            tagged_property: {
                id: 1,
                title: 'Sunny Loft in Leblon'
            }
        }
    ]);

    const [newPost, setNewPost] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const fileInputRef = useRef(null);

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePost = () => {
        if (!newPost.trim() && !selectedImage) return;

        const post = {
            id: Date.now(),
            author: user.name,
            time: 'Just now',
            type: 'Update',
            content: newPost,
            image: previewImage,
            likes: 0,
            liked_by_me: false,
            tagged_property: null
        };

        setPosts([post, ...posts]);
        setNewPost('');
        setSelectedImage(null);
        setPreviewImage(null);
    };

    const handleLike = (postId, liked) => {
        setPosts(posts.map(post =>
            post.id === postId
                ? { ...post, liked_by_me: liked, likes: liked ? post.likes + 1 : post.likes - 1 }
                : post
        ));
    };

    return (
        <div className="feed-view">
            <div className="feed-header">
                <h1>Atividade da Comunidade</h1>
                <p className="feed-subtitle">Compartilhe seus momentos InHouse</p>
            </div>

            {/* New Post Input */}
            <div className="new-post-card">
                <div className="post-input-header">
                    <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
                    <input
                        type="text"
                        placeholder="O que está acontecendo na InHouse?"
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        className="post-input"
                    />
                </div>

                {previewImage && (
                    <div className="image-preview">
                        <img src={previewImage} alt="Preview" />
                        <button
                            className="remove-image"
                            onClick={() => {
                                setSelectedImage(null);
                                setPreviewImage(null);
                            }}
                        >
                            ✕
                        </button>
                    </div>
                )}

                <div className="post-actions">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        style={{ display: 'none' }}
                    />
                    <button
                        className="btn-icon"
                        onClick={() => fileInputRef.current.click()}
                        title="Adicionar foto"
                    >
                        📷
                    </button>
                    <button className="btn-icon" title="Marcar seu imóvel">
                        🏠
                    </button>
                    <div style={{ flex: 1 }} />
                    <button
                        className="btn-primary"
                        onClick={handlePost}
                        disabled={!newPost.trim() && !selectedImage}
                    >
                        Publicar
                    </button>
                </div>
            </div>

            {/* Feed */}
            <div className="feed-list">
                {posts.map(post => (
                    <FeedCard
                        key={post.id}
                        post={post}
                        onLike={handleLike}
                    />
                ))}
            </div>
        </div>
    );
};

export default FeedView;
