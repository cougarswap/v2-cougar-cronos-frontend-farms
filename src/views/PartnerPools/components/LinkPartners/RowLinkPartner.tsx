import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { Flex, LinkExternal, MetaMaskIcon, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { LinkPartnerPoolConfig } from 'config/constants/types'
import DexTag from 'views/Farms/components/FarmCard/RowFarmCard/DexTag'
import NewPoolTag from 'views/Farms/components/FarmCard/RowFarmCard/NewPoolTag'
import { getLiquidityUrlPathPartsPartnerPool } from 'utils/getLiquidityUrlPathParts'
import { getLiquidityUrl } from 'utils'
import { registerToken } from 'utils/wallet'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import ExpandableSectionButton from 'components/ExpandableSectionButton'

export interface RowLinkPartnerProps {
    linkPartnerPool: LinkPartnerPoolConfig
    account?: string
}

const RowLinkPartner : React.FC<RowLinkPartnerProps> = ({linkPartnerPool, account}) => {
    const {
        stakingToken : 
            { 
                isTokenOnly, 
                token,
                token0,
                token1
            },
        earningToken,
        projectLink,
        contractAddress,
        dex,
        isNewPool
    } = linkPartnerPool

    const tokenPath = useMemo(() => {
        if (isTokenOnly){
            return token.address
        }
    
        const quoteTokenAdress = token0.address
        const quoteTokenSymbol0 = token0.symbol
        const tokenAddress = token1.address
        return getLiquidityUrlPathPartsPartnerPool({ quoteTokenAdress, quoteTokenSymbol: quoteTokenSymbol0, tokenAddress, dex })
    }, [isTokenOnly, token.address, token0, token1, dex])
      
    const [showExpandableSection, setShowExpandableSection] = useState(false)
    const shouldRenderChild = useDelayedUnmount(showExpandableSection, 300)
    
    const liquidityUrl = getLiquidityUrl(dex, tokenPath, isTokenOnly)
    const masterChefBscScanAddress =`https://polygonscan.com/address/${linkPartnerPool.contractAddress}`  
    const lpLabel = token.symbol

    const TranslateString = useI18n()
    const isMetaMaskInScope = !!window.ethereum?.isMetaMask

    const renderPoolLabel = () => {
      return (
        <td>
            <TokenLableFlex alignItems="center">
              <ImageWrapper>
                  <LpPairsToken>          
                      {isTokenOnly ? (<SingleTokenImage src={`/images/single-token/${token.symbol}.png`} alt={token.symbol} />) : 
                          (<PairTokenImage>
                              <TokenSymbolImage src={`/images/single-token/${token0.symbol}.png`} alt={token0.symbol} />
                              <QuoteTokenSymbolImage src={`/images/single-token/${token1.symbol}.png`} alt={token1.symbol} />
                          </PairTokenImage>)
                      }
                  </LpPairsToken> 
                  <EarningToken>
                      <EarningTokenImage src={`/images/single-token/${earningToken.symbol}.png`} alt={earningToken.symbol} />
                  </EarningToken>
              </ImageWrapper>                         
              <LpTokenInfo flexDirection="column" alignItems="flex-start">
                  <StakeEarnLabelWrapper>
                      <EarnLabel>Earn&nbsp;{earningToken.symbol}</EarnLabel>
                      <StakeLabel>Stake&nbsp;{token.symbol}</StakeLabel>
                  </StakeEarnLabelWrapper>              
                  <LpFooterTags left={isTokenOnly ? 'auto' : '0'}>
                      {!isTokenOnly ? <DexTag dex={dex} /> : null }
                      {isNewPool ? <NewPoolTag /> : null }
                  </LpFooterTags>             
              </LpTokenInfo>
            </TokenLableFlex> 
        </td>
      )
    }

    const renderTokenSection = () => {
      return (
        <>
          <Flex justifyContent='space-between'>
            <Text color="text">{TranslateString(999, 'GET')}:&nbsp;</Text>
            <StyledLinkExternal href={liquidityUrl}>
              {lpLabel}
            </StyledLinkExternal>
          </Flex> 
          <Flex justifyContent="flex-start">
            <StyledLinkExternal color="text" external href={masterChefBscScanAddress} bold={false}>
            {TranslateString(999, 'View contract')}
            </StyledLinkExternal>
          </Flex>                                                                   
        </>    
      )
    }

   const renderProjectLinkSection = () => {
     return (
      <>  
        <Flex justifyContent="flex-start">
            <StyledLinkExternal color="text" external href={projectLink} bold={false}>
            {TranslateString(999, 'View project site')}
            </StyledLinkExternal>
        </Flex>    
        {account && isMetaMaskInScope && (
            <Flex justifyContent="flex-start">
              <AddToMetaMaskButton
                onClick={() => registerToken(earningToken.address, earningToken.symbol, earningToken.decimals)}
              >
                <Text color="primary">{TranslateString(999, 'Add to Metamask')}</Text>
                <MetaMaskIcon ml="4px" />
              </AddToMetaMaskButton>
          </Flex>)}       
      </>
     )    
  }  

   const renderButtonDetails = () => {
     return (
      <DetailsButtonWrapper>
          <ExpandableSectionButton onClick={() => setShowExpandableSection(!showExpandableSection)}
            expanded={showExpandableSection}
        />  
      </DetailsButtonWrapper>
     )
   }

    return (  
      <>
        <WrapperDesktop>
          {renderPoolLabel()}  
          <td><></></td>   
          <td colSpan={6}>
              <Flex flexDirection="row" justifyContent="space-between">
                {renderTokenSection()}
                {renderProjectLinkSection()}
              </Flex>
          </td>
        </WrapperDesktop>
        <WrapperMobile>
            {renderPoolLabel()}           
            <td><></></td>
            <MagicTd colSpan={5}><></></MagicTd>
            <td>                
              {renderButtonDetails()}
            </td>           
        </WrapperMobile> 
        {
          shouldRenderChild && (
            <ExpandedRow expanded={showExpandableSection}>
              <td colSpan={8}>
                <Flex flexDirection="column" alignItems="flex-end">
                  {renderTokenSection()}
                  {renderProjectLinkSection()}
                </Flex>                
              </td>
            </ExpandedRow>
          )
        }      
      </>
    )
}

const DetailsButtonWrapper = styled.div`

`

const WrapperDesktop = styled.tr`
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05);
  position: relative;
  font-size: 0.8em;  
  margin: 0;  
  border-bottom: 1px solid #473e6c;  
  &>td {
    padding: 20px 20px 20px 0;
  }
  svg {
    margin-right: 0.25rem;
  }   
  display: none;

  ${({ theme }) => theme.mediaQueries.nav} {
    display: table-row;
  }
`

const MagicTd = styled.td`
    display: none;

    ${({ theme }) => theme.mediaQueries.nav} {
      display: table-cell;
    }
`

const ExpandedRow = styled.tr<{ expanded: boolean }>`
  &>td {
    padding: 10px;
  }

  border-bottom: 1px solid #473e6c;  
  display: ${(props) => (props.expanded) ? 'table-row' : 'none'};
  ${({ theme }) => theme.mediaQueries.nav} {
      display: none;
  }
`

const WrapperMobile = styled.tr`
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05);
  position: relative;
  font-size: 0.8em;  
  margin: 0;  
  border-bottom: 1px solid #473e6c;  
  &>td {
    padding: 20px 20px 20px 0;
  }
  svg {
    margin-right: 0.25rem;
  }   

  display: table-row;

  ${({ theme }) => theme.mediaQueries.nav} {
    display: none;
  }
`

const TokenLableFlex = styled(Flex)`
  flex-basic: 50%;
`

const LpPairsToken = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  min-width: 96px;
`

const ImageWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  min-width: 96px;
`

const LpTokenInfo = styled(Flex)`
  min-width: 96px;
  margin-left: 10px;
  position: relative;
`

const SingleTokenImage = styled.img`
  width: 48px;
  height: 48px;
`
const PairTokenImage = styled.div`
  width: 50px;
  height: 50px;    
  position: relative;
`
const TokenSymbolImage = styled.img`
  width: 32px;
  height: 32px;
  position: absolute;
  left: 0;
  top: 0;
`
const QuoteTokenSymbolImage = styled.img`
  width: 36px;
  height: 36px;
  position: absolute;
  right: 0;
  top: 0;
`

const StakeEarnLabelWrapper = styled.div`
  padding: 3px;
`

const EarnLabel = styled.div`
  color: ${({theme}) => theme.colors.secondary};
  font-size: 1.1em;
  font-weight: 600;
`

const StakeLabel = styled.div`
  color: ${({theme}) => theme.colors.primaryDark};
  font-size: 0.8em;
  font-weight: 400;
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

const LpFooterTags = styled.div<{left?: string}>`
    padding: 3px;
    text-align: center;
    position: absolute;
    top: 100%;
    left: ${({left}) => left || '0'};
    display: flex;    
    & > *+* {
      margin-left: 10px;
    }
`

const StyledLinkExternal = styled(LinkExternal)`
  text-decoration: none;
  font-weight: normal;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;

  svg {
    padding-left: 4px;
    height: 18px;
    width: auto;
    fill: ${({ theme }) => theme.colors.text};
  }
`

const AddToMetaMaskButton = styled.button`
  background-color: transparent;
  border: none;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  padding-left: 0;
  color: ${({theme}) => theme.colors.text};
  & > * {
    color: ${({theme}) => theme.colors.text};
  }
`

export default RowLinkPartner