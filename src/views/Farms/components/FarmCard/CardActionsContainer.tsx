import React, { useState, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { AutoRenewIcon, Button, Flex, Text } from '@pancakeswap-libs/uikit'
import { Farm } from 'state/types'
import { useFarmFromPid, useFarmUser } from 'state/hooks'
import useI18n from 'hooks/useI18n'
import UnlockButton from 'components/UnlockButton'
import { useERC20 } from 'hooks/useContract'
import { useApprove } from 'hooks/useApprove'
import useStake from 'hooks/useStake'
import useUnstake from 'hooks/useUnstake'
import StakeAction from './StakeAction'
import HarvestAction from './HarvestAction'


const Action = styled.div`
  margin-top: 16px;
  background-color: #1c1c1c;    
  border-radius: 20px;
  padding: 10px;
`

const CardActionHeading = styled(Flex)`
  justify-content: space-between;
`

export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber
  lpWorth?: BigNumber
}

interface FarmCardActionsProps {
  farm: FarmWithStakedValue
  account?: string
}

const CardActions: React.FC<FarmCardActionsProps> = ({ farm, account }) => {
  const TranslateString = useI18n()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { pid, lpAddresses, tokenAddresses, isTokenOnly, depositFeeBP } = useFarmFromPid(farm.pid)
  const { allowance, tokenBalance, stakedBalance, nextHarvestUntil, earnings } = useFarmUser(pid)  
  const lpAddress = lpAddresses[process.env.REACT_APP_CHAIN_ID]
  const tokenAddress = tokenAddresses[process.env.REACT_APP_CHAIN_ID];
  const lpName = farm.lpSymbol.toUpperCase()
  const lpWorth = farm.lpWorth
  const isApproved = account && allowance && allowance.isGreaterThan(0)
  
  const { onStake } = useStake(pid)
  const { onUnstake } = useUnstake(pid)
  
  const lpContract = useERC20(isTokenOnly ? tokenAddress : lpAddress)

  const { onApprove } = useApprove(lpContract)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
    } catch (e) {
      console.error(e)
    }
    finally {
      setRequestedApproval(false)
    }
  }, [onApprove])

  const renderApprovalOrStakeButton = () => {        
    return isApproved ? (
      <StakeAction stakedBalance={stakedBalance} 
        lpTokenDecimals={farm.lpTokenDecimals} 
        lpWorth={lpWorth} 
        tokenBalance={tokenBalance} 
        tokenName={lpName} 
        depositFeeBP={depositFeeBP}
        onStake={onStake}
        onUnstake={onUnstake} />
    ) : (
      <Button mt="8px" fullWidth 
        isLoading={requestedApproval}
        endIcon={requestedApproval ? <AutoRenewIcon spin color="currentColor" /> : null}                        
        disabled={requestedApproval} 
        onClick={handleApprove}>
          { requestedApproval ? TranslateString(999, 'Approving') : TranslateString(999, 'Approve Contract')}
      </Button>
    )
  }

  return (
    <Action>
      <CardActionHeading>
        <div>
          <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="3px">
            COUGAR
          </Text>
          <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
            {TranslateString(999, 'Earned')}
          </Text>
        </div>
      </CardActionHeading>
      <HarvestAction earnings={earnings} 
        nextHarvestUntil={nextHarvestUntil} 
        pid={pid}
        tokenName={lpName}
        harvestInterval={farm.harvestInterval}
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
