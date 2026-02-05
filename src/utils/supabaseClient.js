<<<<<<< HEAD
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://aynmblthitrfqcfvclot.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5bm1ibHRoaXRyZnFjZnZjbG90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMTI3NjgsImV4cCI6MjA4NTc4ODc2OH0.IdhGNNDVJdfAuSlCn9G4E_iiaUpoeZw1mNkUoYl3yFE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
=======
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
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
