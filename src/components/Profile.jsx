import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserProfile } from '../utils/database';

const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    tax_data: '',
    bank_account: '',
    bic_swift: '',
    ownership_certificate: null,
    company_id: '',
    company_name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const userId = localStorage.getItem('token');
      if (!userId) return;

      const { data, error } = await getUserProfile(userId);
      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setUserData({
          tax_data: data.tax_data || '',
          bank_account: data.bank_account || '',
          bic_swift: data.bic_swift || '',
          ownership_certificate: data.ownership_certificate || null,
          company_id: data.company_id || '',
          company_name: data.company_name || '',
          email: data.email || '',
          phone: data.phone || ''
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUserData(prev => ({
      ...prev,
      ownership_certificate: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const userId = localStorage.getItem('token');
      if (!userId) return;

      // Preparar datos para actualizar
      const profileData = { ...userData };
      
      // Eliminar el archivo del objeto para enviarlo por separado
      delete profileData.ownership_certificate;

      const { data, error } = await updateUserProfile(userId, profileData);
      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({ type: 'success', text: t('common.success') + ': ' + t('profile.title') });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
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
      <div className="row justify-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">{t('profile.title')}</h2>
            </div>
            
            {message && (
              <div className={`alert alert-${message.type}`}>
                {message.text}
              </div>
            )}
            
            <div className="card-body">
              <div className="profile-nav">
                <button type="button" className="nav-link" onClick={() => navigate('/dashboard')}>{t('common.dashboard')}</button>
                <button type="button" className="nav-link" onClick={() => navigate('/payments')}>{t('navigation.payments')}</button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="company_name" className="form-label">
                  {t('profile.account_type')}
                </label>
                <input
                  type="text"
                  id="company_name"
                  name="company_name"
                  className="form-input"
                  value={userData.company_name}
                  onChange={handleChange}
                  placeholder={t('profile.account_type')}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="tax_data" className="form-label">
                  {t('profile.tax_data')}
                </label>
                <input
                  type="text"
                  id="tax_data"
                  name="tax_data"
                  className="form-input"
                  value={userData.tax_data}
                  onChange={handleChange}
                  placeholder={t('profile.tax_data')}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="bank_account" className="form-label">
                  {t('profile.bank_account')}
                </label>
                <input
                  type="text"
                  id="bank_account"
                  name="bank_account"
                  className="form-input"
                  value={userData.bank_account}
                  onChange={handleChange}
                  placeholder={t('profile.bank_account')}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="bic_swift" className="form-label">
                  {t('profile.bic_swift')}
                </label>
                <input
                  type="text"
                  id="bic_swift"
                  name="bic_swift"
                  className="form-input"
                  value={userData.bic_swift}
                  onChange={handleChange}
                  placeholder={t('profile.bic_swift')}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="company_id" className="form-label">
                  {t('profile.company_id')}
                </label>
                <input
                  type="text"
                  id="company_id"
                  name="company_id"
                  className="form-input"
                  value={userData.company_id}
                  onChange={handleChange}
                  placeholder={t('profile.company_id')}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  {t('profile.upload_documents')}
                </label>
                <div className="mb-2">
                  <input
                    type="file"
                    name="ownership_certificate"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </div>
                <small className="text-muted">
                  {t('profile.ownership_certificate')}
                </small>
              </div>
              
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={saving}
              >
                {saving ? t('common.loading') : t('common.save')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;