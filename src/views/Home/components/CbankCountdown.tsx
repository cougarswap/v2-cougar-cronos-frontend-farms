import React from "react"
import { Button, Flex } from "@pancakeswap-libs/uikit"
import { useBlock } from 'state/block/hooks'
import { Link } from 'react-router-dom'
import styled from "styled-components"
import CbankHeaderCountDown from "views/Pools/components/CbankHeaderCountDown"
import { useRemainingBlockToCbankPoolFarming, useRemainingBlockToFarming } from "state/hooks"


const Container = styled.div`
    width: 100%;
    max-width: 1200px;
    margin: 42px auto 10px;
    padding-top: 8px;
    padding-bottom: 8px;
    border-radius: 32px;
    background: linear-gradient(166deg,#6e4d05 20%,#6e4527 80%);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    opacity: 0.85;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    ${({ theme }) => theme.mediaQueries.nav} {
        margin: 32px auto;
    }
`

const LinkNavigation = styled.div`
    margin-bottom: 12px;
`


const CbankCard = () => {
    const remainingBlockToCbankFarming = useRemainingBlockToCbankPoolFarming(1)
    const remainingBlockToFarmingStart = useRemainingBlockToFarming()
    
    return (
        <>
            {remainingBlockToFarmingStart <= 0 && remainingBlockToCbankFarming && remainingBlockToCbankFarming > 0 ? <Container>    
                <CbankHeaderCountDown />
                <LinkNavigation>
                    <Link to="/cbank">
                        <Button variant="primary">GO TO CBANK</Button>
                    </Link>
                </LinkNavigation>               
            </Container> : null }
        </>        
    )
}

export default CbankCard