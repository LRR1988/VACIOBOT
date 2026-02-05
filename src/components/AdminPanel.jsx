import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../utils/database';
import { USER_ROLES } from '../utils/constants';

const AdminPanel = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      // Cargar usuarios
      const allUsers = db.getAll('users');
      setUsers(allUsers);

      // Cargar anuncios
      const allAds = db.getAll('ads');
      setAds(allAds);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = (userId, newRole) => {
    const updatedUser = db.update('users', userId, { role: newRole });
    if (updatedUser) {
      setUsers(users.map(u => u.id === userId ? updatedUser : u));
    }
  };

  const markAdAsFeatured = (adId) => {
    const updatedAd = db.update('ads', adId, { featured: true });
    if (updatedAd) {
      setAds(ads.map(a => a.id === adId ? updatedAd : a));
    }
  };

  const blockAd = (adId) => {
    const updatedAd = db.update('ads', adId, { status: 'blocked' });
    if (updatedAd) {
      setAds(ads.map(a => a.id === adId ? updatedAd : a));
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UsersManagement users={users} onUpdateRole={updateUserRole} />;
      case 'ads':
        return <AdsManagement ads={ads} onMarkFeatured={markAdAsFeatured} onBlock={blockAd} />;
      case 'featured':
        return <FeaturedManagement ads={ads.filter(ad => ad.featured)} />;
      case 'random-ads':
        return <RandomAdsManagement />;
      default:
        return <UsersManagement users={users} onUpdateRole={updateUserRole} />;
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="text-center">
          <div className="spinner"></div>
          <p>{t('common.loading')}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">{t('admin.admin_panel')}</h2>
        </div>
        
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            {t('admin.manage_users')}
          </button>
          <button
            className={`tab-btn ${activeTab === 'ads' ? 'active' : ''}`}
            onClick={() => setActiveTab('ads')}
          >
            {t('admin.manage_ads')}
          </button>
          <button
            className={`tab-btn ${activeTab === 'featured' ? 'active' : ''}`}
            onClick={() => setActiveTab('featured')}
          >
            {t('admin.featured_ads')}
          </button>
          <button
            className={`tab-btn ${activeTab === 'random-ads' ? 'active' : ''}`}
            onClick={() => setActiveTab('random-ads')}
          >
            {t('admin.random_ads')}
          </button>
        </div>
        
        <div className="tab-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// Subcomponente para gestión de usuarios
const UsersManagement = ({ users, onUpdateRole }) => {
  const { t } = useTranslation();

  return (
    <div className="users-management">
      <h3>{t('admin.manage_users')}</h3>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>{t('auth.username')}</th>
              <th>{t('profile.company_name')}</th>
              <th>{t('profile.email')}</th>
              <th>{t('profile.account_type')}</th>
              <th>{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id?.substring(0, 8)}</td>
                <td>{user.username}</td>
                <td>{user.company_name || '-'}</td>
                <td>{user.email || '-'}</td>
                <td>
                  <select
                    value={user.role || 'user'}
                    onChange={(e) => onUpdateRole(user.id, e.target.value)}
                  >
                    <option value="user">{t('profile.user')}</option>
                    <option value="admin">{t('profile.admin')}</option>
                  </select>
                </td>
                <td>
                  <button className="btn btn-sm btn-outline">Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Subcomponente para gestión de anuncios
const AdsManagement = ({ ads, onMarkFeatured, onBlock }) => {
  const { t } = useTranslation();

  return (
    <div className="ads-management">
      <h3>{t('admin.manage_ads')}</h3>
      <div className="ads-list">
        {ads.map(ad => (
          <div key={ad.id} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">{ad.route_from} → {ad.route_to}</h5>
              <p className="card-text">
                <strong>{t('ad_details.price')}:</strong> {ad.price}€<br/>
                <strong>{t('ad_details.dates')}:</strong> {new Date(ad.start_date).toLocaleDateString()} - {ad.end_date ? new Date(ad.end_date).toLocaleDateString() : 'N/A'}<br/>
                <strong>{t('ad_details.status')}:</strong> <span className={`status ${ad.status}`}>{ad.status}</span>
              </p>
              <div className="d-flex gap-2">
                {!ad.featured && (
                  <button 
                    className="btn btn-primary" 
                    onClick={() => onMarkFeatured(ad.id)}
                  >
                    {t('admin.mark_featured')}
                  </button>
                )}
                <button 
                  className="btn btn-danger" 
                  onClick={() => onBlock(ad.id)}
                >
                  Bloquear
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Subcomponente para anuncios destacados
const FeaturedManagement = ({ ads }) => {
  const { t } = useTranslation();

  return (
    <div className="featured-management">
      <h3>{t('admin.featured_ads')}</h3>
      <div className="ads-list">
        {ads.length > 0 ? (
          ads.map(ad => (
            <div key={ad.id} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">{ad.route_from} → {ad.route_to} <span className="badge badge-featured">DESTACADO</span></h5>
                <p className="card-text">
                  <strong>{t('ad_details.price')}:</strong> {ad.price}€<br/>
                  <strong>{t('ad_details.dates')}:</strong> {new Date(ad.start_date).toLocaleDateString()} - {ad.end_date ? new Date(ad.end_date).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No hay anuncios destacados</p>
        )}
      </div>
    </div>
  );
};

// Subcomponente para publicación de anuncios aleatorios
const RandomAdsManagement = () => {
  const { t } = useTranslation();
  const [selectedCountry, setSelectedCountry] = useState('');
  const [adCount, setAdCount] = useState(10);

  const generateRandomAds = () => {
    // En una implementación real, esto generaría anuncios aleatorios bloqueados
    alert(`Generando ${adCount} anuncios aleatorios para ${selectedCountry || 'todos los países'}`);
  };

  return (
    <div className="random-ads-management">
      <h3>{t('admin.random_ads')}</h3>
      <div className="form-group">
        <label htmlFor="country" className="form-label">Seleccionar país</label>
        <select
          id="country"
          className="form-select"
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          <option value="">Todos los países</option>
          <option value="ES">España</option>
          <option value="FR">Francia</option>
          <option value="DE">Alemania</option>
          <option value="IT">Italia</option>
          <option value="PT">Portugal</option>
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="adCount" className="form-label">Número de anuncios</label>
        <input
          type="number"
          id="adCount"
          className="form-input"
          value={adCount}
          onChange={(e) => setAdCount(parseInt(e.target.value) || 10)}
          min="1"
          max="50"
        />
      </div>
      
      <button 
        className="btn btn-primary"
        onClick={generateRandomAds}
      >
        Generar anuncios aleatorios
      </button>
      
      <div className="mt-3">
        <p>Esta función permite generar anuncios aleatorios bloqueados para mostrar actividad en la plataforma.</p>
        <p>Los anuncios generados aparecerán como "bloqueados" y no serán contactables, pero mostrarán movimiento en la plataforma.</p>
      </div>
    </div>
  );
};

export default AdminPanel;