import contracts from './contracts'
import tokens from './farm-tokens'
import lpTokens from './lp-tokens'

import { DexSwapRouter, FarmConfig, QuoteToken } from './types'

const farms: FarmConfig[] = [
  // {
  //   enabled: true,
  //   isNewPool: true,
  //   pid: lpTokens.pairs.cgsGlmr.pid,
  //   risk: 5,
  //   lpSymbol: 'CGS-WGLMR',
  //   lpAddresses: {
  //     97: '',
  //     1284: lpTokens.pairs.cgsGlmr.address,
  //   },
  //   tokenSymbol: 'CGS',
  //   tokenAddresses: {
  //     97: '',
  //     1284: tokens.cgs,
  //   },
  //   quoteTokenSymbol: QuoteToken.GLMR,
  //   quoteTokenAdresses: contracts.wglmr,
  // },  
  // {
  //   enabled: true,
  //   isNewPool: true,
  //   pid: lpTokens.pairs.cgsUsdc.pid,
  //   risk: 5,
  //   lpSymbol: 'CGS-USDC.wh',
  //   lpAddresses: {
  //     97: '',
  //     1284: lpTokens.pairs.cgsUsdc.address,
  //   },
  //   tokenSymbol: 'CGS',
  //   tokenAddresses: {
  //     97: '',
  //     1284: tokens.cgs,
  //   },
  //   quoteTokenSymbol: QuoteToken.USDC,
  //   quoteTokenAdresses: contracts.usdc,
  // }, 
  // {
  //     enabled: true,
  //     isNewPool: true,
  //     pid: lpTokens.pairs.glmrUsdcWh.pid,
  //     risk: 5,
  //     lpSymbol: 'WGLMR-USDC.wh',
  //     lpAddresses: {
  //       97: '',
  //       1284: lpTokens.pairs.glmrUsdcWh.address,
  //     },
  //     tokenSymbol: 'WGLMR',
  //     tokenAddresses: {
  //       97: '',
  //       1284: tokens.wglmr,
  //     },
  //     quoteTokenSymbol: QuoteToken.USDC,
  //     quoteTokenAdresses: contracts.usdc
  //   },
  //   {
  //     enabled: true,
  //     isNewPool: true,
  //     pid: lpTokens.pairs.glmrEthWh.pid,
  //     risk: 5,
  //     lpSymbol: 'WGLMR-ETH.wh',
  //     lpAddresses: {
  //       97: '',
  //       1284: lpTokens.pairs.glmrEthWh.address,
  //     },
  //     tokenSymbol: 'ETH',
  //     tokenAddresses: {
  //       97: '',
  //       1284: tokens.ethwh,
  //     },
  //     quoteTokenSymbol: QuoteToken.GLMR,
  //     quoteTokenAdresses: contracts.wglmr
  //   },
  //   {
  //     enabled: true,
  //     isNewPool: true,
  //     pid: lpTokens.pairs.glmrBtcWh.pid,
  //     risk: 5,
  //     lpSymbol: 'WGLMR-BTC.wh',
  //     lpAddresses: {
  //       97: '',
  //       1284: lpTokens.pairs.glmrBtcWh.address,
  //     },
  //     tokenSymbol: 'BTC',
  //     tokenAddresses: {
  //       97: '',
  //       1284: tokens.btcwh,
  //     },
  //     quoteTokenSymbol: QuoteToken.GLMR,
  //     quoteTokenAdresses: contracts.wglmr
  //   },
  //   {
  //     enabled: true,
  //     isNewPool: true,
  //     pid: lpTokens.pairs.glmrDotWh.pid,
  //     risk: 5,
  //     lpSymbol: 'WGLMR-DOT.xc',
  //     lpAddresses: {
  //       97: '',
  //       1284: lpTokens.pairs.glmrDotWh.address,
  //     },
  //     tokenSymbol: 'DOT',
  //     tokenAddresses: {
  //       97: '',
  //       1284: tokens.dotwh,
  //     },
  //     quoteTokenSymbol: QuoteToken.GLMR,
  //     quoteTokenAdresses: contracts.wglmr
  //   },
    {
      enabled: true,
      isNewPool: true,
      pid: lpTokens.single.cgs.pid,
      risk: 5,
      isTokenOnly: true,
      lpSymbol: 'CGS',
      lpAddresses: {
        97: '',
        137: tokens.cgsUsdc, // CGS-USDC LP quickswap
      },
      tokenSymbol: 'CGS',
      tokenAddresses: {
        97: '',
        137: tokens.cgs,
      },
      quoteTokenSymbol: QuoteToken.USDC,
      quoteTokenAdresses: contracts.usdc,
    },
    {
      enabled: true,
      isNewPool: true,
      pid: lpTokens.pairs.cgsMatic.pid,
      risk: 5,
      lpSymbol: 'CGS-MATIC LP',
      lpAddresses: {
        97: '',
        137: lpTokens.pairs.cgsMatic.address,
      },
      tokenSymbol: 'CGS',
      tokenAddresses: {
        97: '',
        137: tokens.cgs,
      },
      quoteTokenSymbol: QuoteToken.MATIC,
      quoteTokenAdresses: contracts.wmatic,
    },  
    {
      enabled: true,
      isNewPool: true,
      pid: lpTokens.pairs.cgsUsdc.pid,
      risk: 5,
      lpSymbol: 'CGS-USDC LP',
      lpAddresses: {
        97: '',
        137: lpTokens.pairs.cgsUsdc.address,
      },
      tokenSymbol: 'CGS',
      tokenAddresses: {
        97: '',
        137: tokens.cgs,
      },
      quoteTokenSymbol: QuoteToken.USDC,
      quoteTokenAdresses: contracts.usdc,
    },  
    {
      enabled: true,
      isNewPool: true,
      pid: lpTokens.pairs.wMaticUsdc.pid,
      risk: 5,
      lpSymbol: 'WMATIC-USDC LP',
      lpAddresses: {
        97: '',
        137: lpTokens.pairs.wMaticUsdc.address,
      },
      tokenSymbol: 'WMATIC',
      tokenAddresses: {
        97: '',
        137: tokens.wmatic,
      },
      quoteTokenSymbol: QuoteToken.USDC,
      quoteTokenAdresses: contracts.usdc,
    },  
    {
      enabled: true,
      isNewPool: true,
      pid: lpTokens.pairs.usdcUsdt.pid,
      risk: 5,
      lpSymbol: 'USDC-USDT',
      lpAddresses: {
        97: '',
        137: lpTokens.pairs.usdcUsdt.address,
      },
      tokenSymbol: 'USDT',
      tokenAddresses: {
        97: '',
        137: tokens.usdt,
      },
      quoteTokenSymbol: QuoteToken.USDC,
      quoteTokenAdresses: contracts.usdc,
    },   
    {
      enabled: true,
      isNewPool: true,
      pid: lpTokens.pairs.usdcMai.pid,
      risk: 5,
      lpSymbol: 'USDC-MAI',
      lpAddresses: {
        97: '',
        137: lpTokens.pairs.usdcMai.address,
      },
      tokenSymbol: 'miMatic',
      tokenAddresses: {
        97: '',
        137: tokens.miMatic,
      },
      quoteTokenSymbol: QuoteToken.USDC,
      quoteTokenAdresses: contracts.usdc,
    }, 
    {
      enabled: true,
      isNewPool: true,
      pid: lpTokens.single.wmatic.pid,
      risk: 4,
      isTokenOnly: true,
      lpSymbol: 'WMATIC',
      lpAddresses: {
        97: '',
        137: tokens.wMaticUsdc, 
      },
      tokenSymbol: 'WMATIC',
      tokenAddresses: {
        97: '',
        137: tokens.wmatic,
      },
      quoteTokenSymbol: QuoteToken.USDC,
      quoteTokenAdresses: contracts.usdc,
    },
    {
      enabled: true,
      isNewPool: true,
      pid: lpTokens.single.wbtc.pid,
      risk: 4,
      isTokenOnly: true,
      lpSymbol: 'WBTC',
      lpAddresses: {
        97: '',
        137: tokens.wbtcUsdc, // wbtcUsdc LP quickswap
      },
      tokenSymbol: 'WBTC',
      tokenAddresses: {
        97: '',
        137: tokens.wbtc,
      },
      quoteTokenSymbol: QuoteToken.USDC,
      quoteTokenAdresses: contracts.usdc,
    },
    {
      enabled: true,
      isNewPool: true,
      pid: lpTokens.single.weth.pid,
      risk: 4,
      isTokenOnly: true,
      lpSymbol: 'WETH',
      lpAddresses: {
        97: '',
        137: tokens.wethUsdc, // wethUsdc LP quickswap
      },
      tokenSymbol: 'WETH',
      tokenAddresses: {
        97: '',
        137: tokens.weth,
      },
      quoteTokenSymbol: QuoteToken.USDC,
      quoteTokenAdresses: contracts.usdc,
    },
    {
      enabled: true,
      isNewPool: true,
      pid: lpTokens.single.sand.pid,
      risk: 4,
      isTokenOnly: true,
      lpSymbol: 'SAND',
      lpAddresses: {
        97: '',
        137: tokens.sandwMatic, // wethUsdc LP quickswap
      },
      tokenSymbol: 'SAND',
      tokenAddresses: {
        97: '',
        137: tokens.sand,
      },
      quoteTokenSymbol: QuoteToken.MATIC,
      quoteTokenAdresses: contracts.wmatic,
    },
  
]

export default farms
