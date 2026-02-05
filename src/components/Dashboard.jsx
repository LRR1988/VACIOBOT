import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';
import { getUserAds, updateAd, deleteAd, getUserFollowingAds, unfollowAd } from '../utils/database';
import { supabase } from '../utils/supabaseClient';
import RatingComponent from './RatingComponent';
import Notifications from './Notifications';
import EditAdModal from './EditAdModal';

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('my-ads');
  const [myAds, setMyAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAd, setEditingAd] = useState(null);
=======
import { getUserAds } from '../utils/supabaseClient';

const Dashboard = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('my-ads');
  const [myAds, setMyAds] = useState([]);
  const [loading, setLoading] = useState(true);
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85

  useEffect(() => {
    loadUserAds();
  }, []);

  const loadUserAds = async () => {
    try {
      const userId = localStorage.getItem('token');
      if (!userId) return;

      const { data, error } = await getUserAds(userId);
      if (error) {
        console.error('Error loading user ads:', error);
      } else {
        setMyAds(data || []);
      }
    } catch (error) {
      console.error('Error loading user ads:', error);
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const handleEditAd = (ad) => {
    // Mostrar mensaje si intentan editar el precio
    if (window.confirm(`¿Editar anuncio?\n\nNota: El precio no se puede modificar después de crear el anuncio. Si necesita cambiar el precio, debe eliminar este anuncio y crear uno nuevo.`)) {
      setEditingAd(ad);
    }
  };

  const handleSaveEdit = (updatedAd) => {
    // Actualizar la lista localmente
    setMyAds(prevAds => prevAds.map(ad => 
      ad.id === updatedAd.id ? updatedAd : ad
    ));
    setEditingAd(null);
    alert('Anuncio actualizado exitosamente');
  };

  const handleCloseEditModal = () => {
    setEditingAd(null);
  };

  const handleDeleteAd = async (adId) => {
    if (window.confirm('¿Está seguro de que desea eliminar este anuncio? Esta acción no se puede deshacer.')) {
      try {
        const { error } = await deleteAd(adId);
        if (error) {
          throw new Error(error.message || 'Error al eliminar el anuncio');
        }
        
        alert('Anuncio eliminado exitosamente');
        // Recargar la lista de anuncios
        loadUserAds(); // Actualizar la lista directamente
      } catch (err) {
        alert('Error al eliminar el anuncio: ' + err.message);
      }
    }
  };

  const renderContent = () => {
    const userId = localStorage.getItem('token');
    
    switch (activeTab) {
      case 'my-ads':
        return <MyAdsSection ads={myAds} loading={loading} handleEditAd={handleEditAd} handleDeleteAd={handleDeleteAd} />;
      case 'followed':
        return <FollowedAdsSection />;
      case 'offers':
        return <OffersSection />;
      case 'ratings':
        return userId ? <RatingSection userId={userId} /> : <div>Debe iniciar sesión</div>;
      case 'notifications':
        return userId ? <NotificationsSection userId={userId} /> : <div>Debe iniciar sesión</div>;
      default:
        return <MyAdsSection ads={myAds} loading={loading} handleEditAd={handleEditAd} handleDeleteAd={handleDeleteAd} />;
=======
  const renderContent = () => {
    switch (activeTab) {
      case 'my-ads':
        return <MyAdsSection ads={myAds} loading={loading} />;
      case 'followed':
        return <FollowedAdsSection />;
      case 'interested':
        return <InterestedAdsSection />;
      case 'offers':
        return <OffersSection />;
      default:
        return <MyAdsSection ads={myAds} loading={loading} />;
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
    }
  };

  return (
<<<<<<< HEAD
    <div>
=======
    <div className="container">
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">{t('common.dashboard')}</h2>
        </div>
        
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'my-ads' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-ads')}
          >
            {t('navigation.my_ads')}
          </button>
          <button
            className={`tab-btn ${activeTab === 'followed' ? 'active' : ''}`}
            onClick={() => setActiveTab('followed')}
          >
            {t('navigation.followed_ads')}
          </button>
          <button
<<<<<<< HEAD
=======
            className={`tab-btn ${activeTab === 'interested' ? 'active' : ''}`}
            onClick={() => setActiveTab('interested')}
          >
            {t('navigation.interested_ads')}
          </button>
          <button
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
            className={`tab-btn ${activeTab === 'offers' ? 'active' : ''}`}
            onClick={() => setActiveTab('offers')}
          >
            {t('navigation.sent_offers')}
          </button>
<<<<<<< HEAD
          <button
            className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            {t('navigation.notifications')}
          </button>
=======
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
        </div>
        
        <div className="tab-content">
          {renderContent()}
        </div>
      </div>
<<<<<<< HEAD
      
      {editingAd && (
        <EditAdModal
          ad={editingAd}
          isOpen={!!editingAd}
          onClose={handleCloseEditModal}
          onSave={handleSaveEdit}
        />
      )}
=======
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
    </div>
  );
};

// Subcomponente para anuncios propios
<<<<<<< HEAD
const MyAdsSection = ({ ads, loading, handleEditAd, handleDeleteAd }) => {
=======
const MyAdsSection = ({ ads, loading }) => {
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner"></div>
        <p>{t('common.loading')}...</p>
      </div>
    );
  }

  if (!ads || ads.length === 0) {
    return (
      <div className="text-center">
        <p>{t('common.no_items_found')}</p>
      </div>
    );
  }

  return (
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
<<<<<<< HEAD
              <button 
                className="btn btn-outline"
                onClick={() => handleEditAd(ad)}
              >
                {t('common.edit')}
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => handleDeleteAd(ad.id)}
              >
                {t('common.delete')}
              </button>
=======
              <button className="btn btn-outline">{t('common.edit')}</button>
              <button className="btn btn-danger">{t('common.delete')}</button>
              <button className="btn btn-primary">{t('common.clone')}</button>
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Subcomponente para anuncios seguidos
const FollowedAdsSection = () => {
  const { t } = useTranslation();
<<<<<<< HEAD
  const [followedAds, setFollowedAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadFollowedAds();
  }, []);

  const loadFollowedAds = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Usuario no autenticado');
        return;
      }
      
      // Obtener el usuario actual
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      setCurrentUser(user);

      // Obtener IDs de anuncios seguidos
      const { data: followedData, error: followedError } = await getUserFollowingAds(token);
      if (followedError) {
        throw new Error(followedError.message || 'Error al cargar anuncios seguidos');
      }

      if (followedData && followedData.length > 0) {
        // Extraer IDs de anuncios seguidos
        const followedAdIds = followedData.map(item => item.ad_id);
        
        // Obtener detalles completos de los anuncios
        const promises = followedAdIds.map(adId => 
          supabase
            .from('ads')
            .select(`
              *,
              users (
                username
              )
            `)
            .eq('id', adId)
            .single()
        );

        const results = await Promise.all(promises);
        const validAds = results
          .filter(result => !result.error && result.data)
          .map(result => result.data);

        setFollowedAds(validAds);
      }
    } catch (error) {
      console.error('Error cargando anuncios seguidos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner"></div>
        <p>{t('common.loading')}...</p>
      </div>
    );
  }

  if (!followedAds || followedAds.length === 0) {
    return (
      <div className="text-center">
        <p>{t('common.no_items_found')}</p>
      </div>
    );
  }

  const handleUnfollow = async (adId) => {
    if (!window.confirm('¿Está seguro de que desea dejar de seguir este anuncio?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Debe iniciar sesión para dejar de seguir un anuncio');
        return;
      }

      const { error } = await unfollowAd(token, adId);
      if (error) {
        throw new Error(error.message || 'Error al dejar de seguir el anuncio');
      }

      // Actualizar la lista localmente eliminando el anuncio
      setFollowedAds(prev => prev.filter(ad => ad.id !== adId));
      alert('Ha dejado de seguir este anuncio');
    } catch (error) {
      console.error('Error dejando de seguir anuncio:', error);
      alert('Error al dejar de seguir el anuncio: ' + error.message);
    }
  };

  return (
    <div className="ads-list">
      {followedAds.map(ad => (
        <div key={ad.id} className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">{ad.route_from} → {ad.route_to}</h5>
            <p className="card-text">
              <strong>{t('ad_details.posted_by')}:</strong> {ad.users?.username || 'N/A'}<br/>
              <strong>{t('ad_details.price')}:</strong> {ad.price}€<br/>
              <strong>{t('ad_details.dates')}:</strong> {new Date(ad.start_date).toLocaleDateString()} - {ad.end_date ? new Date(ad.end_date).toLocaleDateString() : 'N/A'}<br/>
              <strong>{t('ad_details.status')}:</strong> <span className={`status ${ad.status}`}>{ad.status}</span>
            </p>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-outline"
                onClick={() => handleUnfollow(ad.id)}
              >
                {t('common.unfollow')}
              </button>
            </div>
          </div>
        </div>
      ))}
=======
  return (
    <div className="text-center">
      <p>{t('common.no_items_found')}</p>
    </div>
  );
};

// Subcomponente para anuncios en los que se está interesado
const InterestedAdsSection = () => {
  const { t } = useTranslation();
  return (
    <div className="text-center">
      <p>{t('common.no_items_found')}</p>
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
    </div>
  );
};

// Subcomponente para ofertas enviadas
const OffersSection = () => {
  const { t } = useTranslation();
  return (
    <div className="text-center">
      <p>{t('common.no_items_found')}</p>
    </div>
  );
};

<<<<<<< HEAD
// Subcomponente para calificaciones
const RatingSection = ({ userId }) => {
  const { t } = useTranslation();
  return (
    <div className="rating-section">
      <h3>{t('navigation.ratings')}</h3>
      <div className="card">
        <div className="card-body">
          <h4>Sistema de Calificaciones Anónimas</h4>
          <p>Este sistema permite calificar a empresas de transporte sin revelar identidades, manteniendo el sistema "blind" para proteger las comisiones.</p>
          <RatingComponent userId={userId} />
        </div>
      </div>
    </div>
  );
};

// Subcomponente para notificaciones
const NotificationsSection = ({ userId }) => {
  const { t } = useTranslation();
  return (
    <div className="notifications-section">
      <h3>{t('navigation.notifications')}</h3>
      <div className="card">
        <div className="card-body">
          <Notifications userId={userId} />
        </div>
      </div>
    </div>
  );
};

=======
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
export default Dashboard;