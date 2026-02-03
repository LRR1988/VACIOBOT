import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { signIn } from '../utils/supabaseClient';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
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

    try {
      const { user, error } = await signIn(formData.username, formData.password);
      if (error) {
        setError(error.message || t('auth.invalid_credentials'));
      } else {
        // Redirect to dashboard or previous page
        navigate('/dashboard');
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
              <h2 className="card-title">{t('auth.sign_in')}</h2>
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
              
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? t('common.loading') : t('auth.sign_in')}
              </button>
            </form>
            
            <div className="mt-3 text-center">
              <p>
                {t('auth.no_account')}{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="btn btn-link"
                >
                  {t('auth.create_account')}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;