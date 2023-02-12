import React from "react"
import styled, { keyframes } from "styled-components"
import { Text } from '@pancakeswap-libs/uikit'
import { DexSwapRouter } from "config/constants/types"

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

const Container = styled.div<{color?: string, borderRadius?: string}>`
    border: ${({color}) => color ? `2px solid ${color}` : '2px solid #89ff00'};
    border-radius: ${({borderRadius}) => borderRadius ? `${borderRadius}` : '1px'};
    padding: 3px;
    text-align: center;
    display: flex;
    align-items: center;
    /* animation: ${Tada} 2s linear infinite; */
`

const TextStyled = styled(Text)<{color?: string}>`
    color: ${({color}) => color ||'#89ff00'} ;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    line-height: 0.9;
`

export interface DexTagProps {
    dex?: DexSwapRouter    
    borderRadius?: string
}

const DexTag : React.FC<DexTagProps> = ({dex, borderRadius}) => {
    const text = dex === DexSwapRouter.VVSFINANCE ? 'VVSFINANCE' : 'CRONASWAP'
    const color = dex === DexSwapRouter.VVSFINANCE ? '#5dcdd6' : '#8c8bbf'
    return (
        <Container color={color} borderRadius={borderRadius}>
            <TextStyled color={color}>{text}</TextStyled>
        </Container>       
    )
}

export default DexTag