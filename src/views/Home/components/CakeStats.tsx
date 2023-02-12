import React from 'react'
import { CardBody, Heading, Text } from '@pancakeswap-libs/uikit'
import BigNumber from 'bignumber.js/bignumber'
import styled from 'styled-components'
import Card from 'components/layout/Card'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTotalSupply, useBurnedBalance } from 'hooks/useTokenBalance'
import { useMaxTransferAmountRate, useTransferTaxRate } from 'state/hooks'
import { useTokenPerBlock, useTokenPublicData } from 'state/tokenPublicData/hooks'
import useI18n from 'hooks/useI18n'
import { getCakeAddress } from 'utils/addressHelpers'
import { useFarms, usePriceCakeBusd } from '../../../state/hooks'
import CardValue from './CardValue'


const StyledCakeStats = styled(Card)`  
  margin-left: auto;
  margin-right: auto;
  background: linear-gradient(90deg, #FFAD02 0%, #FF6C02 100%, #FF6C02 100%);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  opacity: 0.85;
  border-radius: 33px;
`
const ActionsHeading = styled.div`
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 24px;
` 

const StyledCakeStatsBody = styled(Card)`
background-color: #FFFFFF;
background-repeat: no-repeat;
background-position: top right;  
background-size: 180px;  
background: #fffffff2;
border-radius: 10px;
margin-left: 24px;
margin-right: 24px;
margin-bottom: 24px;
padding-bottom: 35px;
`

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 8px;
`

const CakeStats = () => {
  const TranslateString = useI18n()
  const totalSupply = useTotalSupply()
  const burnedBalance = useBurnedBalance(getCakeAddress())  
  const eggPrice = usePriceCakeBusd();
  const circSupply = totalSupply ? totalSupply.minus(burnedBalance) : new BigNumber(0);  
  const marketCap = eggPrice.times(circSupply);

  const { tokenPerBlock } = useTokenPublicData();
  const maxTransferAmountRate = useMaxTransferAmountRate()

  const maxTransferAmount = maxTransferAmountRate && totalSupply ?
    new BigNumber(maxTransferAmountRate).div(new BigNumber(100)).multipliedBy(new BigNumber(getBalanceNumber(totalSupply))) : new BigNumber(0)

  const transferTaxRate = useTransferTaxRate()

  return (
    <StyledCakeStats>
      <ActionsHeading>
      <Heading size="xl" color="#ffffff" mb="24px">
          {TranslateString(534, 'Egg Stats')}
        </Heading>
        </ActionsHeading>
      <StyledCakeStatsBody>
      <CardBody>
        <Row>
          <Text color = "#000000" fontSize="14px">{TranslateString(999, 'Market Cap')}</Text>
          <CardValue color = "primaryDark" fontSize="14px" value={getBalanceNumber(marketCap)} decimals={0} prefix="$" />
        </Row>
        <Row>
          <Text color = "#000000" fontSize="14px">{TranslateString(536, 'Total Supply')}</Text>
          {totalSupply && <CardValue color = "primaryDark" fontSize="14px" value={getBalanceNumber(totalSupply)} decimals={0} />}
        </Row>       
        <Row>
          <Text color = "#000000" fontSize="14px">{TranslateString(538, 'Total Burned')}</Text>
          <CardValue color = "primaryDark" fontSize="14px" value={getBalanceNumber(burnedBalance)} decimals={0} />
        </Row>
        <Row>
          <Text color = "#000000" fontSize="14px">{TranslateString(541, 'Max Tx Amount')}</Text>          
          {maxTransferAmount && <CardValue color = "primaryDark" fontSize="14px" value={maxTransferAmount.toNumber()} decimals={0} />}
        </Row>
        <Row>
          <Text color = "#000000" fontSize="14px">{TranslateString(543, 'Transfer Tax')}</Text>          
          {transferTaxRate && <CardValue color = "#000000" postfix="%" fontSize="14px" value={transferTaxRate} decimals={0} />}
        </Row>
        <Row>
          <Text color = "#000000" fontSize="14px">{TranslateString(540, 'New CGS/block')}</Text>
          <Text color = "#000000"  bold fontSize="14px">{tokenPerBlock}</Text>
        </Row>              
      </CardBody>
      </StyledCakeStatsBody>
    </StyledCakeStats>
  )
}

export default CakeStats
