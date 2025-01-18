import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Languages from './Languages/Languages'
const resources = Languages;

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'fr', // Default language
        fallbackLng: 'en', // Fallback language
        interpolation: {
            escapeValue: false, // React already escapes the values
        },
    });

export default i18n;
