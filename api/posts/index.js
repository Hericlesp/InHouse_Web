import { getDb } from '../db.js';

export default function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const db = getDb();

    if (req.method === 'GET') {
        const posts = db.prepare('SELECT * FROM posts ORDER BY id DESC').all();
        return res.status(200).json(posts);
    }

    if (req.method === 'POST') {
        const { author, time, type, content, image, media_type, tagged_property_id } = req.body;

        if (!author || !content) {
            return res.status(400).json({ error: 'Author and content required' });
        }

        try {
            const result = db.prepare(`
        INSERT INTO posts (author, time, type, content, image, media_type, tagged_property_id, likes, liked_by_me)
        VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0)
      `).run(author, time || 'Just now', type || 'Update', content, image, media_type, tagged_property_id);

            const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(result.lastInsertRowid);

            return res.status(201).json(post);
        } catch (error) {
            return res.status(500).json({ error: 'Server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
