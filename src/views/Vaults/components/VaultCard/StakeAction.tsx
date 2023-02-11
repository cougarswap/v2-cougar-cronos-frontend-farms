import React, { useMemo } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Button, Flex, Text, Heading, IconButton, AddIcon, MinusIcon, useModal } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { getBalanceNumber } from 'utils/formatBalance'
import DepositModal from '../DepositModal'
import WithdrawModal from '../WithdrawModal'

interface FarmCardActionsProps {
  stakedBalance?: BigNumber
  tokenBalance?: BigNumber
  tokenName?: string
  depositFeeBP?: number
  lpTokenDecimals?: number
  lpWorth?: BigNumber
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

const StakeAction: React.FC<FarmCardActionsProps> = ({ stakedBalance, lpTokenDecimals, lpWorth, tokenBalance, tokenName, depositFeeBP, onStake, onUnstake }) => {
  const TranslateString = useI18n()

  const rawStakedBalance = getBalanceNumber(stakedBalance, lpTokenDecimals)
  const displayBalance = rawStakedBalance.toLocaleString('en-US', { maximumFractionDigits: 12 })

  const lpStaked = useMemo(() => {
    return getBalanceNumber(stakedBalance.times(lpWorth), lpTokenDecimals)
  }, [stakedBalance, lpWorth, lpTokenDecimals])

  const [onPresentDeposit] = useModal(<DepositModal max={tokenBalance} lpTokenDecimals={lpTokenDecimals} onConfirm={onStake} tokenName={tokenName} depositFeeBP={depositFeeBP} />)
  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={stakedBalance} lpTokenDecimals={lpTokenDecimals} onConfirm={onUnstake} tokenName={tokenName} />,
  )

  const renderStakingButtons = () => {
    return rawStakedBalance === 0 ? (
      <Button mt="8px" onClick={onPresentDeposit}>{TranslateString(999, 'Stake')}</Button>
    ) : (
      <IconButtonWrapper>
        <IconButton variant="tertiary" onClick={onPresentWithdraw} mr="6px">
          <MinusIcon color="primary" />
        </IconButton>
        <IconButton variant="tertiary" onClick={onPresentDeposit}>
          <AddIcon color="primary" />
        </IconButton>
      </IconButtonWrapper>
    )
  }

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <StakeBalanceWrapper>
        <Heading color={rawStakedBalance === 0 ? 'textDisabled' : 'textSubTitleFarm'}>{displayBalance}</Heading>
        <Text color="primaryDark" fontSize="0.9em">~${lpStaked.toLocaleString('en-US', { maximumFractionDigits: 10})}</Text>
      </StakeBalanceWrapper>
      {renderStakingButtons()}
    </Flex>
  )
}

export default StakeAction
