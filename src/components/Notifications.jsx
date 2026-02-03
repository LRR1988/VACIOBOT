import React from 'react';
import { useTranslation } from 'react-i18next';

const Notifications = () => {
  const { t } = useTranslation();

  return (
    <div className="notifications-panel">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">{t('common.notifications')}</h2>
        </div>
        
        <div className="notifications-list">
          <div className="notification-item">
            <div className="notification-content">
              <strong>{t('notifications.new_interest')}</strong>
              <p>Usuario interesado en tu anuncio Madrid-Barcelona</p>
              <small>2023-06-15 10:30</small>
            </div>
            <button className="btn btn-outline">{t('common.view')}</button>
          </div>
          
          <div className="notification-item">
            <div className="notification-content">
              <strong>{t('notifications.payment_required')}</strong>
              <p>Transferencia requerida para anuncio activo</p>
              <small>2023-06-15 09:15</small>
            </div>
            <button className="btn btn-primary">{t('common.view')}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;