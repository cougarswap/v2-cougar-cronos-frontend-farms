import React, { useMemo } from 'react'
import useI18n from 'hooks/useI18n'
import styled from 'styled-components'
import { Text, Flex, Link, LinkExternal, MetaMaskIcon } from '@pancakeswap-libs/uikit'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { Address, DexSwapRouter, Token } from 'config/constants/types'
import { getBscScanLink, getLiquidityUrl } from 'utils'
import { registerToken } from 'utils/wallet'
import Balance from 'components/Balance'

export interface SyrupBlock {
  endBlock?: number
  blocksRemaining?: number
  startBlock?: number
  blocksUntilStart?: number
}

export interface ExpandableSectionProps extends SyrupBlock {
  isTokenOnly?: boolean
  bscScanAddress?: string
  masterChefBscScanAddress?: string
  projectLink?: string
  earningToken?: Token
  removed?: boolean
  totalValueFormated?: string
  lpLabel?: string
  quoteTokenAdresses?: Address
  quoteTokenSymbol?: string
  tokenAddresses: Address
  dex?: DexSwapRouter
  account: string,
  lpTokenDecimals?: number
}

const Wrapper = styled.div`
  margin-top: 24px;
`

const StyledLinkExternal = styled(LinkExternal)`
  text-decoration: none;
  font-weight: normal;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;

  & > * > span {
    font-weight: normal;
  }

  svg {
    padding-left: 4px;
    height: 18px;
    width: auto;
    fill: ${({ theme }) => theme.colors.primary};
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

const DetailsSection: React.FC<ExpandableSectionProps> = ({
  isTokenOnly,
  masterChefBscScanAddress,
  projectLink,
  earningToken,
  lpLabel,
  quoteTokenAdresses,
  quoteTokenSymbol,
  tokenAddresses,
  dex,
  account,
  startBlock,
  blocksUntilStart,
  endBlock, 
  blocksRemaining
}) => {
  const isMetaMaskInScope = !!window.ethereum?.isMetaMask
  const TranslateString = useI18n()
  const liquidityUrlPathParts = getLiquidityUrlPathParts({ quoteTokenAdresses, quoteTokenSymbol, tokenAddresses, dex })
  const tokenPath = isTokenOnly? tokenAddresses[process.env.REACT_APP_CHAIN_ID] : liquidityUrlPathParts
  const liquidityUrl = getLiquidityUrl(dex, tokenPath, isTokenOnly)

  const title = useMemo(() => {
    if (blocksUntilStart && blocksUntilStart > 0){
      return 'Starts In'
    }
    
    if (blocksRemaining && blocksRemaining > 0){
      return 'Ends In'
    }

    return ''
  }, [blocksUntilStart, blocksRemaining])

  return (
    <Wrapper>
      <Flex justifyContent="space-between">
        <Text>{TranslateString(316, 'Stake')}:</Text>
        <StyledLinkExternal href={liquidityUrl}>
          {lpLabel}
        </StyledLinkExternal>
      </Flex> 
      {
        title && (
          <Flex justifyContent="space-between">
            <Text>{TranslateString(999, title)}:</Text>
            {
              startBlock && blocksUntilStart > 0 && (
                <StyledLinkExternal href={getBscScanLink(startBlock, 'block')}>
                  <Balance fontSize="16px" value={blocksUntilStart} decimals={0} unit=" blocks"/>
                </StyledLinkExternal> 
              )
            }
            {
              blocksUntilStart === 0 && blocksRemaining > 0 && (
                <StyledLinkExternal href={getBscScanLink(endBlock, 'block')}>
                  <Balance fontSize="16px" value={blocksRemaining} decimals={0} unit=" blocks"/>
                </StyledLinkExternal>       
              )
            }
            {
              !blocksUntilStart && !blocksRemaining && (
                <Text color="text">-</Text>        
              )
            }
          </Flex> 
        )
      }  
      {account && isMetaMaskInScope && (
        <Flex justifyContent="flex-start">
          <AddToMetaMaskButton
            onClick={() => registerToken(earningToken.address, earningToken.symbol, earningToken.decimals)}
          >
            <Text color="primary">{TranslateString(999, 'Add to Metamask')}</Text>
            <MetaMaskIcon ml="4px" />
          </AddToMetaMaskButton>
        </Flex>
      )}           
      <Flex justifyContent="flex-start">
        <Link external href={masterChefBscScanAddress} bold={false}>
          {TranslateString(999, 'View contract')}
        </Link>
      </Flex>     
      <Flex justifyContent="flex-start">
        <Link external href={projectLink} bold={false}>
          {TranslateString(999, 'View project site')}
        </Link>
      </Flex>      
    </Wrapper>
  )
}

export default DetailsSection
