import { getDb } from './db.js';

export default function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const db = getDb();

    if (req.method === 'POST') {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        // Simple auth (no hashing for MVP - TODO: add bcrypt)
        const user = db.prepare('SELECT * FROM users WHERE email = ? AND password_hash = ?')
            .get(email, password);

        if (user) {
            // Remove password from response
            const { password_hash, ...userData } = user;
            return res.status(200).json({
                success: true,
                user: userData
            });
        }

        return res.status(401).json({
            success: false,
            error: 'Invalid credentials'
        });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
