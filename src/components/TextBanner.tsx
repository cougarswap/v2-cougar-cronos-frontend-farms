import React from 'react'
import {  Text } from '@pancakeswap-libs/uikit'
import styled from "styled-components"


const Hero = styled.div`
    align-items: center;
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
    margin: auto;      
    text-align: center;  
    padding: 20px;
`

const TextHeading = styled(Text)`
  color: ${({theme}) => theme.colors.binance};
  font-size: 3.5em;
  font-weight: 700;  
  line-height: 1;
  text-shadow: 0px 4px 4px rgb(118 81 81);

  margin-top: 20px;

  ${({ theme }) => theme.mediaQueries.nav} {
    margin-top: 0;
  }
`

const TextSubHeading = styled(Text)`
    color: #fff;
  font-weight: 700;  
  font-size: 2.5em;
  text-transform: uppercase;
  line-height: 1;
`

export interface HeroBannerProps {
    title?: string
    text?: string
}

const TextBanner : React.FC<HeroBannerProps> = ({title, text}) => {
    return (
        <Hero>
            {title &&
                <TextHeading>
                    {title}
                </TextHeading>
            }
            {text &&
                <TextSubHeading>{text}</TextSubHeading>                        
            }
        </Hero>       
    )
}

export default TextBanner