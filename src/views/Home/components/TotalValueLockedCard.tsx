import React, { useMemo } from 'react'
import styled from 'styled-components'
import { CardBody, Heading, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import Card from 'components/layout/Card'
import { useCBankTotalValue, useCgsPartnerPoolsTvl, useTotalValue } from '../../../state/hooks'
import CardValue from './CardValue'

const StyledTotalValueLockedCard = styled(Card)`
  background-color: #27262cad;
  flex: 1;
  background: linear-gradient(166deg,#6e4d05 20%,#6e4527 80%);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 33px;
  opacity: 0.85;
`

const StyledTotalValueLockedCardBody = styled(Card)`
background-color: #FFFFFF;
background-repeat: no-repeat;
background-position: top right;  
background-size: 180px;  
background: #fffffff2;
border-radius: 10px;
margin-left: 24px;
margin-right: 24px;
margin-bottom: 24px;
`
const ActionsHeading = styled.div`
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 24px;
`

const TvlRow = styled.div`
  margin-top: 20px;
`

const TotalValueLockedCard = () => {
  const TranslateString = useI18n()

  const farmTotalValue = useTotalValue();
  const cbankTvl = useCBankTotalValue();
  const cgsInPartnerPoolsTvl = useCgsPartnerPoolsTvl();

  const cbankTotalTvl = useMemo(() => {
    return cbankTvl.plus(cgsInPartnerPoolsTvl);
  }, [cbankTvl, cgsInPartnerPoolsTvl])
  
  const totalTvl = useMemo(() => {
    return farmTotalValue.plus(cbankTotalTvl).toNumber()
  }, [farmTotalValue, cbankTotalTvl])

  return (
    <StyledTotalValueLockedCard>    
      <ActionsHeading>
      <Heading size="xl" color="#ffffff"  mb="24px">
          {TranslateString(999, 'Total Value Locked (TVL)')}
        </Heading>
        </ActionsHeading>  
      <StyledTotalValueLockedCardBody>
      <CardBody>
        <CardValue color="primaryDark" fontSize="40px" value={totalTvl} prefix="$" decimals={2} />       
        <TvlRow>         
          <CardValue color="primaryDark"  fontSize="20px" value={farmTotalValue.toNumber()} prefix="$" decimals={2}/>
          <Text color="#000000" bold>{TranslateString(999, 'Across all Farms and Pools TVL')}</Text>
        </TvlRow>
        <TvlRow>         
          <CardValue color="primaryDark" fontSize="20px" value={cbankTotalTvl.toNumber()} prefix="$" decimals={2}/>
          <Text color="#000000" bold>{TranslateString(999, 'CBank TVL')}</Text>
        </TvlRow>
      </CardBody>
      </StyledTotalValueLockedCardBody>
    </StyledTotalValueLockedCard>
  )
}

export default TotalValueLockedCard
