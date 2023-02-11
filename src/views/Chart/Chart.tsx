import React from 'react'
import styled from 'styled-components'
import { getTokenAddress } from 'utils/addressHelpers'

const ChartContainer = styled.div`
    display: inline-block;
    flex-direction: column;
    -webkit-box-align: stretch;
    align-items: stretch;
    height: 900px;
    width: 100%;
    flex: 1 1 0%;
`

const Chart = () =>  {
    const tokenAddress = getTokenAddress()
    
    return (
        <ChartContainer>
            <iframe title="graph" src={`https://dex.guru/token/${tokenAddress}-avalanche`}
                scrolling="no" 
                style={{width: "1px", minWidth: "100%", height: "100vh", minHeight:"100%", overflow: "hidden"}}
            />
        </ChartContainer>
    )
}

export default Chart