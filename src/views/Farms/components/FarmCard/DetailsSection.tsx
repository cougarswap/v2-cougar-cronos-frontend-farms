import React from 'react'
import useI18n from 'hooks/useI18n'
import styled from 'styled-components'
import { Text, Flex, Link, LinkExternal, MetaMaskIcon } from '@pancakeswap-libs/uikit'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { Address, DexSwapRouter } from 'config/constants/types'
import { getLiquidityUrl } from 'utils'
import { registerToken } from 'utils/wallet'

export interface ExpandableSectionProps {
  isTokenOnly?: boolean
  bscScanAddress?: string
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
  bscScanAddress,
  removed,
  totalValueFormated,
  lpLabel,
  quoteTokenAdresses,
  quoteTokenSymbol,
  tokenAddresses,
  lpTokenDecimals,
  dex,
  account
}) => {
  const isMetaMaskInScope = !!window.ethereum?.isMetaMask
  const TranslateString = useI18n()
  const liquidityUrlPathParts = getLiquidityUrlPathParts({ quoteTokenAdresses, quoteTokenSymbol, tokenAddresses, dex })
  const tokenPath = isTokenOnly? tokenAddresses[process.env.REACT_APP_CHAIN_ID] : liquidityUrlPathParts
  const liquidityUrl = getLiquidityUrl(dex, tokenPath, isTokenOnly)
  return (
    <Wrapper>
      <Flex justifyContent="space-between">
        <Text>{TranslateString(316, 'Stake')}:</Text>
        <StyledLinkExternal href={liquidityUrl}>
          {lpLabel}
        </StyledLinkExternal>
      </Flex>   
      {account && isMetaMaskInScope && isTokenOnly && (
        <Flex justifyContent="flex-start">
          <AddToMetaMaskButton
            onClick={() => registerToken(tokenAddresses[process.env.REACT_APP_CHAIN_ID], lpLabel, lpTokenDecimals)}
          >
            <Text color="textTitleFarm">{TranslateString(999, 'Add to Metamask')}</Text>
            <MetaMaskIcon ml="4px" />
          </AddToMetaMaskButton>
        </Flex>
      )}     
      <Flex justifyContent="flex-start">
        <Link external href={bscScanAddress} bold={false}>
          {TranslateString(356, 'View on Cronos')}
        </Link>
      </Flex>         
    </Wrapper>
  )
}

export default DetailsSection
