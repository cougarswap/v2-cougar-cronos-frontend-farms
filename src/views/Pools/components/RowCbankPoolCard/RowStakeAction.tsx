import React, { useState, useCallback, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { AutoRenewIcon, Button, Flex, Text } from '@pancakeswap-libs/uikit'
import { Pool } from 'state/types'
import useI18n from 'hooks/useI18n'
import UnlockButton from 'components/UnlockButton'
import { useSousApprove } from 'hooks/useApprove'
import StakeAction from 'views/Farms/components/FarmCard/StakeAction'
import { useSousStake } from 'hooks/useStake'
import { useSousUnstake } from 'hooks/useUnstake'
import { useERC20 } from 'hooks/useContract'
import { PoolCategory, PoolVersion } from 'config/constants/types'

const Action = styled.div`
  border-radius: 12px;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.textSubTitleFarm};
  width: 100%;
  /* margin-top: 16px; */
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 5px;    
    margin-top: 0;
  }
`

export interface PoolWithApy extends Pool {
    earningTokenPrice?: BigNumber
    stakingTokenPrice?: BigNumber
}

interface FarmCardActionsProps {
    farm: PoolWithApy
    isPoolStarted?: boolean
    isPoolEnded?: boolean
    account?: string
}

const RowStakeAction: React.FC<FarmCardActionsProps> = ({ farm, isPoolStarted, isPoolEnded, account }) => {
  const TranslateString = useI18n()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const isBnbPool = farm.poolCategory === PoolCategory.BINANCE
  const { userData, earningTokenPrice, stakingTokenPrice } = farm
  const lpTokenDecimals = farm.stakingTokenDecimals

  const allowance = new BigNumber(userData?.allowance || 0)
  const tokenBalance = new BigNumber(userData?.stakingTokenBalance || 0)
  const stakedBalance = new BigNumber(userData?.stakedBalance || 0)
  const earnings = new BigNumber(userData?.pendingReward || 0)


  const stakingTokenAddress = farm.stakingTokenAddress
  const lpName = farm.stakingTokenName
  const lpWorth = stakingTokenPrice
  const isApproved = account && allowance && allowance.isGreaterThan(0)
  
  const { onStake } = useSousStake(farm.sousId, isBnbPool)
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

  
  const currentMs = Date.now() / 1000

  const secondsUntilNextWithdraw = useMemo(() => {  
    const nextWithdrawalUntil = new BigNumber(userData?.nextWithdrawalUntil || 0)
    if (nextWithdrawalUntil.eq(0)) return 0
    return Math.round(nextWithdrawalUntil.toNumber() - currentMs)
  }, [currentMs, userData?.nextWithdrawalUntil]) 

  const withdrawDisabled = useMemo(() => {
    const nextWithdrawalUntil = new BigNumber(userData?.nextWithdrawalUntil || 0)
    const distanceToWithdrawTime = nextWithdrawalUntil.toNumber() - currentMs

    if (farm.poolVersion && farm.poolVersion === PoolVersion.V1 && distanceToWithdrawTime > 0) 
      return true

    if (farm.poolVersion && farm.poolVersion >= PoolVersion.V2 && 
      distanceToWithdrawTime > 0 && 
      (isPoolStarted && !isPoolEnded)) {
      return true
    }

    return false
  }, [isPoolStarted, isPoolEnded, farm.poolVersion, userData?.nextWithdrawalUntil, currentMs])

  const renderApprovalOrStakeButton = () => {
    return isApproved ? (
      <StakeAction stakedBalance={stakedBalance} 
        tokenBalance={tokenBalance} 
        lpTokenDecimals={lpTokenDecimals} 
        lpWorth={lpWorth} 
        tokenName={lpName} 
        onStake={onStake}
        onUnstake={onUnstake}
        secondsUntilNextWithdraw={secondsUntilNextWithdraw}
        withdrawDisabled={withdrawDisabled}
        depositFeeBP={0} />
    ) : (
      <Button fullWidth 
        isLoading={requestedApproval}
        endIcon={requestedApproval ? <AutoRenewIcon spin color="currentColor" /> : null}                
        disabled={requestedApproval} onClick={handleApprove}>
        {TranslateString(999, 'Approve Contract')}
      </Button>
    )
  }

  return (
    <Action>     
        {!isApproved &&   
          <Flex>
            <Text bold textTransform="uppercase" color="primaryDark" fontSize="12px" pr="3px">
            {TranslateString(999, 'Start earning')}
            </Text>
          </Flex>
        }     
        {isApproved
        &&  (
          <Flex>
            <Text bold textTransform="uppercase" color="primaryDark" fontSize="12px" pr="3px">
              {lpName}
            </Text>
            <Text bold textTransform="uppercase" color="primaryDark" fontSize="12px">
              {TranslateString(999, 'Staked')}
            </Text>
          </Flex>          
        )}
      {!account ? <UnlockButton mt="8px" fullWidth /> : renderApprovalOrStakeButton()}
    </Action>
  )
}

export default RowStakeAction
