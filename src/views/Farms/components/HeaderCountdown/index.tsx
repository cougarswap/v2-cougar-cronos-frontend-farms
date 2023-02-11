import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import { BSC_BLOCK_TIME } from 'config'
import useI18n from 'hooks/useI18n'
import { Heading, Flex, LinkExternal, Text } from '@pancakeswap-libs/uikit'
import styled, { keyframes } from 'styled-components'
import { useTokenPublicData } from 'state/tokenPublicData/hooks'
import { getBscScanLink } from 'utils'
import CountdownTimer from 'components/CountdownTimer/CountdownTimer'
import { useRemainingBlockToFarming } from 'state/hooks'

const FarmingCountdownTimeContainer = styled(Flex)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;  
  padding-top: 10px;
  padding-bottom: 12px;
  order: -1;

  ${({theme}) => theme.mediaQueries.nav} {
    order: 1;
  }
`

const HeeaderCountdownCard = styled(Flex)`
  width: 100%;
  max-width: 531px;
  margin: 42px auto 10px;
  padding-top: 8px;
  padding-bottom: 8px;
  border-radius: 32px;
  background-color: #27262cad;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background: linear-gradient(166deg, #143c78 20%, #464f99 80%);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  opacity: 0.85;
  border-radius: 33px;

  ${({ theme }) => theme.mediaQueries.nav} {
    margin: 32px auto;
  }
`

const fadein = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`

const FarmingCountdownTimeHeader = styled(Heading)<{color?: string}>`    
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.primaryBright};
    text-align: center;
    margin: 5px auto 10px;
    font-size: 1.4em;
    line-height: 1.4;
    /* transition: all 2s ease; */
    animation: ${fadein} 1s ease-in-out;
    &>a {
      display: inline-block;
      font-size: 1em;
    }
`

const LockBlocksTime = styled(Flex)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
`
const TextTitle = styled(Text)`
  text-transform: uppercase;  
  font-size: 1.4em;
  font-weight: bold;
  color: ${({theme}) => theme.colors.primaryDark};
`

const TextValue = styled(Text)`
  font-size: 1.3em;
  color: ${({theme}) => theme.colors.text}
`

export interface HeaderCountDownProps {    
    showHarvestLockup?: boolean;
}

const HeaderCountDown : React.FC<HeaderCountDownProps> = ({showHarvestLockup}) => {
    const t = useI18n()
    const remainingBlockToFarming = useRemainingBlockToFarming()
    const secondsToFarming = remainingBlockToFarming * BSC_BLOCK_TIME;
    
    return (
        <> 
          {remainingBlockToFarming > 0 && secondsToFarming?  
          <HeeaderCountdownCard>                          
            <FarmingCountdownTimeContainer>                
                  <>
                    <FarmingCountdownTimeHeader>{t(999, 'Farming Will Start In ')}
                    </FarmingCountdownTimeHeader>
                    <CountdownTimer seconds={secondsToFarming} />
                  </>
            </FarmingCountdownTimeContainer>  
          </HeeaderCountdownCard> : null}                            
        </>
    )
}

export default React.memo(HeaderCountDown)


