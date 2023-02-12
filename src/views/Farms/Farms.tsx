import React, { useEffect, useCallback, useState, useMemo } from 'react'
import { Route, useLocation, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Image, Heading, Text, Toggle } from '@pancakeswap-libs/uikit'
import { BLOCKS_PER_DAY, BLOCKS_PER_YEAR, CAKE_PER_BLOCK } from 'config'
import Page from 'components/layout/Page'
// import { useFarms, usePriceGlmrBusd, usePriceCakeBusd, usePriceWbtcBnb, usePriceBnbBusd } from 'state/hooks'
import { useFarms,  usePriceCakeBusd, usePriceBnbBusd } from 'state/hooks'
import useRefresh from 'hooks/useRefresh'
import { fetchFarmUserDataAsync } from 'state/actions'
import { QuoteToken } from 'config/constants/types'
import useI18n from 'hooks/useI18n'
import Select, { OptionProps } from 'components/Select/Select'
import SearchInput from 'components/SearchInput'
import { latinise } from 'utils/latinise'
import { orderBy } from 'lodash'
import { ViewMode } from 'state/types'
import { BIG_ZERO } from 'utils/bigNumber'
import FarmCard, { FarmWithStakedValue } from './components/FarmCard/FarmCard'
import RowFarmCard from './components/FarmCard/RowFarmCard/RowFarmCard'
import FarmTabButtons from './components/FarmTabButtons'
import HeaderCountDown from './components/HeaderCountdown'
import Divider from './components/Divider'
import FarmTable from './components/FarmTable'
import ToggleView from './components/ToggleView/ToggleView'
import ConvertCgsAnnouncement from './components/ConvertCgsAnnouncement'

export interface FarmsProps{
  tokenMode?: boolean
}

const FarmTableLayout = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  & > * {
    min-width: 280px;
    width: 100%;
    margin: 0 12px;
    margin-bottom: 32px;
  }
`

const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 32px;
    margin-bottom: 0;
  }
`


const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 0px;

  ${({ theme }) => theme.mediaQueries.nav} {
    width: auto;
    justify-content: flex-start;
    padding: 0;
  }
`

const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: space-between;
  display: flex;
  align-items: center;
  align-self: flex-end;
  width: 100%;

  & > *+* {
    margin-left: 20px;
  }

  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.nav} {
    justify-content: flex-start;
    width: auto;
    flex: 1;

    > div {
      padding: 0;
    }
  }
`

const ToggleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  ${Text} {
    margin-left: 8px;
  }
`

const VIEWMODE_KEY = 'fantomCGSViewMode'

const Farms: React.FC<FarmsProps> = (farmsProps) => {
  const { path } = useRouteMatch()
  const { pathname } = useLocation()
  const TranslateString = useI18n()
  const farmsLP = useFarms()
  const cakePrice = usePriceCakeBusd()
  const bnbPrice = usePriceBnbBusd()
  // const btcPriceToBnb = usePriceWbtcBnb()
  // const bnbPriceToBusd = usePriceBnbBusd()
  
  const { account } = useWeb3React()
  const {tokenMode} = farmsProps;
  const [sortOption, setSortOption] = useState('hot')
  const [query, setQuery] = useState('')
  
  const [viewMode, setViewMode] = useState(ViewMode.TABLE)
  // useEffect(() => {
  //   const storedViewMode = localStorage.getItem(VIEWMODE_KEY)
  //   if (storedViewMode === 'CARD') {
  //     setViewMode(ViewMode.CARD)
  //   } else {
  //     setViewMode(ViewMode.TABLE)
  //   }
  // }, [])
  
  // const handleSetViewMode = (vm: ViewMode) => {
  //   setViewMode(vm)
  //   localStorage.setItem(VIEWMODE_KEY, vm)
  // }

  const isInactive = pathname.includes('history')
  const isActive = !isInactive

  const dispatch = useDispatch()
  const { slowRefresh } = useRefresh()
  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account))
    }
  }, [account, dispatch, slowRefresh])

  const [stakedOnly, setStakedOnly] = useState(false)

  const activeFarms = farmsLP.filter((farm) => !!farm.isTokenOnly === !!tokenMode && farm.multiplier !== '0X')
  const inactiveFarms = farmsLP.filter((farm) => !!farm.isTokenOnly === !!tokenMode && farm.multiplier === '0X')

  const stakedOnlyFarms = activeFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  const stakedInactiveFarms = inactiveFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
  }

  // /!\ This function will be removed soon
  // This function compute the APY for each farm and will be replaced when we have a reliable API
  // to retrieve assets prices against USD
  const farmsList = useCallback(
    (farmsToDisplay) => {
      let farmsToDisplayWithAPY: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        if (!farm.tokenAmount || !farm.lpTotalInQuoteToken || !farm.lpTotalInQuoteToken) {
          return farm
        }
        
        const cakeRewardPerBlock = CAKE_PER_BLOCK.times(farm.poolWeight)
        const cakeRewardPerDay = cakeRewardPerBlock.times(BLOCKS_PER_DAY)
        const cakeRewardPerYear = cakeRewardPerBlock.times(BLOCKS_PER_YEAR)

        let apy = BIG_ZERO;  
        const cakeRewardPerYearInUsdc = cakePrice.times(cakeRewardPerYear);  

        let totalValue = new BigNumber(farm.lpTotalInQuoteToken || 0);        

        if (totalValue.isNaN()) {
          totalValue = BIG_ZERO
        }

        if (farm.quoteTokenSymbol === QuoteToken.CRO) {
          totalValue = totalValue.times(bnbPrice);
        }
        else if (farm.quoteTokenSymbol === QuoteToken.CGS) { 
          totalValue =  totalValue.times(cakePrice)
        } 
        // else if (farm.quoteTokenSymbol === QuoteToken.BNB) {
        //   totalValue =  totalValue.times(bnbPriceToBusd)
        // }

        if(totalValue.comparedTo(0) > 0){
          apy = cakeRewardPerYearInUsdc.div(totalValue).times(100);
        }

        const lpWorth = farm.lpTokenBalanceMC && totalValue ? 
          new BigNumber(totalValue).div(new BigNumber(farm.lpTokenBalanceMC)) : BIG_ZERO
       
        return { ...farm, apy, lpWorth, cakeRewardPerDay, liquidity: totalValue }
      })

      if (query) {
        const lowercaseQuery = latinise(query.toLowerCase())
        farmsToDisplayWithAPY = farmsToDisplayWithAPY.filter((farm: FarmWithStakedValue) => {
          return latinise(farm.lpSymbol.toLowerCase()).includes(lowercaseQuery)
        })
      }      
      
      return farmsToDisplayWithAPY
    },
    // [glmrPrice, bnbPriceToBusd, query, cakePrice]
    [bnbPrice, query, cakePrice]
  )

  const farmsStakedMemoized = useMemo(() => {
    let farmsStaked = []

    const sortFarms = (farms: FarmWithStakedValue[]): FarmWithStakedValue[] => {
      switch (sortOption) {
        case 'apr':
          return orderBy(farms, (farm: FarmWithStakedValue) => (farm.apy ? farm.apy.toNumber() : 0), 'desc')
        case 'multiplier':
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => (farm.multiplier ? Number(farm.multiplier.slice(0, -1)) : 0),
            'desc',
          )
        case 'earned':
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => (farm.userData ? Number(farm.userData.earnings) : 0),
            'desc',
          )
        case 'liquidity':
          return orderBy(farms, (farm: FarmWithStakedValue) => Number(farm.liquidity), 'desc')
        default:
          return farms
      }
    }

    if (isActive) {
      farmsStaked = stakedOnly ? farmsList(stakedOnlyFarms) : farmsList(activeFarms)
    }
    if (isInactive) {
      farmsStaked = stakedOnly ? farmsList(stakedInactiveFarms) : farmsList(inactiveFarms)
    }    

    return sortFarms(farmsStaked)
  }, [
    sortOption,
    activeFarms,
    farmsList,
    inactiveFarms,
    isActive,
    isInactive,
    stakedInactiveFarms,
    stakedOnly,
    stakedOnlyFarms,
  ])  

  return (
    <Page>
      <Heading as="h1" size="lg" color="primaryBright" mb="50px" style={{ textAlign: 'center' }}>
        {
          tokenMode ?
            TranslateString(10002, 'Stake tokens to earn CGS')
            :
          TranslateString(320, 'Stake LP tokens to earn CGS')
        }
      </Heading>  
      {/* <ConvertCgsAnnouncement /> */}
      <HeaderCountDown />
      <ControlContainer>
        <ViewControls>  
          {/* <ToggleView viewMode={viewMode} onToggle={(mode: ViewMode) => handleSetViewMode(mode)} />         */}
          <ToggleWrapper>
            <Toggle checked={stakedOnly} onChange={() => setStakedOnly(!stakedOnly)} />
            <Text color= "text" > {TranslateString(699, 'Staked only')}</Text>
          </ToggleWrapper>
          <FarmTabButtons />
        </ViewControls>
        <FilterContainer>
          <LabelWrapper>
            <Text color="text" textTransform="uppercase">{TranslateString(999, 'Sort by')}</Text>
            <Select
              options={[
                {
                  label: TranslateString(999, 'Hot'),
                  value: 'hot',
                },
                {
                  label: TranslateString(999, 'APR'),
                  value: 'apr',
                },
                {
                  label: TranslateString(999, 'Multiplier'),
                  value: 'multiplier',
                },
                {
                  label: TranslateString(999, 'Earned'),
                  value: 'earned',
                },
                {
                  label: TranslateString(999, 'Liquidity'),
                  value: 'liquidity',
                },
              ]}
              onChange={handleSortOptionChange}
            />
          </LabelWrapper>
          <LabelWrapper style={{ marginLeft: 16 }}>
            <Text color="text" textTransform="uppercase">{TranslateString(999, 'Search')}</Text>
            <SearchInput onChange={handleChangeQuery} placeholder="Search Farms" />
          </LabelWrapper>
        </FilterContainer>
      </ControlContainer>
      <div>
        <Divider />
        <FarmTableLayout>
          <Route exact path={`${path}`}>
            { viewMode === ViewMode.TABLE ? (
                <FarmTable>              
                  {farmsStakedMemoized.map((farm) => (
                    <RowFarmCard key={farm.pid} 
                      farm={farm} 
                      bnbPrice={bnbPrice} 
                      cakePrice={cakePrice} 
                      account={account} removed={false} />                     
                  ))}
                </FarmTable>
              ) : (
                farmsStakedMemoized.map((farm) => (
                  <FarmCard key={farm.pid} 
                    farm={farm} 
                    bnbPrice={bnbPrice} 
                    cakePrice={cakePrice} 
                    account={account} removed={false} />                     
                ))
            )}            
          </Route>
          <Route exact path={`${path}/history`}>
            { viewMode === ViewMode.TABLE ? (
              <FarmTable>
                {farmsStakedMemoized.map((farm) => (
                    <RowFarmCard key={farm.pid} 
                      farm={farm} 
                      bnbPrice={bnbPrice} 
                      cakePrice={cakePrice} 
                      account={account} removed />                     
                  ))}
              </FarmTable>
            ) : (
              farmsStakedMemoized.map((farm) => (
                <FarmCard key={farm.pid} 
                  farm={farm} 
                  bnbPrice={bnbPrice} 
                  cakePrice={cakePrice} 
                  account={account} removed />                     
              ))
            )}
          </Route>          
        </FarmTableLayout>
      </div>       
    </Page>
  )
}


export default Farms
