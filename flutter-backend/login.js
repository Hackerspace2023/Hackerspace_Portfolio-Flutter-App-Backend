// login.js

const express = require('express');
const bcrypt = require('bcryptjs');
const mysql = require('mysql');

const router = express.Router();

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Replace with your DB username
    password: '',  // Replace with your DB password
    database: 'flutter_app' // Replace with your DB name
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database');
});

// Login route
router.post('/', (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, result) => {
        if (err) {
            return res.status(500).json({
                status: 'error',
                message: 'Server error occurred.'
            });
        }

        if (result.length > 0) {
            const user = result[0];

            // Verify the password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    return res.status(500).json({
                        status: 'error',
                        message: 'Password verification failed.'
                    });
                }

                if (isMatch) {
                    res.json({
                        status: 'success',
                        message: 'Login successful!',
                        user: {
                            id: user.id,
                            email: user.email,
                            name: user.name
                        }
                    });
                } else {
                    res.json({
                        status: 'error',
                        message: 'Invalid password.'
                    });
                }
            });
        } else {
            res.json({
                status: 'error',
                message: 'User does not exist.'
            });
        }
    });
});

module.exports = router;
