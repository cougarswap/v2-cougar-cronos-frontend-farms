import React from 'react'
import _uniqueId from 'lodash/uniqueId'
import styled from 'styled-components'
import { Flex } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import Step from './Step'
import { ProgressStep, StepState } from './easterPhases'

const ProgressStepperContainer = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }
`

const Spacer = styled.div<{ isPastSpacer?: boolean }>`
  margin: 12px 8px 0 8px;
  width: 28px;
  background-color: ${({ isPastSpacer, theme }) =>
  isPastSpacer ? theme.colors.textSubtle : theme.colors.textDisabled};
  height: 2px;
  border-radius: 4px;
  display: none;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 36px;
    display: block;
  }
`

export interface CountdownProps {
  steps?: ProgressStep[]
}

const ProgressStepper: React.FC<CountdownProps> = ({ steps }) => {
  const t = useI18n()
  const activeStepIndex = steps.findIndex(_ => _.state === StepState.LIVE)
  
  return (
    <ProgressStepperContainer>
      {steps.map((step, index) => {
        const isPastSpacer = index < activeStepIndex
        const stepText = step.text.toUpperCase()

        return (
          <React.Fragment key={_uniqueId('ProgressStep-')}>
            <Step stepText={stepText} timeStamp={step.timeStamp} index={index} activeStepIndex={activeStepIndex} />
            {index + 1 < steps.length && <Spacer isPastSpacer={isPastSpacer} />}
          </React.Fragment>
        )
      })}
    </ProgressStepperContainer>
  )
}

export default ProgressStepper
