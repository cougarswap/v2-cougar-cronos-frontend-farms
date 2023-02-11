import React, { useState, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { AutoRenewIcon, Button, Flex, Text } from '@pancakeswap-libs/uikit'
import { Farm, Vault } from 'state/types'
import { useVaultUser } from 'state/hooks'
import { getVaultAddress } from 'utils/addressHelpers'
import useI18n from 'hooks/useI18n'
import UnlockButton from 'components/UnlockButton'
import { useERC20 } from 'hooks/useContract'
import { useVaultApprove } from 'hooks/useApprove'
import { useAutoCakeStake, useVaultStake } from 'hooks/useStake'
import { useAutoCakeUnstake, useVaultUnstake } from 'hooks/useUnstake'
import StakeAction from './VaultCard/StakeAction'


const Action = styled.div`
  background-color: ${({ theme }) => theme.colors.invertedContrast}60;    
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

  background-color: transparent;
`

const CardActionHeading = styled(Flex)`
  justify-content: space-between;
`

interface VaultCardActionsProps {
  vault: Vault
  account?: string
}

const RowVaultStakeAction: React.FC<VaultCardActionsProps> = ({ vault, account }) => {
  const TranslateString = useI18n()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { allowance, tokenBalance, stakedBalance } = useVaultUser(vault.pid)  
  const lpAddress = vault.stakingToken.token.address
  const lpName = vault.stakingToken.token.symbol.toUpperCase()
  const lpWorth = vault.stakingLpWorth
  const isApproved = account && allowance && allowance.isGreaterThan(0)

  const onVaultStake = useVaultStake(vault.pid)
  const onAutoCakeStake = useAutoCakeStake()

  const onVaultUnstake = useVaultUnstake(vault.pid)  
  const onAutoCakeUnstake = useAutoCakeUnstake()

  const lpContract = useERC20(lpAddress)

  const { onApprove } = useVaultApprove(lpContract, vault.isAutoCgs ? vault.strategyContract : getVaultAddress())  

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
        lpTokenDecimals={vault.stakingToken.token.decimals} 
        lpWorth={new BigNumber(lpWorth)} 
        tokenName={lpName} 
        depositFeeBP={vault.depositFee + vault.farmContractInfo.depositFeeBP} 
        onStake={vault.isAutoCgs ? onAutoCakeStake.onStake : onVaultStake.onStake} 
        onUnstake={vault.isAutoCgs ? onAutoCakeUnstake.onUnstake : onVaultUnstake.onUnstake} 
        />
    ) : (
      <Button fullWidth 
        isLoading={requestedApproval}
        endIcon={requestedApproval ? <AutoRenewIcon spin color="currentColor" /> : null}                
        disabled={requestedApproval || !vault.multiplier } 
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

export default RowVaultStakeAction
