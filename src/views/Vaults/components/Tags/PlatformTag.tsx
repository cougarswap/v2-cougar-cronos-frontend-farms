import React, { useMemo } from "react"
import styled, { keyframes } from "styled-components"
import { Text } from '@pancakeswap-libs/uikit'
import { DexSwapRouter, StakePlatform } from "config/constants/types"

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

export interface PlatformTagProps {
    platform?: StakePlatform    
    borderRadius?: string
}

const PlatformTag : React.FC<PlatformTagProps> = ({platform, borderRadius}) => {
    const color = useMemo(() => {
      if (platform === StakePlatform.COUGARSWAP) return '#b41914' 
      return '#e9e9e9'
    }, [platform])
    
    return (
        <Container color={color} borderRadius={borderRadius}>
            <TextStyled color={color}>{platform}</TextStyled>
        </Container>       
    )
}

export default PlatformTag