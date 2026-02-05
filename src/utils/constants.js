// Constantes para la aplicación Travabus

// Idiomas soportados
export const SUPPORTED_LANGUAGES = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' }
];

// Tipos de anuncios
export const AD_TYPES = {
  OFFER: 'offer', // Oferta de bus vacío
  DEMAND: 'demand' // Demanda de bus (próximamente)
};

// Roles de usuario
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

// Estados de anuncio
export const AD_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BOOKED: 'booked',
  PENDING_PAYMENT: 'pending_payment'
};

// Comisiones
export const COMMISSION_RATE = 0.05; // 5%
export const MINIMUM_COMMISSION = 25; // 25€

// Campos requeridos para ofertas de bus
export const OFFER_FIELDS = [
  'routeFrom',
  'routeTo',
  'startDate',
  'endDate',
  'startTime',
  'endTime',
  'price',
  'expensesBy',
  'busCount',
  'busAge',
  'seats',
  'observations'
];

// Países europeos
export const EUROPE_COUNTRIES = [
  { code: 'ES', name: 'España' },
  { code: 'FR', name: 'Francia' },
  { code: 'DE', name: 'Alemania' },
  { code: 'IT', name: 'Italia' },
  { code: 'PT', name: 'Portugal' },
  { code: 'NL', name: 'Países Bajos' },
  { code: 'BE', name: 'Bélgica' },
  { code: 'AT', name: 'Austria' },
  { code: 'CH', name: 'Suiza' },
  { code: 'PL', name: 'Polonia' },
  { code: 'SE', name: 'Suecia' },
  { code: 'NO', name: 'Noruega' },
  { code: 'DK', name: 'Dinamarca' },
  { code: 'FI', name: 'Finlandia' },
  { code: 'IE', name: 'Irlanda' },
  { code: 'GR', name: 'Grecia' },
  { code: 'CZ', name: 'República Checa' },
  { code: 'HU', name: 'Hungría' },
  { code: 'RO', name: 'Rumanía' },
  { code: 'BG', name: 'Bulgaria' }
];