import React, { useEffect, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import styled, { keyframes } from 'styled-components'
import { Flex, Text, Skeleton } from '@pancakeswap-libs/uikit'
import { useTransferTaxRate } from 'state/hooks'
import { Farm } from 'state/types'
import { provider } from 'web3-core'
import useI18n from 'hooks/useI18n'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { QuoteToken } from 'config/constants/types'
import lpTokens from 'config/constants/lp-tokens'
import DetailsSection from './DetailsSection'
import CardHeading from './CardHeading'
import CardActionsContainer from './CardActionsContainer'
import ApyButton from './ApyButton'

export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber
  lpWorth?: BigNumber
  cakeRewardPerDay?: BigNumber
  liquidity?: BigNumber
}

const RainbowLight = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`

const Tada = keyframes`
  0% {
    transform: scale(1)
  }
  10%, 20% {
    transform: scale(.9) rotate(-8deg);
  }
  30%, 50%, 70% {
    transform: scale(1.3) rotate(8deg);
  } 
  40%, 60% {
    transform: scale(1.3) rotate(-8deg);
  }
  100% {
    transform: scale(1) rotate(0)
  }
`

const StyledCardAccent = styled.div`
  /* background: linear-gradient(45deg,
  rgba(255, 0, 0, 1) 0%,
  rgba(255, 154, 0, 1) 10%,
  rgba(208, 222, 33, 1) 20%,
  rgba(79, 220, 74, 1) 30%,
  rgba(63, 218, 216, 1) 40%,
  rgba(47, 201, 226, 1) 50%,
  rgba(28, 127, 238, 1) 60%,
  rgba(95, 21, 242, 1) 70%,
  rgba(186, 12, 248, 1) 80%,
  rgba(251, 7, 217, 1) 90%, 
  rgba(255, 0, 0, 1) 100%); */
  background-size: 300% 300%;
  animation: ${RainbowLight} 2s linear infinite;
  border-radius: 72px;
  filter: blur(6px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
`

const FCard = styled.div`
  position: relative;
  align-self: baseline;  
  opacity: 0.9;
  background: url(/images/egg/farm-card-bg.jpg) 0% 0% / cover no-repeat;
  border-radius: 41px;
  background-blend-mode: luminosity;
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
  position: relative;
  text-align: center;
  font-size: 0.8em;
  max-width: 27%;
`

const NewImage = styled.img`
  position: absolute;
  top:  -40px;
  left: -10px;
  width: 80px;
  animation: ${Tada} 1.5s linear infinite;
`

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.borderColor};
  height: 1px;
  margin: 28px auto;
  width: 100%;
`

const CardInfoWrapper = styled.div`
    background-color: #1c1c1c;    
    border-radius: 20px;
    padding: 10px;
`

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? '100%' : '0px')};
  overflow: hidden;
`



interface FarmCardProps {
  farm: FarmWithStakedValue
  removed: boolean
  cakePrice?: BigNumber
  bnbPrice?: BigNumber
  account?: string
}

const FarmCard: React.FC<FarmCardProps> = ({ farm, removed, cakePrice, bnbPrice, account }) => {
  const TranslateString = useI18n()

  const [showExpandableSection, setShowExpandableSection] = useState(false)

  // const isCommunityFarm = communityFarms.includes(farm.tokenSymbol)
  // We assume the token name is coin pair + lp e.g. CAKE-BNB LP, LINK-BNB LP,
  // NAR-CAKE LP. The images should be cake-bnb.svg, link-bnb.svg, nar-cake.svg
  // const farmImage = farm.lpSymbol.split(' ')[0].toLocaleLowerCase()  
  const farmImage = farm.isTokenOnly ? farm.tokenSymbol.toLowerCase() : `${farm.tokenSymbol.toLowerCase()}_${farm.quoteTokenSymbol.toLowerCase()}`

  const totalValueFormated = farm.liquidity
    ? `$${Number(farm.liquidity).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
    : '-'

  const lpLabel = farm.lpSymbol
  const earnLabel = 'CGS' 

  const farmAPY = farm.apy && farm.apy.toNumber().toLocaleString('en-US', { maximumFractionDigits: 2 })

  const { quoteTokenAdresses, quoteTokenSymbol, tokenAddresses, risk } = farm

  return (
    <FCard>
      {(farm.tokenSymbol === 'CGS' ||  farm.quoteTokenSymbol === 'CGS')
        && <StyledCardAccent />}
      {farm.isNewPool && 
      (<NewImage src="/images/egg/newpool.png" alt = {farm.lpSymbol} />)}
      <CardHeading
        lpLabel={lpLabel}
        multiplier={farm.multiplier}
        depositFee={farm.depositFeeBP}
        farmImage={farmImage}
        isTokenOnly={farm.isTokenOnly}
        isPartner={farm.isPartner}
        tokenSymbol={farm.tokenSymbol}
        dex={farm.dex}
        quoteTokenSymbol={farm.quoteTokenSymbol}
      />
      <CardInfoWrapper>        
        {!removed && (
          <Flex justifyContent='space-between' alignItems='center'>
            <Text color="#ffffff">{TranslateString(352, 'APR')}:</Text>
            <Text bold style={{ display: 'flex', alignItems: 'center' }} color="text">
              {farm.apy ? 
                <>
                  {farm.apy.gt(0) ? (
                    <>
                      <ApyButton
                        lpLabel={lpLabel}
                        quoteTokenAdresses={quoteTokenAdresses}
                        quoteTokenSymbol={quoteTokenSymbol}
                        tokenAddresses={tokenAddresses}
                        cakePrice={cakePrice}
                        isTokenOnly={farm.isTokenOnly}
                        dex={farm.dex}
                        apy={farm.apy}                    
                      />                
                      {farmAPY}%
                    </>
                  ): <>-</>}
                </>
               : (
                <Skeleton height={24} width={80} />
              )}
            </Text>
          </Flex>
        )}
        {!removed && (<Flex justifyContent='space-between'>
          <Text color="#ffffff">{TranslateString(23, 'Total Liquidity')}:</Text>
          <Text bold color="text">{totalValueFormated}</Text>
        </Flex>
        )}
        <Flex justifyContent='space-between'>
          <Text color="#ffffff">{TranslateString(318, 'Earn')}:</Text>
          <Text bold color="text">{earnLabel}</Text>
        </Flex>
        <Flex justifyContent='space-between'>
          <Text color="#ffffff">{TranslateString(10001, 'Deposit Fee')}:</Text>
          <Text bold color="text">{(farm.depositFeeBP / 100)}%</Text>
        </Flex>           
      </CardInfoWrapper>      
      <CardActionsContainer farm={farm} account={account} />
      <Divider />
      <ExpandableSectionButton
        onClick={() => setShowExpandableSection(!showExpandableSection)}
        expanded={showExpandableSection}
      />
      <ExpandingWrapper expanded={showExpandableSection}>
        <DetailsSection
          removed={removed}
          isTokenOnly={farm.isTokenOnly}
          bscScanAddress={
            farm.isTokenOnly ?
              `https://polygonscan.com/address/${farm.tokenAddresses[process.env.REACT_APP_CHAIN_ID]}`
              :
              `https://polygonscan.com/address/${farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]}`
          }
          totalValueFormated={totalValueFormated}
          lpLabel={lpLabel}
          quoteTokenAdresses={quoteTokenAdresses}
          quoteTokenSymbol={quoteTokenSymbol}
          tokenAddresses={tokenAddresses}
          dex={farm.dex}
          account={account}
          lpTokenDecimals={farm.lpTokenDecimals}
        />
      </ExpandingWrapper>
    </FCard>
  )
}

export default FarmCard
