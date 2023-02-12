import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Page from 'components/layout/Page'
import useI18n from 'hooks/useI18n'
import { useFarms, usePartnerPoolsData, usePoolsData, usePriceCakeBusd, usePrices } from "state/hooks"
import { Heading, Text, Toggle } from '@pancakeswap-libs/uikit'
import { PartnerPool, Pool, ViewMode } from 'state/types'
import { useDispatch } from 'react-redux'
import useRefresh from 'hooks/useRefresh'
import { useWeb3React } from '@web3-react/core'
import partition from 'lodash/partition'
import { fetchPartnerPoolsUserDataAsync } from 'state/partnerPools'
import BigNumber from 'bignumber.js'
import Select, { OptionProps } from 'components/Select/Select'
import { BLOCKS_PER_DAY, BLOCKS_PER_YEAR, BSC_BLOCK_TIME } from 'config'
import partnerPoolsConfig, { linkPartnerPools } from 'config/constants/partnerPools'
import { getBalanceAmount, getBalanceNumber } from 'utils/formatBalance'
import { BIG_ZERO } from 'utils/bigNumber'
import { orderBy } from 'lodash'
import { latinise } from 'utils/latinise'
import { PoolCategory, QuoteToken, StartType } from 'config/constants/types'
import styled from 'styled-components'
import ToggleView from 'views/Farms/components/ToggleView/ToggleView'
import SearchInput from 'components/SearchInput'
import Divider from 'views/Farms/components/Divider'
import FarmTable from 'views/Farms/components/FarmTable'
import { fetchPoolsUserDataAsync } from 'state/actions'
import { useBlock } from 'state/block/hooks'
import PoolCard from 'views/Pools/components/PoolCard'
import RowCbankPoolCard, { PoolWithApy } from 'views/Pools/components/RowCbankPoolCard/RowCbankPoolCard'
import { Route, useRouteMatch } from 'react-router-dom'
import FlexLayout from 'components/layout/Flex'
import PoolTabButtons from 'views/Pools/components/PoolTabButtons'
import CbankHeaderCountDown from 'views/Pools/components/CbankHeaderCountDown'
import RowFarmCard, { PartnerPoolWithComputedValue } from './components/RowFarmCard/RowFarmCard'
import FarmCard from './components/FarmCard'
import CbankPoolCard from '../Pools/components/CbankPoolCard'
import RowLinkPartner from './components/LinkPartners/RowLinkPartner'
import LinkPartnerCard from './components/LinkPartners/LinkPartnerCard'

const VIEWMODE_KEY = 'fantomCGSViewMode'

const ControlContainer = styled.div<{isExact ?: boolean}>`
  display: ${({isExact}) => !isExact? 'none' : 'flex'};
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

const PartnerPools = () => {
    const { path, isExact } = useRouteMatch()
    const { account } = useWeb3React()
    const dispatch = useDispatch()
    const { slowRefresh } = useRefresh()

    const cakePrice = usePriceCakeBusd()
    // const wftmPrice = usePriceGlmrBusd() // test
    const wftmPrice = usePriceCakeBusd()
    const priceList = usePrices()
    const { currentBlock: block } = useBlock()
    
    const farmsData = useFarms()  
    const partnerPools = usePartnerPoolsData()
    const poolsData = usePoolsData()

    const TranslateString = useI18n()
    
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
    //     setViewMode(vm)
    //     localStorage.setItem(VIEWMODE_KEY, vm)
    // }

    const priceToBnb = useCallback((tokenName: string, tokenPrice: BigNumber, quoteToken: QuoteToken): BigNumber => {
      const tokenPriceBN = new BigNumber(tokenPrice)
      if (tokenName === 'WCRO') {
        return new BigNumber(1)
      }
      if (tokenPrice && quoteToken === QuoteToken.CRO) {
        return tokenPriceBN.div(wftmPrice)
      }
      if (tokenPrice && quoteToken === QuoteToken.CGS) {
        return tokenPriceBN.times(cakePrice).div(wftmPrice)
      }
      if (tokenPrice && (quoteToken === QuoteToken.USDC || quoteToken === QuoteToken.BUSD || quoteToken === QuoteToken.ceUSDT 
        || quoteToken === QuoteToken.madUSDC || quoteToken === QuoteToken.madUSDT || quoteToken === QuoteToken.anyUSDC || quoteToken === QuoteToken.anyUSDT)) {
        return tokenPriceBN.div(wftmPrice)
      }
      return tokenPriceBN
    }, [wftmPrice, cakePrice])
    
    useEffect(() => {
        if (account) {
            dispatch(fetchPartnerPoolsUserDataAsync(account))
            dispatch(fetchPoolsUserDataAsync(account))
        }
    }, [account, dispatch, slowRefresh])

    const earningTokenPrices = useMemo(() => {
        const prices = {}
        partnerPoolsConfig.forEach((partnerPool) => {
            const farmPool = farmsData.find(farm => farm.tokenSymbol === partnerPool.earningToken.symbol)
            if (!farmPool) {
                throw new Error(`Could not load price for ${partnerPool.earningToken.symbol} from farms data`)
            }
            
            if (farmPool.quoteTokenSymbol === QuoteToken.USDC || 
                farmPool.quoteTokenSymbol === QuoteToken.BUSD ||
                farmPool.quoteTokenSymbol === QuoteToken.ceUSDT) {
                prices[partnerPool.earningToken.symbol] = new BigNumber(farmPool.tokenPriceVsQuote)
            }
            else
            if (farmPool.quoteTokenSymbol === QuoteToken.CRO) {
                prices[partnerPool.earningToken.symbol] = new BigNumber(farmPool.tokenPriceVsQuote).multipliedBy(wftmPrice)
            }
            else if (farmPool.quoteTokenSymbol === QuoteToken.CGS) {
                prices[partnerPool.earningToken.symbol] = new BigNumber(farmPool.tokenPriceVsQuote).multipliedBy(cakePrice)
            }
            else {
                throw new Error(`Could not find pair to get price for token ${partnerPool.earningToken.symbol} in farms data`)
            }            
        })

        return prices
    }, [farmsData, cakePrice, wftmPrice])

    const [stakedOnly, setStakedOnly] = useState(false)
    const [sortOption, setSortOption] = useState('hot')
    const [query, setQuery] = useState('')

    const activePartnerPools = partnerPools
   
    const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value)
    }
    
    const handleSortOptionChange = (option: OptionProps): void => {
        setSortOption(option.value)
    }

    const partnerPoolsList = useCallback(
        (farmsToDisplay: PartnerPool[]) => {
            const farmsToDisplayWithAPY: PartnerPoolWithComputedValue[] = farmsToDisplay.map((farm) => {
                if (!farm.totalStaked){
                    return farm
                }

                const tokenRewardPerBlock = new BigNumber(farm.tokenPerBlock).times(farm.poolWeight)
                const tokenRewardPerDay = farm.startType === StartType.TIMESTAMP ?
                  tokenRewardPerBlock.times(BLOCKS_PER_DAY).times(BSC_BLOCK_TIME) :
                  tokenRewardPerBlock.times(BLOCKS_PER_DAY)

                const tokenRewardPerYear = farm.startType === StartType.TIMESTAMP ?
                  tokenRewardPerBlock.times(BLOCKS_PER_YEAR).times(BSC_BLOCK_TIME) :
                  tokenRewardPerBlock.times(BLOCKS_PER_YEAR)
                
                const earningTokenPrice = earningTokenPrices[farm.earningToken.symbol]                
                const earningTokenRewardPerYearInUsdc = tokenRewardPerYear.times(earningTokenPrice)

                let tvl = BIG_ZERO
                let apy = BIG_ZERO;  

                if (farm.stakingToken.isTokenOnly){
                    tvl = getBalanceAmount(new BigNumber(farm.totalStaked), farm.stakingToken.token.decimals).times(cakePrice)
                }
                else {
                    // TODO: make sure token 1 is cgs
                    const lpStakedRatio = farm.totalStaked && farm.totalSupply ? 
                        new BigNumber(farm.totalStaked).dividedBy(new BigNumber(farm.totalSupply)) : BIG_ZERO
                    
                    let lpLiquidity = BIG_ZERO
                    if (farm.stakingToken.token1.symbol === 'CGS') {
                      lpLiquidity = farm.lpInToken1 && cakePrice ? getBalanceAmount(new BigNumber(farm.lpInToken1)).times(cakePrice).multipliedBy(2) : BIG_ZERO
                    }
                    else {
                      lpLiquidity = farm.lpInToken0 && cakePrice ? getBalanceAmount(new BigNumber(farm.lpInToken0)).times(cakePrice).multipliedBy(2) : BIG_ZERO
                    }
                    
                    tvl = lpLiquidity.times(lpStakedRatio)
                }

                if(tvl.comparedTo(0) > 0){
                    apy = earningTokenRewardPerYearInUsdc.div(tvl).times(100);
                }
                               
                const lpWorth = farm.totalStaked && tvl.gt(0) ? 
                  tvl.div(getBalanceAmount(new BigNumber(farm.totalStaked), farm.stakingToken.token.decimals)) : BIG_ZERO
       
                return {
                    ...farm, apy, lpWorth, liquidity: tvl.toNumber(), earningTokenPrice, tokenRewardPerDay
                }
            })            

            return farmsToDisplayWithAPY

        }, [cakePrice, earningTokenPrices]
    )

    const poolsList = useCallback(
      (pools: Pool[]) => {  
        const poolsWithApy : PoolWithApy[] = pools.map((pool)  => {
          const isBnbPool = pool.poolCategory === PoolCategory.BINANCE
          const rewardTokenFarm = farmsData.find((f) => f.tokenSymbol === pool.tokenName)
          const stakingTokenFarm = farmsData.find((s) => s.tokenSymbol === pool.stakingTokenName && s.quoteTokenSymbol === QuoteToken.CRO)
      
          // /!\ Assume that the farm quote price is BNB
          const stakingTokenPriceInBNB = isBnbPool ? new BigNumber(1) : new BigNumber(stakingTokenFarm?.tokenPriceVsQuote)

          let rewardTokenPriceInBNB = BIG_ZERO

          if (pool.tokenName === '1BEAM') {
            const salemPrice = priceList.find(_ => _.address.toLowerCase() === pool.tokenAddress.toLowerCase())
            rewardTokenPriceInBNB = priceToBnb(
              pool.tokenName,
              salemPrice ? new BigNumber(salemPrice.price) : BIG_ZERO,
              QuoteToken.USDC
              )
          } else {
            rewardTokenPriceInBNB = priceToBnb(
              pool.tokenName,
              rewardTokenFarm?.tokenPriceVsQuote,
              rewardTokenFarm?.quoteTokenSymbol,
            )   
          }

      
          const totalRewardPricePerYear = rewardTokenPriceInBNB.times(pool.tokenPerBlock).times(BLOCKS_PER_YEAR)
          const totalStakingTokenInPool = stakingTokenPriceInBNB.times(getBalanceNumber(pool.totalStaked))
          const apy = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)
          const earningTokenPrice = rewardTokenPriceInBNB.times(wftmPrice)
          const stakingTokenPrice = stakingTokenPriceInBNB.times(wftmPrice)
          const liquidity = pool.totalStaked && stakingTokenPrice.gt(0) ? 
            getBalanceAmount(pool.totalStaked).times(stakingTokenPrice).toNumber() : 0
    
          return {
            ...pool,
            isFinished: pool.sousId === 0 ? false : pool.isFinished || block > pool.endBlock,
            apy,
            liquidity,
            earningTokenPrice,
            stakingTokenPrice
          }
        })    

        return partition(poolsWithApy, (pool) => pool.isFinished)
    }, [farmsData, block, wftmPrice, priceToBnb, priceList])
    
    const [finishedPools, openPools] = poolsList(poolsData)
    
    const farmsStakedMemoized = useMemo(() => {
        let farmsStaked = []

        const sortFarms = (farms) => {
          switch (sortOption) {
            case 'apr':
              return orderBy(farms, (farm) => (farm.apy ? farm.apy.toNumber() : 0), 'desc')           
            case 'earned':
              return orderBy(
                farms,
                (farm) => (farm.userData ? Number(farm.userData.pendingReward) : 0),
                'desc',
              )
            case 'liquidity':
              return orderBy(farms, (farm) => Number(farm.liquidity), 'desc')
            default:
              return farms
          }
        }

        const computedPartnerPools = partnerPoolsList(activePartnerPools)
        const farms = [].concat(...openPools).concat(...computedPartnerPools)

        farmsStaked = stakedOnly ? farms.filter((farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0)) 
          : farms.filter((farm) => {
            return (!farm.isHardCodeFinished);
          })

        if (query) {
          const lowercaseQuery = latinise(query.toLowerCase())
          farmsStaked = farmsStaked.filter((farm) => {
            return (farm.earningToken && latinise(farm.earningToken.symbol.toLowerCase()).includes(lowercaseQuery)) 
            || (farm.tokenName && latinise(farm.tokenName.toLowerCase()).includes(lowercaseQuery))
          })
        } 

        return sortFarms(farmsStaked)
    }, [
        partnerPoolsList,        
        activePartnerPools,
        openPools,
        sortOption,
        stakedOnly,
        query,
    ])    

    const farmsStakedMemoizedWithInactivePools = useMemo(() => {

      const computedPartnerPools = partnerPoolsList(activePartnerPools)
      const farms = []
        .concat(...finishedPools)
        .concat(
          ...computedPartnerPools.filter(
            (farm) =>
              (farm.apy ? farm.apy.toNumber() : 0) <= 0 ||
              farm.isHardCodeFinished ||
              (farm.tokenRewardPerDay ? farm.tokenRewardPerDay.toNumber() : 0) <= 0,
          ),
        )
        const sortFarms = (sortFarms2) => {
            return orderBy(sortFarms2, (farm) => Number(farm.endBlock), 'desc')
          }

      return sortFarms(farms)
    }, [partnerPoolsList, activePartnerPools, finishedPools])

    return (
        <Page>
            <Heading as="h1" size="lg" color="primaryBright" mb="50px" style={{ textAlign: 'center' }}>
                {
                    TranslateString(999, 'Stake CGS LP to earn other tokens')
                }
            </Heading>
            {/* <CbankHeaderCountDown />          */}
            <PoolTabButtons />
            <ControlContainer isExact={isExact}>
                <ViewControls>  
                  {/* <ToggleView viewMode={viewMode} onToggle={(mode: ViewMode) => handleSetViewMode(mode)} />         */}
                  <ToggleWrapper>
                      <Toggle checked={stakedOnly} onChange={() => setStakedOnly(!stakedOnly)} />
                      <Text color= "text" > {TranslateString(699, 'Staked only')}</Text>
                  </ToggleWrapper>
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
                <Route exact path={`${path}`}>
                  <FarmTableLayout>
                    { viewMode === ViewMode.TABLE ? (
                          <FarmTable>              
                            <>                           
                              {farmsStakedMemoized.map((farm) => 
                                {
                                  if (farm.sousId) {
                                    return <RowCbankPoolCard key={`syrup-${farm.sousId}-${farm.isFinished}`} farm={farm} isInactivePartnerPool = {false}/>
                                  }
                                  return <RowFarmCard key={`partner-${farm.partnerId}`} 
                                    farm={farm} 
                                    bnbPrice={wftmPrice} 
                                    cakePrice={cakePrice} 
                                    account={account} removed={false} />                     
                                })
                              }    
                              {linkPartnerPools.map(pool => {
                                  return <RowLinkPartner key={`partner-link-row-${pool.partnerId}`} 
                                    linkPartnerPool={pool}
                                    account={account}/>
                              })}                        
                            </>                        
                          </FarmTable>
                      ) : (<>                          
                            {farmsStakedMemoized.map((farm) => {
                              if (farm.sousId) {
                                return <CbankPoolCard key={`syrup-${farm.sousId}-${farm.isFinished}`} pool={farm} />
                              }
                              return <FarmCard key={`partner-${farm.partnerId}`} 
                                  farm={farm} 
                                  bnbPrice={wftmPrice} 
                                  cakePrice={cakePrice} 
                                  account={account} removed={false} />                                                 
                              })
                            }    
                             {linkPartnerPools.map(pool => {
                                  return <LinkPartnerCard key={`partner-link-card-${pool.partnerId}`} 
                                    linkPartnerPool={pool}
                                    account={account}/>
                              })}                             
                          </>                                              
                      )}     
                  </FarmTableLayout>                  
                </Route>            
                <Route path={`${path}/history`}>
                    {/* <FlexLayout>
                      {orderBy(finishedPools, ['sortOrder']).map((pool) => (
                        <PoolCard key={pool.sousId} pool={pool} />
                      ))}
                    </FlexLayout> */}
                     <FarmTable>
                      {farmsStakedMemoizedWithInactivePools.map((farm) => {
                        if (farm.sousId) {
                          return <RowCbankPoolCard key={`syrup-${farm.sousId}-${farm.isFinished}`} farm={farm} isInactivePartnerPool />
                        }
                        return (
                          <RowFarmCard key={`partner-${farm.partnerId}`} 
                                      farm={farm} 
                                      bnbPrice={wftmPrice} 
                                      cakePrice={cakePrice} 
                                      account={account} removed={false}
                                      isInactivePartnerPool /> 
                        )
                      })}
                  </FarmTable>
                </Route>               
            </div>    

        </Page>
    )
}



export default PartnerPools