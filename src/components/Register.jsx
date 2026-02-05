import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
<<<<<<< HEAD
import { signUp } from '../utils/database';
=======
import { signUp } from '../utils/supabaseClient';
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.password_mismatch'));
      setLoading(false);
      return;
    }

    try {
<<<<<<< HEAD
      // Preparar los datos del usuario para enviar a la función signUp
      const userData = {
        username: formData.username,
        password: formData.password
      };
      
      const { user, error } = await signUp(userData);
=======
      const { user, error } = await signUp(formData.username, formData.password);
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
      if (error) {
        setError(error.message);
      } else {
        // Redirect to login or dashboard
        navigate('/login');
      }
    } catch (err) {
      setError(err.message || 'Ha ocurrido un error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">{t('auth.create_account')}</h2>
            </div>
            
            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  {t('auth.username')}
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-input"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  {t('auth.password')}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-input"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  {t('auth.confirm_password')}
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-input"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? t('common.loading') : t('auth.create_account')}
              </button>
            </form>
            
            <div className="mt-3 text-center">
              <p>
                {t('auth.already_have_account')}{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="btn btn-link"
                >
                  {t('auth.sign_in')}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;