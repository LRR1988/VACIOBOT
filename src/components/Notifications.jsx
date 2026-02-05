import React, { useState, useEffect } from 'react';
import { getUserNotifications, markNotificationAsRead, createNotification } from '../utils/database';

const Notifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
    
    // Actualizar periódicamente (cada 30 segundos)
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  const loadNotifications = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const response = await getUserNotifications(userId);
      if (!response.error) {
        setNotifications(response.data);
        const unread = response.data.filter(n => !n.read).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await markNotificationAsRead(notificationId);
      if (!response.error) {
        loadNotifications(); // Recargar notificaciones
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = () => {
    notifications.forEach(notification => {
      if (!notification.read) {
        markAsRead(notification.id);
      }
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return <div>Cargando notificaciones...</div>;
  }

  return (
    <div className="notifications-panel">
      <div className="notifications-header">
        <h3>
          Notificaciones 
          {unreadCount > 0 && (
            <span className="unread-count" style={{ 
              backgroundColor: '#dc3545', 
              color: 'white', 
              borderRadius: '50%', 
              padding: '2px 6px', 
              marginLeft: '8px',
              fontSize: '0.8em'
            }}>
              {unreadCount}
            </span>
          )}
        </h3>
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="btn btn-sm btn-outline-secondary"
            style={{ fontSize: '0.9em', padding: '2px 8px' }}
          >
            Marcar todas como leídas
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="no-notifications">
          No tienes notificaciones
        </div>
      ) : (
        <div className="notifications-list">
          {notifications
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .map((notification) => (
              <div 
                key={notification.id} 
                className={`notification-item ${!notification.read ? 'unread' : 'read'}`}
                style={{ 
                  padding: '12px', 
                  borderBottom: '1px solid #eee',
                  backgroundColor: !notification.read ? '#f8f9fa' : 'white',
                  borderLeft: !notification.read ? '3px solid #007bff' : '3px solid #eee'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <strong>{notification.type}</strong>
                    <p style={{ margin: '5px 0', lineHeight: '1.4' }}>
                      {notification.message}
                    </p>
                  </div>
                  {!notification.read && (
                    <button 
                      onClick={() => markAsRead(notification.id)}
                      className="btn btn-sm btn-outline-primary"
                      style={{ fontSize: '0.8em', padding: '2px 6px' }}
                    >
                      Marcar como leída
                    </button>
                  )}
                </div>
                <small style={{ color: '#666' }}>
                  {formatDate(notification.created_at)}
                </small>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
};

export default Notifications;