import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import useRefresh from 'hooks/useRefresh'
import { Flex, Heading } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { PresaleOption } from 'state/types'
import { usePresaleUserBalance } from 'views/Presale/hooks/usePresaleDataOption'
import PresaleCountdown from 'views/Presale/components/PresaleCountdown'
import PresaleCard from 'views/Home/components/PresaleCard'
import SwapForMigration from './SwapForMigration'

const PresaleHeading = styled(Heading)`
    font-size: 2.5em;
    font-weight: 700;  
    font-size: 72px;
    background: -webkit-linear-gradient(#FFAD02,#FF6C02);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1;
    ${({ theme }) => theme.mediaQueries.nav} {      
    line-height: 1.5;
    font-size: 3.5em;
    }
    text-transform: uppercase;
`

const DecorationHeading = styled.span`
    color: ${({theme}) => theme.colors.primaryDark};
    font-size: 1.5em;
    text-transform: uppercase;
    margin-top: 15px;    
    text-align: center;
`

const HeaderCoundown = styled(Flex)`  
    width: 100%;
    max-width: 1200px;
    margin: 32px auto;

    ${({ theme }) => theme.mediaQueries.md} {
        padding-top: 0;
    }

    ${({ theme }) => theme.mediaQueries.lg} {
        padding-top: 0;
    }
    `

const TextHeader = styled(Flex)`    
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 20px;

    ${({ theme }) => theme.mediaQueries.md} {
        padding-top: 0;
    }

    ${({ theme }) => theme.mediaQueries.lg} {
        padding-top: 0;
    }
`

const PresalePageHeader = styled(Flex)`
    padding: 0 30px;
    justify-content: space-around;
    flex-direction: column-reverse;

    ${({ theme }) => theme.mediaQueries.md} {
        flex-direction: row;
    }
`

const Container = styled.div`
    padding: 20px;
    margin-top: 20px;
`

export default function Migration() {    
    const { t } = useTranslation()
    const { account } = useWeb3React() 
    const dispatch = useDispatch()
    const { slowRefresh } = useRefresh()
    
    
    // usePresaleMigrateDataOption(PresaleOption.OPTION_1, account)
    usePresaleUserBalance(account, dispatch, slowRefresh);
  return (
    <Container>
        <PresalePageHeader>
            <TextHeader>
                <PresaleHeading>
                {t('Migration')}
                </PresaleHeading>                   
                <DecorationHeading>{t('Convert CGS to wCGS')}</DecorationHeading>                 
            </TextHeader>                                                 
        </PresalePageHeader>
        {/* <HeaderCoundown>
        <PresaleCountdown />
        </HeaderCoundown> */}
        {/* <PresaleCard/> */}
        <SwapForMigration />
    </Container>
  )
}
