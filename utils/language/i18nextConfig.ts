import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './json/en.json';
import es from './json/es.json';
import { LangCode } from './LanguageUtils';

const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
};

// const initalizeI18Next = () => {
i18n.use(initReactI18next).init({
  debug: false,
  resources,
  lng: LangCode.es,
  fallbackLng: LangCode.es,
  compatibilityJSON: 'v3',
  interpolation: {
    escapeValue: false,
  },
});
// };

// export default {initalizeI18Next};
