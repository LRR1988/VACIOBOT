import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../utils/database';
import { calculateCommission } from '../utils/helpers';

const StripeIntegration = () => {
  const { t } = useTranslation();
  const [stripeConfigured, setStripeConfigured] = useState(false);
  const [amount, setAmount] = useState('');
  const [commission, setCommission] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Verificar si ya hay configuración de Stripe
  useEffect(() => {
    const stripeKey = localStorage.getItem('stripe_publishable_key');
    if (stripeKey) {
      setStripeConfigured(true);
    }
  }, []);

  const handleCalculateCommission = () => {
    if (amount && !isNaN(amount)) {
      const calculated = calculateCommission(parseFloat(amount));
      setCommission(calculated);
    }
  };

  useEffect(() => {
    handleCalculateCommission();
  }, [amount]);

  const handleConfigureStripe = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const publishableKey = formData.get('publishableKey');
    const secretKey = formData.get('secretKey');

    // Guardar las claves de Stripe (en un entorno real, las claves secretas deben permanecer en el backend)
    localStorage.setItem('stripe_publishable_key', publishableKey);

    setStripeConfigured(true);
    setMessage({
      type: 'success',
      text: 'Stripe configurado correctamente'
    });

    // Reset form
    e.target.reset();
  };

  const handlePayment = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setMessage({
        type: 'error',
        text: 'Por favor, introduce un monto válido'
      });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // En una implementación real, aquí se integraría con la API de Stripe
      // Por ahora, simulamos la creación de una transacción
      
      const userId = localStorage.getItem('token');
      if (!userId) {
        throw new Error('Usuario no autenticado');
      }

      const transactionData = {
        user_id: userId,
        amount: parseFloat(amount),
        commission: commission,
        type: 'platform_fee', // tipo de transacción
        status: 'pending',
        description: `Comisión por publicación de anuncio`,
        created_at: new Date().toISOString()
      };

      // Guardar transacción en la base de datos local
      const transaction = db.createTransaction(transactionData);

      if (transaction) {
        setMessage({
          type: 'success',
          text: `Transacción registrada. Comisión de ${commission.toFixed(2)}€ calculada.`
        });
        
        // Aquí es donde normalmente se redirigiría al flujo de pago de Stripe
        // En una implementación completa, se usaría el SDK de Stripe
      } else {
        throw new Error('No se pudo registrar la transacción');
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: `Error en el pago: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stripe-integration">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">{t('commissions.title')}</h3>
        </div>
        <div className="card-body">
          {!stripeConfigured ? (
            <form onSubmit={handleConfigureStripe}>
              <div className="form-group">
                <label htmlFor="publishableKey" className="form-label">
                  Stripe Publishable Key
                </label>
                <input
                  type="password"
                  id="publishableKey"
                  name="publishableKey"
                  className="form-input"
<<<<<<< HEAD
                  placeholder="pk_..."
=======
                  placeholder="pk_..."
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="secretKey" className="form-label">
                  Stripe Secret Key
                </label>
                <input
                  type="password"
                  id="secretKey"
                  name="secretKey"
                  className="form-input"
<<<<<<< HEAD
                  placeholder="sk_..."
=======
                  placeholder="your_stripe_secret_key"
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Configurar Stripe
              </button>
            </form>
          ) : (
            <div>
              <div className="form-group">
                <label htmlFor="amount" className="form-label">
                  Monto de la transacción (€)
                </label>
                <input
                  type="number"
                  id="amount"
                  className="form-input"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Introduce el monto"
                  step="0.01"
                  min="0"
                />
              </div>
              
              <div className="card mb-3">
                <div className="card-body">
                  <p><strong>Monto base:</strong> {parseFloat(amount || 0).toFixed(2)}€</p>
                  <p><strong>Comisión (5%, min 25€):</strong> {commission.toFixed(2)}€</p>
                  <p><strong>Total con comisión:</strong> {(parseFloat(amount || 0) + commission).toFixed(2)}€</p>
                </div>
              </div>
              
              <button
                onClick={handlePayment}
                className="btn btn-primary w-100"
                disabled={loading || !amount}
              >
                {loading ? 'Procesando...' : 'Procesar Pago con Stripe'}
              </button>
            </div>
          )}
          
          {message.text && (
            <div className={`alert alert-${message.type} mt-3`}>
              {message.text}
            </div>
          )}
        </div>
      </div>
      
      <div className="card mt-4">
        <div className="card-header">
          <h3 className="card-title">Información de Comisiones</h3>
        </div>
        <div className="card-body">
          <p>{t('commissions.explanation')}</p>
          <p><strong>{t('commissions.charged_to')}</strong></p>
          <ul>
            <li>{t('commissions.minimum_fee')}</li>
            <li>{t('commissions.percentage_fee')}</li>
          </ul>
          <p>La comisión se cobra al usuario que recibe el dinero por el servicio.</p>
        </div>
      </div>
    </div>
  );
};

export default StripeIntegration;