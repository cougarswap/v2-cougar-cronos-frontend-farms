import React from "react"
import { Link } from 'react-router-dom'
import { Button, Flex } from "@pancakeswap-libs/uikit"
import styled from "styled-components"
import { useRemainingBlockToCbankPoolFarming, useRemainingBlockToFarming } from "state/hooks"
import HeaderCountDown from '../../Farms/components/HeaderCountdown'


const Container = styled.div`
    width: 100%;
    max-width: 531px;
    margin: 42px auto 10px;
    padding-top: 8px;
    padding-bottom: 8px;
    border-radius: 32px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    opacity: 0.85;
    border-radius: 33px;

    ${({ theme }) => theme.mediaQueries.nav} {
        margin: 32px auto;
    }
`

const LinkNavigation = styled.div`
    margin-bottom: 12px;
`


const FarmingCard = () => {
    const remainingBlockToFarming = useRemainingBlockToFarming()

    return (
        <>
            {remainingBlockToFarming && remainingBlockToFarming > 0 ? <Container>    
                <HeaderCountDown />
                <LinkNavigation>
                    <Link to="/farms">
                        <Button variant="primarycronos">GO TO FARMS</Button>
                    </Link>
                </LinkNavigation>   
            </Container> : null }
        </>        
    )
}

export default FarmingCard