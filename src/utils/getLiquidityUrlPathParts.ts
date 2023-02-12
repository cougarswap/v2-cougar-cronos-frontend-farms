// Constructing the two forward-slash-separated parts of the 'Add Liquidity' URL
// Each part of the url represents a different side of the LP pair.

import { DexSwapPatch, DexSwapRouter, StakingToken } from "config/constants/types"
import { getDexUrl } from "utils"

// In the URL, using the quote token 'CRO' is represented by 'ETH'
const getLiquidityUrlPathParts = ({ quoteTokenAdresses, quoteTokenSymbol, tokenAddresses, dex = DexSwapRouter.COUGAREXCHANGE }) => {
  const chainId = process.env.REACT_APP_CHAIN_ID
  
  let firstPart = ''
  if (quoteTokenSymbol === 'CRO') {
    // firstPart = dex === DexSwapRouter.CRONASWAP ? 'CRO' : 'ETH'
      switch(dex) { 
        case DexSwapRouter.CRONASWAP: { 
          firstPart = 'CRO'
           break; 
        } 
        case DexSwapRouter.COUGAREXCHANGE: { 
          firstPart = 'CRO'
           break; 
        } 
        case DexSwapRouter.MEERKATFINANCE: { 
          firstPart = quoteTokenAdresses[chainId]
           break; 
        } 
        default: { 
          firstPart = 'ETH'
           break; 
        }
      }
  }
  else {  
    firstPart = quoteTokenAdresses[chainId]
  }
  const secondPart = tokenAddresses[chainId]
  return `${firstPart}/${secondPart}`
}

export const getLiquidityUrlPathPartsPartnerPool = ({ quoteTokenAdress, quoteTokenSymbol, tokenAddress, dex = DexSwapRouter.COUGAREXCHANGE }) => {
  let firstPart = ''
  if (quoteTokenSymbol === 'CRO') {
    firstPart = dex === DexSwapRouter.CRONASWAP ? 'CRO' : 'CRO'
  }
  else {  
    firstPart = quoteTokenAdress
  }
  const secondPart = tokenAddress
  
  return `${firstPart}/${secondPart}`
}

export const getLiquidityUrlByStakingToken = (stakingToken: StakingToken, dex?: DexSwapRouter) => {
  const baseDexUrl = getDexUrl(dex)

  if (stakingToken.isTokenOnly) {
    if (dex === DexSwapRouter.VVSFINANCE) {
      return `${baseDexUrl}swap/${stakingToken.token.address}`;
    }
    return `${baseDexUrl}swap?outputCurrency=${stakingToken.token.address}`;
  }
  
  if (stakingToken.token0.symbol === 'WCRO') {
    const mainToken = dex === DexSwapRouter.VVSFINANCE ? 'ETH' : 'ETH'
    return `${baseDexUrl}add/${mainToken}/${stakingToken.token1.address}`;
  }
  
  if (stakingToken.token1.symbol === 'WCRO') {  
    const mainToken = dex === DexSwapRouter.VVSFINANCE ? 'ETH' : 'ETH'
    return `${baseDexUrl}add/${mainToken}/${stakingToken.token0.address}`;
  }
  
  return `${baseDexUrl}add/${stakingToken.token0.address}/${stakingToken.token1.address}`;
}


const getLiquidityPair = (quoteTokenAddress, quoteTokenSymbol, tokenAddress, tokenSymbol, dex = DexSwapRouter.CRONASWAP) => {
  const chainId = process.env.REACT_APP_CHAIN_ID
  
  if (dex === DexSwapRouter.VVSFINANCE) {
    return `${tokenSymbol}_${quoteTokenSymbol}`
  }

  let firstPart = ''
  if (quoteTokenSymbol === 'CRO') {
      switch(dex) { 
        case DexSwapRouter.CRONASWAP: { 
          firstPart = 'CRO'
           break; 
        } 
        case DexSwapRouter.COUGAREXCHANGE: { 
          firstPart = quoteTokenAddress
           break; 
        } 
        default: { 
          firstPart = 'ETH'
           break; 
        }
      }
  }
  else {  
    firstPart = quoteTokenAddress
  }

  const secondPart = tokenAddress

  return `${firstPart}/${secondPart}`
}

export function getLiquidityLink(dex: DexSwapRouter, 
  isTokenOnly: boolean,
  tokenAddress: string, 
  tokenSymbol: string, 
  quoteTokenAddress?: string,
  quoteTokenSymbol?: string
  
  ): string {
    const baseDexUrl = getDexUrl(dex);
  if (isTokenOnly) {
    return `${baseDexUrl}swap?outputCurrency=${tokenAddress}`;
  }

  const liquidityPairPath = getLiquidityPair(quoteTokenAddress, 
    quoteTokenSymbol, 
    tokenAddress,
    tokenSymbol, 
    dex)
  return `${baseDexUrl}add/${liquidityPairPath}`;
}

export default getLiquidityUrlPathParts
