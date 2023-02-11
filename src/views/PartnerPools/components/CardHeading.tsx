import React from 'react'
import styled from 'styled-components'
import { Tag, Flex, Image } from '@pancakeswap-libs/uikit'
import { NoFeeTag } from 'components/Tags'
import { DexSwapRouter, StakingToken, Token } from 'config/constants/types'
import DexTag from 'views/Farms/components/FarmCard/RowFarmCard/DexTag'
import PartnerTag from 'views/Farms/components/FarmCard/RowFarmCard/PartnerTag'
import WaitingTag from 'views/Farms/components/FarmCard/RowFarmCard/WaitingTag'

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
  stakingToken?: StakingToken,
  earningToken?: Token,
  blocksUntilStart?: number
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

const ImageWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  min-width: 96px;
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
  position: absolute;
  left: 21%;
  top: 39px;
  z-index: -1; 
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

const EarningToken = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  bottom: 0;
  left: 60%;
`

const EarningTokenImage = styled.img`
  width: 24px;
  height: 24px;
  background-color: #ffbc77;
  border: 3px solid #ae5827;
  box-shadow: 0px 0px 5px 1px #65c199;
  border-radius: 50%;
`

const StakeEarnLabelWrapper = styled.div`
  padding: 3px;
`

const EarnLabel = styled.div`
  color: ${({theme}) => theme.colors.secondary};
  font-size: 1.4em;
  font-weight: 600;
  margin-bottom: 3px;
`

const StakeLabel = styled.div`
  color: ${({theme}) => theme.colors.primaryBright};
  font-size: 1em;
  font-weight: 400;
`

const TagsWrapper = styled(Flex)`
  margin-top: 5px;
  justify-content: center;
  column-gap: 5px;
`

const CardHeading: React.FC<ExpandableSectionProps> = ({
  depositFee,
  dex,
  isTokenOnly,
  isPartner,
  tokenSymbol,
  stakingToken,
  earningToken,
  blocksUntilStart
}) => {
  return (
    <Wrapper>
      <TokenLableFlex flexDirection="column" alignItems="center">    
        <ImageWrapper>
          <LpPairsToken>                      
              (<PairTokenImage>
                  {isTokenOnly ? (<SingleTokenImage src={`/images/single-token/${tokenSymbol}.png`} alt={tokenSymbol} />) : 
                  <>
                    <TokenImage src={`/images/single-token/${stakingToken.token0.symbol}.png`} alt={stakingToken.token0.symbol}/>
                    <QuoteTokenImage src={`/images/single-token/${stakingToken.token1.symbol}.png`} alt={stakingToken.token1.symbol}/>
                  </>
                  }
              </PairTokenImage>)
          </LpPairsToken>    
          <EarningToken>
            <EarningTokenImage src={`/images/single-token/${earningToken.symbol}.png`} alt={earningToken.symbol} />
          </EarningToken>  
        </ImageWrapper>              
      </TokenLableFlex>
      <LpTokenInfo flexDirection="column" alignItems="center">
        <StakeEarnLabelWrapper>
          <EarnLabel>Earn&nbsp;{earningToken.symbol}</EarnLabel>
          <StakeLabel>Stake&nbsp;{stakingToken.token.symbol}</StakeLabel>
        </StakeEarnLabelWrapper>       
        <Flex justifyContent="center" marginTop="5px">
          {depositFee === 0 ? <NoFeeTag /> : null}
        </Flex>
        <TagsWrapper>
          {!isTokenOnly ? <DexTag dex={dex} borderRadius="8px"/> : null }
          {isPartner ? <PartnerTag borderRadius="8px" /> : null }
          {blocksUntilStart && blocksUntilStart > 0 ? <WaitingTag borderRadius="8px" /> : null}
        </TagsWrapper>
      </LpTokenInfo>
    </Wrapper>
  )
}

export default CardHeading
