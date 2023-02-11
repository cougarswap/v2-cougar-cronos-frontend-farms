import BigNumber from 'bignumber.js'
import { FarmConfig, PartnerPoolConfig, PoolConfig, VaultConfig } from 'config/constants/types'

export type BigNumberSerialize = string

export interface Farm extends FarmConfig {
  tokenAmount?: BigNumber
  // quoteTokenAmount?: BigNumber
  lpTotalInQuoteToken?: BigNumber
  tokenPriceVsQuote?: BigNumber
  tokenPriceBusd?: string
  quoteTokenPriceBusd?: string  
  lpPriceBusd?: string
  lpTokenBalanceMC?: BigNumber
  poolWeight?: number
  depositFeeBP?: number  
  harvestInterval?:number
  lpTokenDecimals?: number
  cougarPerBlock?: number
  userData?: {
    allowance: BigNumber
    tokenBalance: BigNumber
    stakedBalance: BigNumber
    nextHarvestUntil: string
    earnings: BigNumber
  }
}


export interface VaultInterest {
  vaultApr?: number
  vaultDailyApy?: number
  vaultYearlyApy?: number
  farmApr?: number
  farmDailyApy?: number
  farmYearlyApy?: number
  tradingApr?: number
  totalApr?: number
  totalApy?: number
}

export interface Vault extends VaultConfig {
  liquidity?: BigNumber    
  stakingLpWorth?: number
  farmRewardTokenPrice?: number
  totalStaked?: BigNumberSerialize
  poolWeight?: number  
  userData?: {
    allowance: BigNumberSerialize
    tokenBalance: BigNumberSerialize
    stakedBalance: BigNumberSerialize
    earnings: BigNumberSerialize
  },
  interest?: VaultInterest
}

export interface AutoCakeVault extends Vault {
  pricePerFullShare?: string
}


export interface VaultFees {
  performanceFee: number
  callFee: number
  withdrawalFee: number
  withdrawalFeePeriod: number
}

export interface VaultUser {
  isLoading: boolean
  userShares: string
  cakeAtLastUserAction: string
  lastDepositedTime: string
  lastUserActionTime: string
  allowance: string
}

export interface CakeVault {
  totalShares?: string
  pricePerFullShare?: string
  totalCakeInVault?: string
  estimatedCakeBountyReward?: string
  totalPendingCakeHarvest?: string
  fees?: VaultFees
  userData?: VaultUser
}

export interface FeesOnReward {
  devFee?: number;
  platformFee?: number;
  buybackFee?: number;
}

export enum FETCH_STATUS {
  NOTYET = 'NOTYET',
  SUCCESS = 'SUCCESS',
  PENDING = 'PENDING',
  FAILURE = 'FAILURE',
}

export interface VaultsState {
  data: Vault[]
  cakeVault: CakeVault
  tradingFeeApr: any
  feesOnReward: FeesOnReward
  fetchVaultsStatus?: FETCH_STATUS
  fetchVaultsStrategies?: FETCH_STATUS
}


export interface Pool extends PoolConfig {
  totalStaked?: BigNumber
  startBlock?: number
  endBlock?: number
  userData?: {
    allowance: BigNumber
    stakingTokenBalance: BigNumber
    stakedBalance: BigNumber
    pendingReward: BigNumber
    nextWithdrawalUntil: BigNumber
  }
}

export interface PartnerPool extends PartnerPoolConfig {
  totalStaked?: BigNumberSerialize
  totalSupply?: BigNumberSerialize
  totalAllocPoint?: number
  poolWeight?: number
  allocPoint?: number
  startAt?: number
  tokenPerBlock?: number
  lpInToken0?: BigNumberSerialize
  lpInToken1?: BigNumberSerialize
  userData?: {
    allowance: BigNumber
    stakingTokenBalance: BigNumber
    stakedBalance: BigNumber
    pendingReward: BigNumber
    earnings: BigNumber
  }
}

export enum ViewMode {
  'TABLE' = 'TABLE',
  'CARD' = 'CARD',
}


export interface ReferralsState {
  referralsCount: number;
  referralCommission: number;
}

// Slices states

export interface FarmsState {
  data: Farm[]
  cakeVault: CakeVault
}

export interface PoolsState {
  data: Pool[]
}

export interface PartnerPoolsState {
  data: PartnerPool[]
}

export type SerializedBigNumber = string

export interface TokenPublicDataState {
  transferTaxRate: number;
  maxTransferAmountRate: number;
  tokenPerBlock: number;
  startBlock: number,
  startFarmingTimeStamp: string,
  lockupBlocks: number,
  unlockBlocks: number,
  harvestFee: number,
  canHarvest: boolean
  totalSupply?: string
}

export interface TokenPrice {
  symbol: string
  address: string
  price?: number
}

export interface PriceState {
  isLoading?: boolean
  lastUpdated?: string
  platformPrice?: number
  tokenPrice?: number
  data: TokenPrice[]
}

export interface PublicPresaleData {
  startingTimeStamp: string
  closingTimeStamp: string
  claimTimeStamp: string
  firstHarvestTimestamp: string    
  totalCakeSold: SerializedBigNumber
  totalCakeLeft: SerializedBigNumber
  usdcPerCake: number
  isSaleActive: boolean
  isClaimActive: boolean
  timePerPercent: number
  purchaseLimit: number
  totalOnSale: number  
  isWhiteListActive: boolean
  title: string
  condition?: string
  BuyTokenPerCGS: number
}

export interface UserPresaleData {
  cakeUnclaimed: SerializedBigNumber
  userAllowance: SerializedBigNumber 
  cakeLastClaimed: number
  eligibleToBuy: boolean
}

export interface PublicPresaleMigrateData {
  startingTimeStamp: string
  closingTimeStamp: string
  claimTimeStamp: string
  firstHarvestTimestamp: string    
  totalCakeSold: SerializedBigNumber
  totalCakeLeft: SerializedBigNumber
  usdcPerCake: number
  isSaleActive: boolean
  isClaimActive: boolean
  timePerPercent: number
  purchaseLimit: number
  totalOnSale: number  
  isWhiteListActive: boolean
  title: string
  condition?: string
  BuyTokenPerCGS: number
}

export interface UserPresaleMigrateData {
  cakeUnclaimed: SerializedBigNumber
  userAllowance: SerializedBigNumber 
  cakeLastClaimed: number
  eligibleToBuy: boolean
}

// Presale
export enum PresaleOption {
  OPTION_1 = 'Option 1',
  OPTION_2 = 'Option 2',
  OPTION_3 = 'Option 3',
  OPTION_4 = 'Option 4',
}

export interface PresaleState {
  options: PresaleOptionData[]
  userTokenData: UserTokenData
}

export interface PresaleMigrateState {
  options: PresaleMigrateOptionData[]
  userTokenData: UserTokenMigrateData
}

export interface UserTokenData {
  usdcBalance: SerializedBigNumber
  cakeBalance: SerializedBigNumber
}

export interface PresaleOptionData {
  option: PresaleOption
  userData: UserPresaleData
  publicData: PublicPresaleData
}

export interface UserTokenMigrateData {
  usdcBalance: SerializedBigNumber
  cakeBalance: SerializedBigNumber
}

export interface PresaleMigrateOptionData {
  option: PresaleOption
  userData: UserPresaleMigrateData
  publicData: PublicPresaleMigrateData
}

// Block

export interface BlockState {
  currentBlock: number
  initialBlock: number
}


// Global state

export interface State {
  farms: FarmsState
  pools: PoolsState
  vaults: VaultsState
  partnerPools: PartnerPoolsState
  referrals: ReferralsState
  tokenPublicData: TokenPublicDataState
  presale: PresaleState  
  presaleMigrate: PresaleMigrateState
  block: BlockState
  prices: PriceState
}
