import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div>
      <section className="hero">
        <div className="container">
          <h1>{t('common.welcome')}</h1>
          <p>{t('home.subtitle')}</p>
          <p>{t('home.description')}</p>
          <Link to="/publish" className="cta-button">{t('home.cta')}</Link>
        </div>
      </section>
      
      <div className="container">
        <section className="features">
          <div className="feature-card">
            <h3>{t('home.cards.publish_routes')}</h3>
            <p>Publica tus rutas vacías y encuentra empresas interesadas</p>
          </div>
          <div className="feature-card">
            <h3>{t('home.cards.connect')}</h3>
            <p>Conecta con otras empresas de autobuses en toda Europa</p>
          </div>
          <div className="feature-card">
            <h3>{t('home.cards.save')}</h3>
            <p>Ahorra costes de desplazamiento rellenando tus rutas vacías</p>
          </div>
        </section>
        
        <section className="how-it-works">
          <h2 className="text-center mb-4">{t('how_it_works.title')}</h2>
          <div className="features">
            <div className="feature-card">
              <h3>{t('how_it_works.step1')}</h3>
              <p>{t('how_it_works.step1_desc')}</p>
            </div>
            <div className="feature-card">
              <h3>{t('how_it_works.step2')}</h3>
              <p>{t('how_it_works.step2_desc')}</p>
            </div>
            <div className="feature-card">
              <h3>{t('how_it_works.step3')}</h3>
              <p>{t('how_it_works.step3_desc')}</p>
            </div>
            <div className="feature-card">
              <h3>{t('how_it_works.step4')}</h3>
              <p>{t('how_it_works.step4_desc')}</p>
            </div>
          </div>
        </section>
        
        <section className="commissions-info">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">{t('commissions.title')}</h2>
            </div>
            <div className="card-body">
              <p>{t('commissions.explanation')}</p>
              <p><strong>{t('commissions.charged_to')}</strong></p>
              <ul>
                <li>{t('commissions.minimum_fee')}</li>
                <li>{t('commissions.percentage_fee')}</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;