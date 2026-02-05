import React from 'react';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">{t('navigation.contact')}</h2>
        </div>
        <div className="card-body">
          <h3>¿Necesitas más información?</h3>
          <p>Estamos aquí para ayudarte a optimizar tu negocio de transporte.</p>
          
          <h4>Soporte</h4>
          <p>Si eres un usuario registrado y necesitas ayuda con la plataforma:</p>
          <ul>
            <li>Centro de ayuda: disponible 24/7 en la plataforma</li>
            <li>Chat en vivo: disponible durante horario laboral</li>
            <li>Correo electrónico: support@travabus.com</li>
          </ul>
          
          <h4>Comercial</h4>
          <p>Si deseas más información sobre nuestros servicios o precios:</p>
          <ul>
            <li>Correo electrónico: sales@travabus.com</li>
            <li>Teléfono: +34 912 345 678</li>
            <li>Horario: Lunes a Viernes, 9:00 - 18:00 CET</li>
          </ul>
          
          <h4>Destacados</h4>
          <p>{t('admin.contact_us')}</p>
          <p>Correo electrónico: featured@travabus.com</p>
          
          <h4>Dirección</h4>
          <p>
            Travabus S.L.<br />
            Calle de la Innovación, 123<br />
            28000 Madrid, España
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;