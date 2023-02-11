import React, { useMemo, useState, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Button, Flex, IconButton, MinusIcon, Text, useModal } from '@pancakeswap-libs/uikit'
import { Farm, PartnerPool, Pool } from 'state/types'
import useI18n from 'hooks/useI18n'
import UnlockButton from 'components/UnlockButton'
import { usePartnerApprove, useSousApprove } from 'hooks/useApprove'
import { usePartnerStake, useSousStake } from 'hooks/useStake'
import { usePartnerUnstake, useSousUnstake } from 'hooks/useUnstake'
import StakeAction from 'views/Farms/components/FarmCard/StakeAction'
import { useERC20 } from 'hooks/useContract'
import HarvestAction from './CbankHarvestAction'

const Action = styled.div`
  margin-top: 16px;
  background-color: ${({ theme }) => theme.colors.invertedContrast}60;    
  border-radius: 20px;
  padding: 10px;
`

const CardActionHeading = styled(Flex)`
  justify-content: space-between;
`

interface PoolWithApy extends Pool {
  apy?: BigNumber
  lpWorth?: BigNumber
  earningTokenPrice?: BigNumber
  stakingTokenPrice?: BigNumber
}

interface FarmCardActionsProps {
    farm: PoolWithApy
    account?: string
}

const CbankCardActions: React.FC<FarmCardActionsProps> = ({ farm, account }) => {
  const TranslateString = useI18n()
  const [requestedApproval, setRequestedApproval] = useState(false)

  const { userData } = farm
  const lpTokenDecimals = farm.stakingTokenDecimals

  const allowance = new BigNumber(userData?.allowance || 0)
  const tokenBalance = new BigNumber(userData?.stakingTokenBalance || 0)
  const stakedBalance = new BigNumber(userData?.stakedBalance || 0)
  const earnings = new BigNumber(userData?.pendingReward || 0)
    

  const stakingTokenAddress = farm.stakingTokenAddress
  const lpName = farm.stakingTokenName
  const lpWorth = farm.stakingTokenPrice
  const isApproved = account && allowance && allowance.isGreaterThan(0)
  
  const { onStake } = useSousStake(farm.sousId)
  const { onUnstake } = useSousUnstake(farm.sousId)

  const stakingTokenContract = useERC20(stakingTokenAddress)

  const { onApprove } = useSousApprove(stakingTokenContract, farm.sousId)

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
            {farm.tokenName}
          </Text>
          <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
            {TranslateString(999, 'Earned')}
          </Text>
        </div>
      </CardActionHeading>
      <HarvestAction earnings={earnings} 
        sousId={farm.sousId}
        tokenName={farm.tokenName}
        tokenPrice={farm.earningTokenPrice}
        tokenDecimals={farm.tokenDecimals}
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

export default CbankCardActions
