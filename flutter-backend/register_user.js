const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bcrypt = require('bcryptjs'); // Import bcryptjs for hashing passwords

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

// Route: Register a new user
router.post('/', (req, res) => {
    const { email, name, password, phone_number, gender, google_sign_in } = req.body;

    // Check if the user is registering via Google Sign-In
    if (google_sign_in) {
        // Check if the email is already registered
        db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
            if (err) {
                res.status(500).json({ success: false, message: 'Database error' });
            } else if (result.length > 0) {
                // User already exists
                res.json({ success: true, message: `Welcome back, ${email}` });
            } else {
                // Register a new Google user
                db.query(
                    'INSERT INTO users (name, email) VALUES (?, ?)',
                    [name, email],
                    (err) => {
                        if (err) {
                            res.status(500).json({ success: false, message: 'Database error' });
                        } else {
                            res.json({ success: true, message: 'Google account registered successfully' });
                        }
                    }
                );
            }
        });
    } else {
        // Hash the password before storing it in the database
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                res.status(500).json({ success: false, message: 'Error hashing password' });
            } else {
                // Register the user manually with the hashed password
                db.query(
                    'INSERT INTO users (name, email, phone_number, gender, password) VALUES (?, ?, ?, ?, ?)',
                    [name, email, phone_number, gender, hashedPassword],
                    (err) => {
                        if (err) {
                            res.status(500).json({ success: false, message: 'Database error' });
                        } else {
                            res.json({ success: true, message: 'User registered successfully' });
                        }
                    }
                );
            }
        });
    }
});

module.exports = router;
