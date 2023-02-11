import React from "react"
import styled, { keyframes } from "styled-components"
import { Text } from '@pancakeswap-libs/uikit'

const Container = styled.div<{color?: string, borderRadius?: string}>`
    border: ${({color}) => color ? `2px solid ${color}` : '2px solid #fff'} ;
    border-radius: ${({borderRadius}) => borderRadius ? `${borderRadius}` : '1px'};
    padding: 3px;
    text-align: center;
    display: flex;
    align-items: center;
    & > * {
        color: ${({color}) => color? `${color}` : '#fff' };
    }
`

const TextStyled = styled(Text)`    
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    line-height: 0.9;
`

export interface PartnerTagProps {
    borderRadius?: string
}

const PartnerTag : React.FC<PartnerTagProps> = ({borderRadius}) => {
    return (
        <Container color="#55eaa8" borderRadius={borderRadius}>
            <TextStyled>PARTNER</TextStyled>
        </Container>       
    )
}

export default PartnerTag