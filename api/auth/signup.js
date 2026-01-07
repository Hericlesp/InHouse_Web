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
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields required' });
        }

        try {
            const result = db.prepare(`
        INSERT INTO users (name, email, password_hash, points, stars)
        VALUES (?, ?, ?, 0, 5.0)
      `).run(name, email, password);

            const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
            const { password_hash, ...userData } = user;

            return res.status(201).json({
                success: true,
                user: userData
            });
        } catch (error) {
            if (error.message.includes('UNIQUE constraint')) {
                return res.status(400).json({
                    success: false,
                    error: 'Email already exists'
                });
            }
            return res.status(500).json({
                success: false,
                error: 'Server error'
            });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
