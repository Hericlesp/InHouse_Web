import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const DB_PATH = join(__dirname, '../inhouse.db');
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

// Initialize database
function initDatabase() {
    db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      points INTEGER DEFAULT 0,
      stars REAL DEFAULT 5.0,
      user_type TEXT DEFAULT 'tenant',
      phone TEXT,
      verified BOOLEAN DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author TEXT NOT NULL,
      time TEXT NOT NULL,
      type TEXT NOT NULL,
      content TEXT NOT NULL,
      image TEXT,
      media_type TEXT,
      tagged_property_id INTEGER,
      post_type TEXT DEFAULT 'update',
      property_id INTEGER,
      likes INTEGER DEFAULT 0,
      liked_by_me BOOLEAN DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS properties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_email TEXT NOT NULL,
      title TEXT NOT NULL,
      address TEXT,
      neighborhood TEXT,
      city TEXT,
      state TEXT,
      country TEXT,
      price REAL,
      type TEXT,
      image_url TEXT,
      media_type TEXT,
      status TEXT DEFAULT 'Available',
      condo_fee REAL DEFAULT 0,
      iptu REAL DEFAULT 0,
      accepts_pets BOOLEAN DEFAULT 0,
      is_furnished BOOLEAN DEFAULT 0,
      guarantee_type TEXT DEFAULT 'Fiador',
      availability_date TEXT,
      photos TEXT,
      verified_photos BOOLEAN DEFAULT 0,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_email TEXT NOT NULL,
      property_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_email, property_id)
    );

    CREATE TABLE IF NOT EXISTS user_interactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_email TEXT NOT NULL,
      property_id INTEGER NOT NULL,
      interaction_type TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      property_id INTEGER NOT NULL,
      user_email TEXT NOT NULL,
      user_name TEXT NOT NULL,
      status TEXT DEFAULT 'Novo',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(property_id, user_email)
    );

    CREATE TABLE IF NOT EXISTS property_views (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      property_id INTEGER NOT NULL,
      user_email TEXT,
      viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_email TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT,
      message TEXT,
      related_id INTEGER,
      read BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS chats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user1_email TEXT NOT NULL,
      user2_email TEXT NOT NULL,
      last_message_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user1_email, user2_email)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chat_id INTEGER,
      sender_email TEXT NOT NULL,
      content TEXT,
      message_type TEXT DEFAULT 'text',
      related_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS leases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_email TEXT NOT NULL,
      property_id INTEGER NOT NULL,
      status TEXT DEFAULT 'Active'
    );
  `);

    // Seed default user if not exists
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get('admin@inhouse.com');

    if (!user) {
        db.prepare(`
      INSERT INTO users (name, email, password_hash, points, stars, user_type, verified) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run('Justino Admin', 'admin@inhouse.com', 'admin', 150, 4.8, 'owner', 1);

        // Seed properties with new fields
        const properties = [
            ['admin@inhouse.com', 'Sunny Loft in Leblon', 'Av. Delfim Moreira, 100', 'Leblon', 'Rio de Janeiro', 'RJ', 'Brasil', 6500, 'Apartment', 800, 200, 1, 1, 'Fiador ou Caução', '2026-02-01', 'Loft moderno em Leblon com vista para o mar'],
            ['admin@inhouse.com', 'Cozy Studio Lapa', 'Rua do Lavradio, 45', 'Lapa', 'Rio de Janeiro', 'RJ', 'Brasil', 1800, 'Studio', 0, 80, 0, 1, 'Fiador', '2026-01-15', 'Studio charmoso no coração da Lapa'],
            ['admin@inhouse.com', 'Beach House Barra', 'Av. Lucio Costa, 3500', 'Barra da Tijuca', 'Rio de Janeiro', 'RJ', 'Brasil', 12000, 'House', 1200, 400, 1, 1, 'Depósito Caução', '2026-03-01', 'Casa de praia luxuosa com piscina'],
            ['admin@inhouse.com', 'Paulista Avenue Flat', 'Av. Paulista, 1578', 'Bela Vista', 'São Paulo', 'SP', 'Brasil', 3500, 'Kitnet', 350, 150, 0, 0, 'Fiador', '2026-01-20', 'Kitnet moderna na Paulista']
        ];

        const insertProperty = db.prepare(`
      INSERT INTO properties (owner_email, title, address, neighborhood, city, state, country, price, type, condo_fee, iptu, accepts_pets, is_furnished, guarantee_type, availability_date, description, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Available')
    `);

        properties.forEach(p => insertProperty.run(...p));

        // Create lease for admin
        db.prepare('INSERT INTO leases (user_email, property_id) VALUES (?, 1)').run('admin@inhouse.com');

        console.log('✅ Database initialized');

        // Migration: Add user_type column if it doesn't exist
        try {
            const tableInfo = db.prepare("PRAGMA table_info(users)").all();
            const hasUserType = tableInfo.some(col => col.name === 'user_type');

            if (!hasUserType) {
                console.log('🔄 Running migration: Adding user_type column...');
                db.exec(`ALTER TABLE users ADD COLUMN user_type TEXT DEFAULT 'tenant'`);
                console.log('✅ Migration completed: user_type column added');
            }
        } catch (error) {
            console.error('❌ Migration error:', error.message);
        }


    }
}

initDatabase();

// API Routes

// Auth - Login
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ? AND password_hash = ?')
        .get(email, password);

    if (user) {
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
});

// Auth - Signup
app.post('/api/auth/signup', (req, res) => {
    const { name, email, password, user_type } = req.body;

    console.log('📝 Signup attempt:', { name, email, user_type }); // Log de debug

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields required' });
    }

    try {
        const result = db.prepare(`
      INSERT INTO users (name, email, password_hash, points, stars, user_type)
      VALUES (?, ?, ?, 0, 5.0, ?)
    `).run(name, email, password, user_type || 'tenant');

        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
        const { password_hash, ...userData } = user;

        console.log('✅ User created successfully:', userData.email); // Log de sucesso

        return res.status(201).json({
            success: true,
            user: userData
        });
    } catch (error) {
        console.error('❌ Signup error:', error.message); // Log de erro detalhado

        if (error.message.includes('UNIQUE constraint')) {
            return res.status(400).json({
                success: false,
                error: 'Email already exists'
            });
        }
        return res.status(500).json({
            success: false,
            error: 'Server error: ' + error.message // Retorna mensagem de erro específica
        });
    }
});

// Posts - Get all
app.get('/api/posts', (req, res) => {
    const posts = db.prepare('SELECT * FROM posts ORDER BY id DESC').all();
    return res.status(200).json(posts);
});

// Posts - Create
app.post('/api/posts', (req, res) => {
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
});

// Posts - Like teste001
app.post('/api/posts/:id/like', (req, res) => {
    const { id } = req.params;
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
});

// Properties - Get all with filters
app.get('/api/properties', (req, res) => {
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
});

// Properties - Create new
app.post('/api/properties', (req, res) => {
    const {
        owner_email, title, address, neighborhood, city, state, country,
        price, type, condo_fee, iptu, accepts_pets, is_furnished,
        guarantee_type, availability_date, description, status
    } = req.body;

    if (!owner_email || !title || !city || !price) {
        return res.status(400).json({ error: 'Required fields missing' });
    }

    try {
        const result = db.prepare(`
            INSERT INTO properties (
                owner_email, title, address, neighborhood, city, state, country,
                price, type, condo_fee, iptu, accepts_pets, is_furnished,
                guarantee_type, availability_date, description, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            owner_email, title, address, neighborhood, city, state, country || 'Brasil',
            price, type, condo_fee || 0, iptu || 0, accepts_pets ? 1 : 0, is_furnished ? 1 : 0,
            guarantee_type, availability_date, description, status || 'Available'
        );

        const newProperty = db.prepare('SELECT * FROM properties WHERE id = ?').get(result.lastInsertRowid);

        return res.status(201).json(newProperty);
    } catch (error) {
        console.error('Create property error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

// Properties - Update photos
app.put('/api/properties/:id/photos', (req, res) => {
    const { id } = req.params;
    const { photos } = req.body;

    if (!photos || !Array.isArray(photos)) {
        return res.status(400).json({ error: 'Photos array required' });
    }

    try {
        // Limit to 5 photos
        const limitedPhotos = photos.slice(0, 5);
        const photosJson = JSON.stringify(limitedPhotos);

        db.prepare('UPDATE properties SET photos = ? WHERE id = ?')
            .run(photosJson, id);

        const updatedProperty = db.prepare('SELECT * FROM properties WHERE id = ?').get(id);

        return res.status(200).json(updatedProperty);
    } catch (error) {
        console.error('Update photos error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

// Properties - Get by ID
app.get('/api/properties/:id', (req, res) => {
    const { id } = req.params;

    const property = db.prepare('SELECT * FROM properties WHERE id = ?').get(id);

    if (!property) {
        return res.status(404).json({ error: 'Property not found' });
    }

    return res.status(200).json(property);
});

// Favorites - Add
app.post('/api/favorites', (req, res) => {
    const { user_email, property_id } = req.body;

    if (!user_email || !property_id) {
        return res.status(400).json({ error: 'User email and property ID required' });
    }

    try {
        db.prepare('INSERT INTO favorites (user_email, property_id) VALUES (?, ?)')
            .run(user_email, property_id);

        return res.status(201).json({ success: true });
    } catch (error) {
        if (error.message.includes('UNIQUE constraint')) {
            return res.status(400).json({ error: 'Already favorited' });
        }
        return res.status(500).json({ error: 'Server error' });
    }
});

// Favorites - Remove
app.delete('/api/favorites/:id', (req, res) => {
    const { id } = req.params;
    const { user_email } = req.query;

    if (!user_email) {
        return res.status(400).json({ error: 'User email required' });
    }

    db.prepare('DELETE FROM favorites WHERE property_id = ? AND user_email = ?')
        .run(id, user_email);

    return res.status(200).json({ success: true });
});

// Favorites - Get user's favorites
app.get('/api/favorites', (req, res) => {
    const { user_email } = req.query;

    if (!user_email) {
        return res.status(400).json({ error: 'User email required' });
    }

    const favorites = db.prepare(`
        SELECT f.*, p.* 
        FROM favorites f
        JOIN properties p ON f.property_id = p.id
        WHERE f.user_email = ?
        ORDER BY f.created_at DESC
    `).all(user_email);

    return res.status(200).json(favorites);
});

// Interactions - Add
app.post('/api/interactions', (req, res) => {
    const { user_email, property_id, interaction_type } = req.body;

    if (!user_email || !property_id || !interaction_type) {
        return res.status(400).json({ error: 'All fields required' });
    }

    try {
        db.prepare('INSERT INTO user_interactions (user_email, property_id, interaction_type) VALUES (?, ?, ?)')
            .run(user_email, property_id, interaction_type);

        return res.status(201).json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
});

// Interactions - Get stats for a property
app.get('/api/interactions/stats/:propertyId', (req, res) => {
    const { propertyId } = req.params;

    const stats = db.prepare(`
        SELECT 
            interaction_type,
            COUNT(*) as count
        FROM user_interactions
        WHERE property_id = ?
        GROUP BY interaction_type
    `).all(propertyId);

    const favorites = db.prepare('SELECT COUNT(*) as count FROM favorites WHERE property_id = ?')
        .get(propertyId);

    return res.status(200).json({
        interactions: stats,
        favorites: favorites.count
    });
});

// Owner Dashboard - Get metrics
app.get('/api/owner/dashboard', (req, res) => {
    const { owner_email } = req.query;

    if (!owner_email) {
        return res.status(400).json({ error: 'Owner email required' });
    }

    try {
        // Total properties
        const propertiesCount = db.prepare('SELECT COUNT(*) as count FROM properties WHERE owner_email = ?')
            .get(owner_email);

        // Properties by status
        const propertiesByStatus = db.prepare(`
            SELECT status, COUNT(*) as count 
            FROM properties 
            WHERE owner_email = ?
            GROUP BY status
        `).all(owner_email);

        // Total leads
        const leadsCount = db.prepare(`
            SELECT COUNT(DISTINCT l.id) as count
            FROM leads l
            JOIN properties p ON l.property_id = p.id
            WHERE p.owner_email = ?
        `).get(owner_email);

        // Total views (simulated for now)
        const viewsCount = db.prepare(`
            SELECT COUNT(*) as count
            FROM property_views pv
            JOIN properties p ON pv.property_id = p.id
            WHERE p.owner_email = ?
        `).get(owner_email);

        const statusMap = {};
        propertiesByStatus.forEach(item => {
            statusMap[item.status] = item.count;
        });

        return res.status(200).json({
            total_properties: propertiesCount.count,
            total_leads: leadsCount.count,
            total_views: viewsCount.count || 0,
            properties_by_status: statusMap
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

// Owner Properties - Get all with metrics
app.get('/api/owner/properties', (req, res) => {
    const { owner_email } = req.query;

    if (!owner_email) {
        return res.status(400).json({ error: 'Owner email required' });
    }

    try {
        const properties = db.prepare('SELECT * FROM properties WHERE owner_email = ? ORDER BY id DESC')
            .all(owner_email);

        // Add metrics to each property
        const propertiesWithMetrics = properties.map(property => {
            const views = db.prepare('SELECT COUNT(*) as count FROM property_views WHERE property_id = ?')
                .get(property.id);

            const favorites = db.prepare('SELECT COUNT(*) as count FROM favorites WHERE property_id = ?')
                .get(property.id);

            const leads = db.prepare('SELECT COUNT(*) as count FROM leads WHERE property_id = ?')
                .get(property.id);

            return {
                ...property,
                views: views.count,
                favorites: favorites.count,
                leads: leads.count
            };
        });

        return res.status(200).json(propertiesWithMetrics);
    } catch (error) {
        console.error('Owner properties error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

// Owner Leads - Get all
app.get('/api/owner/leads', (req, res) => {
    const { owner_email } = req.query;

    if (!owner_email) {
        return res.status(400).json({ error: 'Owner email required' });
    }

    try {
        const leads = db.prepare(`
            SELECT 
                l.*,
                p.title as property_title,
                p.price as property_price,
                p.neighborhood as property_neighborhood
            FROM leads l
            JOIN properties p ON l.property_id = p.id
            WHERE p.owner_email = ?
            ORDER BY l.created_at DESC
        `).all(owner_email);

        return res.status(200).json(leads);
    } catch (error) {
        console.error('Owner leads error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

// Owner Leads - Update status
app.put('/api/owner/leads/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: 'Status required' });
    }

    try {
        db.prepare('UPDATE leads SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
            .run(status, id);

        const updatedLead = db.prepare('SELECT * FROM leads WHERE id = ?').get(id);

        return res.status(200).json(updatedLead);
    } catch (error) {
        console.error('Update lead error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

// Chats - Get user's conversations
app.get('/api/chats', (req, res) => {
    const { user_email } = req.query;

    if (!user_email) {
        return res.status(400).json({ error: 'User email required' });
    }

    try {
        const chats = db.prepare(`
            SELECT 
                c.*,
                CASE 
                    WHEN c.user1_email = ? THEN c.user2_email 
                    ELSE c.user1_email 
                END as other_user_email,
                m.content as last_message,
                m.created_at as last_message_time
            FROM chats c
            LEFT JOIN messages m ON m.chat_id = c.id 
                AND m.id = (
                    SELECT id FROM messages 
                    WHERE chat_id = c.id 
                    ORDER BY created_at DESC 
                    LIMIT 1
                )
            WHERE c.user1_email = ? OR c.user2_email = ?
            ORDER BY c.last_message_at DESC
        `).all(user_email, user_email, user_email);

        return res.status(200).json(chats);
    } catch (error) {
        console.error('Get chats error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

// Chats - Create or get existing
app.post('/api/chats', (req, res) => {
    const { user1_email, user2_email } = req.body;

    if (!user1_email || !user2_email) {
        return res.status(400).json({ error: 'Both user emails required' });
    }

    try {
        // Check if chat exists
        const existing = db.prepare(`
            SELECT * FROM chats 
            WHERE (user1_email = ? AND user2_email = ?) 
               OR (user1_email = ? AND user2_email = ?)
        `).get(user1_email, user2_email, user2_email, user1_email);

        if (existing) {
            return res.status(200).json(existing);
        }

        // Create new chat
        const result = db.prepare('INSERT INTO chats (user1_email, user2_email) VALUES (?, ?)')
            .run(user1_email, user2_email);

        const newChat = db.prepare('SELECT * FROM chats WHERE id = ?').get(result.lastInsertRowid);

        return res.status(201).json(newChat);
    } catch (error) {
        console.error('Create chat error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

// Messages - Get chat messages
app.get('/api/chats/:id/messages', (req, res) => {
    const { id } = req.params;

    try {
        const messages = db.prepare(`
            SELECT * FROM messages 
            WHERE chat_id = ? 
            ORDER BY created_at ASC
        `).all(id);

        return res.status(200).json(messages);
    } catch (error) {
        console.error('Get messages error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

// Messages - Send message
app.post('/api/messages', (req, res) => {
    const { chat_id, sender_email, content, message_type, related_id } = req.body;

    if (!chat_id || !sender_email || !content) {
        return res.status(400).json({ error: 'Required fields missing' });
    }

    try {
        const result = db.prepare(`
            INSERT INTO messages (chat_id, sender_email, content, message_type, related_id)
            VALUES (?, ?, ?, ?, ?)
        `).run(chat_id, sender_email, content, message_type || 'text', related_id);

        // Update chat last_message_at
        db.prepare('UPDATE chats SET last_message_at = CURRENT_TIMESTAMP WHERE id = ?')
            .run(chat_id);

        const newMessage = db.prepare('SELECT * FROM messages WHERE id = ?').get(result.lastInsertRowid);

        return res.status(201).json(newMessage);
    } catch (error) {
        console.error('Send message error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

// Notifications - Get user's notifications
app.get('/api/notifications', (req, res) => {
    const { user_email } = req.query;

    if (!user_email) {
        return res.status(400).json({ error: 'User email required' });
    }

    try {
        const notifications = db.prepare(`
            SELECT * FROM notifications 
            WHERE user_email = ? 
            ORDER BY created_at DESC
        `).all(user_email);

        return res.status(200).json(notifications);
    } catch (error) {
        console.error('Get notifications error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

// Notifications - Mark as read
app.put('/api/notifications/:id/read', (req, res) => {
    const { id } = req.params;

    try {
        db.prepare('UPDATE notifications SET read = 1 WHERE id = ?').run(id);
        const updated = db.prepare('SELECT * FROM notifications WHERE id = ?').get(id);

        return res.status(200).json(updated);
    } catch (error) {
        console.error('Mark notification read error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

// Notifications - Create (internal helper)
function createNotification(user_email, type, title, message, related_id = null) {
    try {
        db.prepare(`
            INSERT INTO notifications (user_email, type, title, message, related_id)
            VALUES (?, ?, ?, ?, ?)
        `).run(user_email, type, title, message, related_id);
    } catch (error) {
        console.error('Create notification error:', error);
    }
}

// Start server
app.listen(PORT, () => {
    console.log(`🚀 InHouse API running on http://localhost:${PORT}`);
    console.log(`📊 Database: ${DB_PATH}`);
    console.log(`✅ Ready to accept requests`);
});
