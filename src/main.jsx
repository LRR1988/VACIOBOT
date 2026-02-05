import React from 'react';
import ReactDOM from 'react-dom/client';
<<<<<<< HEAD
import './init/stripeInitializer'; // Importar inicializador de Stripe primero
import './config/stripeConfig'; // Importar configuración de Stripe
import App from './App';
import './index.css';  // Importar estilos principales
=======
import App from './App';
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
import './i18n/i18n';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);