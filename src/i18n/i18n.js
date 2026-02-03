import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Importar traducciones
import es from './translations/es.json';
import en from './translations/en.json';
import de from './translations/de.json';
import fr from './translations/fr.json';
import it from './translations/it.json';
import pt from './translations/pt.json';

// Obtener el idioma preferido del navegador
const getBrowserLanguage = () => {
  const browserLang = navigator.language.substring(0, 2);
  const supportedLanguages = ['es', 'en', 'de', 'fr', 'it', 'pt'];
  
  return supportedLanguages.includes(browserLang) ? browserLang : 'es';
};

// Configuración de i18n
i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
    de: { translation: de },
    fr: { translation: fr },
    it: { translation: it },
    pt: { translation: pt }
  },
  lng: localStorage.getItem('language') || getBrowserLanguage(),
  fallbackLng: 'es',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;