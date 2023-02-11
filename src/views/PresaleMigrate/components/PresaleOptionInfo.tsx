import React, { useEffect, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js';
import { CardBody, Text, CardFooter, Heading, LinkExternal } from '@pancakeswap-libs/uikit';
import Card from 'components/layout/Card'
import styled from 'styled-components';
import Flex from 'components/layout/Flex';
import moment from 'moment'
import { useWeb3React } from '@web3-react/core';
import { useDispatch } from 'react-redux';
import { PresaleOption } from 'state/types';
import { fetchUserInWhiteListAsync } from 'state/presaleMigrate';
import CountdownStep from 'components/CountdownStep';
import { ProgressStep, StepState } from 'components/CountdownStep/easterPhases';
import useCurrentTime from 'hooks/useTimer';
import { getOldCgsAddress, getUsdcAddress } from 'utils/addressHelpers';
import { usePresaleMigratePublicData, usePresaleMigrateUserData } from '../hooks/usePresaleMigratePublicData';

const PresaleInfoContainer = styled(Flex)`
    flex: 1 1 0%; 

    ${({ theme }) => theme.mediaQueries.md} {
        grid-row-start: 2;
        grid-row-end: 6;
        grid-column-start: 2;
        grid-column-end: 3;
  }
`

const PresaleInfoStyledCard = styled(Card)`
    width: 100%;
    max-width: 100%;
    border-radius: 8px;
    padding: 24px;
    margin: 0 0 32px;
    background: #ffffff;
`

const PresaleInfoTable = styled.table`
  width: 100%;
  &>tbody>tr>td {
    font-size: 14px;
    padding-bottom: 12px;
    color: #003bbf;
  }  

  ${({ theme }) => theme.mediaQueries.nav} {
    &>tbody>tr>td {
        font-size: 16px;       
    }  
  }

  &>tbody>tr>.colored {
    width: 50%;
    color: ${({theme}) => theme.colors.primaryDark};
    text-align: right;

    &.highlight-price {
        color: ${({theme}) => theme.colors.primaryDark};
    }

    &.highlight-condition {
        color:${({theme}) => theme.colors.primaryDark};
    }
  }

  &>tbody>tr>.get-usdc-link {
    color: #003bbf;

    text-align: right;
    &>* {
        margin-left: auto;
        line-height: 0;
        color: #003bbf;
        &>* {
            fill: #003bbf;
        }
    }
  }
`

const RegistrationForm = styled(LinkExternal)`
    color: ${({ theme }) => theme.colors.primaryDark};
    margin: 20px auto;
`


interface PresaleOptionInfoProps {
    title?: string
    condition?: string
    saleDateStart?: string
    saleDateEnd?: string
    releaseActive?: string
    releaseDuration?: number
    purchaseLimit?: number
    totalTokensSale?: number
    pricePerToken?: number
    option?: PresaleOption
}

const PresaleOptionInfo: React.FC<PresaleOptionInfoProps> = ({
    title,
    condition,
    saleDateStart,
    saleDateEnd,
    releaseActive,
    releaseDuration,
    purchaseLimit,
    totalTokensSale,
    pricePerToken,
    option
}) => {   
    const { account } = useWeb3React() 
    const dispatch = useDispatch()

    const {isWhiteListActive} = usePresaleMigratePublicData(option)
    
    useEffect(() => {
        if (account) {
            dispatch(fetchUserInWhiteListAsync(account, option, isWhiteListActive))
        }
    }, [account, dispatch, option, isWhiteListActive])
    
    const {eligibleToBuy} = usePresaleMigrateUserData(option)
    const currentMillis = useCurrentTime()
    
    const steps: ProgressStep[] = useMemo(() => {  
        const saleStartTime = parseInt(saleDateStart) 
        const saleEndTime = parseInt(saleDateEnd) 
        const saleClaimTime = parseInt(releaseActive) 

        const currentSecondsTimeStamp = Math.round(currentMillis / 1000)
        const progressSteps: ProgressStep[] = [
            {
                text: 'Sale Start',
                timeStamp: saleStartTime,
            },
            {
                text: 'Sale End',
                timeStamp: saleEndTime,
            },
            {
                text: 'Claim Active',
                timeStamp: saleClaimTime,
            }
        ]
        
        for (let i = 0; i < progressSteps.length; i++){
            if (i === 0) {
                if (currentSecondsTimeStamp < progressSteps[i].timeStamp) {
                    progressSteps[i].state = StepState.LIVE
                }
                else {
                    progressSteps[i].state = StepState.END
                }
            }
            else 
                if (currentSecondsTimeStamp < progressSteps[i].timeStamp) {
                    if (progressSteps[i-1].state === StepState.LIVE) {
                        progressSteps[i].state = StepState.ENTRY
                    }
                    else {
                        progressSteps[i].state = StepState.LIVE
                    }
                }
                else {
                    progressSteps[i].state = StepState.END
                }
            
        }

        return progressSteps
    }, [currentMillis, saleDateStart, saleDateEnd, releaseActive])

    const usdcLiquidityUrl = `https://harmonydex.cougarswap.io/#/swap?outputCurrency=${getOldCgsAddress()}`

    return (
        <PresaleInfoContainer>
            <PresaleInfoStyledCard>
                <CardBody style={{padding: "10px 24px 24px"}}>
                    <Text color="#003bbf">
                        {title}
                    </Text>
                </CardBody>
                <CardFooter style={{borderTop: "1px solid #d18181"}} padding={['0px', '0px', '12px', '12px', '24px']}>
                    <div>
                        <CountdownStep steps={steps}/>
                    </div>

                    <PresaleInfoTable>
                        <tbody>
                            {condition ?  <tr>
                                <td>Condition:</td>
                                <td className='colored highlight-condition'>{condition}</td>
                            </tr> : null}                                                      
                            <tr>
                                <td>Release Tokens Per 1%:</td>
                                <td className='colored'>{moment.duration(releaseDuration, 'seconds').humanize()}</td>
                            </tr>                                                 
                            <tr>
                                <td>Tokens On Sale:</td>
                                <td className='colored'>{totalTokensSale}</td>
                            </tr>
                            <tr>
                                <td>Presale Price:</td>
                                <td className='colored highlight-price'>{pricePerToken} CGS (old)</td>
                            </tr>     
                            <tr>
                                <td><></></td>
                                <td className='get-usdc-link'> 
                                    <LinkExternal color="tertiary" href={usdcLiquidityUrl}>
                                        <span>GET CGS (old)</span>
                                    </LinkExternal>
                                </td>
                            </tr>                                                      
                        </tbody>                   
                    </PresaleInfoTable>                   
                </CardFooter>
            </PresaleInfoStyledCard>
        </PresaleInfoContainer>
    )
}

export default PresaleOptionInfo;