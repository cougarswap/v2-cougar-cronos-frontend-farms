import React, { useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { AutoRenewIcon, Button, Flex, Heading, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { usePartnerHarvest } from 'hooks/useHarvest'
import { getBalanceNumber } from 'utils/formatBalance'
import styled from 'styled-components'

interface FarmCardActionsProps {
    earnings?: BigNumber
    partnerId?: number
    tokenName?: string
    tokenPrice?: BigNumber
}

const BalanceAndCompound = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
`

const HarvestActionContainer = styled(Flex)`
  position: relative;
  margin-bottom: 8px;
  justify-content: space-between;
  align-items: center;
`

const HarvestBalanceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

const HarvestAction: React.FC<FarmCardActionsProps> = ({ earnings, partnerId, tokenPrice }) => {
  const TranslateString = useI18n()
  const [pendingTx, setPendingTx] = useState(false)
  const { onReward } = usePartnerHarvest(partnerId)
  const rawEarningsBalance = getBalanceNumber(earnings)
  const displayBalance = rawEarningsBalance.toLocaleString() 

  const cgsEarned = useMemo(() => {    
    return getBalanceNumber(earnings.times(tokenPrice))
  }, [earnings, tokenPrice])
 
  return (
    <HarvestActionContainer > 
      <HarvestBalanceWrapper>
        <Heading color={rawEarningsBalance === 0 ? 'textDisabled' : 'text'}>{displayBalance}</Heading>      
        <Text color="primaryDark" fontSize="0.9em">~${cgsEarned.toLocaleString('en-US', { maximumFractionDigits: 4})}</Text>
      </HarvestBalanceWrapper>
      <BalanceAndCompound>        
        <Button
          isLoading={pendingTx}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}              
          disabled={(rawEarningsBalance === 0 || pendingTx)}
          onClick={async () => {
            setPendingTx(true)
            await onReward()
            setPendingTx(false)
          }}
        >
          {pendingTx ? TranslateString(999, 'Harvesting') : TranslateString(999, 'Harvest')}
        </Button>
      </BalanceAndCompound>
    </HarvestActionContainer>
  )
}

export default HarvestAction
