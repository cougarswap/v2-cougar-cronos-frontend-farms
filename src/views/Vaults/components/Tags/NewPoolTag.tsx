import React from "react"
import styled, { keyframes } from "styled-components"
import { Text } from '@pancakeswap-libs/uikit'
import { NewTag } from "components/Tags"

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

const Container = styled.div`
    width: 50px;
    border: 2px solid #89ff00;
    border-radius: 1px;
    padding: 3px;
    text-align: center;
    top: 100%;
    animation: ${Tada} 2s linear infinite;
    display: flex;
    justify-content: center;
    align-items: center;
`

const TextStyled = styled(Text)`
    color: #89ff00;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    line-height: 0.9;
`

const NewPoolTag = () => {
    return (
        <Container>
            <TextStyled>New</TextStyled>
        </Container>       
    )
}

export default NewPoolTag