import React from 'react'
import styled from 'styled-components'
import { Flex, Skeleton, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import useTheme from 'hooks/useTheme'
import CountdownTimer from 'views/Farms/components/FarmCard/CountdownTimer'
import { ProgressStep, StepState } from './easterPhases'
import ProgressStepper from './ProgressStepper'

export interface CompetitionPhaseProps {  
  steps?: ProgressStep[]
}


const Wrapper = styled(Flex)`
  width: 100%;
  height: fit-content;
  box-sizing: border-box;
  border-radius: 0px 0px 24px 24px;
  padding: 10px 0;
  margin-bottom: 10px;
  justify-content: space-around;

  ${({ theme }) => theme.mediaQueries.xl} {
    flex-direction: column;
  }
`

const PocketWatchWrapper = styled(Flex)`
  align-items: center;
  justify-content: center;
  margin-right: 12px;

  svg {
    height: 48px;
    width: 48px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-right: 24px;

    svg {
      height: 64px;
      width: 64px;
    }
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    margin-bottom: 16px;
    margin-right: 0;
  }
`
const TextCountdown = styled(Flex)`
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`

const Countdown: React.FC<CompetitionPhaseProps> = ({
  steps  
}) => {
  const { theme } = useTheme()
  const t = useI18n()

  const activeStep = steps.find(_ => _.state === StepState.LIVE)

  let secondsUntilNextEvent = 0

  if (activeStep) {
    const finishMs = activeStep.timeStamp
    const currentMs = Date.now() / 1000
    secondsUntilNextEvent = Math.round(finishMs - currentMs)
  }  

  return (
    <Wrapper>     
      <Flex flexDirection="column" justifyContent="center">
        {activeStep ? (         
          <TextCountdown>
            <Text bold textTransform="uppercase" fontSize="16px" mr={{ _: '8px', sm: '16px' }}>
              {`Time to ${activeStep.text}`}
            </Text>
            <CountdownTimer seconds={secondsUntilNextEvent} />
          </TextCountdown>
        ): null }
        <ProgressStepper steps={steps} />
      </Flex>
    </Wrapper>
  )
}

export default React.memo(Countdown)
