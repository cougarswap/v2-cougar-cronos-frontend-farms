import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Button, IconButton, useModal, AddIcon, Image, Flex, Text, Skeleton } from '@pancakeswap-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import farmToken from 'config/constants/farm-tokens'
import { useERC20 } from 'hooks/useContract'
import { useSousApprove } from 'hooks/useApprove'
import useI18n from 'hooks/useI18n'
import { useSousStake } from 'hooks/useStake'
import { useSousUnstake } from 'hooks/useUnstake'
import { useBlock } from 'state/block/hooks'
import { useSousHarvest } from 'hooks/useHarvest'
import { QuoteToken, PoolCategory, StakingToken, Token, Address } from 'config/constants/types'
import { Pool } from 'state/types'
import { useTransferTaxRate } from 'state/tokenPublicData/hooks'
import DepositModal from 'views/Pools/components/DepositModal'
import CompoundModal from 'views/Pools/components/CompoundModal'
import WithdrawModal from 'views/Pools/components/WithdrawModal'
import ApyButton from 'views/Farms/components/FarmCard/ApyButton'
import { getBalanceAmount, getDecimalAmount } from 'utils/formatBalance'
import CardHeading from 'views/PartnerPools/components/CardHeading'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import DetailsSection from 'views/PartnerPools/components/DetailsSection'
import CBankCardActionsContainer from './CBankCardActionsContainer'

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID

interface PoolWithApy extends Pool {
  apy: BigNumber
  earningTokenPrice?: BigNumber
  stakingTokenPrice?: BigNumber
}

interface HarvestProps {
  pool: PoolWithApy
}

const CbankPoolCard: React.FC<HarvestProps> = ({ pool }) => {
  const {
    sousId,
    image,
    tokenName,
    tokenAddress,    
    stakingTokenName,
    stakingTokenAddress,
    contractAddress,
    projectLink,
    harvest,
    apy,
    tokenDecimals,
    poolCategory,
    totalStaked,
    startBlock,
    endBlock,
    isFinished,
    userData,
    stakingLimit,
    isNewPool,
    earningTokenPrice,
    stakingTokenPrice
  } = pool
  // Pools using native BNB behave differently than pools using a token
  const isBnbPool = poolCategory === PoolCategory.BINANCE
  const TranslateString = useI18n()
  const stakingTokenContract = useERC20(stakingTokenAddress)
  const { account } = useWeb3React()
  const { currentBlock : block } = useBlock()
  const { onApprove } = useSousApprove(stakingTokenContract, sousId)
  const { onStake } = useSousStake(sousId, isBnbPool)
  const { onUnstake } = useSousUnstake(sousId)
  const { onReward } = useSousHarvest(sousId, isBnbPool)
  const transferTaxRate = useTransferTaxRate()
  
  const [requestedApproval, setRequestedApproval] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)
  const [showExpandableSection, setShowExpandableSection] = useState(false)

  const allowance = new BigNumber(userData?.allowance || 0)
  const stakingTokenBalance = new BigNumber(userData?.stakingTokenBalance || 0)
  const stakedBalance = new BigNumber(userData?.stakedBalance || 0)
  const earnings = new BigNumber(userData?.pendingReward || 0)

  const blocksUntilStart = Math.max(startBlock - block, 0)
  const blocksRemaining = Math.max(endBlock - block, 0)

  const stakingToken: StakingToken = {
        isTokenOnly: true, 
        token: {
            symbol: stakingTokenName,
            address: stakingTokenAddress
        }
  }

  const earningToken: Token = {
      symbol: tokenName,
      address: tokenAddress,
      decimals: tokenDecimals
  }

  const quoteTokenAdresses : Address = {25: farmToken.wcro }
  const quoteTokenSymbol = 'WCRO' 
  const tokenAddresses: Address = { 25:  stakingToken.token.address }
  const farmAPY = apy && apy.toNumber().toLocaleString('en-US', { maximumFractionDigits: 2 })

  const totalValueFormated = useMemo(() => {
    const totalLiquidity = totalStaked && stakingTokenPrice.gt(0) ? getBalanceAmount(totalStaked).times(stakingTokenPrice).toNumber() : 0
    return `$${totalLiquidity.toLocaleString(undefined, { maximumFractionDigits: 2 })}`      
  }, [totalStaked, stakingTokenPrice]) 

  const fee = transferTaxRate * 100 // deposit fee and widthdraw fee

  return (
    <FCard>    
      {isNewPool && 
      (<NewImage src="/images/egg/newpool.png" alt = {tokenName} />)}
      <CardHeading
        lpLabel={tokenName}        
        depositFee={fee}
        isTokenOnly
        isPartner={false}
        tokenSymbol={stakingTokenName}
        quoteTokenSymbol={tokenName}
        stakingToken={stakingToken}  
        earningToken={earningToken}   
        blocksUntilStart={blocksUntilStart}
      />
      <CardInfoWrapper>        
          <Flex justifyContent='space-between' alignItems='center'>
              <Text>{TranslateString(352, 'APR')}:</Text>
              <Text bold style={{ display: 'flex', alignItems: 'center' }}>
              {apy ? 
                  <>
                  {apy.gt(0) ? (
                      <>
                      <ApyButton
                          lpLabel={stakingToken.token.symbol}
                          quoteTokenAdresses={quoteTokenAdresses}
                          quoteTokenSymbol={quoteTokenSymbol}
                          tokenAddresses={tokenAddresses}
                          cakePrice={earningTokenPrice}
                          isTokenOnly={stakingToken.isTokenOnly}
                          apy={apy}   
                          cakeSymbol={earningToken.symbol}                 
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
        <Flex justifyContent='space-between'>
          <Text>{TranslateString(23, 'Total Liquidity')}:</Text>
          <Text bold>{totalValueFormated}</Text>
        </Flex>      
        <Flex justifyContent='space-between'>
          <Text>{TranslateString(999, 'Transaction Fee')}:</Text>
          <Text bold>{fee / 100}%</Text>
        </Flex>           
      </CardInfoWrapper>      
      <CBankCardActionsContainer farm={pool} account={account} />
      <Divider />
      <ExpandableSectionButton
        onClick={() => setShowExpandableSection(!showExpandableSection)}
        expanded={showExpandableSection}
      />
      <ExpandingWrapper expanded={showExpandableSection}>
        <DetailsSection
          isTokenOnly
          bscScanAddress={`https://cronoscan.com/address/${tokenAddress}`}
          masterChefBscScanAddress={`https://cronoscan.com/address/${contractAddress}`}
          projectLink={projectLink}
          earningToken={earningToken}
          totalValueFormated={totalValueFormated}
          lpLabel={stakingToken.token.symbol}
          quoteTokenAdresses={quoteTokenAdresses}
          quoteTokenSymbol={quoteTokenSymbol}
          tokenAddresses={tokenAddresses}          
          account={account}
          lpTokenDecimals={stakingToken.token.decimals}
          endBlock={endBlock}
          blocksRemaining={blocksRemaining}
          startBlock={startBlock}
          blocksUntilStart={blocksUntilStart}
        />
      </ExpandingWrapper>
    </FCard>
  )
}


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

const CardInfoWrapper = styled.div`
    background-color: ${({ theme }) => theme.colors.invertedContrast}80;    
    border-radius: 20px;
    padding: 10px;
`

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? '100%' : '0px')};
  overflow: hidden;
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

export default CbankPoolCard
