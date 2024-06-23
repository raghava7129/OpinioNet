import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import {initReactI18next} from 'react-i18next';

import esTranslations from './locales/es/translations.json';
import hiTranslations from './locales/hi/translations.json';
import ptTranslations from './locales/pt/translations.json';
import taTranslations from './locales/ta/translations.json';
import bnTranslations from './locales/bn/translations.json';
import frTranslations from './locales/fr/translations.json';
import enTranslations from './locales/en/translations.json';



i18n.use(LanguageDetector).use(initReactI18next).init({
    // Spanish, Hindi, Portuguese, Tamil, Bengali, French, English
    resources: {
        es: {
            translations: esTranslations,
        },
        hi: {
            translations: hiTranslations,
        },
        pt: {
            translations: ptTranslations,
        },
        ta: {
            translations: taTranslations,
        },
        bn: {
            translations: bnTranslations,
        },
        fr: {
            translations: frTranslations,
        },
        en: {
            translations: enTranslations,
        }
        
    },
    fallbackLng: 'en',
    lng: 'en',
    debug: true,
    ns: ['translations'],
    defaultNS: 'translations',
    keySeparator: false,
    interpolation: {
        escapeValue: false,
    },
    react: {
        wait: true,
    },
});

export default i18n;