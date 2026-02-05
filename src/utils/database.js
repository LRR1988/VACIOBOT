<<<<<<< HEAD
import { supabase } from './supabaseClient';

class SupabaseDatabase {
  constructor() {
    this.supabase = supabase;
  }

  // Métodos de autenticación de usuarios
  async getUserByUsername(username) {
    // Validar que el username no sea undefined o null
    if (!username) {
      return null;
    }
    
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error) {
      // Solo registrar error si no es porque no se encontró el usuario
      if (error.code !== 'PGRST116') {  // PGRST116 es el código cuando no se encuentra el registro
        console.error('Error obteniendo usuario por username:', error);
      }
      return null;
    }
    
    return data;
  }

  async getUserById(id) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error obteniendo usuario por ID:', error);
      return null;
    }
    
    return data;
  }

  async createUser(userData) {
    // Validar que los datos requeridos estén presentes
    if (!userData) {
      throw new Error('User data is required');
    }
    
    if (!userData.username) {
      throw new Error('Username is required');
    }

    // Verificar si el usuario ya existe
    const existingUser = await this.getUserByUsername(userData.username);
=======
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
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
    if (existingUser) {
      throw new Error('Username already exists');
    }

<<<<<<< HEAD
    // Extraer solo las propiedades válidas que existen en la tabla users
    // Asegurarse de que no haya problemas con la desestructuración
    const safeUserData = userData || {};
    const { username, password, email, company_name, role, ...otherProps } = safeUserData;
    
    const userToInsert = {
      username,
      password,
      ...(email && { email }),
      ...(company_name && { company_name }),
      role: role || 'user',
      ...otherProps  // Incluir otras propiedades que puedan existir
    };

    const { data, error } = await this.supabase
      .from('users')
      .insert([userToInsert])
      .select()
      .single();

    if (error) {
      console.error('Error creando usuario:', error);
      throw error;
    }

    return data;
  }

  async authenticateUser(username, password) {
    const user = await this.getUserByUsername(username);
=======
    return this.insert('users', {
      ...userData,
      role: userData.role || 'user',
      created_at: new Date().toISOString()
    });
  }

  authenticateUser(username, password) {
    const user = this.getUserByUsername(username);
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

<<<<<<< HEAD
  // Métodos para anuncios
  async getAds(filters = {}) {
    // Primero obtener todos los anuncios activos
    let query = this.supabase.from('ads').select(`
      *,
      users (
        username,
        company_name
      )
    `).eq('status', 'active');

    if (filters.adType) {
      query = query.eq('ad_type', filters.adType);
    }

    if (filters.routeFrom) {
      query = query.ilike('route_from', `%${filters.routeFrom}%`);
    }

    if (filters.routeTo) {
      query = query.ilike('route_to', `%${filters.routeTo}%`);
    }

    if (filters.country) {
      query = query.eq('country', filters.country);
    }

    const { data: allAds, error } = await query;

    if (error) {
      console.error('Error obteniendo anuncios:', error);
      return [];
    }

    // Filtrar los anuncios que ya han sido contratados (tienen una transacción completada asociada)
    // Hacerlo en una sola consulta para verificar todas las transacciones de una vez
    const adIds = allAds.map(ad => ad.id);
    let availableAds = allAds;
    
    if (adIds.length > 0) {
      const { data: completedTransactions, error: transactionError } = await this.supabase
        .from('transactions')
        .select('related_ad_id')
        .in('related_ad_id', adIds)
        .eq('status', 'completed');

      if (transactionError) {
        console.error('Error obteniendo transacciones completadas:', transactionError);
        // Si hay error, devolver todos los anuncios como precaución
        availableAds = allAds;
      } else {
        // Filtrar anuncios que no tienen transacciones completadas asociadas
        const completedAdIds = completedTransactions.map(t => t.related_ad_id);
        availableAds = allAds.filter(ad => !completedAdIds.includes(ad.id));
      }
    }

    // Ordenar por fecha de creación (más recientes primero)
    availableAds.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return availableAds;
  }

  async createAd(adData) {
    const { data, error } = await this.supabase
      .from('ads')
      .insert([{
        ...adData,
        status: 'active' // Asegurar que siempre se establece un estado
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creando anuncio:', error);
      throw error;
    }

    return data;
  }

  async getUserAds(userId) {
    const { data, error } = await this.supabase
      .from('ads')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error obteniendo anuncios del usuario:', error);
      return [];
    }

    // Agregar información sobre si el anuncio ha sido contratado
    const adsWithStatus = await Promise.all(data.map(async (ad) => {
      const { data: existingTransaction, error: transactionError } = await this.supabase
        .from('transactions')
        .select('id')
        .eq('related_ad_id', ad.id)
        .eq('status', 'completed')
        .limit(1);

      return {
        ...ad,
        is_hired: existingTransaction && existingTransaction.length > 0
      };
    }));

    return adsWithStatus;
  }

  async updateAd(adId, updateData) {
    // Excluir el precio de la actualización para cumplir con la regla de negocio
    const { price, ...updateFields } = updateData;
    
    const { data, error } = await this.supabase
      .from('ads')
      .update(updateFields)
      .eq('id', adId)
      .select()
      .single();

    if (error) {
      console.error('Error actualizando anuncio:', error);
      throw error;
    }

    return data;
  }

  async deleteAd(adId) {
    const { error } = await this.supabase
      .from('ads')
      .delete()
      .eq('id', adId);

    if (error) {
      console.error('Error eliminando anuncio:', error);
      throw error;
    }

    return { success: true };
  }

  // Métodos para seguir anuncios
  async followAd(userId, adId) {
    const { data, error } = await this.supabase
      .from('ad_followers')
      .insert([{ user_id: userId, ad_id: adId }])
      .select()
      .single();

    if (error && error.code !== '23505') { // 23505 es violación de unicidad
      console.error('Error siguiendo anuncio:', error);
      throw error;
    }

    return data || { user_id: userId, ad_id: adId }; // Devolver datos aunque ya exista
  }

  async unfollowAd(userId, adId) {
    const { error } = await this.supabase
      .from('ad_followers')
      .delete()
      .match({ user_id: userId, ad_id: adId });

    if (error) {
      console.error('Error dejando de seguir anuncio:', error);
      return false;
    }

    return true;
  }

  async toggleAdFollow(userId, adId) {
    // Verificar si ya está siguiendo el anuncio
    const { data: existingFollow, error: followCheckError } = await this.supabase
      .from('ad_followers')
      .select('id')
      .eq('user_id', userId)
      .eq('ad_id', adId)
      .single();

    if (existingFollow) {
      // Ya está siguiendo, así que dejar de seguir
      const success = await this.unfollowAd(userId, adId);
      return { data: { following: false }, error: success ? null : { message: 'Error al dejar de seguir' } };
    } else {
      // No está siguiendo, así que seguir
      const result = await this.followAd(userId, adId);
      return { data: { following: true }, error: null };
    }
  }

  async expressInterest(userId, adId, message = '') {
    const { data, error } = await this.supabase
      .from('ad_interests')
      .insert([{ user_id: userId, ad_id: adId, message }])
      .select()
      .single();

    if (error) {
      console.error('Error expresando interés:', error);
      throw error;
    }

    // Crear notificación para el dueño del anuncio
    const ad = await this.getAdById(adId);
    if (ad) {
      await this.createNotification({
        user_id: ad.user_id,
        type: 'new_interest',
        message: `Nuevo interés en tu anuncio`,
        related_id: data.id
      });

      // Registrar interacción entre usuarios para permitir calificaciones posteriores
      await this.recordInteraction({
        user1_id: userId,
        user2_id: ad.user_id,
        ad_id: adId,
        interaction_type: 'interest'
      });
    }

    return data;
  }

  // Nuevo método para contratar un servicio y cobrar la comisión
  async hireService(userId, adId) {
    // Verificar que el usuario no esté contratando su propio anuncio
    const ad = await this.getAdById(adId);
    if (!ad) {
      throw new Error('Anuncio no encontrado');
    }
    
    if (ad.user_id === userId) {
      throw new Error('No puedes contratar tu propio anuncio');
    }

    // Verificar si el anuncio ya ha sido contratado por otro usuario
    const { data: existingTransaction, error: transactionError } = await this.supabase
      .from('transactions')
      .select('id')
      .eq('related_ad_id', adId)
      .eq('status', 'completed')
      .limit(1);

    if (existingTransaction && existingTransaction.length > 0) {
      throw new Error('Este anuncio ya ha sido contratado por otro usuario');
    }

    // Calcular la comisión (5% del precio con mínimo de 25€)
    const commission = this.calculateCommission(ad.price);
    const netToOwner = ad.price - commission;

    // Registrar la transacción primero
    const { data: transactionData, error: transactionError2 } = await this.supabase
      .from('transactions')
      .insert([{
        user_id: userId,
        related_ad_id: adId,
        amount: ad.price,
        commission_amount: commission,
        stripe_transaction_id: null,  // No tenemos ID de transacción aquí, solo de sesión
        status: 'completed',
        currency: 'eur'
      }])
      .select()
      .single();

    if (transactionError2) {
      console.error('Error registrando transacción:', transactionError2);
      throw transactionError2;
    }

    // Crear notificación para el dueño del anuncio
    await this.createNotification({
      user_id: ad.user_id,
      type: 'service_hired',
      message: `Alguien ha contratado tu servicio`,
      related_id: adId
    });

    // Registrar interacción entre usuarios para permitir calificaciones posteriores
    await this.recordInteraction({
      user1_id: userId,
      user2_id: ad.user_id,
      ad_id: adId,
      interaction_type: 'service_hired'
    });

    return {
      success: true,
      commission: commission,
      netToOwner: netToOwner,
      totalPrice: ad.price
    };
  }

  // Método para calcular comisión (replicar la lógica de helpers.js)
  calculateCommission(price) {
    const commission = price * 0.05; // 5%
    return Math.max(commission, 25); // mínimo 25€
  }

  async getAdById(adId) {
    const { data, error } = await this.supabase
      .from('ads')
      .select('*')
      .eq('id', adId)
      .single();

    if (error) {
      console.error('Error obteniendo anuncio por ID:', error);
      return null;
    }

    return data;
  }

  // Métodos para notificaciones
  async createNotification(notificationData) {
    const { data, error } = await this.supabase
      .from('notifications')
      .insert([{
        ...notificationData,
        read: false
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creando notificación:', error);
      throw error;
    }

    return data;
  }

  async getUserNotifications(userId) {
    const { data, error } = await this.supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error obteniendo notificaciones:', error);
      return [];
    }

    return data;
  }

  async markNotificationAsRead(notificationId) {
    const { data, error } = await this.supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) {
      console.error('Error marcando notificación como leída:', error);
      return null;
    }

    return data;
  }

  // Métodos para calificaciones anónimas
  async createRating(ratingData) {
    // Validar que la interacción sea entre usuarios diferentes
    if (ratingData.from_user_id === ratingData.to_user_id) {
      throw new Error('No se puede calificar a sí mismo');
    }

    // Verificar que exista una interacción previa entre los usuarios
    const interactionExists = await this.hasInteraction(ratingData.from_user_id, ratingData.to_user_id);
    if (!interactionExists) {
      throw new Error('No se puede calificar sin una interacción previa');
    }

    const { data, error } = await this.supabase
      .from('ratings')
      .insert([{
        ...ratingData,
        anonymous: true
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creando calificación:', error);
      throw error;
    }

    return data;
  }

  async getUserRatings(userId) {
    const { data, error } = await this.supabase
      .from('ratings')
      .select('*')
      .eq('to_user_id', userId);

    if (error) {
      console.error('Error obteniendo calificaciones del usuario:', error);
      return [];
    }

    return data;
  }

  async getAverageRating(userId) {
    const { data, error } = await this.supabase
      .from('ratings')
      .select('score')
      .eq('to_user_id', userId);

    if (error) {
      console.error('Error obteniendo calificaciones para promedio:', error);
      return 0;
    }

    if (data.length === 0) return 0;

    const totalRating = data.reduce((sum, rating) => sum + rating.score, 0);
    return totalRating / data.length;
  }

  async hasInteraction(user1Id, user2Id) {
    const { data, error } = await this.supabase
      .from('user_interactions')
      .select('*')
      .or(`and(user1_id.eq.${user1Id},user2_id.eq.${user2Id}),and(user1_id.eq.${user2Id},user2_id.eq.${user1Id})`)
      .limit(1);

    if (error) {
      console.error('Error verificando interacción:', error);
      return false;
    }

    return data.length > 0;
  }

  async recordInteraction(interactionData) {
    const { data, error } = await this.supabase
      .from('user_interactions')
      .insert([interactionData])
      .select()
      .single();

    if (error) {
      console.error('Error registrando interacción:', error);
      throw error;
    }

    return data;
  }

  // Métodos para transacciones
  async createTransaction(transactionData) {
    // Extraer solo las columnas que sabemos que existen en la tabla transactions
    const { user_id, related_ad_id, amount, status, currency, commission_amount, stripe_transaction_id } = transactionData;
    
    const validTransactionData = {
      user_id,
      related_ad_id,
      amount,
      ...(status && { status }),
      ...(currency && { currency }),
      ...(commission_amount && { commission_amount }),
      ...(stripe_transaction_id && { stripe_transaction_id })
    };

    const { data, error } = await this.supabase
      .from('transactions')
      .insert([validTransactionData])
      .select()
      .single();

    if (error) {
      console.error('Error creando transacción:', error);
      throw error;
    }

    return data;
  }

  async getUserTransactions(userId) {
    const { data, error } = await this.supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error obteniendo transacciones del usuario:', error);
      return [];
    }

    return data;
  }

  // Métodos auxiliares
  async updateUser(userId, updateData) {
    const { data, error } = await this.supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error actualizando usuario:', error);
      throw error;
    }

    return data;
  }

  // Método para verificar si un anuncio ya ha sido contratado por cualquier usuario
  async isAdHiredByAnyUser(adId) {
    try {
      // Buscar en la tabla de transacciones para ver si ya existe una contratación completada
      const { data, error } = await this.supabase
        .from('transactions')
        .select('id')
        .eq('related_ad_id', adId)
        .eq('status', 'completed')
        .limit(1);
      
      if (error) {
        console.error('Error verificando contratación de anuncio por cualquier usuario:', error);
        return { hired: false, error };
      }
      
      return { hired: data && data.length > 0, error: null };
    } catch (error) {
      console.error('Error en isAdHiredByAnyUser:', error);
      return { hired: false, error };
    }
  }
}

// Exportar instancia
export const db = new SupabaseDatabase();
=======
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
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85

// Funciones de utilidad para autenticación
export const signIn = async (username, password) => {
  try {
<<<<<<< HEAD
    const user = await db.authenticateUser(username, password);
    if (user) {
      // Guardar token de sesión en localStorage del navegador
=======
    const user = db.authenticateUser(username, password);
    if (user) {
      // Guardar token de sesión
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
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

<<<<<<< HEAD
export const signUp = async (userData) => {
  try {
    const user = await db.createUser(userData);
    if (user) {
      // Guardar token de sesión en localStorage del navegador
=======
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
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
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
<<<<<<< HEAD
    const ads = await db.getAds(filters);
    return { data: ads, error: null };
=======
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
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
  } catch (error) {
    return { data: [], error };
  }
};

export const createAd = async (adData) => {
  try {
<<<<<<< HEAD
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Usuario no autenticado');
    }

    // Asegurar que el user_id sea el token (ID del usuario)
    const ad = await db.createAd({
      ...adData,
      user_id: token,
      status: 'active'
    });

    console.log('Anuncio creado exitosamente:', ad); // Agregar log para debugging

    return { data: ad, error: null };
  } catch (error) {
    console.error('Error en createAd:', error); // Agregar log para debugging
=======
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
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
    return { data: null, error };
  }
};

export const getUserAds = async (userId) => {
  try {
<<<<<<< HEAD
    console.log('Obteniendo anuncios para el usuario:', userId); // Log para debugging
    const ads = await db.getUserAds(userId);
    console.log('Anuncios obtenidos:', ads); // Log para debugging
    return { data: ads, error: null };
  } catch (error) {
    console.error('Error en getUserAds:', error); // Log para debugging
=======
    const ads = db.getUserAds(userId);
    return { data: ads, error: null };
  } catch (error) {
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
    return { data: [], error };
  }
};

export const updateUserProfile = async (userId, profileData) => {
  try {
<<<<<<< HEAD
    const user = await db.updateUser(userId, profileData);
=======
    const user = db.update('users', userId, profileData);
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
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
<<<<<<< HEAD
    const user = await db.getUserById(userId);
=======
    const user = db.getUserById(userId);
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
    return { data: user, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Funciones para seguir anuncios
export const followAd = async (userId, adId) => {
  try {
<<<<<<< HEAD
    const result = await db.followAd(userId, adId);
=======
    const result = db.followAd(userId, adId);
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
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
<<<<<<< HEAD
    const success = await db.unfollowAd(userId, adId);
=======
    const success = db.unfollowAd(userId, adId);
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
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
<<<<<<< HEAD
    const result = await db.expressInterest(userId, adId, message);
    if (result) {
=======
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
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
      return { error: null };
    }
    return { error: { message: 'Error al expresar interés' } };
  } catch (error) {
    return { error };
  }
<<<<<<< HEAD
};

// Función para contratar un servicio y cobrar la comisión
export const hireService = async (userId, adId) => {
  try {
    const result = await db.hireService(userId, adId);
    return { data: result, error: null };
  } catch (error) {
    console.error('Error en hireService:', error);
    return { data: null, error };
  }
};

// Funciones para calificaciones anónimas
export const createRating = async (ratingData) => {
  try {
    const result = await db.createRating(ratingData);
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getUserAverageRating = async (userId) => {
  try {
    const averageRating = await db.getAverageRating(userId);
    return { data: averageRating, error: null };
  } catch (error) {
    return { data: 0, error };
  }
};

export const getUserRatings = async (userId) => {
  try {
    const ratings = await db.getUserRatings(userId);
    return { data: ratings, error: null };
  } catch (error) {
    return { data: [], error };
  }
};

// Funciones para notificaciones
export const getUserNotifications = async (userId) => {
  try {
    const notifications = await db.getUserNotifications(userId);
    return { data: notifications, error: null };
  } catch (error) {
    return { data: [], error };
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const result = await db.markNotificationAsRead(notificationId);
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Función para crear notificaciones personalizadas
export const createNotification = async (notificationData) => {
  try {
    const result = await db.createNotification(notificationData);
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Funciones para transacciones
export const getUserTransactions = async (userId) => {
  try {
    const transactions = await db.getUserTransactions(userId);
    return { data: transactions, error: null };
  } catch (error) {
    return { data: [], error };
  }
};

export const createTransaction = async (transactionData) => {
  try {
    const result = await db.createTransaction(transactionData);
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Funciones para actualizar y eliminar anuncios
export const updateAd = async (adId, updateData) => {
  try {
    const result = await db.updateAd(adId, updateData);
    return { data: result, error: null };
  } catch (error) {
    console.error('Error en updateAd:', error);
    return { data: null, error };
  }
};

export const deleteAd = async (adId) => {
  try {
    const result = await db.deleteAd(adId);
    return { data: result, error: null };
  } catch (error) {
    console.error('Error en deleteAd:', error);
    return { data: null, error };
  }
};

// Función para alternar seguir/dejar de seguir un anuncio
export const toggleAdFollow = async (userId, adId) => {
  try {
    const result = await db.toggleAdFollow(userId, adId);
    return result;
  } catch (error) {
    console.error('Error en toggleAdFollow:', error);
    return { data: null, error };
  }
};

// Función para verificar si un usuario ya ha contratado un anuncio
export const hasUserHiredAd = async (userId, adId) => {
  try {
    // Buscar en la tabla de transacciones para ver si ya existe una contratación
    // Usar campos que sabemos que existen en la tabla transactions
    const { data, error } = await db.supabase
      .from('transactions')
      .select('id')
      .eq('user_id', userId)
      .eq('related_ad_id', adId);
    
    if (error) {
      console.error('Error verificando contratación de anuncio:', error);
      return { exists: false, error };
    }
    
    return { exists: data && data.length > 0, error: null };
  } catch (error) {
    console.error('Error en hasUserHiredAd:', error);
    return { exists: false, error };
  }
};


// Función para verificar si un anuncio ya ha sido contratado por cualquier usuario
export const isAdHiredByAnyUser = async (adId) => {
  try {
    return await db.isAdHiredByAnyUser(adId);
  } catch (error) {
    console.error('Error en isAdHiredByAnyUser:', error);
    return { hired: false, error };
  }
};

// Función para obtener anuncios seguidos por un usuario
export const getUserFollowingAds = async (userId) => {
  try {
    const { data, error } = await db.supabase
      .from('ad_followers')
      .select('ad_id, created_at')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error obteniendo anuncios seguidos:', error);
      return { data: [], error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error en getUserFollowingAds:', error);
    return { data: [], error };
  }
=======
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
};