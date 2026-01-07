import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import loftImg from '../assets/loft.png';
import palaceImg from '../assets/palace.png';
import villaImg from '../assets/villa.png';

const UserDashboard = () => {
    // Mock data for initial houses
    const [houses, setHouses] = useState([
        { id: 1, title: 'Pink Palace', price: 1200, location: 'Downtown', image: palaceImg },
        { id: 2, title: 'Cozy Loft', price: 850, location: 'Copacabana', image: loftImg },
        { id: 3, title: 'Modern Villa', price: 2500, location: 'Beachfront', image: villaImg },
    ]);

    return (
        <div className="container">
            <header className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--primary-600)' }}>Available Houses</h2>
                <Link to="/" className="btn-secondary">Logout</Link>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {houses.map(house => (
                    <div key={house.id} className="glass-panel" style={{ overflow: 'hidden' }}>
                        <img src={house.image} alt={house.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                        <div style={{ padding: '1.5rem' }}>
                            <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
                                <h3 style={{ fontSize: '1.25rem' }}>{house.title}</h3>
                                <span style={{ fontWeight: 600, color: 'var(--primary-500)' }}>${house.price}/mo</span>
                            </div>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{house.location}</p>
                            <button className="btn-primary w-full">Rent Request</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserDashboard;
