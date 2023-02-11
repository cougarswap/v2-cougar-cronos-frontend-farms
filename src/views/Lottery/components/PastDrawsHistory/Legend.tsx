import React from 'react'
import styled from 'styled-components'
import { Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

const Wrapper = styled.div`
  display: flex;
  margin: 36px 0 28px;
`

const LegendItem = styled.div`
  display: flex;
  margin-right: 18px;
  align-items: center;
`

const Circle = styled.div<{ color?: string }>`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: ${({ color, theme }) => theme.colors[color]};
  margin-right: 6px;
`

const Legend = () => {
  const TranslateString = useI18n()

  return (
    <Wrapper>
      <LegendItem>
        <Circle color="textSubtle" />
        <Text>{TranslateString(999, 'Pool Size')}</Text>
      </LegendItem>
      <LegendItem>
        <Circle color="primary"/>
        <Text>{TranslateString(999, 'Burned')}</Text>
      </LegendItem>
      <LegendItem>
        <Circle color="contrast"/>
        <Text>{TranslateString(999, 'Round')}</Text>
      </LegendItem>
    </Wrapper>
  )
}

export default Legend
