import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="page-home">
            <header className="glass-panel" style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ margin: 0, fontSize: '1.5rem' }}>InHouse</h1>
                <nav className="flex gap-4">
                    <Link to="/" style={{ fontWeight: 500 }}>Home</Link>
                    <a href="#" style={{ fontWeight: 500 }}>About</a>
                    <a href="#" style={{ fontWeight: 500 }}>Contact</a>
                </nav>
            </header>

            <main className="container text-center">
                <div className="glass-panel" style={{ padding: '4rem 2rem', marginTop: '2rem' }}>
                    <h2 style={{ fontSize: '3rem', marginBottom: '1rem', background: 'linear-gradient(to right, var(--primary-600), var(--primary-400))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Find Your Dream Pink Home
                    </h2>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem' }}>
                        The premium platform for renting beautiful houses. Choose your role to get started.
                    </p>

                    <div className="flex justify-center gap-4" style={{ marginTop: '3rem' }}>
                        <button onClick={() => navigate('/user')} className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                            I want to Rent
                        </button>
                        <button onClick={() => navigate('/owner')} className="btn-secondary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                            I am an Owner
                        </button>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <Link to="/admin" style={{ fontSize: '0.9rem', color: 'var(--primary-600)', textDecoration: 'underline' }}>
                            Admin / Developer Access
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
