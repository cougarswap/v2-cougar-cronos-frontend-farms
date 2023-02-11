import React, { useState } from 'react'
import styled from 'styled-components'
import {alertVariants, Button, Heading, Text, ToastContainer} from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

export interface ReferralLinkProps {
    address: string
}

const ReferralLinkWrapper = styled.div`
    padding: 10px;
`

const ReferralLinkContent = styled.input.attrs({readonly: true})`
    background-color: #6c5358;
    border: 0px;
    border-radius: 16px;
    box-shadow: rgb(74 74 104 / 10%) 0px 2px 2px -1px inset;
    color: #ffffff;
    display: block;
    font-size: 16px;
    height: 40px;
    outline: 0px;
    padding: 0px 16px;
    width: 100%;
`

const ReferralLink: React.FC<ReferralLinkProps> = ({address}) => {    
    const [toasts, setToasts] = useState([]);
    const TranslateString = useI18n();

    const fullHostName = `${window.location.protocol}//${window.location.hostname}${(window.location.port ? `:${window.location.port}` : '')}`;
    const refLink = `${fullHostName}/?ref=${address}`;

    const copyReferralLink = () => {
        navigator.clipboard.writeText(refLink);
    }

    const handleClick = () => {
        copyReferralLink();

        const now = Date.now();
        const randomToast = {
            id: `id-${now}`,
            title: TranslateString(804, 'Copied'),        
            type: alertVariants.SUCCESS,
        };

        setToasts((prevToasts) => [randomToast, ...prevToasts]);
    };

    const handleRemove = (id: string) => {
        setToasts((prevToasts) => prevToasts.filter((prevToast) => prevToast.id !== id));
    };
    
    return (
        <ReferralLinkWrapper>
            <Heading as="h5" size="lg" mb="5px"  color="#ffffff">
                {TranslateString(804, 'Your Referral Link')}
            </Heading>
            <ReferralLinkContent value={refLink} readOnly/>                
            <Button onClick={handleClick} mt="10px">
                {TranslateString(803, 'Copy')}
            </Button>                       
            <ToastContainer toasts={toasts} onRemove={handleRemove} />      
        </ReferralLinkWrapper>
    )
}

export default ReferralLink;