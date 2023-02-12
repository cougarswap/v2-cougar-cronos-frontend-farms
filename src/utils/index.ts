import BigNumber from 'bignumber.js'
import { BASE_BLOCK_COUNTDOWN, BASE_BSC_SCAN_URLS, BASE_COUGAR_EXCHANGE_URL, BASE_COUGAR_SWAP_URL } from 'config'
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
  if (dex === DexSwapRouter.COUGAREXCHANGE) {
    return BASE_COUGAR_EXCHANGE_URL;
  }
  // if (dex === DexSwapRouter.MEERKATFINANCE) {
  //   return BASE_MMF_URL;
  // }
  return BASE_COUGAR_SWAP_URL;
}

export function getLiquidityUrl(dex: DexSwapRouter, tokenPath: string, isTokenOnly?: boolean): string {  
  const baseDexUrl = getDexUrl(dex);
  // const baseDexUrl = BASE_COUGAR_SWAP_URL

  if (isTokenOnly) {
    // if (dex === DexSwapRouter.CRONASWAP) {
    //   return `${baseDexUrl}swap/${tokenPath}`;
    // }
    // return `${baseDexUrl}swap?outputCurrency=${tokenPath}`;
    switch (dex){
      case DexSwapRouter.VVSFINANCE: 
        return `${baseDexUrl}${DexSwapPatch.VVSFINANCE}/swap?outputCurrency=${tokenPath}`;
      case DexSwapRouter.COUGAREXCHANGE: 
        return `${baseDexUrl}swap?outputCurrency=${tokenPath}`;
      case DexSwapRouter.MEERKATFINANCE: 
        return `${baseDexUrl}${DexSwapPatch.MEERKATFINANCE}/swap?outputCurrency=${tokenPath}`;
      case DexSwapRouter.CRONASWAP: 
        return `${baseDexUrl}${DexSwapPatch.CRONASWAP}/swap?outputCurrency=${tokenPath}`;
      default:
        // VVS Finance is default
        return `${baseDexUrl}/swap?outputCurrency=${tokenPath}`;
    }
  }

  switch (dex){
    case DexSwapRouter.COUGAREXCHANGE: 
      return `${baseDexUrl}add/${tokenPath}`;
    case DexSwapRouter.MEERKATFINANCE: 
      return `${baseDexUrl}${DexSwapPatch.MEERKATFINANCE}/add/${tokenPath}`;
    case DexSwapRouter.CRONASWAP: 
      return `${baseDexUrl}${DexSwapPatch.CRONASWAP}/add/${tokenPath}`;
    default:
      // VVS Finance is defailt
      return `${baseDexUrl}${DexSwapPatch.VVSFINANCE}/add/${tokenPath}`;
  }
  // if (dex === DexSwapRouter.CRONASWAP) {
  //   return `${baseDexUrl}add/${tokenPath}`;
  // }
  // return `${baseDexUrl}add/${tokenPath}`;
}
