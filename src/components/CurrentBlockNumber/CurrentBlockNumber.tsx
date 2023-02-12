import React from "react"
import { useBlock } from "state/block/hooks"
import styled, { css, keyframes } from 'styled-components'

const LinkWrapper = styled.a`
    text-decoration: none;
    cursor: pointer;
    color: rgb(40, 145, 249);
    font-weight: 500;
`

const Container = styled.div`
    position: fixed;
    display: flex;
    right: 0px;
    bottom: 0px;
    padding: 1rem;
    transition: opacity 0.25s ease 0s;
    color: rgb(113 191 226);
`

const Block = styled.div`
    box-sizing: border-box;
    margin: 0px;
    min-width: 0px;
    font-weight: 500;
    font-size: 11px;
    opacity: 0.7;
`

const pureMaterialProgressCircular = keyframes `
    0% {
        transform: rotate(0deg);
    }
    12.5% {
        transform: rotate(180deg);
        animation-timing-function: linear;
    }
    25% {
        transform: rotate(630deg);
    }
    37.5% {
        transform: rotate(810deg);
        animation-timing-function: linear;
    }
    50% {
        transform: rotate(1260deg);
    }
    62.5% {
        transform: rotate(1440deg);
        animation-timing-function: linear;
    }
    75% {
        transform: rotate(1890deg);
    }
    87.5% {
        transform: rotate(2070deg);
        animation-timing-function: linear;
    }
    100% {
        transform: rotate(2520deg);
    }
}`

const Signal = styled.div<{goodSignal: boolean}>`
    width: 8px;
    height: 8px;
    min-height: 8px;
    min-width: 8px;
    margin-left: 0.5rem;
    margin-top: 3px;
    border-radius: 50%;
    position: relative;
    background-color: ${({goodSignal}) => goodSignal ? 'rgb(39, 174, 140)' : 'transparent'} ;

    ${({ goodSignal }) => !goodSignal && css`
        &::before {
            content: "";
            display: block;
            box-sizing: border-box;
            margin-bottom: 0.15em;
            border: solid 0.15em transparent;
            border-top-color: rgb(174, 88, 39);
            border-right-color: rgb(174, 88, 39);
            border-radius: 50%;
            width: 100% !important;
            height: 100%;
            background-color: transparent;
            animation: ${pureMaterialProgressCircular} 2s infinite linear alternate;
        }
    `}    
`

const CurrentBlockNumber = () => {
    const { currentBlock } = useBlock(); 

    const ftmScanUrl = `https://cronoscan.com/block/countdown/${currentBlock}`
    return (
        <LinkWrapper target="_blank" rel="noopener noreferrer" href={ftmScanUrl}>
            <Container>
                {currentBlock ? <Block>{currentBlock}</Block> : null }
                <Signal goodSignal={currentBlock > 0}/>
            </Container>
        </LinkWrapper>
    )
}

export default CurrentBlockNumber