// Este archivo ahora sirve como puente hacia nuestra base de datos local
// Redirige todas las llamadas a nuestro archivo de base de datos local

export { 
  signIn,
  signUp,
  getAds,
  createAd,
  getUserAds,
  updateUserProfile,
  getUserProfile,
  followAd,
  unfollowAd,
  expressInterest
} from './database';