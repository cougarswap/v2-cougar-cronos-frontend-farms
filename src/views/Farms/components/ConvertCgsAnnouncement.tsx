import React from 'react'
import { Heading } from "@pancakeswap-libs/uikit"
import styled from "styled-components"

const Wrapper = styled(Heading)<{color?: string}>`    
    text-transform: uppercase;
    color: ${({theme, color}) => color ?? theme.colors.primaryDark};
    text-align: center;
    margin: 5px auto 10px;
    font-size: 1.4em;
    line-height: 1.4;
    &>a {
        display: inline-block;
        font-size: 1em;
    }
    `

const ConvertCgsAnnouncement = () => {
    return (
        <Wrapper color='binance'>
            The farming has been temporarily suspended<br />
            YOU CAN CONVERT CGS TO NEW CGS AFTER MIGRATION WITH A RATE OF 1:1 
        </Wrapper>
    )
}

export default ConvertCgsAnnouncement