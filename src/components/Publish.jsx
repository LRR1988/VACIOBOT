import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createAd } from '../utils/database';
import { calculateCommission } from '../utils/helpers';
import { EUROPE_COUNTRIES } from '../utils/constants';

const Publish = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ad_type: 'offer', // Solo oferta para MVP
    route_from: '',
    route_to: '',
    country_from: '', // País de origen
    country_to: '', // País de destino
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    price: '',
    bus_age: '',
    seats: '',
    observations: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validación básica
    if (!formData.route_from || !formData.route_to || !formData.country_from || !formData.country_to || !formData.start_date || !formData.price) {
      setError(t('ad_form.required_field'));
      setLoading(false);
      return;
    }

    try {
      const adData = {
        ...formData,
        price: parseFloat(formData.price),
        bus_count: 1, // Siempre 1 bus
        bus_age: parseInt(formData.bus_age) || 0,
        seats: parseInt(formData.seats) || 0,
        country: formData.country_from // País principal para filtrado
      };

      const { data, error } = await createAd(adData);
      if (error) {
        setError(error.message);
      } else {
        // Anuncio creado exitosamente sin necesidad de pagar comisión inicial
        setSuccess(`${t('common.success')}: ${t('ad_form.title')}.\nAnuncio creado exitosamente. La comisión se aplicará cuando otro usuario contrate su servicio.`);
        
        // Redirigir al dashboard inmediatamente después de un breve delay para mostrar el mensaje
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000); // Reducido el tiempo para una experiencia más rápida
      }
    } catch (err) {
      setError(err.message || 'Ha ocurrido un error');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentComplete = () => {
    // En una implementación real, esto procesaría el pago con Stripe
    // Por ahora, simplemente redirigimos al dashboard
    setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
  };

  return (
    <div className="container">
      <div className="row justify-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">{t('ad_form.title')}</h2>
            </div>
            
            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}
            
            {success && (
              <div className="alert alert-success">
                {success.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {/* Tipo de anuncio - Solo oferta para MVP */}
              <div className="form-group">
                <label className="form-label">
                  {t('ad_types.offer')}
                </label>
                <p>{t('ad_types.offer_description')}</p>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="country_from" className="form-label">
                    País de Origen *
                  </label>
                  <select
                    id="country_from"
                    name="country_from"
                    className="form-select"
                    value={formData.country_from}
                    onChange={handleChange}
                    required
                  >
                    <option value="">{t('common.select')}</option>
                    {EUROPE_COUNTRIES.map(country => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="country_to" className="form-label">
                    País de Destino *
                  </label>
                  <select
                    id="country_to"
                    name="country_to"
                    className="form-select"
                    value={formData.country_to}
                    onChange={handleChange}
                    required
                  >
                    <option value="">{t('common.select')}</option>
                    {EUROPE_COUNTRIES.map(country => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="route_from" className="form-label">
                  Ciudad de Origen *
                </label>
                <input
                  type="text"
                  id="route_from"
                  name="route_from"
                  className="form-input"
                  value={formData.route_from}
                  onChange={handleChange}
                  placeholder="Madrid, Barcelona, etc."
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="route_to" className="form-label">
                  Ciudad de Destino *
                </label>
                <input
                  type="text"
                  id="route_to"
                  name="route_to"
                  className="form-input"
                  value={formData.route_to}
                  onChange={handleChange}
                  placeholder="París, Roma, etc."
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="start_date" className="form-label">
                    {t('ad_form.start_date')} *
                  </label>
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    className="form-input"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="end_date" className="form-label">
                    {t('ad_form.end_date')}
                  </label>
                  <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    className="form-input"
                    value={formData.end_date}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="start_time" className="form-label">
                    {t('ad_form.start_time')}
                  </label>
                  <input
                    type="time"
                    id="start_time"
                    name="start_time"
                    className="form-input"
                    value={formData.start_time}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="end_time" className="form-label">
                    {t('ad_form.end_time')}
                  </label>
                  <input
                    type="time"
                    id="end_time"
                    name="end_time"
                    className="form-input"
                    value={formData.end_time}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="price" className="form-label">
                  Precio, impuestos y otros gastos incluidos *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  className="form-input"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
                <small className="text-muted">
                  {t('commissions.explanation')}
                </small>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="bus_age" className="form-label">
                    {t('ad_form.bus_age')}
                  </label>
                  <input
                    type="number"
                    id="bus_age"
                    name="bus_age"
                    className="form-input"
                    value={formData.bus_age}
                    onChange={handleChange}
                    min="0"
                    defaultValue="0"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="seats" className="form-label">
                    {t('ad_form.seats')}
                  </label>
                  <input
                    type="number"
                    id="seats"
                    name="seats"
                    className="form-input"
                    value={formData.seats}
                    onChange={handleChange}
                    min="1"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="observations" className="form-label">
                  {t('ad_form.observations')}
                </label>
                <textarea
                  id="observations"
                  name="observations"
                  className="form-input"
                  rows="4"
                  value={formData.observations}
                  onChange={handleChange}
                  placeholder="Indique aquí características especiales del trayecto, equipamiento del bus, etc. No incluya información de contacto, nombres de empresas o emails. Todo está sujeto a moderación por parte del equipo de Travabus."
                ></textarea>
                <small className="text-muted">
                  No incluya información de contacto, nombres de empresas, teléfonos ni emails. Todo está sujeto a moderación por parte del equipo de Travabus.
                </small>
              </div>
              
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? t('common.loading') : t('common.publish')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Publish;