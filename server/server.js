const express = require('express');
const mysql = require('mysql');

const app = express();

// Configuración de la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'aS3cret!',
  database: 'emphathylink',
  port: 3307 // Aquí especifica el puerto correcto, en este caso, 3307
});

// Conexión a la base de datos MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL');
});

// Ruta para autenticar usuarios
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  connection.query('CALL sp_authenticate_user(?, ?)', [email, password], (err, results) => {
    if (err) {
      console.error('Error al autenticar usuario:', err);
      res.status(500).send('Error al autenticar usuario');
      return;
    }

    if (results && results.length > 0) {
      res.json({ success: true, user: results[0] });
    } else {
      res.status(401).send('Credenciales inválidas');
    }
  });
});

// Configuración del puerto en el que se ejecutará el servidor
const PORT = process.env.PORT || 4200;
app.listen(PORT, () => {
  console.log(`Servidor Express en ejecución en el puerto ${PORT}`);
});
