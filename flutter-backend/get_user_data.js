const express = require('express');
const router = express.Router();
const mysql = require('mysql');

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Use your MySQL username
    password: '', // Use your MySQL password
    database: 'flutter_app', // Ensure the database is created
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit(1); // Exit if the connection fails
    }
    console.log('Connected to MySQL database.');
});

// Route: Get user data by email
router.get('/', (req, res) => {
    const email = req.query.email;

    if (!email) {
        return res.json({ error: 'Email parameter missing' });
    }

    // Query to get the user's name, phone_number, and gender
    db.query('SELECT name, phone_number, gender FROM users WHERE email = ?', [email], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (result.length > 0) {
            // User found, send data as JSON
            res.json(result[0]);
        } else {
            // User not found
            res.json({ error: 'User not found' });
        }
    });
});

module.exports = router;
