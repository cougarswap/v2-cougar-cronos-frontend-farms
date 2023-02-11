import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { Flex, Heading, Progress, useModal } from '@pancakeswap-libs/uikit';
import useI18n from 'hooks/useI18n'
import moment from 'moment'
import useRefresh from 'hooks/useRefresh';
import { useWeb3React } from '@web3-react/core';
import { delay } from 'lodash'
import BigNumber from 'bignumber.js';
import { getBalanceAmount } from 'utils/formatBalance';
import { PresaleOption } from 'state/types';
import PresaleEndCelebrationModal from './components/PresaleEndCelebrationModal';
import BuyPresaleTabs from './components/BuyPresaleTabs';
import {usePresaleDataOption, usePresaleUserBalance} from './hooks/usePresaleDataOption';
import RegisterPresaleWhiteList from './components/RegisterPresaleWhiteList';
import PresaleCountdownCard from './components/PresaleCountdownCard';
import { usePresalePublicData } from './hooks/usePresaleUserData';

const DISPLAYED_PRESALE_END_KEY = 'fantomPresaleEndDisplayed'

const PresaleHeading = styled(Heading)`
    color: ${({theme}) => theme.colors.text};
    font-size: 3em;
    text-transform: uppercase;
`

const DecorationHeading = styled.span`
    color: ${({theme}) => theme.colors.textSubtle};
    font-size: 1.5em;
    text-transform: uppercase;
    margin-top: 15px;
`

const moveIt = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`

const StyledImage = styled.div`    
    width: 100%;
    text-align: center;
    max-width: 300px;
    margin: 0 auto;

    ${({ theme }) => theme.mediaQueries.md} {
        width: 80%;
    }

    animation: 2s ease-in-out 0s infinite normal none running ${moveIt};
    transform: translate3d(0px, 0px, 0px);
`

const TextHeader = styled(Flex)`    
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 20px;

    ${({ theme }) => theme.mediaQueries.md} {
        padding-top: 30px;
    }

    ${({ theme }) => theme.mediaQueries.lg} {
        padding-top: 30px;
    }
`

const PresalePageHeader = styled(Flex)`
    padding: 0 30px;
    justify-content: space-around;
    flex-direction: column-reverse;

    ${({ theme }) => theme.mediaQueries.md} {
        flex-direction: row;
    }
`

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    margin-top: 20px;
    grid-column-gap: 20px;
    grid-row-gap: 20px;

    ${({ theme }) => theme.mediaQueries.md} {
        grid-template-columns: 1fr 1fr;
    }
`

const Container = styled.div`
    padding: 20px;
    margin-top: 20px;
`

const Presale = () => {
    const t = useI18n()
    const { account } = useWeb3React() 

    const dispatch = useDispatch()
    const { slowRefresh } = useRefresh()
      
    usePresaleUserBalance(account, dispatch, slowRefresh);
    
    const buyPresaleRef = React.useRef<HTMLDivElement>(null);
    const scrollToBuy = (): void => {
        buyPresaleRef.current.scrollIntoView({
          behavior: 'smooth',
        })
    }

    const { totalCakeLeft, closingTimeStamp } = usePresalePublicData(PresaleOption.OPTION_1)
    
    const tokensLeft = useMemo(() => {
        return getBalanceAmount(new BigNumber(totalCakeLeft), 6) // presale uses 6 decimals
    }, [totalCakeLeft])    

    const [secondsToPresaleClosing, setSecondsToPresaleClosing] = useState(0);   
    const isHardCapMet = tokensLeft.eq(0);

    const [onPresentPresaleEndCelebrationModal] = useModal(<PresaleEndCelebrationModal isHardCapMet={isHardCapMet} />)    

    useEffect(() => {            
        setSecondsToPresaleClosing(closingTimeStamp ? 
            moment.unix(Number(closingTimeStamp)).diff(moment(), 'second') : 0);
      }, [closingTimeStamp])

    const shouldShowCelebrationCard = secondsToPresaleClosing < 0 || isHardCapMet;

    useEffect(() => {
        const displayedPresaleEnd = localStorage.getItem(DISPLAYED_PRESALE_END_KEY)

        if (!displayedPresaleEnd && shouldShowCelebrationCard) {
            localStorage.setItem(DISPLAYED_PRESALE_END_KEY, 'true')
            delay(() => onPresentPresaleEndCelebrationModal(), 1000)
        }
      }, [shouldShowCelebrationCard, onPresentPresaleEndCelebrationModal])   

    return (
        <Container>
            <PresalePageHeader>
                <TextHeader>
                    <PresaleHeading>
                        {t(999, 'Presale ')}
                    </PresaleHeading>                   
                    <DecorationHeading>{t(999, 'GET SOME EARLY CGS')}</DecorationHeading> 
                    <RegisterPresaleWhiteList scrollToBuy={scrollToBuy}/>
                </TextHeader>                                     
            </PresalePageHeader>
            <GridContainer>   
                {/* <PresaleCountdownCard />                */}
                <BuyPresaleTabs ref={buyPresaleRef} />
            </GridContainer>
        </ Container>
    )
}

export default Presale;

