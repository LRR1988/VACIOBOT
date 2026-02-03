import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getUserAds } from '../utils/supabaseClient';

const Dashboard = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('my-ads');
  const [myAds, setMyAds] = useState([]);
  const [loading, setLoading] = useState(true);

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
    }
  };

  return (
    <div className="container">
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
            className={`tab-btn ${activeTab === 'interested' ? 'active' : ''}`}
            onClick={() => setActiveTab('interested')}
          >
            {t('navigation.interested_ads')}
          </button>
          <button
            className={`tab-btn ${activeTab === 'offers' ? 'active' : ''}`}
            onClick={() => setActiveTab('offers')}
          >
            {t('navigation.sent_offers')}
          </button>
        </div>
        
        <div className="tab-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// Subcomponente para anuncios propios
const MyAdsSection = ({ ads, loading }) => {
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
              <button className="btn btn-outline">{t('common.edit')}</button>
              <button className="btn btn-danger">{t('common.delete')}</button>
              <button className="btn btn-primary">{t('common.clone')}</button>
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

export default Dashboard;