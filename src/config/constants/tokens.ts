import { Token } from "./types";
import farmTokens from './farm-tokens'

interface TokenList {
    [symbol: string]: Token
  }

export const tokens : TokenList = {
    cgs: {
        symbol: 'CGS',
        address: farmTokens.cgs,
        decimals: 18  
    }, 
    wmatic: {
        symbol: 'WMATIC',
        address: farmTokens.wmatic,
        decimals: 18      
    },
    usdc: {
        symbol: 'USDC',
        address: farmTokens.usdc,
        decimals: 6
    }, 
}

export const lpTokens : TokenList = {
    cgsMaticStella: {
        symbol: 'CGS-WMATIC',
        address: farmTokens.cgsMatic,
        decimals: 18
    },
    cgsUsdcStella: {
        symbol: 'CGS-USDC',
        address: farmTokens.cgsUsdc,
        decimals: 18
    },
}
    