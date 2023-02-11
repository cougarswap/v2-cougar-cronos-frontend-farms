import React, { useMemo } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Button, Flex, Text, Heading, IconButton, AddIcon, MinusIcon, TimerIcon, useModal, useTooltip } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { getBalanceNumber } from 'utils/formatBalance'
import DepositModal from '../DepositModal'
import WithdrawModal from '../WithdrawModal'
import CountdownTimer from './CountdownTimer'

interface FarmCardActionsProps {
  stakedBalance?: BigNumber
  tokenBalance?: BigNumber
  tokenName?: string
  depositFeeBP?: number
  lpTokenDecimals?: number
  lpWorth?: BigNumber
  secondsUntilNextWithdraw?: number
  withdrawDisabled?: boolean
  onStake: (amount: string) => any
  onUnstake: (amount: string) => any
}

const IconButtonWrapper = styled.div`
  display: flex;
  svg {
    width: 20px;
  }
`

const StakeBalanceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

const ActionWrapper = styled.div`
  position: relative;
`

const HarvestCountdown = styled.div`
  display: flex;
`

const HarvestUntilCard = styled(Flex)`
  position: absolute;
  top: -50%;
  left: 14px;
`

const CountdownContainer = styled(Flex)`
  justify-content: flex-end;
  align-items: center;
  width: 120px;
`

const HarvestInfo = styled.span`
  cursor: pointer;
`

const StakeAction: React.FC<FarmCardActionsProps> = ({ stakedBalance, 
  lpTokenDecimals, 
  lpWorth, 
  tokenBalance, 
  tokenName, 
  depositFeeBP, 
  onStake, onUnstake, 
  secondsUntilNextWithdraw, 
  withdrawDisabled }) => {
  const TranslateString = useI18n()

  const rawStakedBalance = getBalanceNumber(stakedBalance, lpTokenDecimals)
  const displayBalance = rawStakedBalance.toLocaleString('en-US', { maximumFractionDigits: 12 })

  const lpStaked = useMemo(() => {    
    if (lpWorth === undefined || lpWorth.isNaN()) {
      return 0
    }

    return getBalanceNumber(stakedBalance.times(lpWorth), lpTokenDecimals)
  }, [stakedBalance, lpWorth, lpTokenDecimals])

  const [onPresentDeposit] = useModal(<DepositModal max={tokenBalance} lpTokenDecimals={lpTokenDecimals} onConfirm={onStake} tokenName={tokenName} depositFeeBP={depositFeeBP} />)
  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={stakedBalance} lpTokenDecimals={lpTokenDecimals} onConfirm={onUnstake} tokenName={tokenName} />,
  )

  const showCountdownLockup = withdrawDisabled && secondsUntilNextWithdraw > 0

  const tooltipContent = <HarvestCountdown>
    <Text fontSize='12px'>Withdraw Locked In:&nbsp;</Text>
    <CountdownContainer>
      <CountdownTimer seconds={secondsUntilNextWithdraw} fontSize='0.8em' /> 
    </CountdownContainer>
  </HarvestCountdown>

  const { targetRef, tooltip: tooltipMiddle, tooltipVisible: middleVisible } = useTooltip(tooltipContent, { placement: "top", trigger: "hover" });
  
  const renderStakingButtons = () => {
    return rawStakedBalance === 0 ? (
      <Button mt="8px" onClick={onPresentDeposit}>{TranslateString(999, 'Stake')}</Button>
    ) : (
      <ActionWrapper>
        {showCountdownLockup ? 
          <HarvestUntilCard>
            <HarvestInfo ref={targetRef}>
              <TimerIcon color='#df0939'/>
            </HarvestInfo>
            {middleVisible && tooltipMiddle}
          </HarvestUntilCard> : null
        }
        <IconButtonWrapper>
          <IconButton disabled={withdrawDisabled && secondsUntilNextWithdraw > 0} variant="primary" onClick={onPresentWithdraw} mr="6px">
            <MinusIcon color="primary" />
          </IconButton>
          <IconButton variant="primary" onClick={onPresentDeposit}>
            <AddIcon color="primary" />
          </IconButton>
        </IconButtonWrapper>
      </ ActionWrapper>
      
    )
  }

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <StakeBalanceWrapper>
        <Heading color={rawStakedBalance === 0 ? 'textDisabled' : 'textSubTitleFarm'}>{displayBalance}</Heading>
        <Text color="primaryDark" fontSize="0.9em">~${lpStaked.toLocaleString('en-US', { maximumFractionDigits: 2})}</Text>
      </StakeBalanceWrapper>
      {renderStakingButtons()}
    </Flex>
  )
}

export default StakeAction
