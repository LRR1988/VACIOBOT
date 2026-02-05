import React, { useState, useEffect } from 'react';
import { getUserRatings, getUserAverageRating, createRating } from '../utils/database';

const RatingComponent = ({ userId, forCompanyId = null }) => {
  const [averageRating, setAverageRating] = useState(0);
  const [userRatings, setUserRatings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRatings();
  }, [userId]);

  const loadRatings = async () => {
    setLoading(true);
    try {
      // Obtener promedio de calificaciones
      const avgResponse = await getUserAverageRating(userId);
      if (!avgResponse.error) {
        setAverageRating(avgResponse.data);
      }

      // Obtener todas las calificaciones
      const ratingsResponse = await getUserRatings(userId);
      if (!ratingsResponse.error) {
        setUserRatings(ratingsResponse.data);
      }
    } catch (error) {
      console.error('Error loading ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    
    if (!ratingValue) {
      alert('Por favor selecciona una calificación');
      return;
    }

    // Obtener el ID del usuario actual desde localStorage
    const currentUserToken = localStorage.getItem('token');
    if (!currentUserToken) {
      alert('Debes estar autenticado para dejar una calificación');
      return;
    }

    try {
      const ratingData = {
        from_user_id: currentUserToken,
        to_user_id: userId,
        score: ratingValue,
        comment: comment,
        ad_id: forCompanyId // ID del anuncio relacionado (opcional)
      };

      const response = await createRating(ratingData);
      if (!response.error) {
        alert('Calificación guardada exitosamente');
        setShowForm(false);
        setRatingValue(0);
        setComment('');
        loadRatings(); // Recargar las calificaciones
      } else {
        alert('Error al guardar la calificación: ' + response.error.message);
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Error al guardar la calificación');
    }
  };

  // Función para renderizar estrellas
  const renderStars = (score) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i} 
          className={`star ${i <= score ? 'filled' : ''}`}
          style={{ color: i <= score ? '#ffc107' : '#ddd', cursor: 'default' }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return <div>Cargando calificaciones...</div>;
  }

  return (
    <div className="rating-component">
      <div className="rating-summary">
        <div className="average-rating">
          <strong>Calificación Promedio:</strong> {averageRating.toFixed(2)}/5
        </div>
        <div className="stars">
          {renderStars(Math.round(averageRating))}
        </div>
        <div className="total-ratings">
          Basado en {userRatings.length} calificación(es)
        </div>
      </div>

      <button 
        className="btn btn-secondary" 
        onClick={() => setShowForm(!showForm)}
        style={{ marginTop: '10px' }}
      >
        {showForm ? 'Cancelar' : 'Dejar Calificación'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmitRating} className="rating-form" style={{ marginTop: '15px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <div style={{ marginBottom: '10px' }}>
            <strong>Calificación:</strong>
            <div>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingValue(star)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    color: star <= ratingValue ? '#ffc107' : '#ddd',
                    cursor: 'pointer'
                  }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="comment"><strong>Comentario:</strong></label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Comparte tu experiencia (anónima)"
              rows="3"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={!ratingValue}
          >
            Enviar Calificación
          </button>
        </form>
      )}

      {userRatings.length > 0 && (
        <div className="ratings-list" style={{ marginTop: '20px' }}>
          <h4>Calificaciones Recientes:</h4>
          {userRatings.slice(0, 5).map((rating) => (
            <div key={rating.id} className="rating-item" style={{ 
              padding: '10px', 
              borderBottom: '1px solid #eee',
              marginBottom: '10px'
            }}>
              <div>
                {renderStars(rating.score)} ({rating.score}/5)
              </div>
              {rating.comment && (
                <div style={{ marginTop: '5px', fontStyle: 'italic' }}>
                  "{rating.comment}"
                </div>
              )}
              <div style={{ fontSize: '0.8em', color: '#666', marginTop: '5px' }}>
                {new Date(rating.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RatingComponent;