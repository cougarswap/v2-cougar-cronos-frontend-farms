import { Flex } from '@pancakeswap-libs/uikit'
import BigNumber from 'bignumber.js'
import React from 'react'
import styled from 'styled-components'
import StatCardContent from './StatCardContent'

export interface BuyOptionStatsProp {
    maxTokenCanBuy: number
    tokensUnclaimed: number
    percentToClaim: number
}

const BuyOptionStatsCard = styled.div`
    display: grid;
    grid-template-columns: repeat(1fr);
    grid-column-gap: 10px;
    margin-bottom: 20px; 

    &>div+div {
        margin-top: 10px;
    }

    ${({ theme }) => theme.mediaQueries.sm} {
        grid-template-columns: repeat(3, 1fr);
        &>div+div {
            margin-top: 0;
        }
    }

    ${({ theme }) => theme.mediaQueries.nav} {
        grid-column-gap: 30px;
    }
`

const BuyOptionStats: React.FC<BuyOptionStatsProp> = ({
    maxTokenCanBuy,
    tokensUnclaimed, 
    percentToClaim
}) => {
    return (
        <BuyOptionStatsCard>
            <StatCardContent
                statType="max tokens can buy"
                value={maxTokenCanBuy}
                unit="CGS"
                highlightColor="ultraFocus"
                />
            <StatCardContent 
                statType="unclaimed tokens"
                value={tokensUnclaimed}
                unit="CGS"
                highlightColor="primaryBright"
                />
            <StatCardContent
                statType="can be claimed"
                value={percentToClaim}
                unit="%"
                highlightColor="secondary"
                />
        </BuyOptionStatsCard>
    )
}

export default BuyOptionStats