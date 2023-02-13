import React, { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { ResetCSS } from '@pancakeswap-libs/uikit'
import BigNumber from 'bignumber.js'
import { useFetchCakeVault, useFetchPublicData } from 'state/hooks'
import { usePollBlockNumber } from 'state/block/hooks'
import CurrentBlockNumber from 'components/CurrentBlockNumber'
import { usePresaleDataOption } from 'views/Presale/hooks/usePresaleDataOption'
import { PresaleOption } from 'state/types'
import useEagerConnect from 'hooks/useEagerConnect'
import { ToastListener } from 'contexts/ToastsContext'
import { usePresaleMigrateDataOption } from 'views/PresaleMigrate/hooks/usePresaleMigrateDataOption'
import GlobalStyle from './style/Global'
import Menu from './components/Menu'
import PageLoader from './components/PageLoader'

// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page'
const Home = lazy(() => import('./views/Home'))
const SwapForMigration = lazy(() => import('./views/PresaleMigrate/Migration'))
const Farms = lazy(() => import('./views/Farms'))
const Pools = lazy(() => import('./views/Pools'))
const Vaults = lazy(() => import('./views/Vaults'))
// const Ifos = lazy(() => import('./views/Ifos'))
const NotFound = lazy(() => import('./views/NotFound'))
const PartnerPools = lazy(() => import('./views/PartnerPools'))
const Referrals = lazy(() => import('./views/Referrals'))
const Chart = lazy(() => import('./views/Chart'))

// This config is required for number formating
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const App: React.FC = () => {  
  const { account } = useWeb3React()
  
  // useEffect(() => {
  //   console.warn = () => null
  // }, [])

  usePollBlockNumber()
  useEagerConnect()
  useFetchPublicData()
  useFetchCakeVault()
  usePresaleDataOption(PresaleOption.OPTION_1, account)

  return (
    <Router>
      <ResetCSS />
      <GlobalStyle />
      <Menu>
        <Suspense fallback={<PageLoader />}>
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>            
            <Route path="/swap-migrate">
              <SwapForMigration />
            </Route>
            <Route path="/farms">
              <Farms />
            </Route>
            <Route path="/nests">
              <Farms tokenMode/>
            </Route>
            <Route path="/vaults">
              <Vaults />
            </Route>
            {/* <Route path="/ifo"> */}
             {/* <Ifos /> */}
            {/* </Route> */}
            <Route path="/syrups"> 
              <Pools />
            </Route>
            {/* <Route path="/lottery">
              <Lottery />
            </Route> */}
            {/* <Route path="/nft"> */}
              {/* <Nft /> */}
            {/* </Route> */}
            <Route path="/referrals">
              <Referrals />
            </Route>
            <Route path="/chart">
              <Chart />
            </Route>
            {/* Redirect */}
            <Route path="/pools">
             <Redirect to="/cbank" />
            </Route>
            <Route path="/cbank">
             <PartnerPools />
            </Route>
            {/* <Route path="/syrup"> */}
            {/*  <Redirect to="/pools" /> */}
            {/* </Route> */}
            {/* 404 */}
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </Menu>
      <ToastListener />
      <CurrentBlockNumber />
      {/* <NftGlobalNotification /> */}
    </Router>
  )
}

export default React.memo(App)
