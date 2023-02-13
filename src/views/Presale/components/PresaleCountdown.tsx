import React, { useEffect, useState } from 'react'
import { Flex, Heading } from '@pancakeswap-libs/uikit'
import moment from 'moment'
import styled, { keyframes } from 'styled-components'
import PresaleStyledCard from 'components/layout/PresaleCard'
import CountdownTimer from 'components/CountdownTimer/CountdownTimer'
import { PresaleOption } from 'state/types'
import useCurrentTime from 'hooks/useTimer'
import { usePresalePublicData } from '../hooks/usePresalePublicData'

const PresaleCountdownContainer = styled(PresaleStyledCard)`
  width: 100%;
  max-width: 800px; 
  margin-left:auto;
  margin-right:auto;
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

const PresaleStartTimeContainer = styled(PresaleStyledCard)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 10px auto;
  width: 100%;
  max-width: 800px; 
`

const TokenClaimStartTimeContainer = styled(Flex)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 10px auto;
`

const CountDownContainer = styled(Flex)`
  width: 100%;
  max-width: 800px; 
  margin-left:auto;
  margin-right:auto;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`

const PresaleCountdown = () => {
  const { startingTimeStamp, closingTimeStamp, claimTimeStamp, firstHarvestTimestamp, isSaleActive, isClaimActive } =
    usePresalePublicData(PresaleOption.OPTION_1)

  const [secondsToPresale, setSecondsToPresale] = useState(0)
  const [secondsToPresaleClosing, setSecondsToPresaleClosing] = useState(0)
  const [secondsToTokenClaim, setSecondsToTokenClaim] = useState(0)
  // setSecondsToTokenClaim(1671976800000)
  const secondsToTokenClaimHard =  (1671976800000/1000 - (new Date().getTime())/1000 ) // hard code 
               
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
      <CountDownContainer>
        {isSaleActive && secondsToPresale > 0 ? (
          <PresaleStartTimeContainer>
            <PresaleStartTimeHeader>Migration Starts In</PresaleStartTimeHeader>
            <CountdownTimer seconds={secondsToPresale} />
          </PresaleStartTimeContainer>
        ) : null}
        {isSaleActive && secondsToPresaleClosing > 0 ? (
          <PresaleStartTimeContainer>
            <PresaleStartTimeHeader>Migration Ends In</PresaleStartTimeHeader>
            <CountdownTimer seconds={secondsToPresaleClosing} />
          </PresaleStartTimeContainer>
        ) : null}
        {!isClaimActive && secondsToTokenClaimHard > 0 ? (
          <TokenClaimStartTimeContainer>
            <TokenClaimStartTimeHeader>Tokens Claim Begin</TokenClaimStartTimeHeader>
            <CountdownTimer seconds={secondsToTokenClaimHard} />
          </TokenClaimStartTimeContainer>
        ) : null}
        {secondsToPresaleClosing < 0 && !isClaimActive && secondsToClaim > 0 ? (
          <PresaleStartTimeContainer>
            <PresaleStartTimeHeader>Time To Claim Converted wCGS</PresaleStartTimeHeader>
            <CountdownTimer seconds={secondsToClaim} />
          </PresaleStartTimeContainer>
        ) : null}
        {isClaimActive ? (
          <PresaleStartTimeContainer>
          <PresaleStartTimeHeader>You Can Claim Your Converted wCGS Now!</PresaleStartTimeHeader>
          </PresaleStartTimeContainer>
        ) : null}
      </CountDownContainer>
  )
}

export default PresaleCountdown
