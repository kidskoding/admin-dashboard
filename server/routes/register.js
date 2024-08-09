const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');

router.get('/', (req, res) => {
    res.send('Registration Route');
});

router.post('/', async (req, res) => {
    const { username, email, password } = req.body;
    if(!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword],
            (error, results) => {
                if(error) {
                    if (error.code === 'ER_DUP_ENTRY') {
                        return res.status(409).json({ message: 'User already exists' });
                    }
                    return res.status(500).json({ message: 'Database error' });
                }
                res.status(201).json({ message: 'User registered successfully' });
            }
        );
    } catch(err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;