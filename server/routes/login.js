const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
    res.send('Login Route');
});

router.post('/', async (req, res) => {
    const { username, password } = req.body;
    if(!username || !password) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    db.query('SELECT * FROM users WHERE username = ?', [username], async (error, results) => {
        if(error) {
            res.status(500).json({ message: 'Database not found' });
        }
        if(results.length === 0) {
            res.status(404).json({ message: 'User not found' });
        }
        
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({ message: 'Incorrect username or password' });
        }

        res.status(200).json({ message: 'Login successful' });
    });
});

module.exports = router;