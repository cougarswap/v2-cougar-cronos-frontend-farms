import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import { BSC_BLOCK_TIME } from 'config'
import useI18n from 'hooks/useI18n'
import { Heading, Flex, LinkExternal, Text } from '@pancakeswap-libs/uikit'
import styled, { keyframes } from 'styled-components'
import { usePoolFromPid, useRemainingBlockToCbankPoolFarming, useRemainingBlockToFarming } from 'state/hooks'
import { getBscScanLink } from 'utils'
import CountdownTimer from 'components/CountdownTimer/CountdownTimer'

const HeaderCountdownCard = styled(Flex)`
  flex: 1 1 50%;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  font-size: 1em;  

  ${({theme}) => theme.mediaQueries.nav} {
    flex-direction: row;
  }
`

const FarmingCountdownTimeContainer = styled(Flex)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto 20px;  
  order: -1;

  ${({theme}) => theme.mediaQueries.nav} {
    order: 1;
  }
`

const fadein = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`

const FarmingCountdownTimeHeader = styled(Heading)`    
    text-transform: uppercase;
    color: ${({theme}) => theme.colors.white};
    text-align: center;
    margin: 10px auto;
    font-size: 1.4em;
    /* transition: all 2s ease; */
    animation: ${fadein} 1s ease-in-out;
    &>a {
      display: inline-block;
      font-size: 1em;
    }
    &>.token-name {
    }
`

const CbankHeaderCountDown = () => {
    const pid = 1
    const remainingBlockToFarming = useRemainingBlockToCbankPoolFarming(pid)    
    const secondsToFarming = remainingBlockToFarming * BSC_BLOCK_TIME;
    
    const { tokenName, startBlock } = usePoolFromPid(pid)

    return (
        <HeaderCountdownCard>
          { secondsToFarming && secondsToFarming > 0 ?
            <FarmingCountdownTimeContainer>
              <FarmingCountdownTimeHeader>CBank <span className='token-name'>{tokenName}</span> Pool Will Start At Block 
                <LinkExternal color="ultraText" href={getBscScanLink(startBlock, 'countdown')}>&nbsp;{`#${startBlock}`}</LinkExternal>
              </FarmingCountdownTimeHeader>
              <CountdownTimer seconds={secondsToFarming} />    
            </FarmingCountdownTimeContainer>  
          : null}                    
        </HeaderCountdownCard>     
    )
}

export default React.memo(CbankHeaderCountDown)