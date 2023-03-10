import { PoolConfig, QuoteToken, PoolCategory, PoolVersion } from './types'

const pools: PoolConfig[] = [ 
  // {
  //   sousId: 1,
  //   tokenName: 'WMATIC',
  //   tokenAddress: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270 ',
  //   stakingTokenName: QuoteToken.CGS,
  //   stakingTokenDecimals: 18,
  //   stakingTokenAddress: '0x0b265919F1B9285FE283010A874b2BEae32D731E',
  //   contractAddress: '0x87a08A18033532fFA5d4607cc75aAA1bDc45528E',
  //   poolCategory: PoolCategory.CORE,
  //   projectLink: 'https://polygon.technology/',
  //   harvest: true,
  //   tokenPerBlock: '0',
  //   sortOrder: 1,
  //   isFinished: false,
  //   tokenDecimals: 18,
  //   startingTimeStamp: '0',
  //   withdrawalInterval: 0,
  //   isNewPool: false,
  //   poolVersion: PoolVersion.V1
  // },   
  // {
  //   sousId: 5,
  //   tokenName: 'USDT',
  //   tokenAddress: '0xeFAeeE334F0Fd1712f9a8cc375f427D9Cdd40d73',
  //   stakingTokenName: QuoteToken.CGS,
  //   stakingTokenDecimals: 18,
  //   stakingTokenAddress: '0xeb50C308177Df06685112b3f56E66761578eA9Bd',
  //   contractAddress: '0x014E30841eD3A16D5397Acff1740A42b24FfCfDf',
  //   poolCategory: PoolCategory.CORE,
  //   projectLink: 'https://tether.to/',
  //   harvest: true,
  //   tokenPerBlock: '0',
  //   sortOrder: 5,
  //   isFinished: false,
  //   tokenDecimals: 6,
  //   startingTimeStamp: '0',
  //   withdrawalInterval: 0,
  //   isNewPool: false,
  //   poolVersion: PoolVersion.V1
  // },     
  // {
  //   sousId: 1,
  //   tokenName: 'WGLMR',
  //   tokenAddress: '0xAcc15dC74880C9944775448304B263D191c6077F',
  //   stakingTokenName: QuoteToken.CGS,
  //   stakingTokenDecimals: 18,
  //   stakingTokenAddress: '0xeb50C308177Df06685112b3f56E66761578eA9Bd',
  //   contractAddress: '0x48adb29EB086296167b02AD54a596361BD891D96',
  //   poolCategory: PoolCategory.CORE,
  //   projectLink: 'https://moonbeam.network/',
  //   harvest: true,
  //   tokenPerBlock: '0',
  //   sortOrder: 1,
  //   isFinished: false,
  //   tokenDecimals: 18,
  //   startingTimeStamp: '0',
  //   withdrawalInterval: 0,
  //   isNewPool: false,
  //   poolVersion: PoolVersion.V1
  // },  
  // {
  //   sousId: 2,
  //   tokenName: 'WGLMR',
  //   tokenAddress: '0xAcc15dC74880C9944775448304B263D191c6077F',
  //   stakingTokenName: QuoteToken.CGS,
  //   stakingTokenDecimals: 18,
  //   stakingTokenAddress: '0xeb50C308177Df06685112b3f56E66761578eA9Bd',
  //   contractAddress: '0x4C90f18F76FEbe0E8C0d0e3e7bDa09Bfb9D12005',
  //   poolCategory: PoolCategory.CORE,
  //   projectLink: 'https://moonbeam.network/',
  //   harvest: true,
  //   tokenPerBlock: '0',
  //   sortOrder: 2,
  //   isFinished: false,
  //   tokenDecimals: 18,
  //   startingTimeStamp: '0',
  //   withdrawalInterval: 0,
  //   isNewPool: false,
  //   poolVersion: PoolVersion.V1
  // },  
  // {
  //   sousId: 3,
  //   tokenName: '1BEAM',
  //   tokenAddress: '0x19d2f0CF1FC41DE2b8fd4A98065AB9284E05Cf29',
  //   stakingTokenName: QuoteToken.CGS,
  //   stakingTokenDecimals: 18,
  //   stakingTokenAddress: '0xeb50C308177Df06685112b3f56E66761578eA9Bd',
  //   contractAddress: '0xEF9335EbBd03293acBd721285DA8a19394145664',
  //   poolCategory: PoolCategory.CORE,
  //   projectLink: 'https://1beam.io/',
  //   harvest: true,
  //   tokenPerBlock: '0',
  //   sortOrder: 3,
  //   isFinished: false,
  //   tokenDecimals: 18,
  //   startingTimeStamp: '0',
  //   withdrawalInterval: 0,
  //   isNewPool: false,
  //   poolVersion: PoolVersion.V1
  // },    
  // {
  //   sousId: 6,
  //   tokenName: 'WGLMR',
  //   tokenAddress: '0xAcc15dC74880C9944775448304B263D191c6077F',
  //   stakingTokenName: QuoteToken.CGS,
  //   stakingTokenDecimals: 18,
  //   stakingTokenAddress: '0xeb50C308177Df06685112b3f56E66761578eA9Bd',
  //   contractAddress: '0xdA7CC973C5F85ABA4789683C2d565BE0d5e370b1',
  //   poolCategory: PoolCategory.CORE,
  //   projectLink: 'https://moonbeam.network/',
  //   harvest: true,
  //   tokenPerBlock: '0',
  //   sortOrder: 2,
  //   isFinished: false,
  //   tokenDecimals: 18,
  //   startingTimeStamp: '0',
  //   withdrawalInterval: 0,
  //   isNewPool: false,
  //   poolVersion: PoolVersion.V1
  // }, 
  // {
  //   sousId: 7,
  //   tokenName: 'USDC',
  //   tokenAddress: '0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b',
  //   stakingTokenName: QuoteToken.CGS,
  //   stakingTokenDecimals: 18,
  //   stakingTokenAddress: '0xeb50C308177Df06685112b3f56E66761578eA9Bd',
  //   contractAddress: '0x0192e427152FB89Aa1F2cA58d4c2B7D91Fe394eB',
  //   poolCategory: PoolCategory.CORE,
  //   projectLink: 'https://www.centre.io/usdc',
  //   harvest: true,
  //   tokenPerBlock: '0',
  //   sortOrder: 4,
  //   isFinished: false,
  //   tokenDecimals: 6,
  //   startingTimeStamp: '0',
  //   withdrawalInterval: 0,
  //   isNewPool: false,
  //   poolVersion: PoolVersion.V2
  // }, 
  // {
  //   sousId: 8,
  //   tokenName: 'BUSD',
  //   tokenAddress: '0xA649325Aa7C5093d12D6F98EB4378deAe68CE23F',
  //   stakingTokenName: QuoteToken.CGS,
  //   stakingTokenDecimals: 18,
  //   stakingTokenAddress: '0xeb50C308177Df06685112b3f56E66761578eA9Bd',
  //   contractAddress: '0xb938c0DA12079F937d9D27de55D9c4A1Dd842e04',
  //   poolCategory: PoolCategory.CORE,
  //   projectLink: 'https://www.centre.io/busd',
  //   harvest: true,
  //   tokenPerBlock: '0',
  //   sortOrder: 6,
  //   isFinished: false,
  //   tokenDecimals: 18,
  //   startingTimeStamp: '0',
  //   withdrawalInterval: 0,
  //   isNewPool: true,
  //   poolVersion: PoolVersion.V2
  // }, 
]

export default pools
