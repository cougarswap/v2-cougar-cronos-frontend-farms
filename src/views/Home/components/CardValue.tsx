import React, { useEffect, useRef } from 'react'
import { useCountUp } from 'react-countup'
import { Text } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'

interface CardValueProps {
  value: number
  decimals?: number
  fontSize?: string
  color?: string
  prefix?: string
  postfix?: string
}

const StyledText = styled(Text)`
  background: linear-gradient(318deg,#b15252 0,#1000ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const CardValue: React.FC<CardValueProps> = ({ value, decimals, fontSize = '40px', color = "primaryDark", prefix, postfix }) => {
  const { countUp, update } = useCountUp({
    start: 0,
    end: value,
    duration: 1,
    separator: ',',
    decimals:
      // eslint-disable-next-line no-nested-ternary
      decimals !== undefined ? decimals : value < 0 ? 4 : value > 1e5 ? 0 : 3,
  })

  const updateValue = useRef(update)

  useEffect(() => {
    updateValue.current(value)
  }, [value, updateValue])

  return (
    <StyledText color={color} bold fontSize={fontSize}>
      {prefix}{countUp}{postfix}
    </StyledText>
  )
}

export default CardValue
