import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database path - will be created in /tmp for Vercel
const DB_PATH = process.env.NODE_ENV === 'production'
    ? '/tmp/inhouse.db'
    : join(__dirname, '../../inhouse.db');

let db = null;

export function getDb() {
    if (!db) {
        db = new Database(DB_PATH);
        db.pragma('journal_mode = WAL');
        initDatabase();
    }
    return db;
}

function initDatabase() {
    // Create tables
    db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      points INTEGER DEFAULT 0,
      stars REAL DEFAULT 5.0
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
      status TEXT DEFAULT 'Available'
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
      INSERT INTO users (name, email, password_hash, points, stars) 
      VALUES (?, ?, ?, ?, ?)
    `).run('Justino Admin', 'admin@inhouse.com', 'admin', 150, 4.8);

        // Seed properties
        const properties = [
            {
                owner: 'admin@inhouse.com',
                title: 'Sunny Loft in Leblon',
                address: 'Av. Delfim Moreira, 100',
                neighborhood: 'Leblon',
                city: 'Rio de Janeiro',
                state: 'RJ',
                country: 'Brasil',
                price: 6500,
                type: 'Apartment'
            },
            {
                owner: 'admin@inhouse.com',
                title: 'Cozy Studio Lapa',
                address: 'Rua do Lavradio, 45',
                neighborhood: 'Lapa',
                city: 'Rio de Janeiro',
                state: 'RJ',
                country: 'Brasil',
                price: 1800,
                type: 'Studio'
            },
            {
                owner: 'admin@inhouse.com',
                title: 'Beach House Barra',
                address: 'Av. Lucio Costa, 3500',
                neighborhood: 'Barra da Tijuca',
                city: 'Rio de Janeiro',
                state: 'RJ',
                country: 'Brasil',
                price: 12000,
                type: 'House'
            },
            {
                owner: 'admin@inhouse.com',
                title: 'Paulista Avenue Flat',
                address: 'Av. Paulista, 1578',
                neighborhood: 'Bela Vista',
                city: 'São Paulo',
                state: 'SP',
                country: 'Brasil',
                price: 3500,
                type: 'Kitnet'
            }
        ];

        const insertProperty = db.prepare(`
      INSERT INTO properties (owner_email, title, address, neighborhood, city, state, country, price, type, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Available')
    `);

        properties.forEach(p => {
            insertProperty.run(p.owner, p.title, p.address, p.neighborhood, p.city, p.state, p.country, p.price, p.type);
        });

        // Create lease for admin (living in Sunny Loft)
        db.prepare('INSERT INTO leases (user_email, property_id) VALUES (?, 1)').run('admin@inhouse.com');
    }
}

export default { getDb };
