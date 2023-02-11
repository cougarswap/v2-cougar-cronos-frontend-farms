import React, { useState, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Button, Flex, Text } from '@pancakeswap-libs/uikit'
import { PartnerPool } from 'state/types'
import useI18n from 'hooks/useI18n'
import UnlockButton from 'components/UnlockButton'
import { useERC20 } from 'hooks/useContract'
import { usePartnerApprove } from 'hooks/useApprove'
import { usePartnerStake } from 'hooks/useStake'
import { usePartnerUnstake } from 'hooks/useUnstake'
import StakeAction from 'views/Farms/components/FarmCard/StakeAction'
import HarvestAction from './HarvestAction'

const Action = styled.div`
  margin-top: 16px;
  background-color: ${({ theme }) => theme.colors.invertedContrast}60;    
  border-radius: 20px;
  padding: 10px;
`

const CardActionHeading = styled(Flex)`
  justify-content: space-between;
`

export interface PartnerPoolWithComputedValue extends PartnerPool {
  apy?: BigNumber
  lpWorth?: BigNumber
  earningTokenPrice?: BigNumber
}

interface FarmCardActionsProps {
  farm: PartnerPoolWithComputedValue
  account?: string
}

const CardActions: React.FC<FarmCardActionsProps> = ({ farm, account }) => {
  const TranslateString = useI18n()
  const [requestedApproval, setRequestedApproval] = useState(false)

  const { userData } = farm
  const lpTokenDecimals = farm.stakingToken.token.decimals

  const allowance = new BigNumber(userData?.allowance || 0)
  const tokenBalance = new BigNumber(userData?.stakingTokenBalance || 0)
  const stakedBalance = new BigNumber(userData?.stakedBalance || 0)
  const earnings = new BigNumber(userData?.pendingReward || 0)

  const stakingTokenAddress = farm.stakingToken.token.address
  const lpName = farm.stakingToken.token.symbol.toUpperCase()
  const lpWorth = farm.lpWorth
  const isApproved = account && allowance && allowance.isGreaterThan(0)
  
  const { onStake } = usePartnerStake(farm.partnerId)
  const { onUnstake } = usePartnerUnstake(farm.partnerId)
  
  const stakingTokenContract = useERC20(stakingTokenAddress)

  const { onApprove } = usePartnerApprove(stakingTokenContract, farm.masterchefAddress)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove])

  const renderApprovalOrStakeButton = () => {        
    return isApproved ? (
        <StakeAction stakedBalance={stakedBalance} 
            tokenBalance={tokenBalance} 
            lpTokenDecimals={lpTokenDecimals} 
            lpWorth={lpWorth} 
            tokenName={lpName} 
            onStake={onStake}
            onUnstake={onUnstake}
            depositFeeBP={0} />
    ) : (
      <Button mt="8px" fullWidth disabled={requestedApproval} onClick={handleApprove}>
        {TranslateString(999, 'Approve Contract')}
      </Button>
    )
  }

  return (
    <Action>
      <CardActionHeading>
        <div>
          <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="3px">
            {farm.earningToken.symbol}
          </Text>
          <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
            {TranslateString(999, 'Earned')}
          </Text>
        </div>
      </CardActionHeading>
      <HarvestAction earnings={earnings} 
          partnerId={farm.partnerId}
          tokenPrice={farm.earningTokenPrice}
          tokenName={farm.earningToken.symbol}
         />
      <Flex>
        <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="3px">
          {lpName}
        </Text>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {TranslateString(999, 'Staked')}
        </Text>
      </Flex>
      {!account ? <UnlockButton mt="8px" fullWidth /> : renderApprovalOrStakeButton()}
    </Action>
  )
}

export default CardActions
