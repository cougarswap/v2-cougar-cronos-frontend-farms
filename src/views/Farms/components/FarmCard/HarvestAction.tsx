import React, { useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import { AutoRenewIcon, Button, Flex, Heading, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { useHarvest } from 'hooks/useHarvest'
import { getBalanceNumber } from 'utils/formatBalance'
import styled from 'styled-components'
import { usePriceCakeBusd } from 'state/hooks'

interface FarmCardActionsProps {
  earnings?: BigNumber
  nextHarvestUntil?: string
  pid?: number
  tokenName?: string
  harvestInterval?: number
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

const HarvestAction: React.FC<FarmCardActionsProps> = ({ earnings, nextHarvestUntil, pid, tokenName, harvestInterval }) => {
  const TranslateString = useI18n()
  const [pendingTx, setPendingTx] = useState(false)
  const { onReward } = useHarvest(pid)
  const rawEarningsBalance = getBalanceNumber(earnings)
  const displayBalance = rawEarningsBalance.toLocaleString() 

  const cakePrice = usePriceCakeBusd()

  const cgsEarned = useMemo(() => {
    if (cakePrice.isNaN()) {
      return 0
    }

    return getBalanceNumber(earnings.times(cakePrice))
  }, [earnings, cakePrice])
 
  return (
    <HarvestActionContainer > 
      <HarvestBalanceWrapper>
        <Heading color={rawEarningsBalance === 0 ? 'textDisabled' : 'text'}>{displayBalance}</Heading>      
        <Text color="primaryDark" fontSize="0.9em">~${cgsEarned.toLocaleString('en-US', { maximumFractionDigits: 4})}</Text>
      </HarvestBalanceWrapper>
      <BalanceAndCompound>
        {/* {pid === lpTokens.single.cgs.pid ?
          <Button
            disabled={(rawEarningsBalance === 0 || pendingTx) || !canHarvestByLock}
            size='sm'
            variant='secondary'
            marginBottom='15px'
            onClick={async () => {
              setPendingTx(true)
              await onStake(maxCompoundingAmount.toNumber().toString())
              setPendingTx(false)
            }}
          >
            {TranslateString(999, 'Compound')}
          </Button>
          : null} */}
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
          { pendingTx ? TranslateString(999, 'Harvesting') : TranslateString(999, 'Harvest')}
        </Button>
      </BalanceAndCompound>
    </HarvestActionContainer>
  )
}

export default HarvestAction
