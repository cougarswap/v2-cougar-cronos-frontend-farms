import React from 'react'
import { Heading, Flex, Text } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'

const StatCardContentStyledBox = styled(Flex)`
  flex: 1;  
  border: 2px;
  border-radius: 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  font-size: 16px;
  box-shadow: 1px 1px 3px 1px #4e4b54;
  background: linear-gradient(90deg, #FFAD02 0%, #FF6C02 100%, #FF6C02 100%);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  opacity: 0.85;
  border-radius: 10px;
  &:hover {
    background-color: #4f34692e;
    transform: scale(1.1);
  }
  
  ${({ theme }) => theme.mediaQueries.nav} {
    padding: 20px;    
  }
`

const ValueText = styled(Text)`
  font-size: 1.2em;
  font-weight: 600;
  line-height: 1.1;
  color: #ffffff;
`

const UnitText = styled(Text)`
  font-size: 0.8em;
  color: #ffffff;
`

const StatTypeText = styled(Text)`
  text-align: center;
  font-size: 0.9em;
  font-weight: bold;
  margin-top: 5px;
  color: #ffffff;
`

const StatCardContent: React.FC<{ statType: string; value: number; unit: string; highlightColor: string }> = ({
    statType,
    value,
    unit,
    highlightColor
  }) => {
    return (
      <StatCardContentStyledBox        
      >
        <ValueText>{value}</ValueText>
        <UnitText>{unit}</UnitText>
        <StatTypeText color={highlightColor || "success"}>{statType}
        </StatTypeText>
      </StatCardContentStyledBox>
    )
  }
  
export default StatCardContent