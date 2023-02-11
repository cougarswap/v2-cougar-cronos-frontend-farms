import React from 'react'
import styled from "styled-components"
import PresaleCountdown from "./PresaleCountdown"

const Container = styled.div`    
    ${({ theme }) => theme.mediaQueries.md} {
        grid-row-start: 1;
        grid-row-end: 2;
        grid-column-start: 1;
        grid-column-end: 3;
    }   
    width: 100%;
`

const PresaleCountdownCard = () => {
    return (
        <Container>
            <PresaleCountdown />
        </Container>
    )
}

export default PresaleCountdownCard