const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5500', credentials: true }));
app.use(session({
    secret: 'your-secret-key', // Change this to a strong secret
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24-hour session
}));

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Your MySQL username
    password: 'omsaiRAM1!2@3', // Your MySQL password
    database: 'quiz_system'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected');
});

// Create Users Table (Run once)
db.query(`
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
    )
`, err => {
    if (err) throw err;
});

// Register Endpoint
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query('SELECT email FROM users WHERE email = ?', [email], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (result.length > 0) return res.status(400).json({ message: 'Email already registered' });

        db.query('INSERT INTO users (email, password) SET ?', { email, password: hashedPassword }, (err) => {
            if (err) return res.status(500).json({ message: 'Registration failed' });
            res.json({ message: 'Registration successful' });
        });
    });
});

// Login Endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (result.length === 0) return res.status(400).json({ message: 'User not found' });

        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

        req.session.user = { email: user.email };
        res.json({ message: 'Login successful', email: user.email });
    });
});

// Check Session Endpoint
app.get('/check-session', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, email: req.session.user.email });
    } else {
        res.json({ loggedIn: false });
    }
});

// Logout Endpoint
app.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out' });
});

// Start Server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
