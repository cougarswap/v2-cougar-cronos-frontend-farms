import React, { useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { Modal, Text, Flex, Button, HelpIcon, AutoRenewIcon, useTooltip } from '@pancakeswap-libs/uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import { useAutoCake } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import Balance from 'components/Balance'
import { getAutoCakeAddress } from 'utils/addressHelpers'
import { useCakeVault } from 'state/hooks'
import { useCgsPrice } from 'state/prices/hooks'
import { BIG_ZERO } from 'utils/bigNumber'
import { ToastDescriptionWithTx } from 'components/Toast'
import UnlockButton from 'components/UnlockButton'
import { useDispatch } from 'react-redux'
import { fetchCakeVaultPublicData } from 'state/vaults'

interface BountyModalProps {
  onDismiss?: () => void
  TooltipComponent: React.ElementType
}

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundDisabled};
  height: 1px;
  margin: 16px auto;
  width: 100%;
`

const BountyModal: React.FC<BountyModalProps> = ({ onDismiss, TooltipComponent }) => {
  const { account } = useWeb3React()
  const { theme } = useTheme()
  const { toastError, toastSuccess } = useToast()
  const dispatch = useDispatch()
  const cakeVaultContract = useAutoCake()
  const [pendingTx, setPendingTx] = useState(false)
  const {
    estimatedCakeBountyReward,
    totalPendingCakeHarvest,
    fees: { callFee },
  } = useCakeVault()
  const cakePriceBusd = useCgsPrice()
  const callFeeAsDecimal = callFee
  const totalYieldToDisplay = getBalanceNumber(new BigNumber(totalPendingCakeHarvest), 18)

  const estimatedCakeBountyRewardBigNum = useMemo(() => {
    return estimatedCakeBountyReward ? new BigNumber(estimatedCakeBountyReward) : BIG_ZERO
  }, [estimatedCakeBountyReward])

  const estimatedDollarBountyReward = useMemo(() => {
    return estimatedCakeBountyRewardBigNum.multipliedBy(cakePriceBusd)
  }, [cakePriceBusd, estimatedCakeBountyRewardBigNum])

  const hasFetchedDollarBounty = estimatedDollarBountyReward.gte(0)
  const hasFetchedCakeBounty = estimatedCakeBountyReward ? estimatedCakeBountyRewardBigNum.gte(0) : false
  const dollarBountyToDisplay = hasFetchedDollarBounty ? getBalanceNumber(estimatedDollarBountyReward, 18) : 0
  const cakeBountyToDisplay = hasFetchedCakeBounty ? getBalanceNumber(estimatedCakeBountyRewardBigNum, 18) : 0

  const { targetRef, tooltip, tooltipVisible } = useTooltip(<TooltipComponent fee={callFee} />, {
    placement: 'bottom',
    tooltipPadding: { right: 15 },
  })

  const handleConfirmClick = async () => {
    setPendingTx(true)
    try {
      const tx = await cakeVaultContract.methods
        .harvest()
        .send({ from: account })
        .on('transactionHash', (txt) => {
          return txt.transactionHash
        })

      dispatch(fetchCakeVaultPublicData())

      toastSuccess(
        'Bounty collected!',
        <ToastDescriptionWithTx txHash={tx.transactionHash}>
          CGS bounty has been sent to your wallet.
        </ToastDescriptionWithTx>,
      )
      setPendingTx(false)
      onDismiss()
      
    } catch (error) {
      console.log(error)
      toastError('Error', 'Please try again. Confirm the transaction and make sure you are paying enough gas!')
      setPendingTx(false)
    }
  }

  return (
    <Modal title='Claim Bounty' onDismiss={onDismiss}>
      {tooltipVisible && tooltip}
      <Flex alignItems="flex-start" justifyContent="space-between">
        <Text>You’ll claim</Text>
        <Flex flexDirection="column">
          <Balance value={cakeBountyToDisplay} fontSize="14px" decimals={7} unit=" CGS" />
          <Text fontSize="12px" color="textSubtle">
            <Balance
              fontSize="12px"
              color="textSubtle"
              value={dollarBountyToDisplay}
              decimals={2}
              unit=" USD"
              prefix="~"
            />
          </Text>
        </Flex>
      </Flex>
      <Divider />
      <Flex alignItems="center" justifyContent="space-between">
        <Text fontSize="14px" color="textSubtle">
          Pool total pending yield
        </Text>
        <Balance color="textSubtle" value={totalYieldToDisplay} fontSize="14px" unit=" CGS" />
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" mb="24px">
        <Text fontSize="14px" color="textSubtle">
          Bounty
        </Text>
        <Text fontSize="14px" color="textSubtle">
          {callFeeAsDecimal}%
        </Text>
      </Flex>
      {account ? (
        <Button
          fullWidth
          isLoading={pendingTx}
          disabled={!dollarBountyToDisplay || !cakeBountyToDisplay || !callFee}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
          onClick={handleConfirmClick}
          mb="28px"
          id="autoCakeConfirmBounty"
        >
          {pendingTx ? 'Confirming' : 'Confirm'}
        </Button>
      ) : (
        <UnlockButton mb="28px" />
      )}
      <Flex justifyContent="center" alignItems="center">
        <Text fontSize="16px" bold color="textSubtle" mr="4px">
          What’s this?
        </Text>
        <span ref={targetRef}>
          <HelpIcon color="textSubtle" />
        </span>
      </Flex>
    </Modal>
  )
}

export default BountyModal
