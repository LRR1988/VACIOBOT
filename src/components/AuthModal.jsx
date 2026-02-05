import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
<<<<<<< HEAD
import { signIn, signUp } from '../utils/database';
=======
import { signIn, signUp } from '../utils/supabaseClient';
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85

const AuthModal = ({ onClose, onLogin }) => {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
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

    try {
      if (isLogin) {
        // Login
        const { user, error } = await signIn(formData.username, formData.password);
        if (error) {
          setError(error.message || t('auth.invalid_credentials'));
        } else {
          onLogin(user);
          onClose();
        }
      } else {
        // Registration
        if (formData.password !== formData.confirmPassword) {
          setError(t('auth.password_mismatch'));
          return;
        }

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
          onLogin(user);
          onClose();
        }
      }
    } catch (err) {
      setError(err.message || 'Ha ocurrido un error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              {isLogin ? t('auth.sign_in') : t('auth.create_account')}
            </h2>
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
            
            {!isLogin && (
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
            )}
            
            <div className="d-flex justify-between mt-3">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? t('auth.no_account') : t('auth.already_have_account')}
              </button>
              
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? t('common.loading') : (isLogin ? t('auth.sign_in') : t('auth.create_account'))}
              </button>
            </div>
          </form>
          
          <button
            onClick={onClose}
            className="btn btn-outline w-100 mt-3"
          >
            {t('common.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;