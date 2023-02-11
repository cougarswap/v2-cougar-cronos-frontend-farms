import React from 'react'
import styled from 'styled-components'
import { Tag, Flex, Heading, Image } from '@pancakeswap-libs/uikit'
import { CommunityTag, CoreTag, RiskTag, NoFeeTag } from 'components/Tags'
import { DexSwapRouter } from 'config/constants/types'
import DexTag from './RowFarmCard/DexTag'
import PartnerTag from './RowFarmCard/PartnerTag'

export interface ExpandableSectionProps {
  lpLabel?: string
  multiplier?: string
  depositFee?: number,
  farmImage?: string,
  isTokenOnly?: boolean,  
  isPartner?: boolean,
  tokenSymbol?: string,
  quoteTokenSymbol?: string
  dex?: DexSwapRouter
}

const Wrapper = styled.div`
  svg {
    margin-right: 0.25rem;
  }
  margin-bottom: 25px;
  display: flex;
  justify-content: space-between;
`

const TokenLableFlex = styled(Flex)`
  flex-basic: 50%;
`

const MultiplierTag = styled(Tag)`
  margin-left: 4px;
`

const PoolImage = styled(Image)`
  position: relative;
  width: 100%;
`

const LpPairsToken = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  width: 96px;  
`
const LpTokenInfo = styled(Flex)`
  min-width: 96px;
`

const SingleTokenImage = styled.img`
  width: 60px;
  height: 60px;
`
const PairTokenImage = styled.div`
  width: 96px;
  height: 96px;
  background-image: url(/images/egg/farm_pair.png);
  background-position-y: -10px;
  background-size: cover;
  position: relative;
`
const TokenImage = styled.img`
  width: 60px;
  height: 60px;
  position: absolute;
  left: 0;
  top: 50px;
  z-index: -1;
`
const QuoteTokenImage = styled.img`
  width: 40px;
  height: 40px;
  position: absolute;
  right: 4px;
  top: 40px;
  z-index: -1;
`

const TagsWrapper = styled(Flex)`
  margin-top: 5px;
  justify-content: center;
  column-gap: 5px;
`

const earnToken = 'CGS'

const CardHeading: React.FC<ExpandableSectionProps> = ({
  lpLabel,
  multiplier,
  depositFee,
  farmImage,
  dex,
  isTokenOnly,
  isPartner,
  tokenSymbol,
  quoteTokenSymbol
}) => {
  return (
    <Wrapper>
      <TokenLableFlex flexDirection="column" alignItems="center">        
        <LpPairsToken>          
          {isTokenOnly ? (<SingleTokenImage src={`/images/single-token/${tokenSymbol}.png`} alt={tokenSymbol} />) : 
            (<PairTokenImage>
                <TokenImage src={`/images/single-token/${tokenSymbol}.png`} alt={tokenSymbol}/>
                <QuoteTokenImage src={`/images/single-token/${quoteTokenSymbol}.png`} alt={quoteTokenSymbol}/>
            </PairTokenImage>)
          }
        </LpPairsToken>        
      </TokenLableFlex>
      <LpTokenInfo flexDirection="column" alignItems="center">
        <Heading color="contrast" mb="4px">{lpLabel}</Heading>
        <Flex justifyContent="center">
          {depositFee === 0 ? <NoFeeTag /> : null}
          {/* {isCommunityFarm ? <CommunityTag /> : <CoreTag />} */}
          {/* <RiskTag risk={risk} /> */}
          <MultiplierTag variant="secondary">{multiplier}</MultiplierTag>          
        </Flex>
        <TagsWrapper>
          {!isTokenOnly ? <DexTag dex={dex} borderRadius="8px"/> : null }
          {isPartner ? <PartnerTag borderRadius="8px" /> : null }
        </TagsWrapper>
      </LpTokenInfo>
    </Wrapper>
  )
}

export default CardHeading
