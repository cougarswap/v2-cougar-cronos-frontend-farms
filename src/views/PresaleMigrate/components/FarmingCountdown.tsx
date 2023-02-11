import React, { useEffect, useState } from 'react'
import { Flex, Heading } from '@pancakeswap-libs/uikit';
import moment from 'moment'
import styled, { keyframes } from 'styled-components';
import PresaleStyledCard from "components/layout/PresaleCard"
import CountdownTimer from 'components/CountdownTimer/CountdownTimer';
import { PresaleOption } from 'state/types';
import { usePresaleMigratePublicData } from '../hooks/usePresaleMigratePublicData';

const FarmingCountdownContainer = styled(PresaleStyledCard)`   
    width: 100%;
`

const PresaleStartTimeHeader = styled(Heading)`
    font-size: 2em;
    text-transform: uppercase;
    color: #ffffff;
    text-align: center;
    margin: 10px auto;
`

const TokenClaimStartTimeHeader = styled(Heading)`
    font-size: 2em;
    text-transform: uppercase;
    color: ${({theme}) => theme.colors.primaryBright};
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

const FarmingCountdown = () => {
    const {startingTimeStamp, closingTimeStamp, claimTimeStamp, firstHarvestTimestamp, isSaleActive, isClaimActive} = usePresaleMigratePublicData(PresaleOption.OPTION_1);
    
    const [secondsToPresale, setSecondsToPresale] = useState(0);
    const [secondsToPresaleClosing, setSecondsToPresaleClosing] = useState(0);    
    const [secondsToTokenClaim, setSecondsToTokenClaim] = useState(0);

    useEffect(() => {            
        setSecondsToPresale(startingTimeStamp ? 
            moment.unix(Number(startingTimeStamp)).diff(moment(), 'second') : 0);
    }, [startingTimeStamp])

    useEffect(() => {            
        setSecondsToPresaleClosing(closingTimeStamp ? 
            moment.unix(Number(closingTimeStamp)).diff(moment(), 'second') : 0);
      }, [closingTimeStamp])

    useEffect(() => {            
        setSecondsToTokenClaim(firstHarvestTimestamp ? 
            moment.unix(Number(firstHarvestTimestamp)).diff(moment(), 'second') : 0);
    }, [firstHarvestTimestamp])
    
    const [secondsToClaim, setSecondsToClaim] = useState(0);
    
    useEffect(() => {            
      setSecondsToClaim(claimTimeStamp ? 
          moment.unix(Number(claimTimeStamp)).diff(moment(), 'second') : 0);
    }, [claimTimeStamp])

    return (
        <FarmingCountdownContainer>
            <CountDownContainer>
                {isSaleActive && secondsToPresale > 0 ?
                    <PresaleStartTimeContainer>
                        <PresaleStartTimeHeader>Time to Presale Start</PresaleStartTimeHeader>
                        <CountdownTimer seconds={secondsToPresale} />
                    </PresaleStartTimeContainer>
                    : null
                }
                {isSaleActive && secondsToPresaleClosing > 0 ?
                    <PresaleStartTimeContainer>
                        <PresaleStartTimeHeader>Presale Ends In</PresaleStartTimeHeader>
                        <CountdownTimer seconds={secondsToPresaleClosing} />
                    </PresaleStartTimeContainer>
                    : null
                }
                {!isClaimActive && secondsToTokenClaim > 0 ?
                    <TokenClaimStartTimeContainer>
                        <TokenClaimStartTimeHeader>Tokens Claim Until</TokenClaimStartTimeHeader>
                        <CountdownTimer seconds={secondsToTokenClaim} />
                    </TokenClaimStartTimeContainer> 
                    : null
                }
                {secondsToPresaleClosing < 0 && !isClaimActive && secondsToClaim > 0 ? 
                    <PresaleStartTimeContainer>
                    <PresaleStartTimeHeader>Time To Token Claim</PresaleStartTimeHeader>
                    <CountdownTimer seconds={secondsToClaim} />
                    </PresaleStartTimeContainer>
                    : null
                }
                {
                    isClaimActive ? <PresaleStartTimeHeader>You Can Claim Your CGS Now!</PresaleStartTimeHeader> : null
                }
                
            </CountDownContainer>
        </FarmingCountdownContainer>   
    )
}

export default FarmingCountdown