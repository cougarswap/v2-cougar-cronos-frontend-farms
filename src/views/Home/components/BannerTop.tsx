import { Button, Heading, LinkExternal, Text, Image, Flex } from '@pancakeswap-libs/uikit'
import PresaleStyledCard from 'components/layout/PresaleCard'
import useCurrentTime from 'hooks/useTimer'
import React, { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'

const rotate = keyframes`
    100% {
		transform: rotate(1turn);
	}
`

const BannerContainer = styled.div`
    width: 100%;
    margin: 20px auto;
    padding: 0;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: relative;
	z-index: 0;	
	overflow: hidden;	
`

const ImageBanner = styled.a`
    display: flex;
    justify-content: center;
    &>*+* {
        margin-left: 20px;
    }
`

const ImageSource = styled.img`
    border-radius: 5px;
`

const BannerTop = () => {
    const currentMillis = useCurrentTime()
    
    const [isShowBanner, setIsShowBanner] = useState(false)
    const expiredTimestamp = 1654182000

    useEffect(() => {
        if (expiredTimestamp > currentMillis / 1000) {
            setIsShowBanner(true)
        }
    }, [currentMillis, expiredTimestamp])
    return (
        <>
            {isShowBanner ? 
            <BannerContainer>
                <ImageBanner target="_blank" href="https://cronosapp.cougarswap.io/ifo">
                    <ImageSource loading='lazy' alt="Cougar Optimizer" src="https://cougarswap.io/images/promotion/cgx_banner_ifo.gif"/>
                </ImageBanner>        
            </BannerContainer> : null }        
        </>  
    )
}

export default BannerTop