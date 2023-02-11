import React, { useEffect, useState } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import styled, { keyframes } from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Heading, Flex, LinkExternal } from '@pancakeswap-libs/uikit'
import { BLOCKS_PER_YEAR, BSC_BLOCK_TIME } from 'config'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import useI18n from 'hooks/useI18n'
import { useBlock } from 'state/block/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import { useFarms, usePools, usePoolFromPid, usePriceCakeBusd, usePrices } from 'state/hooks'
import { QuoteToken, PoolCategory } from 'config/constants/types'
import FlexLayout from 'components/layout/Flex'
import { BIG_ZERO } from 'utils/bigNumber'
import Page from 'components/layout/Page'
import Coming from './components/Coming'
import PoolCard from './components/PoolCard'
import PoolTabButtons from './components/PoolTabButtons'
import Divider from './components/Divider'
import CbankHeaderCountDown from './components/CbankHeaderCountDown'

const Farm: React.FC = () => {
  const { path } = useRouteMatch()
  const TranslateString = useI18n()
  const { account } = useWeb3React()
  const farms = useFarms()
  const pools = usePools(account)
  // const bnbPriceUSD = usePriceGlmrBusd() // test
  const bnbPriceUSD = usePriceCakeBusd()
  const cakePrice = usePriceCakeBusd()
  const priceList = usePrices()
  const { currentBlock : block } = useBlock()

  const priceToBnb = (tokenName: string, tokenPrice: BigNumber, quoteToken: QuoteToken): BigNumber => {
    const tokenPriceBN = new BigNumber(tokenPrice)
    if (tokenName === 'WMATIC') {
      return new BigNumber(1)
    }
    if (tokenPrice && quoteToken === QuoteToken.MATIC) {
      return tokenPriceBN.div(bnbPriceUSD)
    }
    if (tokenPrice && quoteToken === QuoteToken.CGS) {
      return tokenPriceBN.times(cakePrice).div(bnbPriceUSD)
    }
    return tokenPriceBN
  }

  const poolsWithApy = pools.map((pool) => {
    const isBnbPool = pool.poolCategory === PoolCategory.BINANCE
    const rewardTokenFarm = farms.find((f) => f.tokenSymbol === pool.tokenName)
    const stakingTokenFarm = farms.find((s) => s.tokenSymbol === pool.stakingTokenName && s.quoteTokenSymbol === QuoteToken.MATIC)

    // /!\ Assume that the farm quote price is BNB
    const stakingTokenPriceInBNB = isBnbPool ? new BigNumber(1) : new BigNumber(stakingTokenFarm?.tokenPriceVsQuote)

    let rewardTokenPriceInBNB = BIG_ZERO

    if (pool.tokenName === 'TERRA') {
      const terraPrice = priceList[pool.tokenName.toLowerCase()]

      rewardTokenPriceInBNB = priceToBnb(
        pool.tokenName,
        terraPrice,
        QuoteToken.USDC
      )
    }
    else  {
      rewardTokenPriceInBNB = priceToBnb(
        pool.tokenName,
        rewardTokenFarm?.tokenPriceVsQuote,
        rewardTokenFarm?.quoteTokenSymbol,
      )
    }          
    
    const totalRewardPricePerYear = rewardTokenPriceInBNB.times(pool.tokenPerBlock).times(BLOCKS_PER_YEAR)
    const totalStakingTokenInPool = stakingTokenPriceInBNB.times(getBalanceNumber(pool.totalStaked))
    const apy = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)
    
    const earningTokenPrice = rewardTokenPriceInBNB.times(bnbPriceUSD)

    return {
      ...pool,
      isFinished: pool.sousId === 0 ? false : pool.isFinished || block > pool.endBlock,
      apy,
      earningTokenPrice
    }
  })

  const [finishedPools, openPools] = partition(poolsWithApy, (pool) => pool.isFinished)

  return (
    <Page>
      <Heading as="h1" color="primary" size="lg" mb="10px" style={{ textAlign: 'center' }}>
        {TranslateString(999, 'COUGAR CBANK')}
      </Heading>   
      <StyledInstruction>
       <ul>
          <li>{TranslateString(580, 'Stake CGS to earn new tokens.')}</li>
          <li>{TranslateString(404, 'You can unstake at any time.')}</li>
          <li>{TranslateString(406, 'Rewards are calculated per block.')}</li>
        </ul>
      </StyledInstruction> 
      {/* <CbankHeaderCountDown />          */}
      <PoolTabButtons />
      <Divider />
      <FlexLayout>
        <Route exact path={`${path}`}>
          <>
            {orderBy(openPools, ['sortOrder']).map((pool) => (
              <PoolCard key={pool.sousId} pool={pool} />
            ))}
            <Coming />
          </>
        </Route>
        <Route path={`${path}/history`}>
          {orderBy(finishedPools, ['sortOrder']).map((pool) => (
            <PoolCard key={pool.sousId} pool={pool} />
          ))}
        </Route>
      </FlexLayout>
    </Page>
  )
}

const StyledInstruction = styled.div`
  &>ul {
    list-style-type: none;
    text-align: center;
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.9em;
    &>li+li {
      margin-top: 5px;
    }
  }
  margin-bottom: 30px;
`

export default Farm
