import React from 'react';
import { Link } from 'react-router-dom';

const OwnerDashboard = () => {
    return (
        <div className="container">
            <header className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--primary-600)' }}>My Listings</h2>
                <div className="flex gap-2">
                    <button className="btn-primary">Add New House</button>
                    <Link to="/" className="btn-secondary">Logout</Link>
                </div>
            </header>

            <div className="glass-panel text-center" style={{ padding: '3rem' }}>
                <p style={{ color: 'var(--text-muted)' }}>You don't have any active listings yet.</p>
                <button className="btn-primary" style={{ marginTop: '1rem' }}>Create Your First Listing</button>
            </div>
        </div>
    );
};

export default OwnerDashboard;
