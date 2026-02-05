import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isAdmin } from '../utils/helpers';

const Header = ({ 
  isAuthenticated, 
  currentUser, 
  onLogout, 
  onToggleDarkMode, 
  darkMode,
  onShowAuthModal 
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <nav className="navbar">
          <Link to="/" className="logo">
            Travabus
          </Link>
          
          <div className="nav-links">
            <Link to="/" className="nav-link">{t('navigation.home')}</Link>
<<<<<<< HEAD
            <Link to="/all-ads" className="nav-link">Ver Anuncios</Link>
=======
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
            <Link to="/about" className="nav-link">{t('navigation.about')}</Link>
            <Link to="/how-it-works" className="nav-link">{t('navigation.how_it_works')}</Link>
            <Link to="/contact" className="nav-link">{t('navigation.contact')}</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="nav-link">{t('navigation.my_profile')}</Link>
                <Link to="/publish" className="nav-link">{t('navigation.publish_ad')}</Link>
<<<<<<< HEAD
=======
                <Link to="/dashboard" className="nav-link">{t('common.dashboard')}</Link>
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
                
                {currentUser && isAdmin(currentUser) && (
                  <>
                    <Link to="/admin" className="nav-link">Admin</Link>
                    <Link to="/stripe-config" className="nav-link">Stripe</Link>
                  </>
                )}
                
                <button onClick={handleLogout} className="btn btn-outline">
                  {t('common.logout')}
                </button>
              </>
            ) : (
              <button onClick={onShowAuthModal} className="btn btn-primary">
                {t('common.login')}
              </button>
            )}
            
            <button 
              onClick={onToggleDarkMode}
              className="btn btn-outline"
              title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;