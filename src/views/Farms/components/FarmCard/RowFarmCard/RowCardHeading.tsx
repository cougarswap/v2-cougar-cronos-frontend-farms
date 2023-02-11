import React, { useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Address, DexSwapRouter } from 'config/constants/types'
import { getBalanceNumber } from 'utils/formatBalance'
import { Tag, Text, Flex, Heading, Image, Skeleton, HelpIcon, IconButton } from '@pancakeswap-libs/uikit'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import ApyButton from '../ApyButton'
import NewPoolTag from './NewPoolTag'
import DexTag from './DexTag'
import PartnerTag from './PartnerTag'

export interface ExpandableSectionProps {
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
  isTokenOnly?: boolean,  
  isPartner?: boolean,
  isNewPool?: boolean,
  dex?: DexSwapRouter,
  tokenSymbol?: string,
  quoteTokenSymbol?: string,
  quoteTokenAdresses?: Address,
  tokenAddresses?: Address,
  cakePrice?: BigNumber,
  getLiquidityExternalLink?: string
  showExpandableSection?: boolean;
  setShowExpandableSection?: any;
}

const Wrapper = styled.tr`
  /* background-color: rgb(16 12 12 / 82%);   */
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05);
  position: relative;
  font-size: 0.8em;  
  margin: 0;  
  border-bottom: 1px solid #473e6c;  
  &>td {
    padding: 20px 20px 20px 0;
  }
  svg {
    margin-right: 0.25rem;
  }  
  /* display: grid;  
  grid-template-columns: 50% 30% 0 0 0 0 0 20%;

  ${({ theme }) => theme.mediaQueries.nav} {
    grid-template-columns: 4fr 2fr 2fr 2fr 2fr 2fr 2fr 1fr;
  } */
`

const TokenLableFlex = styled(Flex)`
  flex-basic: 50%;
`

const LpPairsToken = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  /* width: 96px;   */
  min-width: 96px;
`
const LpTokenInfo = styled(Flex)`
  min-width: 96px;
  margin-left: 10px;
  position: relative;
`

const SingleTokenImage = styled.img`
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
  width: 32px;
  height: 32px;
  position: absolute;
  right: 0;
  bottom: 0;
`

const StakeNumberInfo = styled.div`
  display: flex;  
  flex-direction: column;
  justify-content: center;
`

const StakedAmount = styled.div`
  text-align: left;
  display: block;
`

const EarnedAmount = styled.div`
  display: flex;
  align-items: center;
`

const EarnTokenImg = styled.img`
  width: 24px;
  height: 24px;
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
  color: ${({theme}) => theme.colors.textTitleFarm};;
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

const earnToken = 'CGS'

const RowCardHeading: React.FC<ExpandableSectionProps> = ({
  lpLabel,
  multiplier,
  depositFee,
  poolTransferTaxFee,
  apy,
  cakeRewardPerDay,
  stakedBalance,
  lpTokenDecimals,
  earnings,
  tvl,
  isTokenOnly,
  isNewPool,
  isPartner,
  dex,
  tokenSymbol,
  quoteTokenSymbol,
  quoteTokenAdresses,
  tokenAddresses,
  cakePrice,
  getLiquidityExternalLink,
  showExpandableSection,
  setShowExpandableSection
}) => {
  const farmAPY = apy && apy.toNumber().toLocaleString('en-US', { maximumFractionDigits: 2 })
  const rewardPerDay = cakeRewardPerDay && cakeRewardPerDay.toNumber().toLocaleString('en-US', { maximumFractionDigits: 2 })
  const rewardPerDayBusd = cakeRewardPerDay && cakeRewardPerDay.times(cakePrice).toNumber().toLocaleString('en-US', { maximumFractionDigits: 2 })
  const rawStakedBalance = getBalanceNumber(stakedBalance, lpTokenDecimals)
  const displayStakedBalance = rawStakedBalance.toLocaleString()
  const rawEarningsBalance = getBalanceNumber(earnings)
  const displayEarningsBalance = rawEarningsBalance.toLocaleString()  

  const poolFee = (depositFee / 100) + poolTransferTaxFee;  
  const [showTooltip, setShowToolTip] = useState(false);

  return (
    <Wrapper>
      <td>
        <TokenLableFlex alignItems="center" justifyContent={isTokenOnly ? "space-around" : "flex-start"}>        
          <LpPairsToken>          
            {isTokenOnly ? (<SingleTokenImage src={`/images/single-token/${tokenSymbol}.png`} alt={tokenSymbol} />) : 
              (<PairTokenImage>
                  <TokenSymbolImage src={`/images/single-token/${tokenSymbol}.png`} alt={tokenSymbol} />
                  <QuoteTokenSymbolImage src={`/images/single-token/${quoteTokenSymbol}.png`} alt={quoteTokenSymbol} />
              </PairTokenImage>)
            }
          </LpPairsToken>        
          <LpTokenInfo flexDirection="column" alignItems="center">
              <Heading bold color="textSubTitleFarm" mb="4px">{lpLabel}</Heading>  
              <LpFooterTags left={isTokenOnly ? 'auto' : '0'}>
                {!isTokenOnly ? <DexTag dex={dex} /> : null }
                {isPartner ? <PartnerTag /> : null}
                {isNewPool ? <NewPoolTag /> : null }
              </LpFooterTags>             
          </LpTokenInfo>
        </TokenLableFlex> 
      </td>  
      <td>        
        <InfoColumn>
          <TextTitle>Earned</TextTitle>
          <Text bold color="textSubTitleFarm">{displayEarningsBalance}&nbsp; CGS</Text>
        </InfoColumn>   
      </td>    
      <InfoColumnWrapper>
        <InfoColumn>
          <TextTitle>APR</TextTitle>
          <Text bold color="textSubTitleFarm" style={{ display: 'flex', alignItems: 'center' }}>
            {apy ? (
              <>
                {apy.gt(0) ? (
                   <>
                    {farmAPY}%
                    <ApyButton
                      lpLabel={lpLabel}
                      quoteTokenAdresses={quoteTokenAdresses}
                      quoteTokenSymbol={quoteTokenSymbol}
                      cakeSymbol={tokenSymbol}
                      tokenAddresses={tokenAddresses}
                      isTokenOnly={isTokenOnly}
                      cakePrice={cakePrice}
                      dex={dex}
                      apy={apy}
                      getLiquidityExternalLink={getLiquidityExternalLink}
                    />                              
                  </>
                ) : <>-</>}
              </>             
            ) : (
              <Skeleton height={24} width={80} />
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
          <TextTitle>Multiplier</TextTitle>
          <Text bold color="textSubTitleFarm">{multiplier}</Text>
        </InfoColumn>     
      </InfoColumnWrapper>
      <InfoColumnWrapper>
        <InfoColumn>
          <TextTitle>Daily Output</TextTitle>  
          <Text bold color="textSubTitleFarm">{rewardPerDay}{' CGS'}</Text>     
          {/* <HelpWrapper 
            onMouseOver={() => setShowToolTip(true)}
            onMouseLeave={() => setShowToolTip(false)}>
            <Text color="text">${rewardPerDayBusd}{' '}</Text>
            <IconWrapper>
              <HelpIcon color="primary"/>
              <Tooltip className={showTooltip ? 'active' : ''}>
                {rewardPerDay}{' CGS'}
              </Tooltip>
            </IconWrapper>
          </HelpWrapper>         */}
        </InfoColumn>
      </InfoColumnWrapper>
      <InfoColumnWrapper>
        <InfoColumn>
          <TextTitle>Deposit Fee</TextTitle>
          <Text bold color="textSubTitleFarm">{depositFee / 100}%</Text>        
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
