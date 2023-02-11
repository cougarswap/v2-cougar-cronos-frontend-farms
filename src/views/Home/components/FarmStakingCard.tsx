import React, { useState, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { Heading, CardBody, Button } from '@pancakeswap-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import useI18n from 'hooks/useI18n'
import BigNumber from 'bignumber.js/bignumber'
import { useAllHarvest } from 'hooks/useHarvest'
import useFarmsWithBalance from 'hooks/useFarmsWithBalance'
import UnlockButton from 'components/UnlockButton'
import Card from 'components/layout/Card'
import CakeHarvestBalance from './CakeHarvestBalance'
import CakeWalletBalance from './CakeWalletBalance'
import { usePriceCakeBusd } from '../../../state/hooks'
import { getCakeAddress } from '../../../utils/addressHelpers'
import useTokenBalance from '../../../hooks/useTokenBalance'
import { getBalanceNumber } from '../../../utils/formatBalance'

const StyledFarmStakingCard = styled(Card)`
  background-color: #27262cad;
  background-image: url('/images/egg/cougar_gru.png');
  background-repeat: no-repeat;
  background-position: top right;  
  background-size: 200px;  
  background: linear-gradient(166deg,#143c78 20%,#464f99 80%);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  opacity: 0.85;
  border-radius: 33px;
`


const StyledFarmStakingCardBody = styled(Card)`
  background-color: #FFFFFF;
  background-repeat: no-repeat;
  background-position: top right;  
  background-size: 180px;  
  background: #fffffff2;
  border-radius: 10px;
  margin-left: 24px;
  margin-right: 24px;
`

const Block = styled.div`
  margin-bottom: 16px;
`

const CardImage = styled.img`
  margin-bottom: 16px;
`

const Label = styled.div`
  color: #000000;
  font-size: 14px;
`

const Actions = styled.div`
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 24px;
  padding-bottom: 24px;
`

const ActionsHeading = styled.div`
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 24px;
`

const FarmedStakingCard = () => {
  const [pendingTx, setPendingTx] = useState(false)
  const { account } = useWeb3React()
  const TranslateString = useI18n()
  const farmsWithBalance = useFarmsWithBalance()

  const { balance: cakeBalance } = useTokenBalance(getCakeAddress())
  const cakeBalanceValue = getBalanceNumber(cakeBalance)
  const eggPrice = usePriceCakeBusd()

  const earningsSum = farmsWithBalance.reduce((accum, farm) => {
    return accum + new BigNumber(farm.balance).div(new BigNumber(10).pow(18)).toNumber()
  }, 0)

  const earningsSumBalance = useMemo(() => {
    if (eggPrice.isNaN()) return 0
    return eggPrice.times(earningsSum).toNumber()
  }, [eggPrice, earningsSum])

  const cakeBalanceValueDisplay = useMemo(() => {
    if (eggPrice.isNaN()) return 0
    return eggPrice.times(cakeBalanceValue).toNumber()
  }, [eggPrice, cakeBalanceValue])

  const balancesWithValue = farmsWithBalance.filter((balanceType) => balanceType.balance.toNumber() > 0)

  const { onReward } = useAllHarvest(balancesWithValue.map((farmWithBalance) => farmWithBalance.pid))

  const harvestAllFarms = useCallback(async () => {
    setPendingTx(true)
    try {
      await onReward()
    } catch (error) {
      // TODO: find a way to handle when the user rejects transaction or it fails
    } finally {
      setPendingTx(false)
    }
  }, [onReward])

  return (
    <StyledFarmStakingCard>
    <ActionsHeading >
    <Heading color="#ffffff" size="xl" mb="24px">
      {TranslateString(542, 'Farms & Staking')}
    </Heading>
    </ActionsHeading>
      <StyledFarmStakingCardBody>
      <CardBody>
        <CardImage src="/images/egg/logo_256.png" alt="cake logo" width={64} height={64} />
        <Block>
          <Label>{TranslateString(544, 'CGS to Harvest')}</Label>
          <CakeHarvestBalance earningsSum={earningsSum}/>
          <Label>~${earningsSumBalance.toFixed(2)}</Label>
        </Block>
        <Block>
          <Label>{TranslateString(546, 'CGS in Wallet')}</Label>
          <CakeWalletBalance cakeBalance={cakeBalanceValue} />
          <Label>~${cakeBalanceValueDisplay.toFixed(2)}</Label>
        </Block>
      </CardBody>
      </StyledFarmStakingCardBody>
        {/* <Actions >
          {account ? (
            <Button
              id="harvest-all"
              disabled={balancesWithValue.length <= 0 || pendingTx}
              onClick={harvestAllFarms}
              fullWidth
            >
              {pendingTx
                ? TranslateString(548, 'Collecting CGS')
                : TranslateString(999, `Harvest all (${balancesWithValue.length})`)}
            </Button>
          ) : (
            <UnlockButton fullWidth variant="primarycronos"/>
          )}
        </Actions> */}
    </StyledFarmStakingCard>
  )
}

export default FarmedStakingCard
