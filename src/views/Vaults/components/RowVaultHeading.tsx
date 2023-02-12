import React, { useMemo } from 'react'
import { AutoRenewIcon, Flex, Heading, HelpIcon, Text, useTooltip } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import { DexSwapRouter, StakePlatform, StakingToken } from 'config/constants/types'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import BigNumber from 'bignumber.js'
import { getBalanceNumber, getInterestDisplayValue } from 'utils/formatBalance'
import { VaultInterest } from 'state/types'
import VaultAprContent from './VaultAprContent'
import PlatformTag from './Tags/PlatformTag'
import NewPoolTag from './Tags/NewPoolTag'
import BoostTag from './Tags/BoostTag'


const Wrapper = styled.tr`
  box-shadow: 0px 2px 12px -8px rgba(32, 32, 34, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05);
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
  /* width: 96px;   */
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
  width: 32px;
  height: 32px;
  position: absolute;
  right: 0;
  bottom: 0;
`


const BoostWrapper = styled(Flex)`
`

const LpFooterTagsWrapper = styled.div`
  position: relative;
  width: 2px;
  height: 20px;
`

const LpFooterTags = styled.div<{left?: string}>`
    text-align: center;
    position: absolute;
    left: ${({left}) => left || '0'};
    display: flex;    
    & > *+* {
      margin-left: 5px;
    }    

    & > ${BoostWrapper} {
      margin-left: 0px;
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

const DetailsColumnWrapper = styled.td`
  display: flex;
`

const TextTitle = styled(Text)`
  color: ${({theme}) => theme.colors.textTitleFarm};
  font-size: 14px;
`

const AprWrapperTooltip = styled(Flex)`
  & > * + * {
    margin-left: 5px;
  }
`

interface RowVaultHeadingProps {
    stakingToken?: StakingToken
    stakedBalance?: string
    tokenBalance?: string
    liquidity?: BigNumber
    isNewPool?: boolean
    isBoosted?: boolean
    multiplier?: string
    dex?: DexSwapRouter
    platform?: StakePlatform
    showExpandableSection?: boolean;
    setShowExpandableSection?: any;
    interest?: VaultInterest
    isAutoCgs?: boolean
    isManualCgs?: boolean
}

const RowVaultHeading : React.FC<RowVaultHeadingProps> = (
    {
        stakingToken,
        tokenBalance,
        stakedBalance,
        liquidity,
        isNewPool,
        isBoosted,
        multiplier,
        platform,
        dex,
        interest,
        isAutoCgs,
        isManualCgs,
        showExpandableSection,
        setShowExpandableSection,        
    }
) => {  
  const dispalyLiquidity = liquidity.toNumber().toLocaleString('en-US', { maximumFractionDigits: 2 })  

  const tooltipContent = <VaultAprContent isAutoCgs={isAutoCgs} interest={interest}/>

  const { targetRef, tooltip: tooltipMiddle, tooltipVisible: middleVisible } = useTooltip(tooltipContent, { placement: "top", trigger: "hover" });
  const displayStakingTokenName = useMemo(() => {
    if (isAutoCgs) return 'Auto CGS'
    if (isManualCgs) return `Manual ${stakingToken.token.symbol}`
    return stakingToken.token.symbol
  }, [isAutoCgs, isManualCgs, stakingToken.token.symbol])

  return (
      <Wrapper>
            <td>
                <TokenLableFlex alignItems="center">        
                    <LpPairsToken>          
                        {stakingToken.isTokenOnly ? (<SingleTokenImage src={`/images/single-token/${stakingToken.token.symbol}.png`} alt={stakingToken.token.symbol} />) : 
                        (<PairTokenImage>
                            <TokenSymbolImage src={`/images/single-token/${stakingToken.token0.symbol}.png`} alt={stakingToken.token0.symbol} />
                            <QuoteTokenSymbolImage src={`/images/single-token/${stakingToken.token1.symbol}.png`} alt={stakingToken.token1.symbol} />
                        </PairTokenImage>)
                        }                        
                    </LpPairsToken>
                    <LpTokenInfo flexDirection="column" alignItems="flex-start">
                        <Heading color="textSubTitleFarm" mb="4px">{displayStakingTokenName}                           
                        </Heading>  
                        <LpFooterTagsWrapper>
                          <LpFooterTags left={stakingToken.isTokenOnly ? 'auto' : '0'}>
                              {/* {!stakingToken.isTokenOnly ? <DexTag dex={dex} /> : null } */}
                              <PlatformTag platform={platform} />
                              {isNewPool ? <NewPoolTag /> : null }
                              {isBoosted ? <BoostWrapper><BoostTag /></BoostWrapper> : null }
                              {/* {!isManualCgs && <AutoRenewIcon spin color="binance" />} */}
                          </LpFooterTags>       
                        </LpFooterTagsWrapper>
                    </LpTokenInfo>
                </TokenLableFlex> 
            </td>            
            <InfoColumnWrapper>        
              <InfoColumn>
                <TextTitle>Wallet</TextTitle>
                <Text bold color="textSubTitleFarm">{tokenBalance}</Text>
              </InfoColumn>   
            </InfoColumnWrapper>    
            <InfoColumnWrapper>        
              <InfoColumn>
                <TextTitle>Deposited</TextTitle>
                <Text bold color="textSubTitleFarm">{stakedBalance}</Text>
              </InfoColumn>   
            </InfoColumnWrapper>    
            <InfoColumnWrapper>        
              <InfoColumn>
                <TextTitle>TVL</TextTitle>
                <Text bold color="textSubTitleFarm">${dispalyLiquidity}</Text>
              </InfoColumn>   
            </InfoColumnWrapper>    
            <InfoColumnWrapper>        
              <InfoColumn>
                <TextTitle>{isManualCgs ? 'APR' : 'APY'}</TextTitle>                
                <AprWrapperTooltip>
                  <Text bold color="textSubTitleFarm">{getInterestDisplayValue(interest?.totalApr)}                    
                  </Text>
                  {interest?.totalApr && interest?.totalApr > 0 ? 
                    <>
                      <span ref={targetRef}>
                        <HelpIcon color='textProper'/>
                      </span>
                      {middleVisible && tooltipMiddle}
                    </> : null
                  }                  
                </AprWrapperTooltip>
              </InfoColumn>   
            </InfoColumnWrapper>   
            <InfoColumnWrapper>
              <InfoColumn>
                <TextTitle>Multiplier</TextTitle>
                <Text bold color="textSubTitleFarm">{multiplier}</Text>
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

export default RowVaultHeading