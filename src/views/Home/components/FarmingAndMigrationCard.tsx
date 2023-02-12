import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Flex, Heading } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import { useRemainingBlockToCbankPoolFarming, useRemainingBlockToFarming } from 'state/hooks'
import PresaleStyledCard from 'components/layout/PresaleCard'
import CountdownTimer from 'components/CountdownTimer/CountdownTimer'
import { PresaleOption } from 'state/types'
import useCurrentTime from 'hooks/useTimer'
import { usePresalePublicData } from 'views/Presale/hooks/usePresalePublicData'
import moment from 'moment'
import HeaderCountDown from '../../Farms/components/HeaderCountdown'

const PresaleCountdownContainer = styled(PresaleStyledCard)`
  width: 100%;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`

const PresaleStartTimeHeader = styled(Heading)`
  font-size: 2em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  margin: 10px auto;
`

const TokenClaimStartTimeHeader = styled(Heading)`
  font-size: 2em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primaryBright};
  text-align: center;
  margin: 10px auto;
`

const PresaleStartTimeContainer = styled(Flex)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 10px auto;
`

const TokenClaimStartTimeContainer = styled(Flex)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 10px auto;
`

const CountDownContainer = styled(Flex)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`

const Container = styled.div`
  width: 100%;
  max-width: 531px;
  margin: 42px auto 10px;
  padding-top: 8px;
  padding-bottom: 8px;
  border-radius: 32px;
  background-color: #27262cad;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background: linear-gradient(166deg, #FFAD02 20%, #FF6C02 80%);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 33px;

  ${({ theme }) => theme.mediaQueries.nav} {
    margin: 32px auto;
  }
`

const ContainerGotoFarm = styled.div`
  width: 100%;
  max-width: 531px;
  margin: 42px auto 10px;
  padding-top: 8px;
  padding-bottom: 8px;
  border-radius: 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 33px;

  ${({ theme }) => theme.mediaQueries.nav} {
    margin: 32px auto;
  }
`

const LinkNavigation = styled.div`
  margin-bottom: 12px;
`

const FarmingCard = () => {
  const remainingBlockToFarming = useRemainingBlockToFarming()
  const { startingTimeStamp, closingTimeStamp, claimTimeStamp, firstHarvestTimestamp, isSaleActive, isClaimActive } =
    usePresalePublicData(PresaleOption.OPTION_1)

  const [secondsToPresale, setSecondsToPresale] = useState(0)
  const [secondsToPresaleClosing, setSecondsToPresaleClosing] = useState(0)
  const [secondsToTokenClaim, setSecondsToTokenClaim] = useState(0)
  // setSecondsToTokenClaim(1671976800000)
  const secondsToTokenClaimHard = 1671976800000 / 1000 - new Date().getTime() / 1000 // hard code

  useEffect(() => {
    setSecondsToPresale(startingTimeStamp ? moment.unix(Number(startingTimeStamp)).diff(moment(), 'second') : 0)
  }, [startingTimeStamp])

  useEffect(() => {
    setSecondsToPresaleClosing(closingTimeStamp ? moment.unix(Number(closingTimeStamp)).diff(moment(), 'second') : 0)
  }, [closingTimeStamp])

  useEffect(() => {
    setSecondsToTokenClaim(
      firstHarvestTimestamp ? moment.unix(Number(firstHarvestTimestamp)).diff(moment(), 'second') : 0,
    )
  }, [firstHarvestTimestamp])

  const [secondsToClaim, setSecondsToClaim] = useState(0)

  useEffect(() => {
    setSecondsToClaim(claimTimeStamp ? moment.unix(Number(claimTimeStamp)).diff(moment(), 'second') : 0)
  }, [claimTimeStamp])
  return (
    <>
      
      {isSaleActive && secondsToPresale > 0 ? (
        <Container>
          <PresaleStartTimeContainer>
            <PresaleStartTimeHeader>Migration Starts In</PresaleStartTimeHeader>
            <CountdownTimer seconds={secondsToPresale} />
          </PresaleStartTimeContainer>
        </Container>
      ) : null}
      {isSaleActive && secondsToPresaleClosing > 0 ? (
        <Container>
          <PresaleStartTimeContainer>
            <PresaleStartTimeHeader>Migration Ends In</PresaleStartTimeHeader>
            <CountdownTimer seconds={secondsToPresaleClosing} />
          </PresaleStartTimeContainer>
        </Container>
      ) : null}
      {secondsToPresale < 0 && !isClaimActive && secondsToTokenClaimHard > 0 ? (
        <Container>
          <TokenClaimStartTimeContainer>
            <TokenClaimStartTimeHeader>Tokens Claim Begin</TokenClaimStartTimeHeader>
            <CountdownTimer seconds={secondsToTokenClaimHard} />
          </TokenClaimStartTimeContainer>
        </Container>
      ) : null}
      {secondsToPresaleClosing < 0 && !isClaimActive && secondsToClaim > 0 ? (
        <Container>
          <PresaleStartTimeContainer>
            <PresaleStartTimeHeader>Time To Claim Converted CGS(new)</PresaleStartTimeHeader>
            <CountdownTimer seconds={secondsToClaim} />
          </PresaleStartTimeContainer>
        </Container>
      ) : null}
      {isClaimActive ? (
        <Container>
           <PresaleStartTimeContainer>
          <PresaleStartTimeHeader>You Can Claim Your Converted CGS(new) Now!</PresaleStartTimeHeader>
        </PresaleStartTimeContainer>
        </Container>
      ) : null}

      
        {secondsToTokenClaimHard < 0 && remainingBlockToFarming && remainingBlockToFarming > 0 ? (
        <ContainerGotoFarm>
          <HeaderCountDown />
          <LinkNavigation>
            <Link to="/farms">
              <Button variant="primarycronos">GO TO FARMS</Button>
            </Link>
          </LinkNavigation>
        </ContainerGotoFarm>
      ) : null}
    </>
  )
}

export default FarmingCard
