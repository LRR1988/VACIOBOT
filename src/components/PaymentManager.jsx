import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { 
  getUserAds, 
  getUserTransactions, 
  createTransaction, 
  getAds,
  hireService,
  followAd,
  unfollowAd,
  getUserFollowingAds,
  hasUserHiredAd
} from '../utils/database';
import { calculateCommission, formatPrice } from '../utils/helpers';
import { createCheckoutSession } from '../utils/paymentService';

const PaymentManager = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('available_ads');
  const [availableAds, setAvailableAds] = useState([]);
  const [userAds, setUserAds] = useState([]);
  const [userTransactions, setUserTransactions] = useState([]);
  const [followingAds, setFollowingAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(null); // ID del anuncio que se está procesando

  const userId = localStorage.getItem('token');
  
  // Manejar parámetros de la URL para contratación directa
  useEffect(() => {
    const adId = searchParams.get('adId');
    const action = searchParams.get('action');
    const price = searchParams.get('price');
    
    if (adId && action === 'hire' && price) {
      // Buscar el anuncio y procesar el pago directamente
      const processDirectPayment = async () => {
        try {
          const { data: allAds, error } = await getAds();
          if (!error) {
            const ad = allAds.find(a => a.id == adId);
            if (ad) {
              handlePayForService(ad.id, parseFloat(price), ad);
            }
          }
        } catch (error) {
          console.error('Error processing direct payment:', error);
        }
      };
      
      processDirectPayment();
    }
  }, [searchParams]);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'available_ads') {
        // Obtener anuncios activos de otros usuarios
        const { data: ads, error } = await getAds();
        if (!error) {
          // Filtrar anuncios que no sean del usuario actual
          const filteredAds = ads.filter(ad => ad.user_id !== userId);
          setAvailableAds(filteredAds);
        }
      } else if (activeTab === 'my_ads') {
        // Obtener anuncios del usuario actual
        const { data, error } = await getUserAds(userId);
        if (!error) {
          setUserAds(data);
        }
      } else if (activeTab === 'my_transactions') {
        // Obtener transacciones del usuario actual
        const { data, error } = await getUserTransactions(userId);
        if (!error) {
          setUserTransactions(data);
        }
      } else if (activeTab === 'following') {
        // Obtener anuncios seguidos por el usuario
        const { data: followedAdData, error: followedError } = await getUserFollowingAds(userId);
        if (!followedError) {
          // Obtener los detalles completos de los anuncios seguidos
          const followedAdIds = followedAdData.map(item => item.ad_id);
          if (followedAdIds.length > 0) {
            const { data: detailedAds, error: adsError } = await getAds();
            if (!adsError) {
              const detailedFollowedAds = detailedAds.filter(ad => followedAdIds.includes(ad.id));
              setFollowingAds(detailedFollowedAds);
            }
          } else {
            setFollowingAds([]);
          }
        } else {
          setFollowingAds([]);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayForService = async (adId, adPrice, ad) => {
    setProcessingPayment(adId);
    
    try {
      // Verificar que el usuario esté autenticado
      if (!userId) {
        alert(t('common.login_required'));
        return;
      }

      // Calcular comisión (5% del precio con mínimo de 25€)
      const commission = calculateCommission(adPrice);
      const netToOwner = adPrice - commission;
      
      // Confirmar el pago con el usuario
      const confirmPayment = window.confirm(
        t('payments.confirm_direct_payment')
      );

      if (!confirmPayment) {
        setProcessingPayment(null);
        return;
      }

      // Intentar crear sesión de checkout con Stripe
      const result = await createCheckoutSession(ad, userId);
      
      if (result.success && result.url) {
        // Redirigir al usuario a la página de checkout de Stripe
        // La transacción se registrará a través del webhook cuando se complete el pago
        window.location.href = result.url;
      } else {
        console.error('Error creating checkout session:', result.error);
        alert('Error al crear la sesión de pago: ' + (result.error || 'Error desconocido'));
        setProcessingPayment(null);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Error al procesar el pago: ' + error.message);
      setProcessingPayment(null);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'available_ads':
        return <AvailableAdsSection 
          ads={availableAds} 
          loading={loading} 
          onPayForService={handlePayForService}
          processingPayment={processingPayment}
        />;
      case 'my_ads':
        return <MyAdsSection ads={userAds} loading={loading} />;
      case 'my_transactions':
        return <TransactionHistorySection transactions={userTransactions} loading={loading} />;
      case 'following':
        return <FollowingAdsSection 
          ads={followingAds} 
          loading={loading} 
          onPayForService={onPayForService}
          processingPayment={processingPayment}
        />;
      default:
        return <AvailableAdsSection 
          ads={availableAds} 
          loading={loading} 
          onPayForService={handlePayForService}
          processingPayment={processingPayment}
        />;
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">{t('payments.title')}</h2>
        </div>
        
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'available_ads' ? 'active' : ''}`}
            onClick={() => setActiveTab('available_ads')}
          >
            {t('payments.available_ads')}
          </button>
          <button
            className={`tab-btn ${activeTab === 'following' ? 'active' : ''}`}
            onClick={() => setActiveTab('following')}
          >
            Siguiendo
          </button>
          <button
            className={`tab-btn ${activeTab === 'my_ads' ? 'active' : ''}`}
            onClick={() => setActiveTab('my_ads')}
          >
            {t('my_ads.title')}
          </button>
          <button
            className={`tab-btn ${activeTab === 'my_transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('my_transactions')}
          >
            {t('payments.transaction_history')}
          </button>
        </div>
        
        <div className="tab-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// Subcomponente para anuncios disponibles
const AvailableAdsSection = ({ ads, loading, onPayForService, processingPayment }) => {
  const { t } = useTranslation();
  const [followingAds, setFollowingAds] = useState([]);
  const [hiredAds, setHiredAds] = useState([]);

  useEffect(() => {
    loadFollowingAds();
    loadHiredAds();
  }, [ads]);

  const loadFollowingAds = async () => {
    try {
      const userId = localStorage.getItem('token');
      if (!userId) return;

      const { data, error } = await getUserFollowingAds(userId);
      if (!error) {
        setFollowingAds(data.map(item => item.ad_id));
      }
    } catch (error) {
      console.error('Error loading following ads:', error);
    }
  };

  const loadHiredAds = async () => {
    try {
      const userId = localStorage.getItem('token');
      if (!userId) return;

      // Verificar para cada anuncio si ya ha sido contratado por este usuario
      const hiredAdIds = [];
      for (const ad of ads) {
        const { exists } = await hasUserHiredAd(userId, ad.id);
        if (exists) {
          hiredAdIds.push(ad.id);
        }
      }
      setHiredAds(hiredAdIds);
    } catch (error) {
      console.error('Error loading hired ads:', error);
    }
  };
  
  // Función para actualizar la lista de anuncios contratados
  const refreshHiredAds = async () => {
    try {
      const userId = localStorage.getItem('token');
      if (!userId) return;

      // Verificar para cada anuncio si ya ha sido contratado por este usuario
      const hiredAdIds = [];
      for (const ad of ads) {
        const { exists } = await hasUserHiredAd(userId, ad.id);
        if (exists) {
          hiredAdIds.push(ad.id);
        }
      }
      setHiredAds(hiredAdIds);
    } catch (error) {
      console.error('Error refreshing hired ads:', error);
    }
  };

  const handleFollowAd = async (adId) => {
    try {
      const userId = localStorage.getItem('token');
      if (!userId) {
        alert(t('common.login_required'));
        return;
      }

      if (followingAds.includes(adId)) {
        // Dejar de seguir
        await unfollowAd(userId, adId);
        setFollowingAds(prev => prev.filter(id => id !== adId));
      } else {
        // Seguir
        await followAd(userId, adId);
        setFollowingAds(prev => [...prev, adId]);
      }
    } catch (error) {
      console.error('Error following/unfollowing ad:', error);
      alert(error.message);
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

  if (!ads || ads.length === 0) {
    return (
      <div className="text-center">
        <p>{t('payments.no_available_ads')}</p>
      </div>
    );
  }

  return (
    <div className="ads-list">
      <h3>{t('payments.available_ads')}</h3>
      <p>{t('payments.select_ad_to_contract')}</p>
      
      {ads.map(ad => {
        const commission = calculateCommission(ad.price);
        const netToOwner = ad.price - commission;
        const isFollowing = followingAds.includes(ad.id);
        return (
          <div key={ad.id} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">{ad.route_from} → {ad.route_to}</h5>
              <p className="card-text">
                <strong>{t('common.price')}:</strong> {formatPrice(ad.price)}<br/>
                <strong>{t('payments.commission')}:</strong> {formatPrice(commission)} ({t('payments.commission_rate')})<br/>
                <strong>{t('payments.net_to_owner')}:</strong> {formatPrice(netToOwner)}<br/>
                <strong>{t('profile.company_name')}:</strong> {ad.users?.company_name || ad.users?.username || t('common.not_specified')}<br/>
                <strong>{t('common.dates')}:</strong> {new Date(ad.start_date).toLocaleDateString()} - {ad.end_date ? new Date(ad.end_date).toLocaleDateString() : t('common.na')}<br/>
                <strong>{t('common.schedule')}:</strong> {ad.start_time || t('common.na')} - {ad.end_time || t('common.na')}
              </p>
              <div className="d-flex gap-2">
                <button 
                  className={`btn ${isFollowing ? 'btn-danger' : 'btn-outline-primary'}`}
                  onClick={() => handleFollowAd(ad.id)}
                >
                  {isFollowing ? '× Dejar de seguir' : '♡ Seguir'}
                </button>
                {hiredAds.includes(ad.id) ? (
                  <button 
                    className="btn btn-secondary"
                    disabled
                  >
                    {t('payments.vehicle_reserved')}
                  </button>
                ) : (
                  <button 
                    className="btn btn-success"
                    onClick={() => onPayForService(ad.id, ad.price, ad)}
                    disabled={processingPayment === ad.id}
                  >
                    {processingPayment === ad.id ? t('common.processing') : `${t('payments.contract_service')} (${formatPrice(ad.price)})`}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
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
        <p>{t('my_ads.no_ads')}</p>
      </div>
    );
  }

  return (
    <div className="ads-list">
      <h3>{t('my_ads.my_ads')}</h3>
      <p>{t('my_ads.description')}</p>
      
      {ads.map(ad => {
        const commission = calculateCommission(ad.price);
        return (
          <div key={ad.id} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">{ad.route_from} → {ad.route_to}</h5>
              <p className="card-text">
                <strong>{t('common.price')}:</strong> {formatPrice(ad.price)}<br/>
                <strong>{t('payments.commission_charged')}:</strong> {formatPrice(commission)}<br/>
                <strong>{t('common.dates')}:</strong> {new Date(ad.start_date).toLocaleDateString()} - {ad.end_date ? new Date(ad.end_date).toLocaleDateString() : t('common.na')}<br/>
                <strong>{t('common.status')}:</strong> <span className={`status ${ad.status}`}>{t(`common.status_${ad.status}`)}</span>
              </p>
              <div className="d-flex gap-2">
                <button className="btn btn-outline">{t('common.edit')}</button>
                <button className="btn btn-danger">{t('common.delete')}</button>
                <button className="btn btn-primary">{t('common.clone')}</button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Subcomponente para historial de transacciones
const TransactionHistorySection = ({ transactions, loading }) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner"></div>
        <p>{t('common.loading')}...</p>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center">
        <p>{t('payments.no_transactions')}</p>
      </div>
    );
  }

  return (
    <div className="transactions-list">
      <h3>{t('payments.transaction_history')}</h3>
      <p>{t('payments.transaction_description')}</p>
      
      {transactions.map(transaction => (
        <div key={transaction.id} className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">{t('payments.transaction')} #{transaction.id}</h5>
            <p className="card-text">
              <strong>{t('payments.transaction_type')}:</strong> {t(`payments.type_${transaction.type}`) || transaction.type}<br/>
              <strong>{t('payments.amount')}:</strong> {formatPrice(transaction.amount)}<br/>
              <strong>{t('common.date')}:</strong> {new Date(transaction.created_at).toLocaleString()}<br/>
              <strong>{t('common.status')}:</strong> <span className={`status ${transaction.status}`}>{t(`common.status_${transaction.status}`)}</span><br/>
              <strong>{t('common.description')}:</strong> {transaction.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

// Subcomponente para anuncios seguidos
const FollowingAdsSection = ({ ads, loading, onPayForService, processingPayment }) => {
  const { t } = useTranslation();
  const [hiredAds, setHiredAds] = useState([]);

  useEffect(() => {
    loadHiredAds();
  }, [ads]);

  const loadHiredAds = async () => {
    try {
      const userId = localStorage.getItem('token');
      if (!userId) return;

      // Verificar para cada anuncio si ya ha sido contratado por este usuario
      const hiredAdIds = [];
      for (const ad of ads) {
        const { exists } = await hasUserHiredAd(userId, ad.id);
        if (exists) {
          hiredAdIds.push(ad.id);
        }
      }
      setHiredAds(hiredAdIds);
    } catch (error) {
      console.error('Error loading hired ads in following section:', error);
    }
  };
  
  // Función para actualizar la lista de anuncios contratados
  const refreshHiredAds = async () => {
    try {
      const userId = localStorage.getItem('token');
      if (!userId) return;

      // Verificar para cada anuncio si ya ha sido contratado por este usuario
      const hiredAdIds = [];
      for (const ad of ads) {
        const { exists } = await hasUserHiredAd(userId, ad.id);
        if (exists) {
          hiredAdIds.push(ad.id);
        }
      }
      setHiredAds(hiredAdIds);
    } catch (error) {
      console.error('Error refreshing hired ads in following section:', error);
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

  if (!ads || ads.length === 0) {
    return (
      <div className="text-center">
        <p>No estás siguiendo ningún anuncio aún.</p>
      </div>
    );
  }

  return (
    <div className="ads-list">
      <h3>Anuncios que sigues</h3>
      <p>Lista de anuncios que has marcado como favoritos o estás siguiendo.</p>
      
      {ads.map(ad => {
        const commission = calculateCommission(ad.price);
        const netToOwner = ad.price - commission;
        return (
          <div key={ad.id} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">{ad.route_from} → {ad.route_to}</h5>
              <p className="card-text">
                <strong>{t('common.price')}:</strong> {formatPrice(ad.price)}<br/>
                <strong>{t('payments.commission')}:</strong> {formatPrice(commission)} ({t('payments.commission_rate')})<br/>
                <strong>{t('payments.net_to_owner')}:</strong> {formatPrice(netToOwner)}<br/>
                <strong>{t('profile.company_name')}:</strong> {ad.users?.company_name || ad.users?.username || t('common.not_specified')}<br/>
                <strong>{t('common.dates')}:</strong> {new Date(ad.start_date).toLocaleDateString()} - {ad.end_date ? new Date(ad.end_date).toLocaleDateString() : t('common.na')}<br/>
                <strong>{t('common.schedule')}:</strong> {ad.start_time || t('common.na')} - {ad.end_time || t('common.na')}
              </p>
              <div className="d-flex gap-2">
                {hiredAds.includes(ad.id) ? (
                  <button 
                    className="btn btn-secondary"
                    disabled
                  >
                    {t('payments.vehicle_reserved')}
                  </button>
                ) : (
                  <button 
                    className="btn btn-success"
                    onClick={() => onPayForService(ad.id, ad.price, ad)}
                    disabled={processingPayment === ad.id}
                  >
                    {processingPayment === ad.id ? t('common.processing') : `${t('payments.contract_service')} (${formatPrice(ad.price)})`}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PaymentManager;