// Servidor simple para la aplicación Travabus (compilada)
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Servir archivos estáticos desde el directorio de producción (dist)
app.use(express.static(path.join(__dirname, 'dist')));

// Ruta para la página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Ruta para servir el archivo de pruebas
app.get('/test', (req, res) => {
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

// Ruta para otras páginas (SPA fallback)
app.get(/\/(about|contact|publish|profile|dashboard|admin|all-ads|payments|how-it-works|login|register|stripe-config).*$/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// SPA fallback: cualquier otra ruta que no coincida con archivos estáticos -> index.html
app.get(/^(?!\/(assets|api|static))/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Iniciar el servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor Travabus (producción) escuchando en http://localhost:${PORT}`);
});