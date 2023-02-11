// @ts-nocheck
import React from 'react'
import styled from 'styled-components'
import { Button, Text, Heading } from '@pancakeswap-libs/uikit'
import Card from 'components/layout/Card'
import useI18n from 'hooks/useI18n'
import Page from 'components/layout/Page'
import UnlockButton from 'components/UnlockButton'
import { useWeb3React } from '@web3-react/core'
import ReferralLink from './ReferralLink'
import ReferralCount from './ReferralCount'

const ReferralInfo = styled(Card)`
    border-radius: 32px;    
    text-align: center;
    overflow: hidden;
    position: relative;
    opacity: 0.85;
`

const ReferralHeader  = styled.div`
background: linear-gradient(90deg, #6e57cd 0%, #01213e 100%, #01213e 100%);
box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
opacity: 0.85;
    padding: 24px;
`

const ReferralContent  = styled.div`
    padding: 24px;
`

const Referrals = () => {
    const TranslateString = useI18n()
    const { account } = useWeb3React()    

    return (
        <Page>
            <Heading as="h1" size="lg" color="#22398c" mb="20px" style={{ textAlign: 'center', fontSize: '40px' }}>
                {TranslateString(800, 'Cougar Referral Program')}
            </Heading>
            <ReferralInfo>
                <ReferralHeader>
                    <Heading as="h2" size="lg" color="#ffffff">
                        {TranslateString(801, 'Share the referral link below to invite your friends and earn 2% of your friends earnings FOREVER!')}
                    </Heading>
                </ReferralHeader>
                <ReferralContent>
                    {!account && 
                    (
                        <>
                            <UnlockButton fullWidth />
                            <Text mt="16px">
                                {TranslateString(802, 'Unlock wallet to get your unique referral link')}
                            </Text>  
                        </>
                    )}
                    { account && 
                    (
                        <>
                            <ReferralLink address={account} />                            
                            <ReferralCount address={account} />
                        </>                        
                    ) }                                      
                </ReferralContent>
            </ReferralInfo>
        </Page>
    )
}


export default Referrals