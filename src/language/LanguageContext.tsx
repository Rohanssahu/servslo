import React, {createContext, useCallback, useContext, useEffect, useState} from 'react';
import Tts from 'react-native-tts';

type Lang = 'hi' | 'en';

interface LangCtx {
  lang: Lang;
  toggleLang: () => void;
  speak: (hi: string, en: string) => void;
  stop: () => void;
  isSpeaking: boolean;
}

const LanguageContext = createContext<LangCtx>({
  lang: 'hi',
  toggleLang: () => {},
  speak: () => {},
  stop: () => {},
  isSpeaking: false,
});

export const LanguageProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [lang, setLang] = useState<Lang>('hi');
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    Tts.setDefaultRate(0.52);
    Tts.setDefaultPitch(1.05);

    const onStart = () => setIsSpeaking(true);
    const onFinish = () => setIsSpeaking(false);
    const onCancel = () => setIsSpeaking(false);

    Tts.addEventListener('tts-start', onStart);
    Tts.addEventListener('tts-finish', onFinish);
    Tts.addEventListener('tts-cancel', onCancel);

    return () => {
      Tts.removeEventListener('tts-start', onStart);
      Tts.removeEventListener('tts-finish', onFinish);
      Tts.removeEventListener('tts-cancel', onCancel);
      Tts.stop();
    };
  }, []);

  const toggleLang = useCallback(() => {
    Tts.stop();
    setLang(l => (l === 'hi' ? 'en' : 'hi'));
  }, []);

  const speak = useCallback(
    (hi: string, en: string) => {
      Tts.stop();
      if (lang === 'hi') {
        Tts.setDefaultLanguage('hi-IN');
        Tts.speak(hi);
      } else {
        Tts.setDefaultLanguage('en-US');
        Tts.speak(en);
      }
    },
    [lang],
  );

  const stop = useCallback(() => {
    Tts.stop();
  }, []);

  return (
    <LanguageContext.Provider value={{lang, toggleLang, speak, stop, isSpeaking}}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
