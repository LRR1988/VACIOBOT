import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { getAds, expressInterest, toggleAdFollow, getUserFollowingAds, hireService, hasUserHiredAd, isAdHiredByAnyUser } from '../utils/database';
import { calculateCommission, formatPrice } from '../utils/helpers';
import { EUROPE_COUNTRIES } from '../utils/constants';

const AllAds = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    country_from: '',
    country_to: '',
    keyword: ''
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [followedAds, setFollowedAds] = useState(new Set());
  const [hiredAds, setHiredAds] = useState(new Set());

  useEffect(() => {
    loadAdsAndUserData();
  }, []);

  // Efecto para actualizar los anuncios contratados cuando cambian los anuncios o el usuario
  useEffect(() => {
    if (ads.length > 0 && currentUser && currentUser.id) {
      const loadHiredAds = async () => {
        try {
          const hiredAdIds = new Set();
          for (const ad of ads) {
            const { exists } = await hasUserHiredAd(currentUser.id, ad.id);
            if (exists) {
              hiredAdIds.add(ad.id);
            }
          }
          setHiredAds(hiredAdIds);
        } catch (err) {
          console.error('Error loading hired ads:', err);
        }
      };
      
      loadHiredAds();
    }
  }, [ads, currentUser]);

  const loadAdsAndUserData = async () => {
    try {
      setLoading(true);
      const { data: adsData, error: adsError } = await getAds();
      if (adsError) {
        setError(adsError.message);
      } else {
        // Filtrar solo anuncios activos
        const activeAds = adsData.filter(ad => ad.status === 'active');
        setAds(activeAds);
      }
    } catch (err) {
      setError(err.message || 'Error al cargar los anuncios');
    } finally {
      setLoading(false);
    }

    // Obtener usuario actual
    const token = localStorage.getItem('token');
    if (token) {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      setCurrentUser(user);
      
      // Cargar anuncios seguidos si hay usuario
      if (user.id) {
        try {
          const { data: followedData, error: followedError } = await getUserFollowingAds(user.id);
          if (!followedError && followedData) {
            const followedIds = new Set(followedData.map(item => item.ad_id));
            setFollowedAds(followedIds);
          }
        } catch (err) {
          console.error('Error loading followed ads:', err);
        }
      }
    }
    
    // Cargar anuncios contratados por el usuario (independientemente de si está autenticado)
    if (currentUser && currentUser.id) {
      try {
        const hiredAdIds = new Set();
        for (const ad of ads) {
          const { exists } = await hasUserHiredAd(currentUser.id, ad.id);
          if (exists) {
            hiredAdIds.add(ad.id);
          }
        }
        setHiredAds(hiredAdIds);
      } catch (err) {
        console.error('Error loading hired ads:', err);
      }
    }
  };

  const isAdFollowed = (adId) => {
    return followedAds.has(adId);
  };
  
  const isAdHired = (adId) => {
    return hiredAds.has(adId);
  };
  
  const refreshHiredAds = async () => {
    if (currentUser && currentUser.id) {
      try {
        const hiredAdIds = new Set();
        for (const ad of ads) {
          const { exists } = await hasUserHiredAd(currentUser.id, ad.id);
          if (exists) {
            hiredAdIds.add(ad.id);
          }
        }
        setHiredAds(hiredAdIds);
      } catch (err) {
        console.error('Error refreshing hired ads:', err);
      }
    }
  };

  const handleFollowToggle = async (adId) => {
    if (!currentUser) {
      alert('Debe iniciar sesión para seguir un anuncio');
      return;
    }

    try {
      const { data, error } = await toggleAdFollow(currentUser.id, adId);
      if (error) {
        throw new Error(error.message || 'Error al seguir/anular el seguimiento del anuncio');
      }

      // Actualizar el estado local de anuncios seguidos basado en el resultado
      setFollowedAds(prev => {
        const newSet = new Set(prev);
        if (data && data.following) {
          newSet.add(adId);
        } else {
          newSet.delete(adId);
        }
        return newSet;
      });
    } catch (err) {
      setError(err.message || 'Error al seguir/anular el seguimiento del anuncio');
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHireService = async (adId) => {
    if (!currentUser) {
      alert('Debe iniciar sesión para contratar un servicio');
      return;
    }

    const ad = ads.find(ad => ad.id === adId);
    if (!ad) {
      alert('Anuncio no encontrado');
      return;
    }

    if (currentUser.id === ad.user_id) {
      alert('No puede contratar su propio anuncio');
      return;
    }

    try {
      // Actualizar el estado local para reflejar que se está contratando este anuncio
      setHiredAds(prev => new Set(prev).add(adId));
      
      // Redirigir al usuario a la página de pagos para completar el checkout
      navigate(`/payments?adId=${ad.id}&action=hire&price=${ad.price}`);
    } catch (err) {
      console.error('Error al procesar la contratación:', err);
      setError(err.message || 'Error al procesar la contratación');
    }
  };

  // Filtrar anuncios según los filtros
  const filteredAds = ads.filter(ad => {
    // Filtro por país de origen
    if (filters.country_from && ad.country_from !== filters.country_from) return false;
    
    // Filtro por país de destino
    if (filters.country_to && ad.country_to !== filters.country_to) return false;
    
    // Filtro por palabra clave
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      let searchField = ad.observations || '';
      // Si las observaciones tienen el formato ACTUALIZADO-<timestamp>, extraer el contenido real
      if (searchField && searchField.startsWith('ACTUALIZADO-')) {
        searchField = searchField.substring(11); // Remover 'ACTUALIZADO-'
      }
      if (!ad.route_from.toLowerCase().includes(keyword) &&
          !ad.route_to.toLowerCase().includes(keyword) &&
          !searchField.toLowerCase().includes(keyword)) {
        return false;
      }
    }
    
    return true;
  });

  if (loading) {
    return (
      <div className="mt-4">
        <h2>{t('all_ads.title')}</h2>
        <div className="text-center">
          <div className="spinner"></div>
          <p>{t('common.loading')}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h2>{t('all_ads.title')}</h2>
      
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Filtros */}
      <div className="card mb-4">
        <div className="card-header">
          <h3 className="card-title">{t('filters.title')}</h3>
        </div>
        <div className="card-body">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('filters.country_from')}</label>
              <select 
                className="form-input" 
                value={filters.country_from}
                onChange={(e) => handleFilterChange('country_from', e.target.value)}
              >
                <option value="">{t('common.all_countries')}</option>
                {EUROPE_COUNTRIES.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{t('filters.country_to')}</label>
              <select 
                className="form-input" 
                value={filters.country_to}
                onChange={(e) => handleFilterChange('country_to', e.target.value)}
              >
                <option value="">{t('common.all_countries')}</option>
                {EUROPE_COUNTRIES.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{t('filters.search')}</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder={t('filters.search_placeholder')}
                value={filters.keyword}
                onChange={(e) => handleFilterChange('keyword', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de anuncios */}
      <div className="ads-list">
        {filteredAds.length > 0 ? (
          filteredAds.map(ad => {
            const countryFrom = EUROPE_COUNTRIES.find(c => c.code === ad.country_from)?.name || ad.country_from;
            const countryTo = EUROPE_COUNTRIES.find(c => c.code === ad.country_to)?.name || ad.country_to;
            
            return (
              <div key={ad.id} className="card mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <h5 className="card-title">{countryFrom} - {ad.route_from} → {ad.route_to} - {countryTo}</h5>
                    <span className={`status ${ad.status}`}>
                      {t(`status.${ad.status}`)}
                    </span>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-8">
                      <p className="card-text">
                        <strong>{t('ad_form.price')}:</strong> {formatPrice(ad.price)}<br/>
                        <strong>{t('ad_form.start_date')}:</strong> {new Date(ad.start_date).toLocaleDateString()}<br/>
                        <strong>{t('ad_form.end_date')}:</strong> {ad.end_date ? new Date(ad.end_date).toLocaleDateString() : 'N/A'}<br/>
                        <strong>{t('ad_form.start_time')}:</strong> {ad.start_time || 'N/A'}<br/>
                        <strong>{t('ad_form.end_time')}:</strong> {ad.end_time || 'N/A'}<br/>
                        <strong>{t('ad_form.seats')}:</strong> {ad.seats || 'N/A'}<br/>
                        <strong>{t('ad_form.bus_age')}:</strong> {ad.bus_age || 'N/A'} años<br/>
                      </p>
                      {ad.observations && !ad.observations.startsWith('ACTUALIZADO-') && ad.observations !== 'common.none' && (
                        <p><strong>{t('ad_form.observations')}:</strong> {ad.observations}</p>
                      )}
                      {ad.observations && ad.observations.startsWith('ACTUALIZADO-') && (
                        <p><strong>{t('ad_form.observations')}:</strong> {ad.observations.substring(11)} <em>({new Date(parseInt(ad.observations.substring(11))).toLocaleString()})</em></p>
                      )}
                      {(!ad.observations || ad.observations === 'common.none') && (
                        <p><strong>{t('ad_form.observations')}:</strong> —</p>
                      )}
                    </div>
                    <div className="col-md-4">
                      <div className="d-grid gap-2">
                        {currentUser && currentUser.id !== ad.user_id ? (
                          <>
                            {isAdHired(ad.id) ? (
                              <button 
                                className="btn btn-secondary"
                                disabled
                              >
                                {t('payments.vehicle_reserved')}
                              </button>
                            ) : (
                              <button 
                                className="btn btn-success"
                                onClick={() => handleHireService(ad.id)}
                              >
                                Contratar Servicio ({formatPrice(ad.price)})
                              </button>
                            )}
                            <button 
                              className="btn btn-outline"
                              onClick={() => handleFollowToggle(ad.id)}
                            >
                              {isAdFollowed(ad.id) ? '♡ Siguiendo' : '♡ Seguir'}
                            </button>
                          </>
                        ) : currentUser && currentUser.id === ad.user_id ? (
                          <button 
                            className="btn btn-outline"
                            onClick={() => navigate('/dashboard')}
                          >
                            {t('all_ads.own_ad')}
                          </button>
                        ) : (
                          <button 
                            className="btn btn-outline"
                            onClick={() => window.location.hash = '#/login'}
                          >
                            {t('auth.login_required')}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center">
            <p>{t('all_ads.no_ads_found')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAds;