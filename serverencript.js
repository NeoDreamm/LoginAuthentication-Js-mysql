const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Configuración de la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'datos'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Conectado a la base de datos MySQL');
});

// Ruta para la página de inicio
app.get('/', (req, res) => {
  res.render('index');
});

// Ruta para el registro de usuarios con formula ENCRIPTADA
const bcrypt = require('bcrypt');
const saltRounds = 10;

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) throw err;
        const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
        db.query(sql, [username, hash], (err, result) => {
            if (err) throw err;
            res.redirect('/');
        });
    });
});


// Ruta para el logueo de usuarios con formula ENCRIPTADA
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            const user = results[0];
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) throw err;
                if (result) {
                    res.send('Logueo exitoso');
                } else {
                    res.send('Usuario o contraseña incorrectos');
                }
            });
        } else {
            res.send('Usuario o contraseña incorrectos');
        }
    });
});

app.listen(3000, () => {
    console.log('Servidor iniciado en el puerto 3000');
  });
  