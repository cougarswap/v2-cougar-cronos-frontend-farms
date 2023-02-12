import { Button, Heading, LinkExternal, Text, Image, Flex } from '@pancakeswap-libs/uikit'
import BigNumber from 'bignumber.js'
import PresaleStyledCard from 'components/layout/PresaleCard'
import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PresaleOption } from 'state/types'
import styled, { keyframes } from 'styled-components'
import { getBalanceAmount } from 'utils/formatBalance'
import { usePresalePublicData } from 'views/Presale/hooks/usePresalePublicData'

const rotate = keyframes`
    100% {
		transform: rotate(1turn);
	}
`

const RegisterPresaleWhiteListCard = styled(PresaleStyledCard)`
    width: 100%;
    padding: 25px;
    margin: 20px auto 32px;
    justify-content: center;
    align-items: center;
    text-align: center;
    background-color: #27262cad;    
    position: relative;
	z-index: 0;	
	border-radius: 5px;
	overflow: hidden;	

    background: linear-gradient(90deg, #FFAD02 0%, #FF6C02 100%, #FF6C02 100%);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    opacity: 0.85;
    border-radius: 33px;
    ${({ theme }) => theme.mediaQueries.md} {
        width: 50%;
        
    }

    &::before {
		content: '';
		position: absolute;
		z-index: -2;
		left: -50%;
		top: -150%;
		width: 200%;
		height: 400%;
		background-repeat: no-repeat;
		background-size: 50% 50%, 50% 50%;
		background-position: 0 0, 100% 0, 100% 100%, 0 100%;
		animation: ${rotate} 10s linear infinite;
	}
	
	&::after {
		content: '';
		position: absolute;
		z-index: -1;
		left: 2px;
		top: 2px;
		width: calc(100% - 4px);
		height: calc(100% - 4px);
		border-radius: 5px;
	}
`

const HeadingStyled = styled(Heading)`
    text-transform: uppercase;
    font-size: 20px;
    margin-bottom: 20px;
    color: #ffffff;

    &>span {
        color: ${({theme}) => theme.colors.binance}
    }
`

const RegisterNowText = styled(Text)`
    text-align: center;
    padding: 5px;
    font-size: 14px;
    margin-top: 5px;
    margin-bottom: 10px;
    text-transform: uppercase;
    color: #ffffff;
`

const HeadingStyledSoldOut = styled(Heading)`
    text-transform: uppercase;
    font-size: 20px;
    margin-bottom: 15px;
    color: #ffffff;

    &>span {
        color: ${({theme}) => theme.colors.binance}
    }
`

const HarmonyCougarLink = styled.a`

`

const ImageBanner = styled(Flex)`
    justify-content: center;
    margin-bottom: 20px;
    &>*+* {
        margin-left: 20px;
    }
`

const GoToPresaleNavigation = () => {
    const { totalCakeLeft, isSaleActive, closingTimeStamp } = usePresalePublicData(PresaleOption.OPTION_1)
    const tokensLeft = useMemo(() => {
        return getBalanceAmount(new BigNumber(totalCakeLeft), 6) // presale uses 6 decimals
    }, [totalCakeLeft])    
    const isHardCapMet = tokensLeft.eq(0);
    
    return (
        <RegisterPresaleWhiteListCard>
            {/* <ImageBanner>
                <Image src="/images/egg/logo.png" width={64} height={64} />
                <Image src="/images/egg/AVAX.png" width={60} height={60} />
            </ImageBanner> */}
            {/* <HeadingStyled>COUGAR TOKEN IS BEING LAUNCHED IN HARMONY</HeadingStyled>                       
            <RegisterNowText>
                Want to be an early investor? Join us.
            </RegisterNowText> 
            <HarmonyCougarLink href="https://harmonyapp.cougarswap.io">
                <Button variant="success">HARMONY COUGAR</Button>
            </HarmonyCougarLink> */}


            { isHardCapMet ? <HeadingStyledSoldOut>Presale Tokens Are Sold Out</HeadingStyledSoldOut> : null }
            {!isHardCapMet && isSaleActive ? (
                <>
                    <HeadingStyled>Presale with discount price is in progress</HeadingStyled>
                    <RegisterNowText>
                        Get some early CGS Now
                    </RegisterNowText>  
                </>) : <HeadingStyled>Presale with discount price is ended</HeadingStyled>
            }
                                  
            <Link to="/presale">
                <Button variant="primarycronos">{isHardCapMet ||  (!isHardCapMet && !isSaleActive ) ? 'GO TO PRESALE' : 'PRESALE BUY'}</Button>
            </Link>
            <Flex mt="10px" justifyContent="center">
                <LinkExternal color="#ffffff" fontSize="10px" href="https://cougarecosystem.gitbook.io/cronoscougarswap/presale-information">
                    Why Presale?
                </LinkExternal>
            </Flex>
        </RegisterPresaleWhiteListCard>
    )
}

export default GoToPresaleNavigation