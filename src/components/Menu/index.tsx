import React, { useContext } from 'react'
import { allLanguages } from 'config/localisation/languageCodes'
import { LanguageContext } from 'contexts/Localization/languageContext'
import useTheme from 'hooks/useTheme'
import { usePriceCakeBusd } from 'state/hooks'
import { Menu as UikitMenu } from '@pancakeswap-libs/uikit'
import useAuth from 'hooks/useAuth'
import { useWeb3React } from '@web3-react/core'
import config from './config'

const Menu = (props) => {
  const { account } = useWeb3React()
  const { login, logout } = useAuth()
  const { selectedLanguage, setSelectedLanguage } = useContext(LanguageContext)
  const { isDark, toggleTheme } = useTheme()
  const cakePriceUsd = usePriceCakeBusd()

  return (
    <UikitMenu
      account={account}
      login={login}
      logout={logout}
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={selectedLanguage && selectedLanguage.code}
      langs={allLanguages}
      setLang={setSelectedLanguage}
      cakePriceUsd={cakePriceUsd.toNumber()}
      links={config}
      priceLink="https://cronoscan.com/address/0xCBfb4bE9dBbaD51A794B10AaCaC0E5341777d398"
      {...props}
    />
  )
}

export default Menu
