import React, { useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { Button, Flex, Heading, useModal, Text, HelpIcon, AutoRenewIcon } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { useHarvest } from 'hooks/useHarvest'
import { getBalanceNumber } from 'utils/formatBalance'
import styled from 'styled-components'
import { usePriceCakeBusd } from 'state/hooks'

const Action = styled.div`
  background-color: ${({ theme }) => theme.colors.invertedContrast}60;    
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.textSubTitleFarm};
  padding: 10px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  ${({ theme }) => theme.mediaQueries.sm} {
    margin-right: 5px;
  }
  background-color: transparent;
`

interface FarmCardActionsProps {
  earnings?: BigNumber
  pid?: number
}

const BalanceAndCompound = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
`


const HarvestActionBody = styled(Flex)`
  position: relative;
  justify-content: space-between;
  align-items: center;
`

const HarvestBalanceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

const RowHarvestAction: React.FC<FarmCardActionsProps> = ({ earnings, pid }) => {
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
    <Action>
        <Flex>
            <Text bold textTransform="uppercase" color="primaryDark" fontSize="12px" pr="3px">
                {TranslateString(999, 'Rewards')}
            </Text>               
        </Flex>       
        <HarvestActionBody>             
            <HarvestBalanceWrapper>
              <Heading color={rawEarningsBalance === 0 ? 'textDisabled' : 'textSubTitleFarm'}>{displayBalance}&nbsp; CGS</Heading>  
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
        </HarvestActionBody>         
    </Action>    
  )
}

export default RowHarvestAction
