import React from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { LogoIcon, CheckmarkCircleIcon, Flex, Text } from '@pancakeswap-libs/uikit'

const sharedFlexStyles = `
flex-direction: column;
align-items: center;
justify-content: center;
`

const ExpiredWrapper = styled(Flex)`
  ${sharedFlexStyles}

  svg {
    fill: ${({ theme }) => theme.colors.textSubtle};
  }
`

const ActiveWrapper = styled(Flex)`
  ${sharedFlexStyles}
`

const FutureWrapper = styled(Flex)`
  ${sharedFlexStyles}

  svg {
    fill: ${({ theme }) => theme.colors.textDisabled};
  }
`

const StyledText = styled(Text)`
  margin-top: 4px;
  font-weight: 600;
  font-size: 12px;
`

export interface StepProps {
  stepText: string
  timeStamp: number
  index: number
  activeStepIndex: number
}

const Step: React.FC<StepProps> = ({ stepText, timeStamp, index, activeStepIndex }) => {
  
  const isExpired = index < activeStepIndex
  const isActive = index === activeStepIndex
  const isFuture = index > activeStepIndex

  if (isExpired) {
    return (
      <ExpiredWrapper>
        <CheckmarkCircleIcon />
        <StyledText color="textSubtle">{stepText}</StyledText>
        <StyledText color="textSubtle">
          {moment.unix(timeStamp).toString()}
        </StyledText>
      </ExpiredWrapper>
    )
  }

  if (isActive) {
    return (
      <ActiveWrapper>
        <LogoIcon />
        <StyledText color="secondary">{stepText}</StyledText>
        <StyledText color="secondary">
          {moment.unix(timeStamp).toString()}
        </StyledText>
      </ActiveWrapper>
    )
  }

  if (isFuture) {
    return (
      <FutureWrapper>
        <CheckmarkCircleIcon />
        <StyledText color="textDisabled">{stepText}</StyledText>  
        <StyledText color="textDisabled">
          {moment.unix(timeStamp).toString()}
        </StyledText>     
      </FutureWrapper>
    )
  }

  return <span>Er</span>
}

export default Step
