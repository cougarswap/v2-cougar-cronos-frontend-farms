// Constructing the two forward-slash-separated parts of the 'Add Liquidity' URL
// Each part of the url represents a different side of the LP pair.

import { DexSwapPatch, DexSwapRouter, StakingToken } from "config/constants/types"
import { getDexUrl } from "utils"

// In the URL, using the quote token 'CRO' is represented by 'ETH'
const getLiquidityUrlPathParts = ({ quoteTokenAdresses, quoteTokenSymbol, tokenAddresses, dex = DexSwapRouter.STELLA }) => {
  const chainId = process.env.REACT_APP_CHAIN_ID
  
  let firstPart = ''
  if (quoteTokenSymbol === 'MATIC') {
      switch(dex) { 
        case DexSwapRouter.BEAM: { 
          firstPart = 'MATIC'
           break; 
        } 
        case DexSwapRouter.STELLA: { 
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

export const getLiquidityUrlPathPartsPartnerPool = ({ quoteTokenAdress, quoteTokenSymbol, tokenAddress, dex = DexSwapRouter.STELLA }) => {
  let firstPart = ''
  if (quoteTokenSymbol === 'GLRM') {
    firstPart = dex === DexSwapRouter.BEAM ? 'GLRM' : 'GLRM'
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
    if (dex === DexSwapRouter.STELLA) {
      return `${baseDexUrl}swap/${stakingToken.token.address}`;
    }
    if (dex === DexSwapRouter.Convergence) {
      return `${baseDexUrl}?swapPair=MATIC_${stakingToken.token.symbol}`;
    }
    return `${baseDexUrl}swap?outputCurrency=${stakingToken.token.address}`;
  }
  
  if (stakingToken.token0.symbol === 'WMATIC') {
    const mainToken = dex === DexSwapRouter.STELLA ? 'ETH' : 'ETH'
    return `${baseDexUrl}add/${mainToken}/${stakingToken.token1.address}`;
  }
  
  if (stakingToken.token1.symbol === 'WMATIC') {  
    const mainToken = dex === DexSwapRouter.STELLA ? 'ETH' : 'ETH'
    return `${baseDexUrl}add/${mainToken}/${stakingToken.token0.address}`;
  }
  return `${baseDexUrl}add/${stakingToken.token0.address}/${stakingToken.token1.address}`;
}


const getLiquidityPair = (quoteTokenAddress, quoteTokenSymbol, tokenAddress, tokenSymbol, dex = DexSwapRouter.STELLA) => {
  const chainId = process.env.REACT_APP_CHAIN_ID
  
  if (dex === DexSwapRouter.Convergence) {
    return `${tokenSymbol}_${quoteTokenSymbol}`
  }

  let firstPart = ''
  if (quoteTokenSymbol === 'MATIC') {
      switch(dex) { 
        case DexSwapRouter.BEAM: { 
          firstPart = 'MATIC'
           break; 
        } 
        case DexSwapRouter.STELLA: { 
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
    if (dex === DexSwapRouter.BEAM) {
      return `${baseDexUrl}beam/swap?outputCurrency=${tokenAddress}`;
    }
    if (dex === DexSwapRouter.Convergence) {
      return `${baseDexUrl}conv/swap?outputCurrency=${tokenAddress}`;
    }
    if (dex === DexSwapRouter.SOLARFLARE) {
      return `https://solarflare.io/exchange/stable-pool/add/${quoteTokenSymbol}`;
    }
    return `${baseDexUrl}swap?outputCurrency=${tokenAddress}`;
  }

  const liquidityPairPath = getLiquidityPair(quoteTokenAddress, 
    quoteTokenSymbol, 
    tokenAddress,
    tokenSymbol, 
    dex)

  if (dex === DexSwapRouter.BEAM) {
    return `${baseDexUrl}add/${DexSwapPatch.BEAM}/${liquidityPairPath}`;
  }
  if (dex === DexSwapRouter.Convergence) {
    return `${baseDexUrl}add/${DexSwapPatch.CONV}/${liquidityPairPath}`;
  }
  if (dex === DexSwapRouter.ZEN) {
    return `https://dex.zenlink.pro/#/pool?liquidType=SHOW_ADD`;
  }
  if (dex === DexSwapRouter.TRADE) {
    return `https://mytrade.org/add/${liquidityPairPath}`;
  }
  if (dex === DexSwapRouter.SOLARFLARE) {
    return `${baseDexUrl}add/${DexSwapPatch.SOLARFLARE}/${liquidityPairPath}`
  }
  return `${baseDexUrl}add/${liquidityPairPath}`;
}

export default getLiquidityUrlPathParts
