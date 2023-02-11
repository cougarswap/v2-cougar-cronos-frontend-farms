import React, { useState, useEffect, useCallback } from 'react'
import { StringTranslations } from '@crowdin/crowdin-api-client'
import { TranslationsContext } from 'contexts/Localization/translationsContext'
import { allLanguages, EN } from 'config/localisation/languageCodes'
import { ContextData, Translate } from './types'

const CACHE_KEY = 'pancakeSwapLanguage'

export interface LangType {
  code: string
  language: string
}

export interface LanguageState {
  selectedLanguage: LangType
  setSelectedLanguage: (langObject: LangType) => void
  translatedLanguage: LangType
  setTranslatedLanguage: React.Dispatch<React.SetStateAction<LangType>>
  t: Translate
}

const LanguageContext = React.createContext({
  selectedLanguage: EN,
  setSelectedLanguage: () => undefined,
  translatedLanguage: EN,
  setTranslatedLanguage: () => undefined,
  t: () => undefined
} as LanguageState)

const fileId = 8
const projectId = parseInt(process.env.REACT_APP_CROWDIN_PROJECTID)
const stringTranslationsApi = new StringTranslations({
  token: process.env.REACT_APP_CROWDIN_APIKEY,
})

const fetchTranslationsForSelectedLanguage = (selectedLanguage) => {
  return stringTranslationsApi.listLanguageTranslations(projectId, selectedLanguage.code, undefined, fileId, 200)
}

const LanguageContextProvider = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<any>(EN)
  const [translatedLanguage, setTranslatedLanguage] = useState<any>(EN)
  const [translations, setTranslations] = useState<Array<any>>([])

  const getStoredLang = (storedLangCode: string) => {
    return allLanguages.filter((language) => {
      return language.code === storedLangCode
    })[0]
  }

  useEffect(() => {
    const storedLangCode = localStorage.getItem(CACHE_KEY)
    if (storedLangCode) {
      const storedLang = getStoredLang(storedLangCode)
      setSelectedLanguage(storedLang)
    } else {
      setSelectedLanguage(EN)
    }
  }, [])

  useEffect(() => {
    if (selectedLanguage) {
      console.log(`import(\`../../../public/i18n/${selectedLanguage.code}.json\`)`);
      fetch(`./i18n/${selectedLanguage.code}.json`)
        .then(r=>r.json())
      // fetchTranslationsForSelectedLanguage(selectedLanguage)
        .then((translationApiResponse) => {
          if (translationApiResponse.data.length < 1) {
            setTranslations(['error'])
          } else {
            setTranslations(translationApiResponse.data)
          }
        })
        .then(() => setTranslatedLanguage(selectedLanguage))
        .catch((e) => {
          console.error("ERROR");
          console.error(e);
          setTranslations(['error'])
        })
    }
  }, [selectedLanguage, setTranslations])

  const handleLanguageSelect = (langObject: LangType) => {
    setSelectedLanguage(langObject)
    localStorage.setItem(CACHE_KEY, langObject.code)
  }

  const translate = useCallback(
    (key: string, data?: ContextData) => {
      // TODO: We use default text for now, will working on localization later
      const translatedText = key

      // Check the existence of at least one combination of %%, separated by 1 or more non space characters
      const includesVariable = translatedText.match(/%\S+?%/gm)

      if (includesVariable && data) {
        let interpolatedText = translatedText
        Object.keys(data).forEach((dataKey) => {
          const templateKey = new RegExp(`%${dataKey}%`, 'g')
          interpolatedText = interpolatedText.replace(templateKey, data[dataKey].toString())
        })

        return interpolatedText
      }

      return translatedText
    },
    [],
  )

  return (
    <LanguageContext.Provider
      value={{ selectedLanguage, setSelectedLanguage: handleLanguageSelect, 
        translatedLanguage, setTranslatedLanguage,
        t: translate }}
    >
      <TranslationsContext.Provider value={{ translations, setTranslations }}>{children}</TranslationsContext.Provider>
    </LanguageContext.Provider>
  )
}

export { LanguageContext, LanguageContextProvider }
