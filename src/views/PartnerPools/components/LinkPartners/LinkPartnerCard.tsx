import React, { useMemo, useState } from 'react'
import { Button, Flex, MetaMaskIcon, Text } from '@pancakeswap-libs/uikit'
import farms from 'config/constants/farms'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import useI18n from 'hooks/useI18n'
import styled, { keyframes } from 'styled-components'
import { getLiquidityUrl } from 'utils'
import { getLiquidityUrlPathPartsPartnerPool } from 'utils/getLiquidityUrlPathParts'
import { registerToken } from 'utils/wallet'
import { LinkPartnerPoolConfig } from 'config/constants/types'
import CardHeading from '../CardHeading'

export interface LinkPartnerCardProps {
    linkPartnerPool: LinkPartnerPoolConfig
    account?: string
}

const Tada = keyframes`
  0% {
    transform: scale(1)
  }
  10%, 20% {
    transform: scale(.9) rotate(-8deg);
  }
  30%, 50%, 70% {
    transform: scale(1.3) rotate(8deg);
  } 
  40%, 60% {
    transform: scale(1.3) rotate(-8deg);
  }
  100% {
    transform: scale(1) rotate(0)
  }
`
const FCard = styled.div`
  position: relative;
  align-self: baseline;  
  opacity: 0.8;
  background: url(/images/egg/farm-card-bg.jpg) 0% 0% / cover no-repeat;
  background-color: #000113;
  background-blend-mode: luminosity;
  border: 1px solid ${({ theme }) => theme.colors.contrast};
  border-radius: 72px;
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
  position: relative;
  text-align: center;
  font-size: 0.8em;
  max-width: 27%;
`

const NewImage = styled.img`
  position: absolute;
  top:  -40px;
  left: -10px;
  width: 80px;
  animation: ${Tada} 1.5s linear infinite;
`

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.borderColor};
  height: 1px;
  margin: 28px auto;
  width: 100%;
`

const CardInfoWrapper = styled(Flex)`
    background-color: ${({ theme }) => theme.colors.invertedContrast}80;    
    border-radius: 20px;
    padding: 10px;
    flex-direction: column;
    min-height: 377px;
    justify-content: space-around;
`

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? '100%' : '0px')};
  overflow: hidden;
`

const LinkPartnerCard = ({linkPartnerPool, account}) => {
    const {
        stakingToken,            
        earningToken,
        projectLink,
        contractAddress,
        dex,
        isNewPool
    } = linkPartnerPool

    const tokenPath = useMemo(() => {
        if (stakingToken.isTokenOnly){
            return stakingToken.token.address
        }
    
        const quoteTokenAdress = stakingToken.token0.address
        const quoteTokenSymbol0 = stakingToken.token0.symbol
        const tokenAddress = stakingToken.token1.address
        return getLiquidityUrlPathPartsPartnerPool({ quoteTokenAdress, quoteTokenSymbol: quoteTokenSymbol0, tokenAddress, dex })
    }, [stakingToken, dex])
      
    const liquidityUrl = getLiquidityUrl(dex, tokenPath, stakingToken.isTokenOnly)
    const masterChefBscScanAddress =`https://polygonscan.com/address/${contractAddress}`  
    const lpLabel = stakingToken.token.symbol

    const TranslateString = useI18n()
    const isMetaMaskInScope = !!window.ethereum?.isMetaMask
    
    return (
        <FCard>    
          {isNewPool && 
          (<NewImage src="/images/egg/newpool.png" alt = {earningToken.symbol} />)}
          <CardHeading
            depositFee={1}
            isTokenOnly={stakingToken.isTokenOnly}
            isPartner={false}
            tokenSymbol={stakingToken.token.symbol}
            dex={dex}
            stakingToken={stakingToken}  
            earningToken={earningToken}   
          />
          <CardInfoWrapper>        
            <CardLink target="_blank" href={projectLink}>
                <Button fullWidth>View Project Site</Button>
            </CardLink>
            <CardLink target="_blank" href={masterChefBscScanAddress}>
                <Button fullWidth>View Contract</Button>
            </CardLink>
            <CardLink href={liquidityUrl}>
                <Button fullWidth>Get {lpLabel}</Button>
            </CardLink>
            {account && isMetaMaskInScope && (
                <Flex justifyContent="center">
                    <AddToMetaMaskButton
                        onClick={() => registerToken(earningToken.address, earningToken.symbol, earningToken.decimals)}
                    >
                        <Text color="primary">{TranslateString(999, 'Add to Metamask')}</Text>
                        <MetaMaskIcon ml="4px" />
                    </AddToMetaMaskButton>
                </Flex>
            )}
          </CardInfoWrapper>                
        </FCard>
    )
}

const CardLink = styled.a`

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

export default LinkPartnerCard