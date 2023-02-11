import React from "react"
import styled, { keyframes } from "styled-components"
import { AutoRenewIcon, Text } from '@pancakeswap-libs/uikit'

const Tada = keyframes`
  0% {
    transform: scale(1)
  }
  
  20% {
    transform: scale(1) rotate(0); 
  }
  30%, 50%, 70% {
    transform: scale(1.1) rotate(2deg);
  } 
  40%, 60%, 80% {
    transform: scale(1.1) rotate(-2deg);
  }
  100% {
    transform: scale(1) rotate(0)
  }
`

const Container = styled.div<{color?: string, backgroundColor?: string, borderRadius?: string}>`
    border: ${({color}) => color ? `2px solid ${color}` : '2px solid #89ff00'};
    background-color: ${({backgroundColor}) => backgroundColor ? `${backgroundColor}` : '#5e1210'};
    border-radius: ${({borderRadius}) => borderRadius ? `${borderRadius}` : '1px'};
    padding: 3px;
    text-align: center;
    display: flex;
    align-items: center;
    /* animation: ${Tada} 2s linear infinite; */
    &>svg {
      width: 14px !important;
      fill: ${({color}) => color ??'#89ff00'};
    }
`

const TextStyled = styled(Text)<{color?: string}>`
    color: ${({color}) => color ||'#89ff00'} ;
    font-size: 12px;
    font-weight: 700;
    margin-right: 0.25em;
    text-transform: uppercase;
    line-height: 0.9;
`

export interface WaitingTagProps {
    borderRadius?: string
}

const WaitingTag : React.FC<WaitingTagProps> = ({borderRadius}) => {
    const text = 'STARTING'
    const color = '#00bcd4'
    const backgroundColor = '#2b3940'

    return (
        <Container color={color} backgroundColor={backgroundColor} borderRadius={borderRadius}>
            <AutoRenewIcon />
            <TextStyled color={color}>{text}</TextStyled>
        </Container>       
    )
}

export default WaitingTag
