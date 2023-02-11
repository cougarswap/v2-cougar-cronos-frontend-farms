import React from 'react'
import styled from 'styled-components'
import { Text, Heading, Link, Image, CardBody, CardFooter } from '@pancakeswap-libs/uikit'
import Card from 'components/layout/Card'
import useI18n from 'hooks/useI18n'

const LayoutWrapper = styled.div`
  max-width: 500px;
  margin: 0 auto 40px;
  display: flex;
  flex-direction: column;
`

const StyledHeading = styled(Heading)`
  margin: 16px 0;
`

const StyledImage = styled(Image)`
  align-self: center;
`

const StyledLink = styled.a`
  align-self: center;
  margin-top: 16px;
  text-decoration: none;
  color: #25beca;
  border: 2px solid ${({theme}) => theme.colors.borderColor};
  border-radius: 1em;
  padding: 0.7em 1.2em;

  &:hover {    
    color:  ${({theme}) => theme.colors.binance};
  }
`

const CardWrapper = styled.div``

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`

const Title = styled.div`
  color: ${(props) => props.theme.colors.secondary};
  font-size: 24px;
  width: 50vw;
  text-align: center;
  font-weight: 1000;
`

const HowItWorks = () => {
  const TranslateString = useI18n()

  return (
    <CardWrapper>
      <Card>
        <CardBody>          
          <StyledCardHeader>
              <Title>
                {TranslateString(999, 'How it works')}
              </Title>              
          </StyledCardHeader>       
        </CardBody>
        <CardFooter>
          <StyledCardContentInner>
            
            <Text fontSize="16px">
              {TranslateString(
                999,
                'Spend CGS to buy tickets, contributing to the lottery pot. Win prizes if 2, 3, or 4 of your ticket numbers match the winning numbers and their exact order!',
              )}
            </Text>
            <StyledLink href="https://cougarecosystem.gitbook.io/cougarswap/products/cougar-lottery">Read more</StyledLink>
          </StyledCardContentInner>
        </CardFooter>
      </Card>
    </CardWrapper>) 
}

export default HowItWorks
