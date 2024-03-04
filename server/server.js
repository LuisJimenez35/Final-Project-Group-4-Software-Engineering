const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser'); // Importa el módulo bodyParser

const app = express();

// Configuración de la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'aS3cret!',
  database: 'emphathylink',
  port: 3307 // Aquí especifica el puerto correcto, en este caso, 3307
});

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(bodyParser.json());

// Conexión a la base de datos MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL');
});

// Ruta para crear un nuevo usuario
app.post('/signup', (req, res) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  const userActive = 1; //  asumimos que el usuario está activo por defecto
  const userRoleId = 3; //  ID del rol según tu lógica de aplicación

  // Llamada al procedimiento almacenado para insertar el usuario en la base de datos
  connection.query('CALL InsertUser(?, ?, ?, ?)', [userEmail, userPassword, userActive, userRoleId], (err, results) => {
    if (err) {
      console.error('Error al insertar usuario en la base de datos:', err);
      res.status(500).send('Error al crear usuario');
      return;
    }

    console.log('Usuario creado exitosamente en la base de datos');
    res.status(200).send('Usuario creado exitosamente');
  });
});

// Configuración del puerto en el que se ejecutará el servidor
const PORT = process.env.PORT || 4200;
app.listen(PORT, () => {
  console.log(`Servidor Express en ejecución en el puerto ${PORT}`);
});
// Ruta para autenticar el usuario
app.post('/login', (req, res) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;

  // Llamada al procedimiento almacenado para autenticar al usuario en la base de datos
  connection.query('CALL AuthenticateUser(?, ?, @isAuthenticated)', [userEmail, userPassword], (err, results) => {
    if (err) {
      console.error('Error al autenticar usuario:', err);
      res.status(500).json({ message: 'Error al autenticar usuario' });
      return;
    }

    // Obtener el resultado de la autenticación
    connection.query('SELECT @isAuthenticated AS isAuthenticated', (err, results) => {
      if (err) {
        console.error('Error al obtener resultado de autenticación:', err);
        res.status(500).json({ message: 'Error al autenticar usuario' });
        return;
      }

      const isAuthenticated = results[0].isAuthenticated;

      if (isAuthenticated === 1) {
        // Usuario autenticado exitosamente
        res.status(200).json({ message: 'Autenticación exitosa' });
      } else {
        // Error de autenticación
        res.status(401).json({ message: 'Credenciales incorrectas' });
      }
    });
  });
});
