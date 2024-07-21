const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const connection = mysql.createConnection({
    host: 'locahost',
    user: 'root',
    password: process.env.MYSQL_DB_PASSWORD,
    database: 'login-system',
});

const port = 3000;

const app = express();

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/authentication/login'));
});

app.post('/auth', function(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    if(username && password) {
        connection.query('SELECT * FROM login-system.users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
            if(error) {
                throw error;
            }   
            if(results.length > 0) {
                req.session.loggedin = true;
                req.session.username = username;
                response.redirect('/')
            } else {
                response.send('Incorrect Username and/or Password!');
            }
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});

app.listen(port, () => {
    console.log('Server is listening on port', port);
});