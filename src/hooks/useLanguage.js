import { useState, useEffect } from 'react';
import loaders from '../localization';

// Language configuration (EN, RU, Tajik, Kyrgyz, Kazakh)
const languages = {
  en: { name: 'English', shortCode: 'EN', flag: '🇺🇸', dir: 'ltr' },
  ru: { name: 'Русский', shortCode: 'RU', flag: '🇷🇺', dir: 'ltr' },
  tg: { name: 'Тоҷикӣ', shortCode: 'TG', flag: '🇹🇯', dir: 'ltr' },
  ky: { name: 'Кыргызча', shortCode: 'KY', flag: '🇰🇬', dir: 'ltr' },
  kk: { name: 'Қазақша', shortCode: 'KK', flag: '🇰🇿', dir: 'ltr' }
};

// Translation cache
let translations = {};

// Language detection
const detectLanguage = () => {
  try {
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && languages[savedLanguage]) {
      return savedLanguage;
    }
    
    const browserLanguage = navigator.language || navigator.languages?.[0] || 'en';
    const languageCode = browserLanguage.split('-')[0];
    
    if (languages[languageCode]) {
      return languageCode;
    }
    
    return 'en';
  } catch (error) {
    console.error('Error detecting language:', error);
    return 'en';
  }
};

// Load language translations
const loadLanguage = async (languageCode) => {
  if (!languages[languageCode]) {
    console.error(`Language ${languageCode} not supported`);
    return false;
  }

  try {
    if (loaders[languageCode]) {
      const langModule = await loaders[languageCode]();
      translations[languageCode] = langModule.default;
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error loading language ${languageCode}:`, error);
    return false;
  }
};

// Language switching
const switchLanguage = async (languageCode) => {
  if (!languages[languageCode]) {
    console.error(`Language ${languageCode} not supported`);
    return false;
  }
  
  const languageConfig = languages[languageCode];
  
  // Ensure languageConfig is valid
  if (!languageConfig || !languageConfig.dir) {
    console.error(`Invalid language config for ${languageCode}:`, languageConfig);
    return false;
  }
  
  // Load translations if not already loaded
  if (!translations[languageCode]) {
    const loaded = await loadLanguage(languageCode);
    if (!loaded) {
      return false;
    }
  }
  
  // Save to localStorage
  localStorage.setItem('preferred-language', languageCode);
  
  // Update document attributes with safety checks
  try {
    document.documentElement.lang = languageCode;
    document.documentElement.dir = languageConfig.dir;
  } catch (error) {
    console.error('Error updating document attributes:', error);
    return false;
  }
  
  // Dispatch language change event
  window.dispatchEvent(new CustomEvent('languageChanged', {
    detail: { language: languageCode, config: languageConfig }
  }));
  
  return true;
};

// Custom hook for language management
export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState(detectLanguage);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleLanguageChange = (event) => {
      if (event.detail && event.detail.language) {
        setCurrentLanguage(event.detail.language);
      }
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

  const changeLanguage = async (languageCode) => {
    if (languageCode === currentLanguage) {
      return true;
    }

    setIsLoading(true);
    
    try {
      const success = await switchLanguage(languageCode);
      
      if (success) {
        setCurrentLanguage(languageCode);
        return true;
      } else {
        console.error('Failed to switch to language:', languageCode);
        return false;
      }
    } catch (error) {
      console.error('Language change error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentLanguage,
    isLoading,
    changeLanguage
  };
};

// Custom hook for translations
export const useTranslation = () => {
  const { currentLanguage } = useLanguage();
  
  const t = (key) => {
    const translation = translations[currentLanguage];
    if (!translation) {
      console.warn(`No translations found for language: ${currentLanguage}`);
      return key;
    }
    
    if (!translation[key]) {
      console.warn(`Translation not found for key: ${key} in language: ${currentLanguage}`);
      return key;
    }
    
    return translation[key];
  };

  return { t, currentLanguage };
};

// Export languages for components
export { languages };

// Initialize
if (typeof window !== 'undefined') {
  setTimeout(async () => {
    try {
      const language = detectLanguage();
      await loadLanguage(language);
      await switchLanguage(language);
    } catch (error) {
      console.error('Failed to initialize i18n:', error);
      document.documentElement.lang = 'en';
      document.documentElement.dir = 'ltr';
    }
  }, 0);
}

export default useLanguage;