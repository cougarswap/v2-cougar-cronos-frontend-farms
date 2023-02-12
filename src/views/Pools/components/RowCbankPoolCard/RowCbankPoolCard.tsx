import React, { useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import styled from 'styled-components'
import { Flex, Text, Skeleton, LinkExternal, MetaMaskIcon } from '@pancakeswap-libs/uikit'
import { Pool } from 'state/types'
import useI18n from 'hooks/useI18n'
import farmToken from 'config/constants/farm-tokens'
import { NoFeeTag } from 'components/Tags'
import { getBscScanLink, getLiquidityUrl } from 'utils'
import { registerToken } from 'utils/wallet'
import ApyButton from 'views/Farms/components/FarmCard/ApyButton'
import { Address, PoolCategory, StakingToken, Token } from 'config/constants/types'
import RowCardHeading from 'views/PartnerPools/components/RowFarmCard/RowCardHeading'
import { useWeb3React } from '@web3-react/core'
import { useBlock } from 'state/block/hooks'
import { BLOCKS_PER_DAY } from 'config'
import { BIG_ZERO } from 'utils/bigNumber'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import { useTransferTaxRate } from 'state/tokenPublicData/hooks'
import Balance from 'components/Balance'
import RowStakeAction from './RowStakeAction'
import RowHarvestAction from './RowHarvestAction'

export interface PoolWithApy extends Pool {
  apy: BigNumber
  isFinished?: boolean
  liquidity?: number
  earningTokenPrice?: BigNumber
  stakingTokenPrice?: BigNumber
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
    /* background-color: ${({ theme }) => theme.colors.invertedContrast}80;     */
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

const CountdownBlock = styled(Flex)`
  justify-content: space-between;

  ${({ theme }) => theme.mediaQueries.nav} {
    display: none;    
  }
`

const StyledLinkExternal = styled(LinkExternal)`
  text-decoration: none;
  font-weight: normal;
  color: ${({ theme }) => theme.colors.textTitleFarm};
  display: flex;
  align-items: center;

  & > * > span {
    font-weight: normal;
  }

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
  farm: PoolWithApy,
  isInactivePartnerPool: boolean
}

const RowCbankPoolCard: React.FC<FarmCardProps> = ({ farm, isInactivePartnerPool }) => {
    const {
        sousId,
        tokenName,
        tokenAddress,    
        stakingTokenName,
        stakingTokenAddress,
        contractAddress,
        tokenDecimals,
        poolCategory,
        totalStaked,
        startBlock,
        endBlock,
        isFinished,
        userData,
        earningTokenPrice,
        stakingTokenPrice,
        liquidity,
        withdrawalInterval
    } = farm

    const isBnbPool = poolCategory === PoolCategory.BINANCE
    const TranslateString = useI18n()

    const [showExpandableSection, setShowExpandableSection] = useState(false)
    const shouldRenderChild = useDelayedUnmount(showExpandableSection, 300)
    
    const { account } = useWeb3React()
    const { currentBlock : block } = useBlock()
    
    const stakedBalance = new BigNumber(userData?.stakedBalance || 0)
    const earnings = new BigNumber(userData?.pendingReward || 0)

    const poolTransferTaxFee = 0;  
    
    const blocksUntilStart = Math.max(startBlock - block, 0)
    const blocksRemaining = Math.max(endBlock - block, 0)

    const totalValueFormated = useMemo(() => {
        const totalLiquidity = liquidity && liquidity > 0 ? liquidity : 0
        return `$${totalLiquidity.toLocaleString(undefined, { maximumFractionDigits: 2 })}`      
    }, [liquidity]) 
        
    const lpLabel = stakingTokenName  
    
    const farmAPY = farm.apy && farm.apy.toNumber().toLocaleString('en-US', { maximumFractionDigits: 2 })
    const rewardPerDay = farm.tokenPerBlock ? new BigNumber(farm.tokenPerBlock).times(BLOCKS_PER_DAY) : BIG_ZERO
    const rewardPerDayFormated = rewardPerDay.toNumber().toLocaleString('en-US', { maximumFractionDigits: 2 })
    // const rewardPerDayBusd = rewardPerDay && rewardPerDay.times(earningTokenPrice).toNumber().toLocaleString('en-US', { maximumFractionDigits: 2 })
        
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
    
    const tokenPath = stakingToken.token.address
    const liquidityUrl = getLiquidityUrl(farm.dex, tokenPath, stakingToken.isTokenOnly)
    const masterChefBscScanAddress =`https://cronoscan.com/address/${contractAddress}`  
    const isMetaMaskInScope = !!window.ethereum?.isMetaMask
    
    const transferTaxRate = useTransferTaxRate()
    const fee = 0 // since cbank contract is in whitelist of no transfer tax for staking cgs
    
    const title = useMemo(() => {
      if (blocksUntilStart && blocksUntilStart > 0){
        return 'Starts In'
      }
  
      return 'Ends In'
    }, [blocksUntilStart])

  return (
    <>     
        <RowCardHeading
            lpLabel={lpLabel}
            multiplier='-'
            depositFee={fee}
            poolTransferTaxFee={poolTransferTaxFee}
            apy={farm.apy}
            cakeRewardPerDay={rewardPerDay}
            stakedBalance={stakedBalance}
            earnings={earnings}
            lpTokenDecimals={stakingToken.token.decimals}
            tvl={totalValueFormated}
            isTokenOnly
            isPartner
            dex={farm.dex}            
            withdrawalInterval={withdrawalInterval}
            isNewPool={farm.isNewPool}
            tokenSymbol={stakingToken.token.symbol}
            quoteTokenSymbol={quoteTokenSymbol}
            quoteTokenAdresses={quoteTokenAdresses}
            tokenAddresses={tokenAddresses}
            cakePrice={earningTokenPrice}     
            stakingToken={stakingToken}  
            earningToken={earningToken}   
            showExpandableSection={showExpandableSection}
            setShowExpandableSection={() => setShowExpandableSection(!showExpandableSection)}
            endBlock={endBlock}
            blocksRemaining={blocksRemaining}
            startBlock={startBlock}
            blocksUntilStart={blocksUntilStart}            
            isInactivePartnerPool={isInactivePartnerPool}
        />   
        {shouldRenderChild && (
           <ExpandedRow expanded={showExpandableSection}>
            <td colSpan={8}>
                <ExpandedSectionWrapper>
                    <RowCardActions>                      
                      <RowHarvestAction earnings={earnings} 
                        sousId={sousId}
                        tokenName={earningToken.symbol}
                        tokenPrice={earningTokenPrice}
                        tokenDecimals={earningToken.decimals}                        
                      />
                      <RowStakeAction farm={farm} account={account} />
                    </RowCardActions>
                    <FarmCardInfoWrapper>
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
                                            cakeSymbol={earningToken.symbol}
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
                        <Flex justifyContent='space-between'>            
                            <TextTitle>{TranslateString(999, 'Liquidity')}:</TextTitle>
                            <Text color="secondary">{totalValueFormated}</Text>
                        </Flex>
                        <Flex justifyContent='space-between'>            
                            <TextTitle>{TranslateString(999, 'Withdraw Lockup')}:</TextTitle>
                            <Text color="secondary">{withdrawalInterval && withdrawalInterval > 0 ? 
                              moment.duration(withdrawalInterval, 'seconds').humanize() : '-'}</Text>
                        </Flex>
                        <Flex justifyContent='space-between'>            
                            <TextTitle>Deposit Fee:</TextTitle>
                            <Text color="secondary">{fee}%</Text>
                        </Flex>                       
                        {/* <Flex justifyContent='space-between'>            
                            <TextTitle>Daily Output:</TextTitle>     
                            <Text color="secondary">{rewardPerDayFormated}{' '}{earningToken.symbol}</Text>                  
                        </Flex> */}
                    </FarmCardInfoWrapper> 
                    <TokenCardInfoWrapper>
                        <Flex justifyContent='space-between'>
                            <Text color="textTitleFarm">{TranslateString(999, 'GET')}:&nbsp;</Text>
                            <StyledLinkExternal href={liquidityUrl}>
                            {lpLabel}
                            </StyledLinkExternal>
                        </Flex>   
                        <CountdownBlock>
                            <Text color="textTitleFarm">{TranslateString(999, title)}:&nbsp;</Text>
                            {
                              startBlock && blocksUntilStart > 0 && (
                                <StyledLinkExternal href={getBscScanLink(startBlock, 'countdown')} style={{ alignSelf: 'center' }}>
                                  <Balance color='textTitleFarm' fontSize="16px" value={blocksUntilStart} decimals={0} unit=" blocks"/>
                                </StyledLinkExternal> 
                              )
                            }
                            {
                              blocksUntilStart === 0 && blocksRemaining > 0 && (
                                <StyledLinkExternal href={getBscScanLink(endBlock, 'countdown')} style={{ alignSelf: 'center' }}>
                                  <Balance color='textTitleFarm' fontSize="16px" value={blocksRemaining} decimals={0} unit=" blocks"/>
                                </StyledLinkExternal>       
                              )
                            }
                            {
                              !blocksUntilStart && !blocksRemaining && (
                                <Text color="text">-</Text>        
                              )
                            }
                        </CountdownBlock>             
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
                                onClick={() => registerToken(earningToken.address, earningToken.symbol, earningToken.decimals)}
                            >
                                <Text color="primary">{TranslateString(999, 'Add to Metamask')}</Text>
                                <MetaMaskIcon ml="4px" />
                            </AddToMetaMaskButton>
                            </Flex>
                        )}
                        { fee && fee === 0 ? 
                          <Flex justifyContent="flex-start" mt="8px">
                              <NoFeeTag />                        
                          </Flex>         
                        : null }       
                    </TokenCardInfoWrapper>                    
                </ExpandedSectionWrapper>        
            </td>
          </ExpandedRow>  
        )}
                         
      </>
  )
}

export default RowCbankPoolCard
