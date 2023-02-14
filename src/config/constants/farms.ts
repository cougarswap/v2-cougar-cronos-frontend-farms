import contracts from './contracts'
import tokens from './farm-tokens'
import lpTokens from './lp-tokens'

import { DexSwapRouter, FarmConfig, QuoteToken } from './types'

const farms: FarmConfig[] = [ 
  {
    enabled: true,
    isNewPool: true,
    pid: lpTokens.single.cgs.pid,
    risk: 5,
    isTokenOnly: true,
    lpSymbol: 'wCGS',
    lpAddresses: {
      97: '',
      25: tokens.cgsUsdc, // CGS-USDC LP quickswap
    },
    tokenSymbol: 'CGS',
    tokenAddresses: {
      97: '',
      25: tokens.cgs,
    },
    quoteTokenSymbol: QuoteToken.USDC,
    quoteTokenAdresses: contracts.usdc,
    dex: DexSwapRouter.COUGAREXCHANGE,
  },
  {
    enabled: true,
    isNewPool: true,
    pid: lpTokens.pairs.cgsWcro.pid,
    risk: 5,
    lpSymbol: 'wCGS-WCRO',
    lpAddresses: {
      97: '',
      25: lpTokens.pairs.cgsWcro.address,
    },
    tokenSymbol: 'CRO',
    tokenAddresses: {
      97: '',
      25: tokens.wcro,
    },
    quoteTokenSymbol: QuoteToken.CGS,
    quoteTokenAdresses: contracts.cake,
    dex: DexSwapRouter.COUGAREXCHANGE
  },
  {
    enabled: true,
    isNewPool: true,
    pid: lpTokens.pairs.cgsUsdc.pid,
    risk: 5,
    lpSymbol: 'wCGS-USDC',
    lpAddresses: {
      97: '',
      25: lpTokens.pairs.cgsUsdc.address,
    },
    tokenSymbol: 'CGS',
    tokenAddresses: {
      97: '',
      25: tokens.cgs,
    },
    quoteTokenSymbol: QuoteToken.USDC,
    quoteTokenAdresses: contracts.usdc,
    dex: DexSwapRouter.COUGAREXCHANGE
  },
]

export default farms
