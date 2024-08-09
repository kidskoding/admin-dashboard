const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = 8080;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_DB_PASSWORD,
    database: 'login-system'
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL connected...');
});

app.post('/', async (req, res) => {
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

app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
});