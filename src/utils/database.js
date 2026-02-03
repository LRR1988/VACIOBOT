// Configuración de base de datos local SQLite para Travabus
// Esta implementación usa IndexedDB simulado como almacenamiento local para navegador
// En una implementación completa usaríamos SQLite con node-sqlite3 en el backend

class Database {
  constructor() {
    this.db = null;
    this.init();
  }

  init() {
    // Inicializar estructura de base de datos en IndexedDB/localStorage
    this.ensureTables();
  }

  ensureTables() {
    // Asegurar que las tablas existen
    const defaultData = {
      users: [],
      ads: [],
      ad_followers: [],
      ad_interests: [],
      notifications: [],
      transactions: [] // Para integración con Stripe
    };

    // Inicializar datos si no existen
    Object.keys(defaultData).forEach(table => {
      if (!localStorage.getItem(table)) {
        localStorage.setItem(table, JSON.stringify(defaultData[table]));
      }
    });
  }

  // Operaciones CRUD genéricas
  getAll(table) {
    try {
      const data = localStorage.getItem(table);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error getting ${table}:`, error);
      return [];
    }
  }

  getById(table, id) {
    const items = this.getAll(table);
    return items.find(item => item.id === id);
  }

  insert(table, data) {
    try {
      const items = this.getAll(table);
      const newItem = {
        ...data,
        id: this.generateId(),
        created_at: new Date().toISOString()
      };
      items.push(newItem);
      localStorage.setItem(table, JSON.stringify(items));
      return newItem;
    } catch (error) {
      console.error(`Error inserting into ${table}:`, error);
      return null;
    }
  }

  update(table, id, data) {
    try {
      const items = this.getAll(table);
      const index = items.findIndex(item => item.id === id);
      if (index !== -1) {
        items[index] = { ...items[index], ...data, updated_at: new Date().toISOString() };
        localStorage.setItem(table, JSON.stringify(items));
        return items[index];
      }
      return null;
    } catch (error) {
      console.error(`Error updating ${table}:`, error);
      return null;
    }
  }

  delete(table, id) {
    try {
      const items = this.getAll(table);
      const filteredItems = items.filter(item => item.id !== id);
      localStorage.setItem(table, JSON.stringify(filteredItems));
      return true;
    } catch (error) {
      console.error(`Error deleting from ${table}:`, error);
      return false;
    }
  }

  // Métodos específicos para la aplicación Travabus
  getUserByUsername(username) {
    const users = this.getAll('users');
    return users.find(user => user.username === username);
  }

  getUserById(id) {
    return this.getById('users', id);
  }

  createUser(userData) {
    // Verificar si el usuario ya existe
    const existingUser = this.getUserByUsername(userData.username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    return this.insert('users', {
      ...userData,
      role: userData.role || 'user',
      created_at: new Date().toISOString()
    });
  }

  authenticateUser(username, password) {
    const user = this.getUserByUsername(username);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  getAds(filters = {}) {
    let ads = this.getAll('ads');
    
    // Aplicar filtros
    if (filters.adType) {
      ads = ads.filter(ad => ad.ad_type === filters.adType);
    }
    
    if (filters.routeFrom) {
      ads = ads.filter(ad => 
        ad.route_from.toLowerCase().includes(filters.routeFrom.toLowerCase())
      );
    }
    
    if (filters.routeTo) {
      ads = ads.filter(ad => 
        ad.route_to.toLowerCase().includes(filters.routeTo.toLowerCase())
      );
    }
    
    if (filters.country) {
      ads = ads.filter(ad => ad.country === filters.country);
    }

    // Filtrar por estado activo
    ads = ads.filter(ad => ad.status === 'active');

    // Ordenar por fecha de creación (más recientes primero)
    ads.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return ads;
  }

  createAd(adData) {
    return this.insert('ads', adData);
  }

  getUserAds(userId) {
    const ads = this.getAll('ads');
    return ads.filter(ad => ad.user_id === userId);
  }

  followAd(userId, adId) {
    const existingFollow = this.getAll('ad_followers').find(f => 
      f.user_id === userId && f.ad_id === adId
    );
    
    if (existingFollow) {
      return existingFollow; // Ya existe el seguimiento
    }
    
    return this.insert('ad_followers', { user_id: userId, ad_id: adId });
  }

  unfollowAd(userId, adId) {
    const followers = this.getAll('ad_followers');
    const filteredFollowers = followers.filter(f => 
      !(f.user_id === userId && f.ad_id === adId)
    );
    localStorage.setItem('ad_followers', JSON.stringify(filteredFollowers));
    return true;
  }

  expressInterest(userId, adId, message = '') {
    return this.insert('ad_interests', { 
      user_id: userId, 
      ad_id: adId, 
      message,
      status: 'pending'
    });
  }

  getAdFollowers(adId) {
    const followers = this.getAll('ad_followers');
    return followers.filter(f => f.ad_id === adId);
  }

  getAdInterests(adId) {
    const interests = this.getAll('ad_interests');
    return interests.filter(i => i.ad_id === adId);
  }

  createNotification(notificationData) {
    return this.insert('notifications', {
      ...notificationData,
      read: false
    });
  }

  getUserNotifications(userId) {
    const notifications = this.getAll('notifications');
    return notifications.filter(n => n.user_id === userId);
  }

  markNotificationAsRead(notificationId) {
    return this.update('notifications', notificationId, { read: true });
  }

  // Método para generar IDs únicos
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  // Métodos para integración con Stripe (almacenamiento de transacciones)
  createTransaction(transactionData) {
    return this.insert('transactions', transactionData);
  }

  getUserTransactions(userId) {
    const transactions = this.getAll('transactions');
    return transactions.filter(t => t.user_id === userId);
  }
}

// Instancia global de la base de datos
export const db = new Database();

// Funciones de utilidad para autenticación
export const signIn = async (username, password) => {
  try {
    const user = db.authenticateUser(username, password);
    if (user) {
      // Guardar token de sesión
      localStorage.setItem('token', user.id);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { user, error: null };
    } else {
      return { user: null, error: { message: 'Credenciales inválidas' } };
    }
  } catch (error) {
    return { user: null, error };
  }
};

export const signUp = async (username, password) => {
  try {
    const user = db.createUser({ 
      username, 
      password, 
      role: 'user',
      created_at: new Date().toISOString()
    });
    
    if (user) {
      // Guardar token de sesión
      localStorage.setItem('token', user.id);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { user, error: null };
    } else {
      return { user: null, error: { message: 'Error al crear el usuario' } };
    }
  } catch (error) {
    return { user: null, error };
  }
};

// Funciones para manejar anuncios
export const getAds = async (filters = {}) => {
  try {
    const ads = db.getAds(filters);
    // Agregar información del usuario a los anuncios
    const adsWithUserInfo = ads.map(ad => {
      const user = db.getUserById(ad.user_id);
      return {
        ...ad,
        user: user ? { username: user.username, company_name: user.company_name } : null
      };
    });
    return { data: adsWithUserInfo, error: null };
  } catch (error) {
    return { data: [], error };
  }
};

export const createAd = async (adData) => {
  try {
    const userId = localStorage.getItem('token');
    if (!userId) {
      throw new Error('Usuario no autenticado');
    }

    const ad = db.createAd({
      ...adData,
      user_id: userId,
      status: 'active',
      created_at: new Date().toISOString()
    });

    return { data: ad, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getUserAds = async (userId) => {
  try {
    const ads = db.getUserAds(userId);
    return { data: ads, error: null };
  } catch (error) {
    return { data: [], error };
  }
};

export const updateUserProfile = async (userId, profileData) => {
  try {
    const user = db.update('users', userId, profileData);
    if (user) {
      // Actualizar el usuario en localStorage si es el usuario actual
      const currentUserId = localStorage.getItem('token');
      if (currentUserId === userId) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
      return { data: user, error: null };
    }
    return { data: null, error: { message: 'Usuario no encontrado' } };
  } catch (error) {
    return { data: null, error };
  }
};

export const getUserProfile = async (userId) => {
  try {
    const user = db.getUserById(userId);
    return { data: user, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Funciones para seguir anuncios
export const followAd = async (userId, adId) => {
  try {
    const result = db.followAd(userId, adId);
    if (result) {
      return { error: null };
    }
    return { error: { message: 'Error al seguir el anuncio' } };
  } catch (error) {
    return { error };
  }
};

export const unfollowAd = async (userId, adId) => {
  try {
    const success = db.unfollowAd(userId, adId);
    if (success) {
      return { error: null };
    }
    return { error: { message: 'Error al dejar de seguir el anuncio' } };
  } catch (error) {
    return { error };
  }
};

// Función para marcar interés en un anuncio
export const expressInterest = async (userId, adId, message = '') => {
  try {
    const result = db.expressInterest(userId, adId, message);
    if (result) {
      // Crear notificación para el dueño del anuncio
      const adOwner = db.getById('ads', adId)?.user_id;
      if (adOwner) {
        db.createNotification({
          user_id: adOwner,
          type: 'new_interest',
          message: `Nuevo interés en tu anuncio ${adId}`,
          related_id: result.id
        });
      }
      return { error: null };
    }
    return { error: { message: 'Error al expresar interés' } };
  } catch (error) {
    return { error };
  }
};