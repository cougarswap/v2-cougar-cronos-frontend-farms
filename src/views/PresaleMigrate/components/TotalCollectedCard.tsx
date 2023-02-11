import React, { useMemo, useState } from 'react'
import styled, { keyframes } from 'styled-components';
import { Flex, Heading, Progress, Text } from '@pancakeswap-libs/uikit';
import BigNumber from 'bignumber.js';
import { getBalanceAmount } from 'utils/formatBalance';
import CardValue from 'views/Home/components/CardValue';
import { PresaleOption } from 'state/types';
import { BIG_ZERO } from 'utils/bigNumber';
import SemiCircleProgress from 'components/SemiCircleProgress';
import Card from 'components/layout/Card';
import { usePresaleMigratePublicData, useTotalCakeSold } from '../hooks/usePresaleMigratePublicData';

interface TotalCollectedCardProps {
    option: PresaleOption
}

const PresaleProgressContainer = styled(Card)`
    width: 100%;
    max-width: 100%;
    border-radius: 8px;
    padding: 24px;
    background: #ffffff;
`

const ProgressBanner = styled(Flex)`
    flex-direction: column;
    justify-content: space-between;
`

const StyledProgress = styled(Flex)` 
    justify-content: center;
    align-items: center;
    flex-direction: column;

    ${({ theme }) => theme.mediaQueries.md} {
        flex-direction: column;
    }
`

const HeadingText = styled(Heading)`
    text-align: center;
    padding: 10px;
    text-transform: uppercase;
    color: #FFAD003bbf02
`

const InfoText = styled(Text)`
    text-align: center;
    padding: 5px;
    text-transform: uppercase;
    color: #003bbf
`

const ProgressContainer = styled.div`
    width: 150px;
    padding: 16px 0;

    ${({ theme }) => theme.mediaQueries.md} {
        width: 200px;
        padding: 32px 0;
    }
`

const TotalCollectedCard : React.FC<TotalCollectedCardProps> = ({
    option
}) => {
    const optionData = usePresaleMigratePublicData(option)    
    
    const totalCakeSold = optionData.totalCakeSold ? 
        getBalanceAmount(new BigNumber(optionData.totalCakeSold), 18).toNumber() : 0

    const totalCollected = useMemo(() => {
        const totalColelected = optionData.totalCakeSold ? 
            getBalanceAmount(new BigNumber(optionData.totalCakeSold), 18).times(optionData.usdcPerCake) : BIG_ZERO;
        return totalColelected.toNumber()
    }, [optionData])

    const totalHardcap = useMemo(() => {
        const hardcapOption =  optionData.totalOnSale * optionData.usdcPerCake;
        return hardcapOption
    }, [optionData.totalOnSale, optionData.usdcPerCake])

    const reachPercent = useMemo(() => {
        return totalCollected/totalHardcap*100;
    }, [totalCollected, totalHardcap]);
    
    return (
        <PresaleProgressContainer>  
            <HeadingText>
                Total collected
            </HeadingText>
            <HeadingText>
                <CardValue color= "primaryDark" value={totalCakeSold} postfix=" CGS" decimals={0}/>
            </HeadingText>
            <InfoText>
                CGS collected since the start of the presale.
            </InfoText>
            <InfoText>
                Hardcap of ${totalHardcap.toFixed(0)}
            </InfoText>

            <ProgressBanner>                      
                <StyledProgress>                                           
                    <ProgressContainer>
                        <SemiCircleProgress percent={reachPercent} text="reached"/>
                    </ProgressContainer>                    
                </StyledProgress>
            </ProgressBanner>       
        </PresaleProgressContainer>
    )
}

export default TotalCollectedCard;