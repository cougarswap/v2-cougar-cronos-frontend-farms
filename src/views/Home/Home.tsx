import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Heading, Text, BaseLayout, Flex } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import useQueryParam from 'hooks/useQueryParam'
import Cookies from 'universal-cookie';
import Page from 'components/layout/Page'
import ConvertCgsAnnouncement from 'views/Farms/components/ConvertCgsAnnouncement'
import FarmStakingCard from './components/FarmStakingCard'
import CakeStats from './components/CakeStats'
import TotalValueLockedCard from './components/TotalValueLockedCard'
import TwitterCard from './components/TwitterCard'
import FarmingCard from './components/FarmingCard'
import CbankCard from './components/CbankCountdown'
import PresaleCard from './components/PresaleCard'
import BannerTop from './components/BannerTop'
import FarmingAndMigrationCard from './components/FarmingAndMigrationCard'

const Hero = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: auto;  
  height: 150px;
  text-align: center;  
  background-color: #0c15307a;

  ${({ theme }) => theme.mediaQueries.lg} {        
    position: relative;
    height: 300px;

    &::after {
      content: "";
        background: url('/images/egg/home_banner.png');
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        border-radius: 25px;
        height: 300px;
        padding-top: 0;
        opacity: 0.8;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        position: absolute;
        z-index: -1;   
    }
  }


`

const PageContainer = styled(Page)`
  width: 100%;
  max-width: 100%;
  margin-left: 0;
  margin-right: 0;
  padding-top: 20px;
`

const TextHeading = styled(Text)`
  font-size: 2.5em;
  font-weight: 700;  
  font-size: 72px;
  background: -webkit-linear-gradient(#cb51ff, #8fbcff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
  ${({ theme }) => theme.mediaQueries.nav} {      
    line-height: 1.5;
    font-size: 3.5em;
}
`

const TextSubHeading = styled(Text)`
  font-weight: 700;  
  color: ${({ theme }) => theme.colors.primaryBright};
`

const PageBodyContainer = styled.div`
  max-width: 1200px;
  margin: 30px auto;
`

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 48px;

  & > div {
    grid-column: span 6;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 8;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`


interface RouteParams {params: any}


const Home: React.FC = () => {
  const TranslateString = useI18n()  
  const ref = useQueryParam("ref", "")  

  useEffect(() => {
    if (ref){
      const cookies = new Cookies(); 
      cookies.set('ref', ref);
    }    
  },[ref]);

  return (
    <PageContainer>
      <Hero>
        <TextHeading>
          {TranslateString(733, 'POLY COUGAR')}
        </TextHeading>
        <TextSubHeading>{TranslateString(578, 'A part of the Cougar ecosystem')}</TextSubHeading>                        
      </Hero>            
      {/* <PresaleCard /> */}
      {/* <FarmingCard /> */}
      <FarmingAndMigrationCard/>
      <BannerTop />
      {/* <CbankCard />   */}
      <Flex marginTop="20px">
        {/* <ConvertCgsAnnouncement /> */}
      </Flex>
      <PageBodyContainer>
        <Cards>
          <FarmStakingCard />
          {/* <LotteryCard /> */}
          <TwitterCard/>
          <TotalValueLockedCard />
          <CakeStats />
        </Cards>
      </PageBodyContainer>
    </PageContainer>
  )
}

export default Home
