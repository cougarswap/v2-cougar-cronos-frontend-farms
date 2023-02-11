import { Flex } from "@pancakeswap-libs/uikit"
import React from "react"
import styled from "styled-components"
import PresaleCountdown from "views/Presale/components/PresaleCountdown"
import GoToPresaleNavigation from "./GoToPresaleNavigation"

const Container = styled.div`
    width: 100%;
    max-width: 1200px;
    margin: 32px auto;
`


const PresaleCard = () => {
    return (
        <Container>
            {/* <GoToPresaleNavigation /> */}
            <PresaleCountdown />
        </Container>
    )
}

export default PresaleCard