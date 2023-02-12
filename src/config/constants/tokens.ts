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
    cgx: {
        symbol: 'CGX',
        address: farmTokens.cgx,
        decimals: 18  
    }, 
    cgo: {
        symbol: 'CGO',
        address: farmTokens.cgo,
        decimals: 18  
    },
    wcro: {
        symbol: 'WCRO',
        address: farmTokens.wcro,
        decimals: 18      
    },
    usdc: {
        symbol: 'USDC',
        address: farmTokens.usdc,
        decimals: 6 
    }, 
    mmf: {
        symbol: 'MMF',
        address: farmTokens.mmf,
        decimals: 18
    },
    metf: {
        symbol: 'MMTF',
        address: farmTokens.metf,
        decimals: 18
    },
    ago: {
        symbol: 'AGO',
        address: farmTokens.ago,
        decimals: 18
    },
    betify: {
        symbol: 'BEFITY',
        address: farmTokens.betify,
        decimals: 18
    }
}

export const lpTokens : TokenList = {
    cgsWcroVvs: {
        symbol: 'CGS-WCRO',
        address: farmTokens.cgsWcro,
        decimals: 18
    },
    cgsUsdcVvs: {
        symbol: 'CGS-USDC',
        address: farmTokens.cgsUsdc,
        decimals: 18
    },
}
    