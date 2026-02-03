import React from 'react';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">{t('navigation.about')}</h2>
        </div>
        <div className="card-body">
          <p>Travabus es la plataforma líder en Europa para conectar empresas de autobuses con rutas vacías y empresas que necesitan transporte.</p>
          
          <h3>Misión</h3>
          <p>Nuestra misión es optimizar la eficiencia del transporte por carretera en Europa, reduciendo costes y emisiones mediante la coordinación de rutas vacías entre empresas de autobuses.</p>
          
          <h3>Visión</h3>
          <p>Convertirnos en la referencia europea para la optimización del transporte terrestre, promoviendo prácticas sostenibles y colaborativas en la industria del transporte.</p>
          
          <h3>Valores</h3>
          <ul>
            <li><strong>Transparencia:</strong> Promovemos relaciones claras y honestas entre empresas</li>
            <li><strong>Sostenibilidad:</strong> Contribuimos a reducir la huella de carbono del transporte</li>
            <li><strong>Colaboración:</strong> Fomentamos la cooperación entre empresas del sector</li>
            <li><strong>Innovación:</strong> Utilizamos tecnología avanzada para mejorar la eficiencia</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;