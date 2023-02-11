import { useWeb3React } from '@web3-react/core'
import React from 'react'
import { PresaleOption } from 'state/types'
import styled from 'styled-components'
import { usePresalePublicData, usePresaleUserData } from '../hooks/usePresalePublicData'
import BuyCard from './BuyCard'
import PresaleOptionInfo from './PresaleOptionInfo'
import TotalCollectedCard from './TotalCollectedCard'
import UserPresaleStats from './UserStats'

interface PresaleOptionProps {
    option: PresaleOption
}

const BuyContainer = styled.div`
    ${({ theme }) => theme.mediaQueries.md} {
        grid-row-start: 1;
        grid-row-end: 3;
        grid-column-start: 2;
        grid-column-end: 3;
    }
`

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    grid-column-gap: 20px;
    grid-row-gap: 20px;

    ${({ theme }) => theme.mediaQueries.md} {
        grid-template-columns: 1fr 1fr;
    }
`

const PresaleOptionCard : React.FC<PresaleOptionProps> = ({option}) => {
    const { account } = useWeb3React() 
    const publicData = usePresalePublicData(option)
    const { eligibleToBuy } = usePresaleUserData(option)
    
    return (
        <GridContainer>
            <TotalCollectedCard option={option}/>                                                                                            
            <UserPresaleStats option={option}/>      
            <BuyContainer>
                <PresaleOptionInfo title={publicData.title}
                    condition={publicData.condition}
                    saleDateStart={publicData.startingTimeStamp}
                    saleDateEnd={publicData.closingTimeStamp}
                    releaseActive={publicData.claimTimeStamp}
                    releaseDuration={publicData.timePerPercent}
                    purchaseLimit={publicData.purchaseLimit}
                    totalTokensSale={publicData.totalOnSale}
                    pricePerToken={publicData.usdcPerCake}
                    option={option}
                />
                {!account || eligibleToBuy ? (
                    <BuyCard option={option} />
                ) : null }          
            </BuyContainer>                    
        </GridContainer>
    )
}

export default PresaleOptionCard