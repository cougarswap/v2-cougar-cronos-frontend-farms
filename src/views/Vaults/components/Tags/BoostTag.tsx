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
    width: 30px;
    border-radius: 1px;
    padding: 3px;
    text-align: center;
    top: 100%;
    animation: ${Tada} 2s linear infinite;
    display: flex;
    justify-content: center;
    align-items: center;
`

const BoostImage = styled.img`
  position: absolute;
  width: 32px;
  height: 32px;
`

const BoostTag = () => {
    return (
        <Container>
            <BoostImage src='/images/promotion/boost.png' alt='Boost' />
        </Container>       
    )
}

export default BoostTag