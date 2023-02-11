import React, { useEffect, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import styled, { keyframes } from 'styled-components'
import { Flex, Text, Skeleton } from '@pancakeswap-libs/uikit'
import { Farm, PartnerPool } from 'state/types'
import farmToken from 'config/constants/farm-tokens'
import useI18n from 'hooks/useI18n'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { Address, QuoteToken } from 'config/constants/types'
import ApyButton from 'views/Farms/components/FarmCard/ApyButton'
import { useTransferTaxRate } from 'state/tokenPublicData/hooks'
import CardActionsContainer from './CardActionsContainer'
import CardHeading from './CardHeading'
import DetailsSection from './DetailsSection'


export interface PartnerPoolWithComputedValue extends PartnerPool {
    apy?: BigNumber
    lpWorth?: BigNumber
    tokenRewardPerDay?: BigNumber
    liquidity?: number   
    earningTokenPrice?: BigNumber
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

const FCard = styled.div`
  position: relative;
  align-self: baseline;  
  opacity: 0.8;
  background: url(/images/egg/farm-card-bg.jpg) 0% 0% / cover no-repeat;
  background-color: #000113;
  background-blend-mode: luminosity;
  border: 1px solid ${({ theme }) => theme.colors.contrast};
  border-radius: 72px;
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
    background-color: ${({ theme }) => theme.colors.invertedContrast}80;    
    border-radius: 20px;
    padding: 10px;
`

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? '100%' : '0px')};
  overflow: hidden;
`

interface FarmCardProps {
  farm: PartnerPoolWithComputedValue
  removed: boolean
  cakePrice?: BigNumber
  bnbPrice?: BigNumber
  account?: string
}

const FarmCard: React.FC<FarmCardProps> = ({ farm, removed, account }) => {
  const TranslateString = useI18n()

  const [showExpandableSection, setShowExpandableSection] = useState(false)

  const farmImage = farm.stakingToken.isTokenOnly ? farm.stakingToken.token.symbol.toLowerCase() : `${farm.stakingToken.token0.symbol.toLowerCase()}_${farm.stakingToken.token1.symbol.toLowerCase()}`

  const totalValueFormated = farm.liquidity
    ? `$${Number(farm.liquidity).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
    : '-'

  const lpLabel = farm.stakingToken.token.symbol

  const farmAPY = farm.apy && farm.apy.toNumber().toLocaleString('en-US', { maximumFractionDigits: 2 })

  const quoteTokenAdresses : Address = {137: farm.stakingToken.isTokenOnly ? farmToken.wmatic : farm.stakingToken.token0.address }
  const quoteTokenSymbol = farm.stakingToken.isTokenOnly ? 'MATIC' : farm.stakingToken.token0.symbol
  const tokenAddresses: Address = {137:  farm.stakingToken.isTokenOnly ? farm.stakingToken.token.address : farm.stakingToken.token1.address }

  const transferTaxRate = useTransferTaxRate()

  return (
    <FCard>    
      {farm.isNewPool && 
      (<NewImage src="/images/egg/newpool.png" alt = {farm.earningToken.symbol} />)}
      <CardHeading
        lpLabel={lpLabel}
        depositFee={farm.stakingToken.isTokenOnly ? transferTaxRate : 0}
        farmImage={farmImage}
        isTokenOnly={farm.stakingToken.isTokenOnly}
        isPartner={false}
        tokenSymbol={farm.stakingToken.token.symbol}
        dex={farm.dex}
        quoteTokenSymbol={quoteTokenSymbol}
        stakingToken={farm.stakingToken}  
        earningToken={farm.earningToken}   
      />
      <CardInfoWrapper>        
        {!removed && (
          <Flex justifyContent='space-between' alignItems='center'>
            <Text>{TranslateString(352, 'APR')}:</Text>
            <Text bold style={{ display: 'flex', alignItems: 'center' }}>
              {farm.apy ? 
                <>
                  {farm.apy.gt(0) ? (
                    <>
                      <ApyButton
                        lpLabel={lpLabel}
                        quoteTokenAdresses={quoteTokenAdresses}
                        quoteTokenSymbol={quoteTokenSymbol}
                        tokenAddresses={tokenAddresses}
                        cakePrice={farm.earningTokenPrice}
                        isTokenOnly={farm.stakingToken.isTokenOnly}
                        dex={farm.dex}
                        apy={farm.apy}   
                        cakeSymbol={farm.earningToken.symbol}                 
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
          <Text>{TranslateString(23, 'Total Liquidity')}:</Text>
          <Text bold>{totalValueFormated}</Text>
        </Flex>
        )}        
        <Flex justifyContent='space-between'>
          <Text>
            {farm.stakingToken.isTokenOnly && farm.stakingToken.token.symbol === 'CGS' ? (
                TranslateString(999, 'Transaction Fee:')
              ) : TranslateString(999, 'Fee:')
            }            
          </Text>
          <Text bold>
            {farm.stakingToken.isTokenOnly && farm.stakingToken.token.symbol === 'CGS' ? 
                `${transferTaxRate}%`
               : '0%'
            }     
          </Text>
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
          isTokenOnly={farm.stakingToken.isTokenOnly}
          bscScanAddress={`https://polygonscan.com/address/${farm.stakingToken.token.address}`}
          masterChefBscScanAddress={`https://polygonscan.com/address/${farm.masterchefAddress}`}
          projectLink={farm.projectLink}
          earningToken={farm.earningToken}
          totalValueFormated={totalValueFormated}
          lpLabel={lpLabel}
          quoteTokenAdresses={quoteTokenAdresses}
          quoteTokenSymbol={quoteTokenSymbol}
          tokenAddresses={tokenAddresses}
          dex={farm.dex}
          account={account}
          lpTokenDecimals={farm.stakingToken.token.decimals}
        />
      </ExpandingWrapper>
    </FCard>
  )
}

export default FarmCard
