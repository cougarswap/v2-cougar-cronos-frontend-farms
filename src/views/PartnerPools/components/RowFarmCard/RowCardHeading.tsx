import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import { Address, DexSwapRouter, StakingToken, Token } from 'config/constants/types'
import { getBalanceNumber } from 'utils/formatBalance'
import { Text, Flex, Skeleton, LinkExternal } from '@pancakeswap-libs/uikit'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import DexTag from 'views/Farms/components/FarmCard/RowFarmCard/DexTag'
import NewPoolTag from 'views/Farms/components/FarmCard/RowFarmCard/NewPoolTag'
import ApyButton from 'views/Farms/components/FarmCard/ApyButton'
import { getBscScanLink } from 'utils'
import Balance from 'components/Balance'
import WaitingTag from 'views/Farms/components/FarmCard/RowFarmCard/WaitingTag'
import FinishedTag from 'views/Farms/components/FarmCard/RowFarmCard/FinishedTag'
import { useBlock } from 'state/block/hooks'
// import { WaitingTag } from 'components/Tags'

export interface SyrupBlock {
  endBlock?: number
  blocksRemaining?: number
  startBlock?: number
  blocksUntilStart?: number
}

export interface ExpandableSectionProps extends SyrupBlock {
  lpLabel?: string
  multiplier?: string
  risk?: number
  depositFee?: number,
  poolTransferTaxFee?:number,
  apy?: BigNumber,
  cakeRewardPerDay?: BigNumber,
  stakedBalance?: BigNumber,
  lpTokenDecimals?: number,
  earnings?:BigNumber,
  tvl?: string,
  farmImage?: string,
  harvestInterval?: number,
  withdrawalInterval?: number,
  isTokenOnly?: boolean,  
  isPartner?: boolean,
  isNewPool?: boolean,
  dex?: DexSwapRouter,
  tokenSymbol?: string,
  quoteTokenSymbol?: string,
  quoteTokenAdresses?: Address,
  tokenAddresses?: Address,
  cakePrice?: BigNumber,
  stakingToken?: StakingToken,
  earningToken?: Token,
  showExpandableSection?: boolean;
  setShowExpandableSection?: any;  
  isInactivePartnerPool?: boolean;
}

const Wrapper = styled.tr`
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05);
  position: relative;
  font-size: 0.8em;  
  margin: 0;  
  border-bottom: 1px solid #5f7e61;  
  &>td {
    padding: 20px 20px 20px 0;
  }
  svg {
    margin-right: 0.25rem;
  }    
`

const TokenLableFlex = styled(Flex)`
  flex-basic: 50%;
`

const LpPairsToken = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  min-width: 96px;
`

const ImageWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  min-width: 96px;
`

const LpTokenInfo = styled(Flex)`
  min-width: 96px;
  margin-left: 10px;
  position: relative;
`

const SingleTokenImage = styled.img`
  width: 48px;
  height: 48px;
`
const PairTokenImage = styled.div`
  width: 50px;
  height: 50px;    
  position: relative;
`
const TokenSymbolImage = styled.img`
  width: 32px;
  height: 32px;
  position: absolute;
  left: 0;
  top: 0;
`
const QuoteTokenSymbolImage = styled.img`
  width: 36px;
  height: 36px;
  position: absolute;
  right: 0;
  top: 0;
`

const StakeEarnLabelWrapper = styled.div`
  padding: 3px;
`

const EarnLabel = styled.div`
  color: ${({theme}) => theme.colors.primaryDark};
  font-size: 1.1em;
  font-weight: 600;
`

const StakeLabel = styled.div`
  color: #358562;
  font-size: 0.8em;
  font-weight: 700;
  color: ${({theme}) => theme.colors.textSubTitleFarm};
`

const EarningToken = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  bottom: 0;
  left: 60%;
`

const EarningTokenImage = styled.img`
  width: 24px;
  height: 24px;
  background-color: #ffbc77;
  border: 3px solid #ae5827;
  box-shadow: 0px 0px 5px 1px #65c199;
  border-radius: 50%;
`

const StyledLinkExternal = styled(LinkExternal)`
  color: ${({ theme }) => theme.colors.textSubTitleFarm};

  svg {
    fill: ${({ theme }) => theme.colors.textSubTitleFarm};
  }
`

const InfoColumnWrapper = styled.td`
  display: none;

  ${({ theme }) => theme.mediaQueries.nav} {
    display: table-cell;
  }
`

const InfoColumn = styled.div`
  display: none;
  ${({ theme }) => theme.mediaQueries.nav} {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`

const TextTitle = styled(Text)`
  color: ${({theme}) => theme.colors.textTitleFarm};
  text-align: center;
  font-size: 14px;
`

const LpFooterTags = styled.div<{left?: string}>`
    padding: 3px;
    text-align: center;
    position: absolute;
    top: 100%;
    left: ${({left}) => left || '0'};
    display: flex;    
    & > *+* {
      margin-left: 10px;
    }
`

const RowCardHeading: React.FC<ExpandableSectionProps> = ({
  lpLabel,
  depositFee,
  apy,
  cakeRewardPerDay,
  stakedBalance,
  lpTokenDecimals,
  earnings,
  tvl,
  isTokenOnly,
  isNewPool,
  dex,
  harvestInterval,
  withdrawalInterval,
  tokenSymbol,
  quoteTokenSymbol,
  quoteTokenAdresses,
  tokenAddresses,
  cakePrice,
  stakingToken,
  earningToken,
  showExpandableSection,
  setShowExpandableSection,
  startBlock,
  blocksUntilStart,
  endBlock, 
  blocksRemaining,
  isInactivePartnerPool
}) => {
  const farmAPY = apy && apy.toNumber().toLocaleString('en-US', { maximumFractionDigits: 2 })
  const rewardPerDay = cakeRewardPerDay && cakeRewardPerDay.toNumber().toLocaleString('en-US', { maximumFractionDigits: 2 })
  const rawEarningsBalance = getBalanceNumber(earnings)
  const displayEarningsBalance = rawEarningsBalance.toLocaleString() 
  const { currentBlock: block } = useBlock() 

  const title = useMemo(() => {    
    if (isInactivePartnerPool){
      return 'Ended'
    }
    if (blocksUntilStart && blocksUntilStart > 0){
      return 'Starts In'
    }
    return 'Ends In'
  }, [blocksUntilStart, isInactivePartnerPool])

  return (
    <Wrapper>
      <td>
        <TokenLableFlex alignItems="center">
          <ImageWrapper>
              <LpPairsToken>          
                  {isTokenOnly ? (<SingleTokenImage src={`/images/single-token/${tokenSymbol}.png`} alt={tokenSymbol} />) : 
                      (<PairTokenImage>
                          <TokenSymbolImage src={`/images/single-token/${stakingToken.token0.symbol}.png`} alt={stakingToken.token0.symbol} />
                          <QuoteTokenSymbolImage src={`/images/single-token/${stakingToken.token1.symbol}.png`} alt={stakingToken.token1.symbol} />
                      </PairTokenImage>)
                  }
              </LpPairsToken> 
              <EarningToken>
                  <EarningTokenImage src={`/images/single-token/${earningToken.symbol}.png`} alt={earningToken.symbol} />
              </EarningToken>
          </ImageWrapper>                         
          <LpTokenInfo flexDirection="column" alignItems="flex-start">
              <StakeEarnLabelWrapper>
                <EarnLabel>Earn&nbsp;{earningToken.symbol}</EarnLabel>
                <StakeLabel>Stake&nbsp;{stakingToken.token.symbol}</StakeLabel>
              </StakeEarnLabelWrapper>              
              <LpFooterTags left={isTokenOnly ? 'auto' : '0'}>
                {!isTokenOnly && !isInactivePartnerPool? <DexTag dex={dex} /> : null }
                {isNewPool ? <NewPoolTag /> : null }
                {((apy ? apy.toNumber() : 0) === 0 || (block || 0) > endBlock || isInactivePartnerPool) ? <FinishedTag/> : null}
                {blocksUntilStart && blocksUntilStart > 0 ? <WaitingTag /> : null}
              </LpFooterTags>             
          </LpTokenInfo>
        </TokenLableFlex> 
      </td>  
      <td>        
        <InfoColumn>
          <TextTitle>Earned</TextTitle>
          <Text bold color="textSubTitleFarm">{displayEarningsBalance}&nbsp; {earningToken.symbol}</Text>
        </InfoColumn>   
      </td>    
      <InfoColumnWrapper>
        <InfoColumn>
          <TextTitle>APR</TextTitle>
          <Text bold color="textSubTitleFarm" style={{ display: 'flex', alignItems: 'center' }}>
            {!isInactivePartnerPool ?(
              <>
                {apy ? (
                  <>
                    {apy.gt(0)  ? (
                      <>
                        {farmAPY}%
                        <ApyButton
                          lpLabel={lpLabel}
                          quoteTokenAdresses={quoteTokenAdresses}
                          quoteTokenSymbol={quoteTokenSymbol}
                          tokenAddresses={tokenAddresses}
                          isTokenOnly={isTokenOnly}
                          cakePrice={cakePrice}
                          dex={dex}
                          apy={apy}
                          cakeSymbol={earningToken.symbol}
                        />                              
                      </>
                    ) : <>-</>}
                  </>             
                ) : (
                  '-'
                )}
                </>  
                ) :  (
                  '0'
              )}
          </Text>
        </InfoColumn>
      </InfoColumnWrapper>
      <InfoColumnWrapper>
        <InfoColumn>
          <TextTitle>TVL</TextTitle>
          <Text bold color="textSubTitleFarm">{tvl}</Text>
        </InfoColumn>
      </InfoColumnWrapper>
      <InfoColumnWrapper>
        <InfoColumn>
          <TextTitle>Withdraw Lockup</TextTitle>
          <Text bold color="textSubTitleFarm">{withdrawalInterval && withdrawalInterval > 0 ? 
              moment.duration(withdrawalInterval, 'seconds').humanize() : '-'}</Text>
        </InfoColumn>
      </InfoColumnWrapper>
      {/* <InfoColumnWrapper>
        <InfoColumn>
          <TextTitle>Daily Output</TextTitle>  
          <Text bold color="textSubTitleFarm">{rewardPerDay}{' '}{earningToken.symbol}</Text>              
        </InfoColumn>
      </InfoColumnWrapper> */}
      <InfoColumnWrapper>
        <InfoColumn>
          <TextTitle>{isTokenOnly ? 'Deposit Fee' : 'Deposit Fee'}</TextTitle>
          <Text bold color="textSubTitleFarm">{depositFee}%</Text>        
        </InfoColumn>
      </InfoColumnWrapper>
      <InfoColumnWrapper>
        <InfoColumn style={{width: '150px'}}>
          <TextTitle>{title}</TextTitle>
          {
            startBlock && blocksUntilStart > 0 && (
              <StyledLinkExternal href={getBscScanLink(startBlock, 'countdown')} style={{ alignSelf: 'center' }}>
                <Balance color="textSubTitleFarm" fontSize="14px" value={blocksUntilStart} decimals={0} unit=" blocks"/>
              </StyledLinkExternal> 
            )
          }
          {
            blocksUntilStart === 0 && blocksRemaining > 0 && (
              <StyledLinkExternal color="textSubTitleFarm" href={getBscScanLink(endBlock, 'countdown')} style={{ alignSelf: 'center' }}>
                <Balance color="textSubTitleFarm" fontSize="14px" value={blocksRemaining} decimals={0} unit=" blocks"/>
              </StyledLinkExternal>       
            )
          }
          {
            !blocksUntilStart && !blocksRemaining && !isInactivePartnerPool && (
              <Text bold color="textSubTitleFarm">-</Text>        
            )
          }
          {
            isInactivePartnerPool && (endBlock !== undefined) && (
              <StyledLinkExternal href={getBscScanLink(endBlock, 'block')} style={{ alignSelf: 'center' }}>
                <Balance color="textSubTitleFarm" fontSize="14px" value={endBlock} decimals={0} unit=" blocks"/>
              </StyledLinkExternal> 
            )
          }
          {
            isInactivePartnerPool && (endBlock === undefined) && (
              <Text bold color="textSubTitleFarm">-</Text> 
            )
          }
        </InfoColumn>
      </InfoColumnWrapper>
      <td>
        <ExpandableSectionButton
            onClick={setShowExpandableSection}
            expanded={showExpandableSection}
        />  
      </td>
    </Wrapper>
  )
}

export default RowCardHeading
