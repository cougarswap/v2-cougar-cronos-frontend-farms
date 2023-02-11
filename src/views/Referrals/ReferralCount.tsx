import React, { useState } from 'react'
import styled from 'styled-components'
import {alertVariants, Button, Heading, Text, ToastContainer} from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { useReferrals } from 'state/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'


export interface ReferralCountProps {
    address: string
}

const ReferralCountWrapper = styled.div`
    padding: 10px;
`

const ReferralCount: React.FC<ReferralCountProps> = ({address}) => {
    const {referralsCount, referralCommission} = useReferrals(address);

    const commission = getBalanceNumber(new BigNumber(referralCommission), 18).toFixed(8);

    const TranslateString = useI18n();

    return (
        <ReferralCountWrapper>
            <Heading as="h5" size="lg" mb="5px"  color="#ffffff">
                {TranslateString(806, 'Total Referrals')}
            </Heading>
            <Text color = "primaryLight" bold>
                {referralsCount}
            </Text>
            <Heading as="h5" size="lg" mb="5px"  color="#ffffff">
                {TranslateString(806, 'Total Commission (CGS)')}
            </Heading>
            <Text color = "primaryLight" bold>
                {commission} CGS
            </Text>

        </ReferralCountWrapper>
    )
}

export default ReferralCount