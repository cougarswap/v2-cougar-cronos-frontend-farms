import React, { useMemo, useState, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { AutoRenewIcon, Button, Flex, Text } from '@pancakeswap-libs/uikit'
import { PartnerPool } from 'state/types'
import useI18n from 'hooks/useI18n'
import UnlockButton from 'components/UnlockButton'
import { usePartnerApprove } from 'hooks/useApprove'
import StakeAction from 'views/Farms/components/FarmCard/StakeAction'
import { usePartnerStake } from 'hooks/useStake'
import { usePartnerUnstake } from 'hooks/useUnstake'
import { useERC20 } from 'hooks/useContract'

const Action = styled.div`
  border-radius: 12px;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.textSubTitleFarm};
  width: 100%;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 5px;    
    margin-top: 0;
  }
`

export interface PartnerPoolWithComputedValue extends PartnerPool {
  apy?: BigNumber
  lpWorth?: BigNumber
}

interface FarmCardActionsProps {
  farm: PartnerPoolWithComputedValue
  account?: string
}

const RowStakeAction: React.FC<FarmCardActionsProps> = ({ farm, account }) => {
  const TranslateString = useI18n()
  const [requestedApproval, setRequestedApproval] = useState(false)

  const { userData } = farm
  const lpTokenDecimals = farm.stakingToken.token.decimals

  const allowance = new BigNumber(userData?.allowance || 0)
  const tokenBalance = new BigNumber(userData?.stakingTokenBalance || 0)
  const stakedBalance = new BigNumber(userData?.stakedBalance || 0)

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
      <Button 
        fullWidth 
        isLoading={requestedApproval}
        endIcon={requestedApproval ? <AutoRenewIcon spin color="currentColor" /> : null}                
        disabled={requestedApproval } onClick={handleApprove}>
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
