// Servidor de producción para la aplicación Travabus
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Servir archivos estáticos desde el directorio de producción (dist)
app.use(express.static(path.join(__dirname, 'dist')));

// Ruta para servir el index.html de la aplicación React para todas las rutas que no sean archivos estáticos
app.get(/.*\.(html|js|css|json|xml)$/i, (req, res) => {
  // Si es una ruta de archivo específica, dejar que express.static la maneje
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Ruta para servir el index.html para cualquier otra ruta (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Ruta para servir el archivo de pruebas
app.get('/test', (req, res) => {
  const fs = require('fs');
  const filePath = path.join(__dirname, 'test_database.html');
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading test file:', err);
      res.status(404).send('Test file not found');
    } else {
      res.setHeader('Content-Type', 'text/html');
      res.send(data);
    }
  });
});

// Iniciar el servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor Travabus (producción) escuchando en http://localhost:${PORT}`);
});