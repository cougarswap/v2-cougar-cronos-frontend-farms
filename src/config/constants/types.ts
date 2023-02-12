export type IfoStatus = 'coming_soon' | 'live' | 'finished'

export interface Ifo {
  id: string
  isActive: boolean
  address: string
  name: string
  subTitle?: string
  description?: string
  launchDate: string
  launchTime: string
  saleAmount: string
  raiseAmount: string
  cakeToBurn: string
  projectSiteUrl: string
  currency: string
  currencyAddress: string
  tokenDecimals: number
  releaseBlockNumber: number
}

export enum QuoteToken {
  'BNB' = 'BNB',
  'MATIC' = 'MATIC',
  'WMATIC' = 'WMATIC', // compare with CGS file hook/state
  'FTM' = 'FTM',
  'AVAX' = 'AVAX',  
  'CRO' = 'CRO',
  'GLMR' = 'GLMR', 
  'CAKE' = 'CAKE',
  'CGS' = 'CGS',
  'SYRUP' = 'SYRUP',
  'BUSD' = 'BUSD',
  'USDC' = 'USDC',
  'USDT' = 'USDT',
  'ceUSDT' = 'ceUSDT',
  'madUSDC' = 'madUSDC',
  'madUSDT' = 'madUSDT',
  'anyUSDC' = 'anyUSDC',
  'anyUSDT' = 'anyUSDT',
  'TWT' = 'TWT',
  'UST' = 'UST',
  'ETH' = 'ETH',
  'BTCB' = 'BTCB',
  'THREEPOOL' = '3pool',
  'MULTICHAIN3POOL' = 'any3-3pool',
  'UST3POOL' = 'ust-3pool',
}

export enum DexSwapRouter {
  'VVSFINANCE' = 'VVSFINANCE',
  'MEERKATFINANCE' = 'MEERKATFINANCE',
  'CRONASWAP' = 'CRONASWAP',
  'COUGAREXCHANGE' = 'COUGAREXCHANGE'
}

export enum DexSwapPatch {
  'VVSFINANCE' = 'vvs',
  'MEERKATFINANCE' = 'mmf',
  'CRONASWAP' = 'crona',
}

export enum PoolCategory {
  'COMMUNITY' = 'Community',
  'CORE' = 'Core',
  'BINANCE' = 'Binance', // Pools using native BNB behave differently than pools using a token
  'PARTNER' = 'PARTNER'
}

export enum StartType {
  'BLOCK' = 'BLOCK',
  'TIMESTAMP' = 'TIMESTAMP'
}

export enum PoolVersion {
  V1 = 1,
  V2 = 2 // fix withdraw lockup (before pool starts and after pool ends, withdraw lockup has no effects)
}

export interface Address {
  97?: string
  56?: string
  137?: string
  250?: string
  43114?: string,
  25?: string,
  1284?: string
}

export interface FarmConfig {
  enabled: boolean
  isNewPool: boolean
  pid: number
  dex?: DexSwapRouter
  lpSymbol: string
  lpAddresses: Address
  tokenSymbol: string
  tokenAddresses: Address
  quoteTokenSymbol: QuoteToken
  quoteTokenAdresses: Address
  multiplier?: string
  isTokenOnly?: boolean
  isCommunity?: boolean
  isPartner?: boolean
  risk: number
  getLiquidityExternalLink?: string
  dual?: {
    rewardPerBlock: number
    earnLabel: string
    endBlock: number
  }
}

export interface PoolConfig {
  sousId: number
  image?: string
  tokenName: string
  tokenAddress: string
  tokenDecimals: number,
  stakingTokenName: QuoteToken
  stakingTokenDecimals: number
  stakingLimit?: number
  stakingTokenAddress?: string
  contractAddress: string
  poolCategory: PoolCategory
  projectLink: string
  tokenPerBlock: string
  sortOrder?: number
  harvest?: boolean
  isFinished?: boolean
  startingTimeStamp?: string
  isNewPool?: boolean
  dex?: DexSwapRouter,
  withdrawalInterval?: number
  poolVersion?: PoolVersion
}

export interface Token {
  symbol?: string
  address?: string
  decimals?: number
  chainId?: number
}

export interface StakingToken {
  isTokenOnly?: boolean
  token: Token
  token0?: Token
  token1?: Token
  dex?: DexSwapRouter
}

export interface PartnerPoolConfig {
  partnerId: number
  masterchefAddress?: string
  poolId?: number
  stakingToken?: StakingToken
  earningToken?: Token
  isFinished?: boolean
  isHardCodeFinished?: boolean
  isNewPool?: boolean
  pendingFunction?: string
  tokenPerBlockFunction?: string
  startFunction?: string
  startType: StartType
  poolCategory?: PoolCategory
  referrer?: string  
  projectLink?: string
  dex?: DexSwapRouter
}

export interface LinkPartnerPoolConfig {
  partnerId: number
  projectLink?: string
  contractAddress?: string
  stakingToken?: StakingToken
  earningToken?: Token
  dex?: DexSwapRouter
  isNewPool?: boolean
}

export type Nft = {
  name: string
  description: string
  originalImage: string
  previewImage: string
  blurImage: string
  sortOrder: number
  bunnyId: number
  price: number
}


export enum VaultStatus {
  'ACTIVE' = 'ACTIVE',
  'PAUSED' = 'PAUSED',
  'STOPPED' = 'STOPPED',
}

export enum StakePlatform {
  'COUGARSWAP' = 'COUGARSWAP',
}

export interface FarmContractInfo {  
  farmContractAddress?: string
  farmPid?: number
  multiplier?: string
  totalAllocpoint?: number  
  allocPoint?: number
  depositFeeBP?: number
  tokenPerBlock?: number
  poolTokenPerBlock?: number
  totalPoolStaked?: number
  mainToken?: Token
  tokenPerBlockFunction: string,  
}


export interface VaultConfig {
  id: string
  name: string
  isAutoCgs?: boolean  
  isManualCgs?: boolean
  pid?: number
  performanceFee?: number
  compoundFrequency?: number // how many times compound per day
  compoundCron?: string
  stakingToken?: StakingToken
  stakePlatform: StakePlatform  
  strategyContract: string 
  multiplier?: string 
  status: VaultStatus
  dex?: DexSwapRouter
  depositFee?: number
  withdrawFee?: number
  isNewPool?: boolean
  isBoosted?: boolean
  projectLink?: string
  farmContractInfo: FarmContractInfo
}
