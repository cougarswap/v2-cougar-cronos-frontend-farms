import { Button, Heading, Text } from '@pancakeswap-libs/uikit'
import Flex from 'components/layout/Flex'
import PresaleStyledCard from 'components/layout/PresaleCard'
import React from 'react'
import styled, { keyframes } from 'styled-components'

const rotate = keyframes`
    100% {
		transform: rotate(1turn);
	}
`

const RegisterPresaleWhiteListCard = styled(PresaleStyledCard)`
    padding: 25px;
    margin-top: 20px;
    justify-content: center;
    align-items: center;
    text-align: center;
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	background: transparent;

    position: relative;
	z-index: 0;	
	overflow: hidden;	

    &::before {
		content: '';
		position: absolute;
		z-index: -2;
		left: -50%;
		top: -150%;
		width: 200%;
		height: 400%;				
	}
	
	&::after {
		content: '';
		position: absolute;
		z-index: -1;
		left: 2px;
		top: 2px;
		width: calc(100% - 4px);
		height: calc(100% - 4px);
		background: #1a1c34;
		border-radius: 5px;
		
	background: linear-gradient(166deg,#6e4d05 20%,#6e4527 80%);
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    opacity: 0.85;
	border-radius: 33px;
	}
`

const HeadingStyled = styled(Heading)`
    text-transform: uppercase;
    font-size: 16px;
	color: "#ffffff";

    &>span {
        color: ${({theme}) => theme.colors.binance}
    }
`

export interface RegisterPresaleWhiteListProps {
	scrollToBuy: () => void
}

const RegisterPresaleWhiteList: React.FC<RegisterPresaleWhiteListProps> = ({scrollToBuy}) => {
    return (
        <RegisterPresaleWhiteListCard>
            <HeadingStyled color = "#ffffff">Presale with discount price is in ended</HeadingStyled>
			<Button mt="20px" onClick={scrollToBuy} variant="primarycronos">VIEW DETAILS</Button>
        </RegisterPresaleWhiteListCard>
    )
}

export default RegisterPresaleWhiteList