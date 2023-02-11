import React, { useState } from 'react'
import { TabMenu as UIKitTabMenu, Tab, Flex, VerifiedIcon, CommunityIcon, Box } from '@pancakeswap-libs/uikit'
import PresaleStyledCard from 'components/layout/PresaleCard';
import styled, { keyframes } from 'styled-components';
import { PresaleOption } from 'state/types'
import PresaleOptionCard from './PresaleOption';

const BuyPresaleTabsCard = styled(PresaleStyledCard)`
  overflow: visible;

  ${({ theme }) => theme.mediaQueries.md} {
        grid-row-start: 2;
        grid-row-end: 3;
        grid-column-start: 1;
        grid-column-end: 3;
    }   
    width: 100%;
`

const BoxContainer = styled(Box)`
  padding: 0;
`

const Tada = keyframes`
  0% {
    transform: scale(1)
  }
  10%, 20% {
    transform: scale(.9) rotate(-8deg);
  }
  30%, 50%, 70% {
    transform: scale(1.1) rotate(8deg);
  } 
  40%, 60% {
    transform: scale(1.1) rotate(-8deg);
  }
  100% {
    transform: scale(1) rotate(0)
  }
`
const BuyPresaleTabs = React.forwardRef((props, ref: React.Ref<HTMLDivElement>) => {
    const [presaleOption, setPresaleOption] = useState(PresaleOption.OPTION_1)

    return (
        <BuyPresaleTabsCard>
            <div ref={ref} />            
            <BoxContainer>
              {presaleOption === PresaleOption.OPTION_1 && <PresaleOptionCard option={PresaleOption.OPTION_1} />}             
            </BoxContainer>
        </BuyPresaleTabsCard>
    )
})

export default BuyPresaleTabs