import BigNumber from 'bignumber.js'
import { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import useRefresh from 'hooks/useRefresh'
import { autoVaultConfig } from 'config/constants/vaults'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceAmount } from 'utils/formatBalance'
import { useWeb3React } from '@web3-react/core'
import lpTokens from 'config/constants/lp-tokens'
import { fetchFarmsPublicDataAsync, 
  fetchPoolsPublicDataAsync, 
  fetchPoolsUserDataAsync,
  fetchTokenPublicDataAsync,
  fetchReferralsCountUserDataAsync,
  fetchReferralCommissionUserDataAsync } from './actions'
import { State, Farm, Pool, PartnerPool, CakeVault, Vault, AutoCakeVault } from './types'
import { QuoteToken } from '../config/constants/types'
import lpToken from '../config/constants/lp-tokens'
import { fetchMasterChefPublicDataAsync } from './tokenPublicData'
import { useBlock, useInitialBlock } from './block/hooks'
import { fetchPartnerPoolsPublicDataAsync } from './partnerPools'
import { useTokenPublicData } from './tokenPublicData/hooks'
import { fetchOtherTokensPricesAsync, fetchPlatformPriceAsync, fetchTokenPriceAsync } from './prices'
import { fetchCakeVaultFees, fetchCakeVaultPublicData, fetchCakeVaultUserData } from './vaults'
import { convertSharesToCake, getCakeVaultEarnings } from './vaults/helpers'

const ZERO = new BigNumber(0)

export const useFetchPublicData = () => {
  const dispatch = useDispatch()
  const { slowRefresh } = useRefresh()
  
  useEffect(() => {
    dispatch(fetchPlatformPriceAsync())
    dispatch(fetchTokenPriceAsync())
    dispatch(fetchOtherTokensPricesAsync())
    dispatch(fetchTokenPublicDataAsync())
    dispatch(fetchMasterChefPublicDataAsync())
    dispatch(fetchFarmsPublicDataAsync())
    dispatch(fetchPoolsPublicDataAsync())
    // dispatch(fetchPartnerPoolsPublicDataAsync())
  }, [dispatch, slowRefresh])
}

// Farms

export const useFarms = (): Farm[] => {
  const farms = useSelector((state: State) => state.farms.data)
  return farms
}

export const useCakeVault = (): CakeVault => {
  const cakeVault = useSelector((state: State) => state.vaults.cakeVault)
  return cakeVault
}

export const usePoolsData = (): Pool[] => {
  const pools = useSelector((state: State) => state.pools.data)
  return pools
}

export const usePartnerPoolsData = () : PartnerPool[] => {
  const partnerPools = useSelector((state: State) => state.partnerPools.data)
  return partnerPools
}

export const useTransferTaxRate = (): number => {
  const transferTaxRate = useSelector((state: State) => state.tokenPublicData.transferTaxRate)
  return transferTaxRate
}

export const useMaxTransferAmountRate = (): number => {
  const maxTransferAmountRate = useSelector((state: State) => state.tokenPublicData.maxTransferAmountRate)
  return maxTransferAmountRate
}


export const useFarmFromPid = (pid): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.pid === pid))
  return farm
}

export const useFarmFromSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.lpSymbol === lpSymbol))
  return farm
}

export const useFarmUser = (pid) => {
  const farm = useFarmFromPid(pid)

  return {
    allowance: farm.userData ? new BigNumber(farm.userData.allowance) : new BigNumber(0),
    tokenBalance: farm.userData ? new BigNumber(farm.userData.tokenBalance) : new BigNumber(0),
    stakedBalance: farm.userData ? new BigNumber(farm.userData.stakedBalance) : new BigNumber(0),
    nextHarvestUntil: farm.userData ? farm.userData.nextHarvestUntil : '0',
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : new BigNumber(0),
  }
}


export const useRemainingBlockToFarming = () => {
  const { startBlock } = useTokenPublicData();    
  const { initialBlock } = useBlock();    

  const [remainingBlockToFarming, setRemainingBlockToFarming] = useState(0)    

  useEffect(() => {
    if (initialBlock && startBlock && initialBlock < startBlock) {
      setRemainingBlockToFarming(startBlock - initialBlock)
    }
    else {
      setRemainingBlockToFarming(0)
    }
  }, [initialBlock, startBlock])

  return remainingBlockToFarming
}



// Pools

export const usePools = (account): Pool[] => {
  const { slowRefresh } = useRefresh()
  const dispatch = useDispatch()
  useEffect(() => {
    if (account) {
      dispatch(fetchPoolsUserDataAsync(account))
    }
  }, [account, dispatch, slowRefresh])

  const pools = useSelector((state: State) => state.pools.data)
  return pools
}

export const usePoolFromPid = (sousId): Pool => {
  const pool = useSelector((state: State) => state.pools.data.find((p) => p.sousId === sousId))
  return pool
}

export const useRemainingBlockToCbankPoolFarming = (poolId: number) => {
    const initialBlock = useInitialBlock()

    const usdcPool = usePoolFromPid(poolId)
    const { startBlock } = usdcPool
    const [remainingBlockToCBankPoolFarming, setRemainingBlockToCBankPoolFarming] = useState(0)
        
    // console.log("aaainitialBlock", initialBlock);
    // console.log("aaastartBlock", startBlock);
    
    useEffect(() => {
        if (initialBlock && startBlock && initialBlock < startBlock) {
          setRemainingBlockToCBankPoolFarming(startBlock - initialBlock)
        }
        else {
          setRemainingBlockToCBankPoolFarming(0)
        }
    }, [initialBlock, startBlock])   

  return remainingBlockToCBankPoolFarming
}

// Referrals

export const useReferrals = (account): any => {
  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()
  useEffect(() => {
    if (account) {
      dispatch(fetchReferralsCountUserDataAsync(account))
      dispatch(fetchReferralCommissionUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const referralsCount = useSelector((state: State) => state.referrals.referralsCount)
  const referralCommission = useSelector((state: State) => state.referrals.referralCommission)
  return {referralsCount, referralCommission}
}

// Prices

export const usePriceBnbBusd = (): BigNumber => {
  const {pid} = lpToken.pairs.cgsUsdc // BUSD-BNB LP anhpvfake croUsdc-cgsUsdc
  const farm = useFarmFromPid(pid)
  // return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : ZERO
  return new BigNumber(1) // anhpv
}

// export const usePriceCgsMatic = (): BigNumber => {
//   const {pid} = lpToken.pairs.croWbtc 
//   const farm = useFarmFromPid(pid)
  
//   return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : ZERO

// }

// export const usePriceBnbBusd = (): BigNumber => {
//   const {pid} = lpToken.pairs.bnbBusdBeam // BUSD-BNB LP
//   const farm = useFarmFromPid(pid)
//   return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : ZERO
// }

// export const usePriceWbtcBnb = (): BigNumber => {
//   const {pid} = lpToken.single.wbtc
//   const farm = useFarmFromPid(pid)
//   return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : ZERO
// }



export const usePriceCakeBusd = (): BigNumber => {
  // const pid = 1 // CAKE-BNB LP
  // const bnbPriceUSD = usePriceGlmrBusd()
  // const farm = useFarmFromPid(pid)
  // return farm.tokenPriceVsQuote ? bnbPriceUSD.times(farm.tokenPriceVsQuote) : ZERO
  const {pid} = lpToken.pairs.cgsUsdc; // EGG-BUSD LP
  const farm = useFarmFromPid(pid);
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : ZERO;
  // return new BigNumber(1) // anhpv
}

export const usePrices = () => {
  const nativePrices = useSelector((state: State) => state.prices.data);
  return nativePrices;
};

export const useTotalValue = (): BigNumber => {
  const farms = useFarms();
  const bnbPrice = usePriceBnbBusd();
  // const btcPriceToBnb = usePriceWbtcBnb();  
  // const cgsMaticPriceToBnb = usePriceCgsMatic();
  const cakePrice = usePriceCakeBusd();
  let value = new BigNumber(0);

  for (let i = 0; i < farms.length; i++) {
    const farm = farms[i]
    if (farm.lpTotalInQuoteToken) {
      let val;     
      
      if (typeof(farm.lpTotalInQuoteToken) === 'string'
        && farm.lpTotalInQuoteToken as any === 'NaN')  {
          val = new BigNumber(0);
      }
      else 
        if (farm.quoteTokenSymbol === QuoteToken.CRO) {
          val = (bnbPrice.times(farm.lpTotalInQuoteToken));
        } else 
        if (farm.quoteTokenSymbol === QuoteToken.CGS) {
          val = (cakePrice.times(farm.lpTotalInQuoteToken));
        } 
        // else if (farm.quoteTokenSymbol === QuoteToken.MATIC) {
        //   val = (cgsMaticPriceToBnb.times(cgsMaticPriceToBnb).times(farm.lpTotalInQuoteToken));
        // } 
        else if (farm.lpTotalInQuoteToken) {        
          val = (farm.lpTotalInQuoteToken);                
        } else {
          val = new BigNumber(0);
        }  

      value = value.plus(val);

    }    
  }

  return value;
}


export const useCBankTotalValue = (): BigNumber => {
  const pools = usePoolsData();  
  const cakePrice = usePriceCakeBusd();
  let value = new BigNumber(0);

  for (let i = 0; i < pools.length; i++) {
    let val = new BigNumber(0); 
    const pool = pools[i]
    if (pool.stakingTokenName === 'CGS' && pool.totalStaked) {
      val = getBalanceAmount(pool.totalStaked)
      value = value.plus(val.times(cakePrice));
    }    
  }

  return value;
}

export const useCgsPartnerPoolsTvl = (): BigNumber => {
  const partnerPools = usePartnerPoolsData()
  const cakePrice = usePriceCakeBusd()

  let value = new BigNumber(0)

  for (let i = 0; i < partnerPools.length; i++) {
    let tvl = new BigNumber(0); 
    const farm = partnerPools[i]

    if (farm.stakingToken.isTokenOnly){
      tvl = getBalanceAmount(new BigNumber(farm.totalStaked), farm.stakingToken.token.decimals).times(cakePrice)
    }
    else {
        // TODO: make sure token 1 is cgs
        const lpStakedRatio = farm.totalStaked && farm.totalSupply ? 
            new BigNumber(farm.totalStaked).dividedBy(new BigNumber(farm.totalSupply)) : BIG_ZERO
        const lpLiquidity = farm.lpInToken1 && cakePrice ? getBalanceAmount(new BigNumber(farm.lpInToken1)).times(cakePrice).multipliedBy(2) : BIG_ZERO
        tvl = lpLiquidity.times(lpStakedRatio)
    }

    if(tvl.comparedTo(0) > 0){
      value = value.plus(tvl)
    }
  }

  return value
}

// vaults


export const useVaults = (): Vault[] => {
  const vaults = useSelector((state: State) => state.vaults.data)
  return vaults
}

export const useVaultsTradingFeeApr = (): any => {
  const tradingFeeApr = useSelector((state: State) => state.vaults.tradingFeeApr)
  return tradingFeeApr
}


export const useVaultFromPid = (pid): Vault => {
  const vault = useSelector((state: State) => state.vaults.data.find((f) => f.pid === pid))
  const autoCakeVault = useAutoCakeVault()

  if (pid === -1) return autoCakeVault
  return vault
}


export const useVaultUser = (pid) => {
  const farm = useVaultFromPid(pid)

  return {
    allowance: farm.userData ? new BigNumber(farm.userData.allowance) : new BigNumber(0),
    tokenBalance: farm.userData ? new BigNumber(farm.userData.tokenBalance) : new BigNumber(0),
    stakedBalance: farm.userData ? new BigNumber(farm.userData.stakedBalance) : new BigNumber(0),
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : new BigNumber(0),
  }
}


export const useFetchCakeVault = () => {
  const { account } = useWeb3React()
  const { slowRefresh } = useRefresh()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCakeVaultPublicData())
  }, [dispatch, slowRefresh])

  useEffect(() => {
    dispatch(fetchCakeVaultUserData({ account }))
  }, [dispatch, slowRefresh, account])

  useEffect(() => {
    dispatch(fetchCakeVaultFees())
  }, [dispatch])
}

export const useAutoCakeVault = (): AutoCakeVault => {
  const vault = useSelector((state: State) => state.vaults.cakeVault)
  const cgsvManualPool = useSelector((state: State) => state.farms.data.find(_ => _.pid === lpTokens.single.cgs.pid ))
  const vaultData : AutoCakeVault = {...autoVaultConfig}

  const userSharesAsBigNumber = vault.userData.userShares ? new BigNumber(vault.userData.userShares) : BIG_ZERO
  const sharePriceAsBigNumber = vault.pricePerFullShare ? new BigNumber(vault.pricePerFullShare) : BIG_ZERO
  const userShare = convertSharesToCake(userSharesAsBigNumber, sharePriceAsBigNumber)

  const cakeAtLastUserActionAsBigNumber = vault.userData.cakeAtLastUserAction ? new BigNumber(vault.userData.cakeAtLastUserAction) : BIG_ZERO

  const autoCakeEarning = getCakeVaultEarnings(
    cakeAtLastUserActionAsBigNumber,
    userSharesAsBigNumber,
    sharePriceAsBigNumber,
  )

  return {
    ...vaultData,
    totalStaked: vault.totalCakeInVault,
    poolWeight: cgsvManualPool.poolWeight,
    multiplier: cgsvManualPool.multiplier,
    performanceFee: vault.fees.performanceFee,
    withdrawFee: vault.fees.withdrawalFee,
    pricePerFullShare: vault.pricePerFullShare,
    userData: {
      allowance: vault.userData?.allowance,
      tokenBalance: cgsvManualPool.userData?.tokenBalance.toString() ?? '0',
      stakedBalance: userShare.cakeAsBigNumber.toJSON(),
      earnings: autoCakeEarning.toJSON(),
    }    
  }
}

export const useCombinedVaults = () => {
  const vaults = useVaults()
  const autoCakeVault = useAutoCakeVault()
  return [autoCakeVault, ...vaults]
}

export const useAutoCakePricePerFullShare = (): string => {
  const pricePerFullShare = useSelector((state: State) => state.vaults.cakeVault.pricePerFullShare)
  return pricePerFullShare
}

export const useAutoCakeWithdrawFeeDuration = (): number => {
  const withdrawalFeePeriod = useSelector((state: State) => state.vaults.cakeVault.fees.withdrawalFeePeriod)
  return withdrawalFeePeriod
}

export const useCgsPoolLiquidity = () => {
  const cgsManualPool = useFarmFromPid(lpTokens.single.cgs.pid)

  let totalValue = new BigNumber(cgsManualPool.lpTotalInQuoteToken || 0);

  if (totalValue.isNaN()) {
    totalValue = BIG_ZERO
  }

  // because this pool has USDC as quote token, so we don't do any extra calculations.

  return totalValue
}