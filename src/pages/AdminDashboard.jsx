import React from 'react';
import { Link } from 'react-router-dom';
import loftImg from '../assets/loft.png';
import palaceImg from '../assets/palace.png';
import villaImg from '../assets/villa.png';

const UserAvatar = ({ name, color, size = '40px' }) => (
    <div style={{
        width: size, height: size, borderRadius: '50%', backgroundColor: color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'white', fontWeight: 'bold', fontSize: '0.9rem',
        border: '2px solid white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    }}>
        {name.charAt(0)}
    </div>
);

const FeedCard = ({ author, time, content, image, type }) => (
    <div className="card" style={{ marginBottom: '1.5rem', padding: '0', overflow: 'hidden', border: 'none', boxShadow: 'var(--shadow-md)' }}>
        {/* Post Header */}
        <div style={{ padding: '1rem', display: 'flex', alignItems: 'center' }}>
            <UserAvatar name={author} color="#e64980" />
            <div style={{ marginLeft: '0.75rem' }}>
                <h4 style={{ margin: 0, fontSize: '1rem' }}>{author}</h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{time} • {type}</span>
            </div>
            <button style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>...</button>
        </div>

        {/* Post Content */}
        <div style={{ padding: '0 1rem 1rem' }}>
            <p style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{content}</p>
        </div>

        {/* Image Attachment (House) */}
        {image && (
            <div style={{ width: '100%', height: '300px', backgroundColor: '#f1f3f5', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <img src={image} alt="House" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
        )}

        {/* Action Bar (Social Style) */}
        <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '1rem' }}>
            <button className="btn" style={{ flex: 1, color: '#e64980', background: '#fff0f6' }}>
                ❤️ Approve Listing
            </button>
            <button className="btn" style={{ flex: 1, color: 'var(--text-secondary)', background: '#f8f9fa' }}>
                💬 Comment
            </button>
            <button className="btn" style={{ flex: 1, color: 'var(--text-secondary)', background: '#f8f9fa' }}>
                Share
            </button>
        </div>
    </div>
);

const TrendItem = ({ tag, count }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
            <h5 style={{ margin: 0 }}>{tag}</h5>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{count} posts</span>
        </div>
        <span style={{ cursor: 'pointer' }}>...</span>
    </div>
);

const AdminDashboard = () => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
            {/* Narrative Sidebar */}
            <aside style={{ width: '280px', padding: '2rem', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' }}>
                <h2 style={{ color: '#e64980', fontSize: '1.8rem', marginBottom: '2rem' }}>InHouse.</h2>
                <nav className="flex-col gap-4">
                    <SidebarLink icon="🏠" label="Home Feed" active />
                    <SidebarLink icon="🔔" label="Notifications" badge="3" />
                    <SidebarLink icon="📩" label="Messages" />
                    <SidebarLink icon="👥" label="Community" />
                    <SidebarLink icon="⚙️" label="Settings" />
                </nav>
                <div style={{ marginTop: 'auto' }}>
                    <div className="card flex items-center gap-2" style={{ padding: '0.75rem' }}>
                        <UserAvatar name="Admin" color="#228be6" />
                        <div>
                            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Justino Admin</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>@superuser</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Feed */}
            <main style={{ flex: 1, maxWidth: '600px', margin: '0 2rem' }}>
                <header style={{ padding: '1.5rem 0', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 10 }}>
                    <h3>Community Activity</h3>
                </header>

                {/* Create Post Input */}
                <div className="card" style={{ marginBottom: '2rem', padding: '1rem', display: 'flex', gap: '1rem' }}>
                    <UserAvatar name="Admin" color="#228be6" />
                    <input type="text" placeholder="What's happening in InHouse?" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '1rem' }} />
                </div>

                {/* The Feed */}
                <FeedCard
                    author="Maria Silva"
                    time="2h ago"
                    type="New Listing"
                    content="Just posted my beautiful loft in Copacabana! Pink vibes only 🌸 Looking for a respectful tenant who loves plants."
                    image={loftImg}
                />

                <FeedCard
                    author="João Santos"
                    time="4h ago"
                    type="Listing Update"
                    content="Lowered the price on the 'Pink Palace' slightly. Don't miss out on this gem! 💎"
                    image={palaceImg}
                />

                <FeedCard
                    author="Ana Costa"
                    time="5h ago"
                    type="User Review"
                    content="Had an amazing stay at the Villa! The owner was super helpful and the decor is to die for. ⭐️⭐️⭐️⭐️⭐️"
                    image={villaImg}
                />
            </main>

            {/* Right Sidebar (Trends) */}
            <aside style={{ width: '300px', padding: '2rem 0' }}>
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Trending in InHouse</h3>
                    <TrendItem tag="#PinkHouses" count="1,240" />
                    <TrendItem tag="#RioRentals" count="850" />
                    <TrendItem tag="#ModernLiving" count="420" />
                    <TrendItem tag="#PetFriendly" count="210" />
                </div>
            </aside>
        </div>
    );
};

const SidebarLink = ({ icon, label, active, badge }) => (
    <div style={{
        display: 'flex', alignItems: 'center', padding: '0.75rem',
        fontSize: '1.2rem', fontWeight: active ? 700 : 500,
        color: active ? '#e64980' : 'var(--text-primary)',
        cursor: 'pointer'
    }}>
        <span style={{ marginRight: '1rem' }}>{icon}</span>
        {label}
        {badge && <span className="badge badge-pink" style={{ marginLeft: 'auto' }}>{badge}</span>}
    </div>
);

export default AdminDashboard;
