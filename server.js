// Servidor simple para servir la aplicación Travabus
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Servir archivos estáticos desde la carpeta pública
app.use(express.static(path.join(__dirname, 'public')));

// Servir archivos estáticos desde la carpeta src también
app.use(express.static(path.join(__dirname, 'src')));

// Servir el archivo HTML de prueba
app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, 'test_database.html'));
});

// Ruta principal
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Travabus - Plataforma de Transporte</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .nav { margin-bottom: 20px; }
          .nav a { margin-right: 15px; text-decoration: none; color: #007bff; }
          .nav a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <h1>Bienvenido a Travabus</h1>
        <div class="nav">
          <a href="/">Inicio</a>
          <a href="/test">Pruebas de Base de Datos</a>
          <a href="/src">Código Fuente</a>
        </div>
        <p>Aplicación para conectar empresas de autobuses con rutas vacías a empresas que necesitan transporte.</p>
        <p><a href="/test">Ir a pruebas de base de datos</a></p>
      </body>
    </html>
  `);
});

// Iniciar el servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor Travabus escuchando en http://localhost:${PORT}`);
  console.log(`Ruta de pruebas disponible en: http://localhost:${PORT}/test`);
});