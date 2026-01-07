import { getDb } from '../db.js';

export default function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const db = getDb();
    const { id } = req.query;

    if (req.method === 'POST') {
        const { liked } = req.body;

        try {
            const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);

            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }

            const newLikes = liked ? post.likes + 1 : post.likes - 1;

            db.prepare('UPDATE posts SET likes = ?, liked_by_me = ? WHERE id = ?')
                .run(newLikes, liked ? 1 : 0, id);

            const updatedPost = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);

            return res.status(200).json(updatedPost);
        } catch (error) {
            return res.status(500).json({ error: 'Server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
