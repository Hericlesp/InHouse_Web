import { getDb } from '../db.js';

export default function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const db = getDb();

    if (req.method === 'GET') {
        const { city, neighborhood, type, maxPrice } = req.query;

        let query = "SELECT * FROM properties WHERE status = 'Available'";
        const params = [];

        if (city) {
            query += " AND city LIKE ?";
            params.push(`%${city}%`);
        }

        if (neighborhood) {
            query += " AND neighborhood LIKE ?";
            params.push(`%${neighborhood}%`);
        }

        if (type) {
            query += " AND type = ?";
            params.push(type);
        }

        if (maxPrice) {
            query += " AND price <= ?";
            params.push(parseFloat(maxPrice));
        }

        const properties = db.prepare(query).all(...params);
        return res.status(200).json(properties);
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
