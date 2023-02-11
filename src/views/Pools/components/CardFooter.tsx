import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { LinkExternal, Text, MetaMaskIcon } from '@pancakeswap-libs/uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import useI18n from 'hooks/useI18n'
import { ChevronDown, ChevronUp } from 'react-feather'
import Balance from 'components/Balance'
import { CommunityTag, CoreTag, BinanceTag, FarmingTag, WaitingTag } from 'components/Tags'
import { PoolCategory } from 'config/constants/types'
import { getBscScanLink } from 'utils'
import { registerToken } from 'utils/wallet'

const tags = {
  [PoolCategory.BINANCE]: BinanceTag,
  [PoolCategory.CORE]: CoreTag,
  [PoolCategory.COMMUNITY]: CommunityTag,  
}

interface Props {
  projectLink: string
  totalStaked: BigNumber
  blocksRemaining: number
  endBlock: number
  startBlock: number
  isFinished: boolean
  blocksUntilStart: number
  poolCategory: PoolCategory
  contractAddress: string
  tokenSymbol: string
  tokenAddress: string
  tokenDecimals: number
  account: string
}

const StyledFooter = styled.div<{ isFinished: boolean }>`
  border-top: 1px solid ${({ theme }) => (theme.isDark ? '#524B63' : '#E9EAEB')};
  color: ${({ isFinished, theme }) => theme.colors[isFinished ? 'textDisabled2' : 'primary2']};
  padding: 24px;
`

const StyledDetailsButton = styled.button`
  align-items: center;
  background-color: transparent;
  border: 0;
  color: ${(props) => props.theme.colors.primary};
  cursor: pointer;
  display: inline-flex;
  font-size: 16px;
  font-weight: 600;
  height: 32px;
  justify-content: center;
  outline: 0;
  padding: 0;
  &:hover {
    opacity: 0.9;
  }

  & > svg {
    margin-left: 4px;
  }
`

const Details = styled.div`
  margin-top: 24px;
`

const Row = styled.div`
  align-items: center;
  display: flex;
`

const FlexFull = styled.div`
  flex: 1;
  & > * + * {
    margin-left: 5px;
  }
`
const Label = styled.div`
  font-size: 14px;
`
const TokenLink = styled.a`
  font-size: 14px;
  text-decoration: none;
  color: #12aab5;
`

const AddMetaMaskContainer = styled.div`

`

const ContractLink = styled(LinkExternal)`
  font-size: 14px;
  text-decoration: none;
  color: #12aab5;
  margin: 10px 0;
`

const AddToMetaMaskButton = styled.button`
  background-color: transparent;
  border: none;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  padding-left: 0;
  margin: 10px 0;
  font-size: 14px;
  text-decoration: none;

  color: #12aab5;
  & > * {
    font-size: 14px;
    color: #12aab5;
    font-weight: bold;
    line-height: 1;
  }
`

const CardFooter: React.FC<Props> = ({
  projectLink,
  totalStaked,
  blocksRemaining,
  startBlock,
  endBlock,
  isFinished,
  blocksUntilStart,
  poolCategory,
  contractAddress,
  account,
  tokenSymbol,
  tokenAddress, 
  tokenDecimals
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const TranslateString = useI18n()
  const Icon = isOpen ? ChevronUp : ChevronDown

  const handleClick = () => setIsOpen(!isOpen)
  const Tag = tags[poolCategory]
  const ftmScan = getBscScanLink(contractAddress, 'address')
  const isMetaMaskInScope = !!window.ethereum?.isMetaMask

  return (
    <StyledFooter isFinished={isFinished}>
      <Row>
        <FlexFull>
          <Tag />
          {blocksUntilStart > 0 ? <WaitingTag /> : null}
          {blocksUntilStart === 0 && blocksRemaining > 0 ? <FarmingTag /> : null }
        </FlexFull>
        <StyledDetailsButton onClick={handleClick}>
          {isOpen ? 'Hide' : 'Details'} <Icon />
        </StyledDetailsButton>
      </Row>
      {isOpen && (
        <Details>
          <Row style={{ marginBottom: '4px' }}>
            <FlexFull>
              <Label>
                {TranslateString(999, 'Total ')}
                <span role="img" aria-label="syrup">
                  🥞{' '}
                </span>                
              </Label>
            </FlexFull>
            <Balance fontSize="14px" isDisabled={isFinished} value={getBalanceNumber(totalStaked)} />
          </Row>
          {blocksUntilStart > 0 && (
            <Row>
              <FlexFull>
                <Label>{TranslateString(999, 'Start')}:</Label>
              </FlexFull>
              <LinkExternal href={getBscScanLink(startBlock, 'block')} style={{ alignSelf: 'center' }}>
                <Balance fontSize="14px" isDisabled={isFinished} value={blocksUntilStart} decimals={0} unit=" blocks"/>
              </LinkExternal> 
            </Row>
          )}
          {blocksUntilStart === 0 && blocksRemaining > 0 && (
            <Row>
              <FlexFull>
                <Label>{TranslateString(999, 'End')}:</Label>
              </FlexFull>
              <LinkExternal href={getBscScanLink(endBlock, 'block')} style={{ alignSelf: 'center' }}>
                <Balance fontSize="14px" isDisabled={isFinished} value={blocksRemaining} decimals={0} unit=" blocks"/>
              </LinkExternal>              
            </Row>
          )}          
          <ContractLink color="#12aab5" href={ftmScan} style={{ alignSelf: 'center' }}>
            <Label>{TranslateString(999, 'View contract on Polygonscan')}:</Label>
          </ContractLink>              
          <TokenLink href={projectLink} target="_blank">
            {TranslateString(412, 'View project site')}
          </TokenLink>
          <AddMetaMaskContainer>
              {account && isMetaMaskInScope && (
                <AddToMetaMaskButton
                  onClick={() => registerToken(tokenAddress, tokenSymbol, tokenDecimals)}
                >
                  <Text color="primary">{TranslateString(999, 'Add to Metamask')}</Text>
                  <MetaMaskIcon ml="4px" />
                </AddToMetaMaskButton>
              )}
          </AddMetaMaskContainer>
        </Details>
      )}
    </StyledFooter>
  )
}

export default React.memo(CardFooter)
