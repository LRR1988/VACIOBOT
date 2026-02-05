import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { updateAd } from '../utils/database';
import { EUROPE_COUNTRIES } from '../utils/constants';

const EditAdModal = ({ ad, isOpen, onClose, onSave }) => {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    ad_type: 'offer',
    route_from: '',
    route_to: '',
    country_from: '',
    country_to: '',
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    bus_age: '',
    seats: '',
    observations: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');

  useEffect(() => {
    if (ad && isOpen) {
      setOriginalPrice(ad.price);
      setFormData({
        ad_type: ad.ad_type || 'offer',
        route_from: ad.route_from || '',
        route_to: ad.route_to || '',
        country_from: ad.country_from || ad.country || '',
        country_to: ad.country_to || ad.country || '',
        start_date: ad.start_date || '',
        end_date: ad.end_date || '',
        start_time: ad.start_time || '',
        end_time: ad.end_time || '',
        bus_age: ad.bus_age || '',
        seats: ad.seats || '',
        observations: ad.observations || '',
      });
    }
  }, [ad, isOpen]);

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

    // Validación básica
    if (!formData.route_from || !formData.route_to || !formData.country_from || !formData.country_to || !formData.start_date) {
      setError(t('ad_form.required_field'));
      setLoading(false);
      return;
    }

    try {
      // Preparar datos para actualizar (sin el precio)
      const adData = {
        ...formData,
        bus_age: parseInt(formData.bus_age) || 0,
        seats: parseInt(formData.seats) || 0,
        country: formData.country_from
      };

      const updatedAd = await updateAd(ad.id, adData);
      onSave(updatedAd);
      onClose();
    } catch (err) {
      setError(err.message || 'Ha ocurrido un error al actualizar el anuncio');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  if (!isOpen || !ad) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Editar Anuncio</h3>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>
        
        <div className="modal-body">
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}
          
          <div className="alert alert-info">
            <strong>Información Importante:</strong> El precio del anuncio no se puede modificar después de crearlo. 
            Si necesita cambiar el precio, debe eliminar este anuncio y crear uno nuevo.
            <br/><br/>
            <strong>Precio original:</strong> {originalPrice}€
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="country_from_modal" className="form-label">
                  País de Origen *
                </label>
                <select
                  id="country_from_modal"
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
                <label htmlFor="country_to_modal" className="form-label">
                  País de Destino *
                </label>
                <select
                  id="country_to_modal"
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
              <label htmlFor="route_from_modal" className="form-label">
                Ciudad de Origen *
              </label>
              <input
                type="text"
                id="route_from_modal"
                name="route_from"
                className="form-input"
                value={formData.route_from}
                onChange={handleChange}
                placeholder="Madrid, Barcelona, etc."
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="route_to_modal" className="form-label">
                Ciudad de Destino *
              </label>
              <input
                type="text"
                id="route_to_modal"
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
                <label htmlFor="start_date_modal" className="form-label">
                  {t('ad_form.start_date')} *
                </label>
                <input
                  type="date"
                  id="start_date_modal"
                  name="start_date"
                  className="form-input"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="end_date_modal" className="form-label">
                  {t('ad_form.end_date')}
                </label>
                <input
                  type="date"
                  id="end_date_modal"
                  name="end_date"
                  className="form-input"
                  value={formData.end_date}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="start_time_modal" className="form-label">
                  {t('ad_form.start_time')}
                </label>
                <input
                  type="time"
                  id="start_time_modal"
                  name="start_time"
                  className="form-input"
                  value={formData.start_time}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="end_time_modal" className="form-label">
                  {t('ad_form.end_time')}
                </label>
                <input
                  type="time"
                  id="end_time_modal"
                  name="end_time"
                  className="form-input"
                  value={formData.end_time}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bus_age_modal" className="form-label">
                  {t('ad_form.bus_age')}
                </label>
                <input
                  type="number"
                  id="bus_age_modal"
                  name="bus_age"
                  className="form-input"
                  value={formData.bus_age}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="seats_modal" className="form-label">
                  {t('ad_form.seats')}
                </label>
                <input
                  type="number"
                  id="seats_modal"
                  name="seats"
                  className="form-input"
                  value={formData.seats}
                  onChange={handleChange}
                  min="1"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="observations_modal" className="form-label">
                {t('ad_form.observations')}
              </label>
              <textarea
                id="observations_modal"
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
            
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleClose}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? t('common.loading') : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAdModal;