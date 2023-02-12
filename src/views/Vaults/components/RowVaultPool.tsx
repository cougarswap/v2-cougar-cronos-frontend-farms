import React, { useEffect, useMemo, useState } from 'react'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import { useAutoCakeWithdrawFeeDuration, useRemainingBlockToFarming, useVaultUser } from 'state/hooks'
import styled from 'styled-components'
import useI18n from 'hooks/useI18n'
import moment from 'moment'
import BigNumber from 'bignumber.js'
import parse, { CronDate } from 'cron-parser'
import { Vault } from 'state/types'
import { getLiquidityUrlByStakingToken } from 'utils/getLiquidityUrlPathParts'
import { getBalanceNumber, getInterestDisplayValue } from 'utils/formatBalance'
import { registerToken } from 'utils/wallet'
import { Flex, HelpIcon, InfoIcon, LinkExternal, MetaMaskIcon, Text, useTooltip } from '@pancakeswap-libs/uikit'
import { getBscScanLink } from 'utils'
import { getVaultAddress } from 'utils/addressHelpers'
import useRefresh from 'hooks/useRefresh'
import RowVaultHarvestAction from './RowVaultHarvestAction'
import RowVaultHeading from './RowVaultHeading'
import RowVaultStakeAction from './RowVaultStakeAction'
import VaultAprContent from './VaultAprContent'
import CountdownTimer from './VaultCard/CountdownTimer'

interface RowVaultPoolProps {
    vault: Vault
    account?: string
}

const ExpandedRow = styled.tr<{ expanded: boolean }>`
  &>td {
    padding: 10px;
  }

  border-bottom: 1px solid #5f7e61;  
  display: ${(props) => (props.expanded) ? 'table-row' : 'none'};
`

const ExpandingWrapper = styled.div`
  display: block;

  ${({ theme }) => theme.mediaQueries.nav} {
    display: flex;
    justify-content: space-between;
  }
`

const ExpandedSectionWrapper = styled(ExpandingWrapper)`  
  overflow: visible;
`

const RowCardActions = styled.div`
  align-items: center;

  ${({ theme }) => theme.mediaQueries.sm} {
    display: flex;
    justify-content: space-between;
  }  
`

const ActionContainer = styled.div` 
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-basis: 100%;
  }
`

const VaultExtraInfoContainer = styled(Flex)`
  margin-top: 5px;
  padding: 5px;
  flex-direction: column;
  & > * + * {
      margin-top: 10px;
  }

  ${({ theme }) => theme.mediaQueries.nav} {
    flex-direction: row;
    & > * + * {
      margin-top: 0;
    }
  }  
`

const FeeExplaination = styled(Flex)`
  padding: 5px;  
  flex-basis: 50%; 
`

const FeeExplainationColumn = styled.div`
  flex-basis: 50%;  
`

const FeeExplainationBody = styled.div`
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text}; 
`

const FeeItem = styled.div`
  color: ${({theme}) => theme.colors.primary};
  margin-top: 5px;
  font-size: 14px;
  font-weight: 400;
`

const TextLabel = styled.span`
  color: ${({theme}) => theme.colors.textSubTitleFarm};  
  font-size: 14px;
  font-weight: normal;
`

const TextValue = styled.span`
  color: ${({theme}) => theme.colors.primaryDark};  
  font-size: 14px;
  font-weight: normal;
`

const TextCompoundTime = styled(Text)`
  color: ${({theme}) => theme.colors.primaryDark};
  font-size: 14px;
  font-weight: bold;
  line-height: 1;
`

const PoolMoreInfo = styled(Flex)`
  padding: 5px;
  flex-grow: 1;
`

const CompoundExplainationBody = styled.div`
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text}; 
  & > * {
    margin-top: 5px;
  }
`

const CompoundCountdown = styled(Flex)`    
  flex-direction: column;
  flex: 50%;
  & > * + * {
    margin-top: 5px;
  };

  font-weight: bold;
  font-size: 14px;
`

const TokenCardInfoWrapper = styled.div`
    display: flex;
    flex: 50%;
    flex-direction: column;    
    border-radius: 20px;        
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

const AddToMetaMaskButton = styled.button`
  background-color: transparent;
  border: none;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  padding-left: 0;
  color: ${({theme}) => theme.colors.textTitleFarm};
  & > * {
    color: ${({theme}) => theme.colors.textTitleFarm};
  }
`

const FarmCardInfoWrapper = styled.div`
    background-color: ${({ theme }) => theme.colors.invertedContrast}80;    
    border-radius: 20px;
    padding: 10px;
    display: block;
    margin-bottom: 10px;
    ${({ theme }) => theme.mediaQueries.nav} {
      display: none;
    }
`

const TextTitle = styled(Text)`
  color: ${({theme}) => theme.colors.white}; 
  font-weight: bold;
  font-size: 14px;
  line-height: 1; 
`

const FeeTitle = styled(Text)`
  color: ${({theme}) => theme.colors.ultraFocus}; 
  text-transform: uppercase;
  font-weight: bold;
  font-size: 14px;
  line-height: 1; 
  margin-top: 5px;
  margin-bottom: 5px;
`

const AprWrapperTooltip = styled(Flex)`
  & > * + * {
    margin-left: 5px;
  }
`

const FeeValueContainer = styled(Flex)`
  display: inline-flex;
  align-items: center;
  font-size: 12px;
`

const RowVaultPool : React.FC<RowVaultPoolProps> = ({
    vault,
    account
}) => {
    const TranslateString = useI18n() 

    const [showExpandableSection, setShowExpandableSection] = useState(false)
    const shouldRenderChild = useDelayedUnmount(showExpandableSection, 300)
    const { stakedBalance, earnings, tokenBalance } = useVaultUser(vault.pid)
    const isMetaMaskInScope = !!window.ethereum?.isMetaMask
    const withdrawDuration = useAutoCakeWithdrawFeeDuration()

    const farmContractLink = useMemo(() => {
      if (vault.farmContractInfo?.farmContractAddress && !vault.isManualCgs) {
        if (vault.isAutoCgs) {
          return getBscScanLink(getVaultAddress(), 'address')
        }

        return getBscScanLink(vault.farmContractInfo?.farmContractAddress, 'address')
      }

      return ''
    }, [vault.farmContractInfo?.farmContractAddress, vault.isAutoCgs, vault.isManualCgs])

    const rawStakedBalance = getBalanceNumber(stakedBalance, vault.stakingToken.token.decimals)
    const displayStakedBalance = rawStakedBalance.toLocaleString('en-US', { maximumFractionDigits: 12 })

    const rawTokenBalance = getBalanceNumber(tokenBalance, vault.stakingToken.token.decimals)
    const displayTokenBalance = rawTokenBalance.toLocaleString('en-US', { maximumFractionDigits: 12 })

    const tooltipContent = <VaultAprContent isAutoCgs={vault.isAutoCgs} interest={vault.interest}/>
    const { targetRef, tooltip: tooltipMiddle, tooltipVisible: middleVisible } = useTooltip(tooltipContent, { placement: "top", trigger: "hover" });
    
    const depositTooltipContent = <Text fontSize='14px'>Deposit Fee is charged by COUGARSWAP</Text>
    const { targetRef: depositRef, tooltip: depositTooltipMiddle, tooltipVisible: depositMiddleVisible } = useTooltip(depositTooltipContent, { placement: "top", trigger: "hover" });
    const withdrawTooltipContent = vault.pid === -1 ? <Text fontSize='14px'>
      Withraw Fee is charged by {vault.stakePlatform} if withdrawn within {moment.duration(withdrawDuration, 'seconds').humanize()}
    </Text> : <Text fontSize='14px'>Withraw Fee is charged by COUGARSWAP</Text>   
    
    const partnerDepositTooltipContent = <Text fontSize='14px'>Deposit Fee is charged by {vault.stakePlatform}</Text>
    const { targetRef: partnerDepositRef, tooltip: partnerDepositTooltipMiddle, tooltipVisible: partnerDepositMiddleVisible } = useTooltip(partnerDepositTooltipContent, { placement: "top", trigger: "hover" });

    const { targetRef: withdrawRef, tooltip: withdrawTooltipMiddle, tooltipVisible: withdrawMiddleVisible } = useTooltip(withdrawTooltipContent, { placement: "top", trigger: "hover" });

    const { fastRefresh } = useRefresh()
    const remainingBlockToFarming = useRemainingBlockToFarming()
    const [nextCompoundTime, setNextCompoundTime] = useState<CronDate>()

    useEffect(() => {
      const nextTime = parse.parseExpression(vault.compoundCron, { utc: true })
      setNextCompoundTime(nextTime.next())
    }, [vault.compoundCron, fastRefresh])

    const secondsUntilCompound = useMemo(() => {
      const compoundTime = nextCompoundTime ? nextCompoundTime.toDate() : moment.utc()
      const currentTime = moment.utc()
      const secondsToEvent = currentTime.diff(compoundTime, 'second')

      return Math.abs(-secondsToEvent)
    }, [nextCompoundTime])    

    const isCompoundInprogress = useMemo(() => {
      const fullCycleDurationInSeconds = 24*60*60 / vault.compoundFrequency
      const compoundHappenTime = fullCycleDurationInSeconds / 24 // display inprogress only in 1/24 cycle
      const compoundFreeTime = fullCycleDurationInSeconds - compoundHappenTime
      return secondsUntilCompound > compoundFreeTime
    }, [secondsUntilCompound, vault.compoundFrequency])

    return (
        <>
            <RowVaultHeading stakingToken={vault.stakingToken} 
                tokenBalance={displayTokenBalance}
                stakedBalance={displayStakedBalance}
                liquidity={vault.liquidity}
                isNewPool={vault.isNewPool}
                isBoosted={vault.isBoosted}
                multiplier={vault.multiplier}
                platform={vault.stakePlatform}
                interest={vault.interest}
                isAutoCgs={vault.isAutoCgs}
                isManualCgs={vault.isManualCgs}
                showExpandableSection={showExpandableSection}
                setShowExpandableSection={() => setShowExpandableSection(!showExpandableSection)}
              />
            {shouldRenderChild && (
                <ExpandedRow expanded={showExpandableSection}>
                    <td colSpan={7}>
                        <ExpandedSectionWrapper>
                          <FarmCardInfoWrapper>
                            <Flex justifyContent='space-between' alignItems='center'>              
                              <TextTitle>{TranslateString(999, 'Wallet')}:</TextTitle>
                              <Text color="text" style={{ display: 'flex', alignItems: 'center' }}>
                                {displayTokenBalance}
                              </Text>
                            </Flex>
                            <Flex justifyContent='space-between' alignItems='center'>              
                              <TextTitle>{TranslateString(999, 'Deposited')}:</TextTitle>
                              <Text color="text" style={{ display: 'flex', alignItems: 'center' }}>
                                {displayStakedBalance}
                              </Text>
                            </Flex>
                            <Flex justifyContent='space-between' alignItems='center'>              
                              <TextTitle>{vault.isAutoCgs ? 'APY' : 'APR'}:</TextTitle>
                              <Text color="text" style={{ display: 'flex', alignItems: 'center' }}>
                                {getInterestDisplayValue(vault.interest?.totalApr)}&nbsp;
                                {vault.interest?.totalApr && vault.interest?.totalApr > 0 ? 
                                  <>
                                    <span ref={targetRef}>
                                      <HelpIcon />
                                    </span>
                                    {middleVisible && tooltipMiddle}
                                  </> : null
                                }     
                              </Text>
                            </Flex>
                            <Flex justifyContent='space-between' alignItems='center'>              
                              <TextTitle>{TranslateString(999, 'TVL')}:</TextTitle>
                              <AprWrapperTooltip>
                                <Text color="text" style={{ display: 'flex', alignItems: 'center' }}>
                                  ${vault.liquidity.toNumber().toLocaleString('en-US', { maximumFractionDigits: 2 })}
                                </Text>           
                              </AprWrapperTooltip>                                
                            </Flex>
                            <Flex justifyContent='space-between' alignItems='center'>              
                              <TextTitle>{TranslateString(999, 'Multiplier')}:</TextTitle>
                              <Text color="text" style={{ display: 'flex', alignItems: 'center' }}>
                                {vault.multiplier}
                              </Text>
                            </Flex>
                          </FarmCardInfoWrapper> 
                          <ActionContainer>
                            <RowCardActions>
                              <RowVaultHarvestAction 
                                earnings={earnings} 
                                pid={vault.pid} />
                              <RowVaultStakeAction vault={vault} account={account} />
                            </RowCardActions>
                            <VaultExtraInfoContainer>
                              <FeeExplaination>
                                <FeeExplainationColumn>
                                  <FeeTitle>Fees on deposited asset</FeeTitle>
                                  <FeeExplainationBody> 
                                    <FeeItem>
                                      <TextLabel>{ vault.isManualCgs || vault.isAutoCgs ? 'Deposit Fee: ' : 'Entrance Fee: ' }</TextLabel>
                                      <FeeValueContainer>
                                        <TextValue>
                                          {vault.depositFee && vault.depositFee > 0 ? '<' : ''}
                                          {vault.depositFee * 100}%
                                        </TextValue>
                                          <>
                                            <span ref={depositRef}>                                          
                                                <InfoIcon color='primaryDark' width="18px"/>
                                              </span>
                                              {depositMiddleVisible && depositTooltipMiddle}
                                          </>
                                      </FeeValueContainer>
                                    </FeeItem>
                                    <FeeItem>
                                      <TextLabel>Withdraw Fee: </TextLabel>
                                      <FeeValueContainer>
                                        <TextValue>{vault.withdrawFee * 100}%</TextValue>
                                          <>
                                                <span ref={withdrawRef}>
                                                <InfoIcon color='primaryDark' width="18px"/>
                                                </span>
                                                {withdrawMiddleVisible && withdrawTooltipMiddle}
                                          </> 
                                      </FeeValueContainer>                                  
                                    </FeeItem>
                                    {!vault.isAutoCgs && !vault.isManualCgs &&
                                      <FeeItem>
                                        <TextLabel>3rd Deposit Fee: </TextLabel>
                                        <FeeValueContainer>
                                          <TextValue>                                      
                                            {vault.farmContractInfo.depositFeeBP * 100}%
                                          </TextValue>
                                            <>
                                              <span ref={partnerDepositRef}>                                          
                                                  <InfoIcon width="18px"/>
                                                </span>
                                                {partnerDepositMiddleVisible && partnerDepositTooltipMiddle}
                                            </>
                                        </FeeValueContainer>
                                      </FeeItem>
                                    }
                                  </FeeExplainationBody>
                                </FeeExplainationColumn>  
                                {
                                  !vault.isManualCgs && 
                                  <FeeExplainationColumn>
                                    <FeeTitle>Fees on vault profits</FeeTitle>
                                    <FeeExplainationBody>
                                    {vault.isAutoCgs && 
                                      <FeeItem>
                                        <TextLabel>Controller Fee: </TextLabel>
                                        <TextValue>{new BigNumber(vault.performanceFee).times(100).toJSON()}%</TextValue>
                                      </FeeItem>
                                      }
                                      {!vault.isManualCgs && !vault.isAutoCgs &&
                                        <>
                                          <FeeItem>
                                            <TextLabel>Buyback and Burn CGS: </TextLabel>
                                            <TextValue>2%</TextValue>
                                          </FeeItem>
                                          <FeeItem>
                                            <TextLabel>Fee to CGS staking vault: </TextLabel>
                                            <TextValue>0.5%</TextValue>
                                          </FeeItem>
                                          <FeeItem>
                                            <TextLabel>Controller Fee: </TextLabel>
                                            <TextValue>0.5%</TextValue>
                                          </FeeItem> 
                                          <FeeItem>
                                            <TextLabel>Platform fee: </TextLabel>
                                            <TextValue>0.5%</TextValue>
                                          </FeeItem>                                    
                                        </>                                  
                                      }
                                    </FeeExplainationBody>
                                  </FeeExplainationColumn>    
                                }                                                                                                                                                         
                              </FeeExplaination>
                              <PoolMoreInfo>
                                {!vault.isManualCgs && 
                                <CompoundCountdown>
                                  {isCompoundInprogress ? 
                                  <>
                                    <TextTitle>Compound is in progress...</TextTitle>
                                  </>:
                                  <>
                                    <FeeTitle>Next compound</FeeTitle>
                                    <CompoundExplainationBody>
                                      {remainingBlockToFarming > 0 ? <>
                                        <TextCompoundTime>
                                          Compound will be executed after Farming starts
                                        </TextCompoundTime>
                                      </>:
                                      <>
                                        <TextCompoundTime>
                                          {nextCompoundTime.toDate().toLocaleString()}
                                        </TextCompoundTime>
                                        <Flex>
                                          <CountdownTimer seconds={secondsUntilCompound} />
                                        </Flex>
                                      </>}                                      
                                    </CompoundExplainationBody>                                  
                                  </>}                               
                                </CompoundCountdown>}
                                <TokenCardInfoWrapper>
                                  <Flex justifyContent='flex-start'>
                                    <Text color="textTitleFarm">{TranslateString(999, 'GET')}&nbsp;</Text>
                                    <StyledLinkExternal href={getLiquidityUrlByStakingToken(vault.stakingToken, vault.dex)}>
                                      {vault.stakingToken.token.symbol}
                                    </StyledLinkExternal>
                                  </Flex>
                                  <Flex>
                                    <StyledLinkExternal color="textTitleFarm" external href={getBscScanLink(vault.stakingToken.token.address, 'address')} bold={false}>
                                      {TranslateString(999, 'View on Cronos Explorer')}
                                    </StyledLinkExternal>
                                  </Flex>
                                  {!vault.isManualCgs && <Flex justifyContent="flex-start">
                                    <StyledLinkExternal color="textTitleFarm" external href={getBscScanLink(vault.strategyContract, 'address')} bold={false}>
                                      {TranslateString(999, 'Vault contract')}
                                    </StyledLinkExternal>
                                  </Flex>
                                  }
                                  {farmContractLink && <Flex justifyContent="flex-start">
                                    <StyledLinkExternal color="textTitleFarm" external href={farmContractLink} bold={false}>
                                      {TranslateString(999, 'Farm contract')}
                                    </StyledLinkExternal>
                                  </Flex>}
                                  {vault.projectLink && <Flex justifyContent="flex-start">
                                    <StyledLinkExternal color="textTitleFarm" external href={vault.projectLink} bold={false}>
                                      {TranslateString(999, 'Project Link')}
                                    </StyledLinkExternal>
                                  </Flex>}
                                  {account && isMetaMaskInScope && (
                                    <Flex justifyContent="flex-start">
                                      <AddToMetaMaskButton
                                        onClick={() => registerToken(vault.stakingToken.token.address, vault.stakingToken.token.symbol, vault.stakingToken.token.decimals, !vault.stakingToken.isTokenOnly)}
                                      >
                                        <Text color="textTitleFarm">{TranslateString(999, 'Add to Metamask')}</Text>
                                        <MetaMaskIcon ml="4px" />
                                      </AddToMetaMaskButton>
                                    </Flex>
                                  )}
                                </TokenCardInfoWrapper>
                              </PoolMoreInfo>                              
                            </VaultExtraInfoContainer>                      
                          </ActionContainer>                                                                              
                        </ExpandedSectionWrapper>                        
                    </td>
                </ExpandedRow>)
            }
        </>
    )
}

export default RowVaultPool