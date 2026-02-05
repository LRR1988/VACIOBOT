import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Travabus</h3>
            <p>{t('home.description')}</p>
          </div>
          
          <div className="footer-section">
            <h3>{t('navigation.home')}</h3>
            <ul className="footer-links">
              <li><Link to="/">{t('navigation.home')}</Link></li>
              <li><Link to="/about">{t('navigation.about')}</Link></li>
              <li><Link to="/how-it-works">{t('navigation.how_it_works')}</Link></li>
              <li><Link to="/contact">{t('navigation.contact')}</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>{t('common.profile')}</h3>
            <ul className="footer-links">
              <li><Link to="/login">{t('common.login')}</Link></li>
              <li><Link to="/register">{t('common.register')}</Link></li>
              <li><Link to="/profile">{t('navigation.my_profile')}</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>{t('common.publish')}</h3>
            <ul className="footer-links">
              <li><Link to="/publish">{t('navigation.publish_ad')}</Link></li>
              <li><Link to="/dashboard">{t('common.dashboard')}</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Travabus. {t('common.all_rights_reserved')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;