import BigNumber from 'bignumber.js'
import {
  BASE_BLOCK_COUNTDOWN,
  BASE_BSC_SCAN_URLS,
  BASE_BEAM_SWAP_URL,
  BASE_STELLA_SWAP_URL,
  BASE_COUGAR_SWAP_URL,
  BASE_CONVERGENCE_SWAP_URL,
  BASE_SOLARFLARE_SWAP_URL,
} from 'config'
import { DexSwapPatch, DexSwapRouter } from 'config/constants/types'

export { default as formatAddress } from './formatAddress'

export const bnToDec = (bn: BigNumber, decimals = 18): number => {
  return bn.dividedBy(new BigNumber(10).pow(decimals)).toNumber()
}

export function getBscScanLink(
  data: string | number,
  type: 'transaction' | 'token' | 'address' | 'block' | 'countdown',
): string {
  switch (type) {
    case 'transaction': {
      return `${BASE_BSC_SCAN_URLS}/tx/${data}`
    }
    case 'token': {
      return `${BASE_BSC_SCAN_URLS}/token/${data}`
    }
    case 'block': {
      return `${BASE_BSC_SCAN_URLS}/block/${data}`
    }
    case 'countdown': {
      return `${BASE_BLOCK_COUNTDOWN}/block/countdown/${data}`
    }
    default: {
      return `${BASE_BSC_SCAN_URLS}/address/${data}`
    }
  }
}

export function getDexUrl(dex: DexSwapRouter): string {
  // if (dex === DexSwapRouter.SOLARFLARE) {
  //   return BASE_SOLARFLARE_SWAP_URL
  // }
  // if (dex === DexSwapRouter.Convergence) {
  //   return BASE_CONVERGENCE_SWAP_URL
  // }
  return BASE_STELLA_SWAP_URL
}

export function getLiquidityUrl(dex: DexSwapRouter, tokenPath: string, isTokenOnly?: boolean): string {
  const baseDexUrl = getDexUrl(dex)

  if (isTokenOnly) {
    switch (dex) {
      case DexSwapRouter.BEAM:
        return `${baseDexUrl}${DexSwapPatch.BEAM}/swap?outputCurrency=${tokenPath}`
      case DexSwapRouter.Convergence:
        return `${baseDexUrl}${DexSwapPatch.CONV}/swap?outputCurrency=${tokenPath}`
      case DexSwapRouter.SOLARFLARE:
        return `https://solarflare.io/exchange/stable-pool`;
      default:
        return `${baseDexUrl}swap?outputCurrency=${tokenPath}`
    }
  }

  if (dex === DexSwapRouter.BEAM) {
    return `${baseDexUrl}add/${DexSwapPatch.BEAM}/${tokenPath}`
  }
  if (dex === DexSwapRouter.Convergence) {
    return `${baseDexUrl}add/${DexSwapPatch.CONV}/${tokenPath}`
  }  
  if (dex === DexSwapRouter.SOLARFLARE) {
    return `${baseDexUrl}add/${DexSwapPatch.SOLARFLARE}/${tokenPath}`
  }
  return `${baseDexUrl}add/${tokenPath}`
}
