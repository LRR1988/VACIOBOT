import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
<<<<<<< HEAD
import { createAd } from '../utils/database';
=======
import { createAd } from '../utils/supabaseClient';
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
import { calculateCommission } from '../utils/helpers';
import { EUROPE_COUNTRIES } from '../utils/constants';

const Publish = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ad_type: 'offer', // Solo oferta para MVP
    route_from: '',
    route_to: '',
<<<<<<< HEAD
    country_from: '', // País de origen
    country_to: '', // País de destino
=======
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    price: '',
<<<<<<< HEAD
    bus_age: '',
    seats: '',
    observations: '',
=======
    expenses_by: '',
    bus_count: '',
    bus_age: '',
    seats: '',
    observations: '',
    circuit: false
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
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
<<<<<<< HEAD
    if (!formData.route_from || !formData.route_to || !formData.country_from || !formData.country_to || !formData.start_date || !formData.price) {
=======
    if (!formData.route_from || !formData.route_to || !formData.start_date || !formData.price) {
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
      setError(t('ad_form.required_field'));
      setLoading(false);
      return;
    }

    try {
      const adData = {
        ...formData,
        price: parseFloat(formData.price),
<<<<<<< HEAD
        bus_count: 1, // Siempre 1 bus
        bus_age: parseInt(formData.bus_age) || 0,
        seats: parseInt(formData.seats) || 0,
        country: formData.country_from // País principal para filtrado
=======
        bus_count: parseInt(formData.bus_count) || 1,
        bus_age: parseInt(formData.bus_age) || 0,
        seats: parseInt(formData.seats) || 0
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
      };

      const { data, error } = await createAd(adData);
      if (error) {
        setError(error.message);
      } else {
<<<<<<< HEAD
        // Anuncio creado exitosamente sin necesidad de pagar comisión inicial
        setSuccess(`${t('common.success')}: ${t('ad_form.title')}.\nAnuncio creado exitosamente. La comisión se aplicará cuando otro usuario contrate su servicio.`);
        
        // Redirigir al dashboard inmediatamente después de un breve delay para mostrar el mensaje
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000); // Reducido el tiempo para una experiencia más rápida
=======
        // Calcular comisión
        const commission = calculateCommission(parseFloat(formData.price));
        
        // Mostrar información de pago y comisión
        setSuccess(
          `${t('common.success')}: ${t('ad_form.title')}.\n` +
          `Comisión aplicada: ${commission.toFixed(2)}€ (${t('commissions.explanation')}).\n` +
          `Por favor, realice el pago de la comisión para completar el proceso.`
        );
        
        // Mostrar información de pago
        setShowPaymentInfo(true);
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
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
              
<<<<<<< HEAD
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
=======
              <div className="form-group">
                <label htmlFor="route_from" className="form-label">
                  {t('ad_form.route_from')} *
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
                </label>
                <input
                  type="text"
                  id="route_from"
                  name="route_from"
                  className="form-input"
                  value={formData.route_from}
                  onChange={handleChange}
<<<<<<< HEAD
                  placeholder="Madrid, Barcelona, etc."
=======
                  placeholder={t('ad_form.route_from')}
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="route_to" className="form-label">
<<<<<<< HEAD
                  Ciudad de Destino *
=======
                  {t('ad_form.route_to')} *
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
                </label>
                <input
                  type="text"
                  id="route_to"
                  name="route_to"
                  className="form-input"
                  value={formData.route_to}
                  onChange={handleChange}
<<<<<<< HEAD
                  placeholder="París, Roma, etc."
=======
                  placeholder={t('ad_form.route_to')}
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
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
<<<<<<< HEAD
                  Precio, impuestos y otros gastos incluidos *
=======
                  {t('ad_form.price')} *
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
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
              
<<<<<<< HEAD
              <div className="form-row">
                <div className="form-group">
=======
              <div className="form-group">
                <label htmlFor="expenses_by" className="form-label">
                  {t('ad_form.expenses_by')}
                </label>
                <select
                  id="expenses_by"
                  name="expenses_by"
                  className="form-select"
                  value={formData.expenses_by}
                  onChange={handleChange}
                >
                  <option value="">{t('common.select')}</option>
                  <option value="sender">{t('ad_form.sender')}</option>
                  <option value="receiver">{t('ad_form.receiver')}</option>
                  <option value="shared">{t('ad_form.shared')}</option>
                </select>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="bus_count" className="form-label">
                    {t('ad_form.bus_count')}
                  </label>
                  <input
                    type="number"
                    id="bus_count"
                    name="bus_count"
                    className="form-input"
                    value={formData.bus_count}
                    onChange={handleChange}
                    min="1"
                    defaultValue="1"
                  />
                </div>
                
                <div className="form-group">
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
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
<<<<<<< HEAD
                  placeholder="Indique aquí características especiales del trayecto, equipamiento del bus, etc. No incluya información de contacto, nombres de empresas o emails. Todo está sujeto a moderación por parte del equipo de Travabus."
                ></textarea>
                <small className="text-muted">
                  No incluya información de contacto, nombres de empresas, teléfonos ni emails. Todo está sujeto a moderación por parte del equipo de Travabus.
                </small>
=======
                  placeholder={t('ad_form.observations')}
                ></textarea>
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  <input
                    type="checkbox"
                    name="circuit"
                    checked={formData.circuit}
                    onChange={handleChange}
                  />{' '}
                  {t('ad_form.circuit')}
                </label>
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
              </div>
              
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? t('common.loading') : t('common.publish')}
              </button>
            </form>
<<<<<<< HEAD
=======
            
            {showPaymentInfo && (
              <div className="card mt-4">
                <div className="card-header">
                  <h3 className="card-title">Pago de Comisión</h3>
                </div>
                <div className="card-body">
                  <p>Debe pagar la comisión para completar su anuncio.</p>
                  <p>Comisión: <strong>{calculateCommission(parseFloat(formData.price)).toFixed(2)}€</strong></p>
                  <p>La comisión se calcula como el 5% del precio del anuncio con un mínimo de 25€.</p>
                  
                  <button
                    onClick={handlePaymentComplete}
                    className="btn btn-success w-100"
                  >
                    Procesar Pago con Stripe
                  </button>
                </div>
              </div>
            )}
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
          </div>
        </div>
      </div>
    </div>
  );
};

export default Publish;