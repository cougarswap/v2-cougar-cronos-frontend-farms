import React, { useMemo } from 'react'
import PresaleStyledCard from 'components/layout/PresaleCard';
import { BIG_ZERO } from 'utils/bigNumber';
import { Flex, Heading, Progress } from '@pancakeswap-libs/uikit';
import styled, { keyframes } from 'styled-components';
import { getBalanceAmount, getBalanceNumber } from 'utils/formatBalance';
import { useWeb3React } from '@web3-react/core';
import UnlockButton from 'components/UnlockButton';
import BigNumber from 'bignumber.js';
import { PresaleOption } from 'state/types';
import Card from 'components/layout/Card';
import { usePresaleUserData, usePresaleUserTokenData } from '../hooks/usePresaleUserData';

interface UserPresaleStatsProps {
    option: PresaleOption
}

const UserStatsContainer = styled(Card)`
    width: 100%;
    max-width: 100%;
    border-radius: 8px;
    padding: 24px;
    background: #ffffff
`

const HeadingText = styled(Heading)`
    text-align: center;
    padding: 20px;
`

const PresaleAction = styled(Flex)`
    margin-top: 20px;
    justify-content: center;
    flex-direction: column;

    ${({ theme }) => theme.mediaQueries.md} {
        flex-direction: column;
    }
`

const BuyPresaleTable = styled.table`
  &>tbody>tr>td {
    font-size: 14px;
    padding-bottom: 12px;
    color: ${({theme}) => theme.colors.ultraText};
  }

  ${({ theme }) => theme.mediaQueries.nav} {
    &>tbody>tr>td {
        font-size: 16px;       
    }  
  }

  &>tbody>tr>.colored {
    color: ${({theme}) => theme.colors.primaryDark};
    text-align: right;
  }
`

const UserPresaleStats : React.FC<UserPresaleStatsProps> = ({option}) => {
    const { account } = useWeb3React()
    const {
        usdcBalance: usdcBalanceAsString,
        cakeBalance: tokenBalanceAsString,
    } = usePresaleUserTokenData()
    
    const tokenBalance = new BigNumber(tokenBalanceAsString)   
    const usdcBalance = new BigNumber(usdcBalanceAsString)  
    
    const optionData = usePresaleUserData(PresaleOption.OPTION_1)    

    const totalCakeUnclaimed = useMemo(() => {
        const totalUnclaimed = optionData.cakeUnclaimed ? 
            getBalanceAmount(new BigNumber(optionData.cakeUnclaimed), 6) : BIG_ZERO      
        return totalUnclaimed.toNumber()

    }, [optionData])

    return (
        <UserStatsContainer>
            <HeadingText size="lg" color="bgLevel1">
                USER STATS
            </HeadingText>
            <PresaleAction padding={['0px', '0px', '12px', null, '24px']}>
                <BuyPresaleTable> 
                    <tbody>   
                        <tr>
                            <td>Your USDC Balance:</td>
                            <td className='colored'>{account ? `${getBalanceNumber(usdcBalance, 6)} USDC` : '-'}</td>
                        </tr>                        
                        <tr>
                            <td>Your CGS Balance:</td>
                            <td className='colored'>{account ? `${getBalanceNumber(tokenBalance)} CGS` : '-'}</td>
                        </tr>    
                        <tr>
                            <td>Your CGS Unclaimed:</td>
                            <td className='colored'>{account ? `${totalCakeUnclaimed} CGS` : '-'}</td>
                        </tr>  
                    </tbody>                    
                </BuyPresaleTable>
                {!account ? <UnlockButton mt="8px" fullWidth /> : null}
            </PresaleAction>
        </UserStatsContainer>      
    )
}

export default UserPresaleStats