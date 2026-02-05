import React from 'react';
import { useTranslation } from 'react-i18next';

const HowItWorks = () => {
  const { t } = useTranslation();

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">{t('how_it_works.title')}</h2>
        </div>
        <div className="card-body">
          <h3>1. {t('how_it_works.step1')}</h3>
          <p>{t('how_it_works.step1_desc')}</p>
          
          <h3>2. {t('how_it_works.step2')}</h3>
          <p>{t('how_it_works.step2_desc')}</p>
          
          <h3>3. {t('how_it_works.step3')}</h3>
          <p>{t('how_it_works.step3_desc')}</p>
          
          <h3>4. {t('how_it_works.step4')}</h3>
          <p>{t('how_it_works.step4_desc')}</p>
          
          <div className="card mt-4">
            <div className="card-header">
              <h3>{t('commissions.title')}</h3>
            </div>
            <div className="card-body">
              <p>{t('how_it_works.commission_info')}</p>
              <ul>
                <li>Comisión: 5%</li>
                <li>Mínimo: 25€</li>
                <li>La comisión se cobra al usuario que recibe el dinero por el servicio</li>
              </ul>
            </div>
          </div>
          
          <div className="card mt-4">
            <div className="card-header">
              <h3>¿Por qué elegirnos?</h3>
            </div>
            <div className="card-body">
              <ul>
                <li>Plataforma segura y confiable</li>
                <li>Validación de identidad de empresas</li>
                <li>Seguimiento de transacciones</li>
                <li>Soporte multilingüe</li>
                <li>Sistema de calificaciones</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;