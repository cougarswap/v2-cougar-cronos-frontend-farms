import React, { useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Flex, Text, Skeleton, LinkExternal, MetaMaskIcon, Link } from '@pancakeswap-libs/uikit'
import { PartnerPool } from 'state/types'
import useI18n from 'hooks/useI18n'
import farmToken from 'config/constants/farm-tokens'
import { getLiquidityUrlPathPartsPartnerPool } from 'utils/getLiquidityUrlPathParts'
import { NoFeeTag } from 'components/Tags'
import { getLiquidityUrl } from 'utils'
import { registerToken } from 'utils/wallet'
import ApyButton from 'views/Farms/components/FarmCard/ApyButton'
import { Address } from 'config/constants/types'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import { useTransferTaxRate } from 'state/tokenPublicData/hooks'
import RowCardHeading from './RowCardHeading'
import RowStakeAction from './RowStakeAction'
import RowHarvestAction from './RowHarvestAction'

export interface PartnerPoolWithComputedValue extends PartnerPool {
    apy?: BigNumber
    lpWorth?: BigNumber
    tokenRewardPerDay?: BigNumber
    liquidity?: number   
    earningTokenPrice?: BigNumber
}

const FarmCardInfoWrapper = styled.div`
    background-color: ${({ theme }) => theme.colors.invertedContrast}80;    
    border-radius: 20px;
    padding: 10px;
    display: block;
    margin-top: 10px;
    ${({ theme }) => theme.mediaQueries.nav} {
      display: none;
    }
`

const TokenCardInfoWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 20px;    
    padding: 10px;
    align-items: inherit;
    ${({ theme }) => theme.mediaQueries.nav} {
      align-items: flex-end;
    }
`

const ExpandingWrapper = styled.div`
  display: block;

  ${({ theme }) => theme.mediaQueries.nav} {
    display: flex;
    justify-content: space-between;
  }
`

const ExpandedRow = styled.tr<{ expanded: boolean }>`
  &>td {
    padding: 10px;
  }

  border-bottom: 1px solid #5f7e61;  
  display: ${(props) => (props.expanded) ? 'table-row' : 'none'};
`

const StyledLinkExternal = styled(LinkExternal)`
  text-decoration: none;
  font-weight: normal;
  color: ${({ theme }) => theme.colors.textTitleFarm};
  display: flex;
  align-items: center;

  svg {
    padding-left: 4px;
    height: 18px;
    width: auto;
    fill: ${({ theme }) => theme.colors.textTitleFarm};
  }
`

const RowCardActions = styled.div`
  align-items: center;

  ${({ theme }) => theme.mediaQueries.sm} {
    display: flex;
    justify-content: space-between;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-basis: 75%;
  }
`

const TextTitle = styled(Text)`
  color: ${({theme}) => theme.colors.primary};
  font-size: 14px;
`

const ExpandedSectionWrapper = styled(ExpandingWrapper)`  
  overflow: visible;
`
const AddToMetaMaskButton = styled.button`
  background-color: transparent;
  border: none;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  padding-left: 0;
  color: ${({theme}) => theme.colors.text};
  & > * {
    color: ${({theme}) => theme.colors.textTitleFarm};
  }
`

interface FarmCardProps {
  farm: PartnerPoolWithComputedValue
  removed: boolean
  cakePrice?: BigNumber
  bnbPrice?: BigNumber
  account?: string
  isInactivePartnerPool?: boolean
}

const RowFarmCard: React.FC<FarmCardProps> = ({ farm, removed, cakePrice, bnbPrice, account, isInactivePartnerPool}) => {
  const TranslateString = useI18n()

  const [showExpandableSection, setShowExpandableSection] = useState(false)
  const shouldRenderChild = useDelayedUnmount(showExpandableSection, 300)

  const stakedBalance = farm.userData ? new BigNumber(farm.userData.stakedBalance) : new BigNumber(0)
  const earnings = farm.userData ? new BigNumber(farm.userData.pendingReward) : new BigNumber(0)
 
  const totalValueFormated = farm.liquidity
    ? `$${Number(farm.liquidity).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
    : '-'
    
  const lpLabel = farm.stakingToken.token.symbol
  
  const farmAPY = farm.apy && farm.apy.toNumber().toLocaleString('en-US', { maximumFractionDigits: 2 })
  const rewardPerDay = farm.tokenRewardPerDay && farm.tokenRewardPerDay.toNumber().toLocaleString('en-US', { maximumFractionDigits: 2 })
    
  const { dex, stakingToken } = farm  
  const quoteTokenAdresses : Address = {25: farm.stakingToken.isTokenOnly ? farmToken.wcro : farm.stakingToken.token0.address }
  const quoteTokenSymbol = farm.stakingToken.isTokenOnly ? 'WCRO' : farm.stakingToken.token0.symbol
  const tokenAddresses: Address = {25:  farm.stakingToken.isTokenOnly ? farm.stakingToken.token.address : farm.stakingToken.token1.address }

  const tokenPath = useMemo(() => {
    if (stakingToken.isTokenOnly){
        return stakingToken.token.address
    }

    const quoteTokenAdress = stakingToken.token0.address
    const quoteTokenSymbol0 = stakingToken.token0.symbol
    const tokenAddress = stakingToken.token1.address
    return getLiquidityUrlPathPartsPartnerPool({ quoteTokenAdress, quoteTokenSymbol: quoteTokenSymbol0, tokenAddress, dex })
  }, [stakingToken, dex])

  const liquidityUrl = getLiquidityUrl(farm.dex, tokenPath, farm.stakingToken.isTokenOnly)

  const masterChefBscScanAddress =`https://cronoscan.com/address/${farm.masterchefAddress}`  

  const isMetaMaskInScope = !!window.ethereum?.isMetaMask
  const transferTaxRate = useTransferTaxRate()
  const fee = stakingToken.isTokenOnly ? transferTaxRate : 0 // deposit fee and widthdraw fee

  return (
    <>     
      <RowCardHeading
          lpLabel={lpLabel}
          multiplier={farm.allocPoint?.toString() || '-'}
          depositFee={fee}
          apy={farm.apy}
          cakeRewardPerDay={farm.tokenRewardPerDay}
          stakedBalance={stakedBalance}
          earnings={earnings}
          lpTokenDecimals={farm.stakingToken.token.decimals}
          tvl={totalValueFormated}
          isTokenOnly={farm.stakingToken.isTokenOnly}
          isPartner
          dex={farm.dex}
          isNewPool={farm.isNewPool}
          tokenSymbol={farm.stakingToken.token.symbol}
          quoteTokenSymbol={quoteTokenSymbol}
          quoteTokenAdresses={quoteTokenAdresses}
          tokenAddresses={tokenAddresses}
          cakePrice={farm.earningTokenPrice}     
          stakingToken={farm.stakingToken}  
          earningToken={farm.earningToken}   
          showExpandableSection={showExpandableSection}
          setShowExpandableSection={() => setShowExpandableSection(!showExpandableSection)}          
          isInactivePartnerPool = {isInactivePartnerPool}           
        />    
        {shouldRenderChild && (
          <ExpandedRow expanded={showExpandableSection}>
            <td colSpan={8}>
              <ExpandedSectionWrapper>
                <RowCardActions>
                  <RowHarvestAction earnings={earnings} 
                    partnerId={farm.partnerId}
                    tokenName={farm.earningToken.symbol}
                    tokenPrice={farm.earningTokenPrice}
                  />
                  <RowStakeAction farm={farm} account={account} />
                </RowCardActions>        
                <FarmCardInfoWrapper>
                  {!removed && (
                    <Flex justifyContent='space-between' alignItems='center'>              
                      <TextTitle>{TranslateString(352, 'APR')}:</TextTitle>
                      <Text color="secondary" style={{ display: 'flex', alignItems: 'center' }}>
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
                                    apy={farm.apy}
                                    dex={farm.dex}
                                    cakeSymbol={farm.earningToken.symbol}
                                  />                
                                  {farmAPY}%
                                </>
                              ) : <>-</>
                              }                         
                            </>                      
                        : (
                          <Skeleton height={24} width={80} />
                        )}
                      </Text>
                    </Flex>
                  )}              
                  {!removed && (
                  <Flex justifyContent='space-between'>            
                    <TextTitle>{TranslateString(999, 'Liquidity')}:</TextTitle>
                    <Text color="secondary">{totalValueFormated}</Text>
                  </Flex>)}
                  <Flex justifyContent='space-between'>            
                    <TextTitle>{fee && fee > 0 ? 'Deposit Fee:' : 'Fee:'}</TextTitle>
                    <Text color="secondary">{fee}%</Text>
                  </Flex>                       
                  {/* <Flex justifyContent='space-between'>            
                    <TextTitle>Daily Output:</TextTitle>     
                    <Text color="secondary">{`${rewardPerDay} ${farm.earningToken.symbol}`}</Text>                  
                  </Flex> */}
                </FarmCardInfoWrapper> 
                <TokenCardInfoWrapper>
                  <Flex justifyContent='space-between'>
                    <Text color="textTitleFarm">{TranslateString(999, 'GET')}:&nbsp;</Text>
                    <StyledLinkExternal href={liquidityUrl}>
                      {lpLabel}
                    </StyledLinkExternal>
                  </Flex>              
                  <Flex justifyContent="flex-start">
                    <StyledLinkExternal color="textTitleFarm" external href={masterChefBscScanAddress} bold={false}>
                      {TranslateString(999, 'View contract')}
                    </StyledLinkExternal>
                  </Flex>
                  <Flex justifyContent="flex-start">
                    <StyledLinkExternal color="textTitleFarm" external href={farm.projectLink} bold={false}>
                      {TranslateString(999, 'View project site')}
                    </StyledLinkExternal>
                  </Flex>
                  {account && isMetaMaskInScope && (
                    <Flex justifyContent="flex-start">
                      <AddToMetaMaskButton
                        onClick={() => registerToken(farm.earningToken.address, farm.earningToken.symbol, farm.earningToken.decimals)}
                      >
                        <Text color="textTitleFarm">{TranslateString(999, 'Add to Metamask')}</Text>
                        <MetaMaskIcon ml="4px" />
                      </AddToMetaMaskButton>
                    </Flex>
                  )}
                  {fee === 0 ? <Flex justifyContent="flex-start" mt="8px">
                     <NoFeeTag />                       
                  </Flex> : null}      
                </TokenCardInfoWrapper>                    
              </ExpandedSectionWrapper>        
            </td>
          </ExpandedRow>  
        )}                           
    </>
  )
}

export default RowFarmCard
