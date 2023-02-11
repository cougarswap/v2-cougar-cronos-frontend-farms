import React from 'react'
import { Text } from '@pancakeswap-libs/uikit'
import { VaultInterest } from 'state/types'
import { getInterestDisplayValue } from 'utils/formatBalance'

export interface VaultAprContentProps {
    isAutoCgs?: boolean
    interest?: VaultInterest
}

const VaultAprContent : React.FC<VaultAprContentProps> = ({
    isAutoCgs,
    interest
}) => {
    return (
        <>
            {interest.vaultApr && interest.vaultApr > 0 ? 
                <Text>CGS Rewards APR: {interest.vaultApr.toLocaleString('en-US', { maximumFractionDigits: 2 })}%</Text> : null
            }
            {isAutoCgs && interest.vaultDailyApy && interest.vaultDailyApy > 0 ? 
                <Text ml={0}>CGS Rewards APY (Daily compound): {getInterestDisplayValue(interest.vaultDailyApy)}</Text> : null
            }           
            {!isAutoCgs && interest.farmApr && interest.farmApr > 0 ? 
                <Text>Farm APR: {interest.farmApr.toLocaleString('en-US', { maximumFractionDigits: 2 })}%</Text> : null
            }
            {!isAutoCgs && interest.farmDailyApy && interest.farmDailyApy > 0 ? 
                <Text>Farm APY (Daily compound): {interest.farmDailyApy.toLocaleString('en-US', { maximumFractionDigits: 2 })}%</Text> : null
            }
            {interest.tradingApr && interest.tradingApr > 0 ? 
                <Text>Trading APR: {interest.tradingApr.toLocaleString('en-US', { maximumFractionDigits: 2 })}%</Text> : null
            }
        </>
    )
}

export default VaultAprContent