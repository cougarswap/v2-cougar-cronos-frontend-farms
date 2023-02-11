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
import StakeAction from '../StakeAction'


const Action = styled.div`
background-color: transparent;
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

const RowStakeAction: React.FC<FarmCardActionsProps> = ({ farm, account }) => {
  const TranslateString = useI18n()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { pid, lpAddresses, tokenAddresses, isTokenOnly, lpTokenDecimals, depositFeeBP } = useFarmFromPid(farm.pid)
  const { allowance, tokenBalance, stakedBalance} = useFarmUser(pid)  
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
        tokenBalance={tokenBalance} 
        lpTokenDecimals={lpTokenDecimals} 
        lpWorth={lpWorth} 
        tokenName={lpName} 
        depositFeeBP={depositFeeBP} 
        onStake={onStake} 
        onUnstake={onUnstake} 
        />
    ) : (
      <Button fullWidth 
        isLoading={requestedApproval}
        endIcon={requestedApproval ? <AutoRenewIcon spin color="currentColor" /> : null}                
        disabled={requestedApproval || !farm.multiplier } 
        onClick={handleApprove}>
          { requestedApproval ? TranslateString(999, 'Approving') : TranslateString(999, 'Approve Contract')}
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
