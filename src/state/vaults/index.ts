import { CakeVault, FETCH_STATUS, Vault, VaultFees, VaultsState, VaultUser } from "state/types";
import vaultsConfig from 'config/constants/vaults'
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import fetchVaults from "./fetchVaults";
import { fetchVaultUserAllowances, fetchVaultUserEarnings, fetchVaultUserStakedBalances, fetchVaultUserTokenBalances } from "./fetchVaultsUser";
import fetchVaultStrategies from "./fetchVaultStrategies";
import fetchTradingFeeApr from "./fetchTradingFeeAprs";
import fetchVaultFeesData from "./fetchVaultFees";
import { fetchPublicVaultData, fetchVaultFees } from "./fetchCakeVaultPublic";
import fetchVaultUser from "./fetchCakeVaultUser";

export const initialPoolVaultState = Object.freeze({
  totalShares: null,
  pricePerFullShare: null,
  totalCakeInVault: null,
  estimatedCakeBountyReward: null,
  totalPendingCakeHarvest: null,
  fees: {
    performanceFee: null,
    callFee: null,
    withdrawalFee: null,
    withdrawalFeePeriod: null,
  },
  userData: {
    isLoading: true,
    userShares: null,
    cakeAtLastUserAction: null,
    lastDepositedTime: null,
    lastUserActionTime: null,
    allowance: null,
    credit: null,
  },
  creditStartBlock: null,
})

const initialState: VaultsState = { 
  data: [...vaultsConfig], 
  cakeVault: initialPoolVaultState,
  tradingFeeApr: {}, 
  feesOnReward: {}
}

export const fetchCakeVaultPublicData = createAsyncThunk<CakeVault>('cakeVault/fetchPublicData', async () => {
  const publicVaultInfo = await fetchPublicVaultData()
  return publicVaultInfo
})

export const fetchCakeVaultFees = createAsyncThunk<VaultFees>('cakeVault/fetchFees', async () => {
  const vaultFees = await fetchVaultFees()
  return vaultFees
})

export const fetchCakeVaultUserData = createAsyncThunk<VaultUser, { account: string }>(
  'cakeVault/fetchUser',
  async ({ account }) => {
    const userData = await fetchVaultUser(account)
    return userData
  },
)


export const vaultsSlice = createSlice({
    name: 'Vaults',
    initialState,
    reducers: {
        setVaultsPublicData: (state, action) => {
            const liveFarmsData: Vault[] = action.payload
            state.data = state.data.map((farm) => {
              const liveFarmData = liveFarmsData.find((f) => f.pid === farm.pid)              
              return { ...farm, ...liveFarmData }
            })
            state.fetchVaultsStatus = FETCH_STATUS.SUCCESS
        },
        setVaultUserData: (state, action) => {
            const { arrayOfUserDataObjects } = action.payload
            arrayOfUserDataObjects.forEach((userDataEl) => {
                const { index } = userDataEl
                state.data[index] = { ...state.data[index], userData: userDataEl }
            })
        },
        setTradingFeeAprData: (state, action) => {
          const tradingFeeApr = action.payload
          state.tradingFeeApr = tradingFeeApr
        },
        setFeesOnRewardData: (state, action) => {
          const feesOnReward = action.payload
          state.feesOnReward = feesOnReward
      },
    },
    extraReducers: (builder) => {
      // Vault public data that updates frequently
      builder.addCase(fetchCakeVaultPublicData.fulfilled, (state, action: PayloadAction<CakeVault>) => {
        state.cakeVault = { ...state.cakeVault, ...action.payload }
      })
      // Vault fees
      builder.addCase(fetchCakeVaultFees.fulfilled, (state, action: PayloadAction<VaultFees>) => {
        const fees = action.payload
        state.cakeVault = { ...state.cakeVault, fees }
      })
      // Vault user data
      builder.addCase(fetchCakeVaultUserData.fulfilled, (state, action: PayloadAction<VaultUser>) => {
        const userData = action.payload
        userData.isLoading = false
        state.cakeVault = { ...state.cakeVault, userData }
      })     
    },
})

// Actions
export const { setVaultsPublicData, setVaultUserData, setTradingFeeAprData, setFeesOnRewardData } = vaultsSlice.actions

// Thunks
export const fetchVaultsPublicDataAsync = () => async (dispatch) => {
    const farms = await fetchVaults()    
    const vaultWithStrategies = await fetchVaultStrategies(farms)
    // const fetchCakeAutoVault = await fetchCakeAutoVaults()
    dispatch(setVaultsPublicData([...vaultWithStrategies]))
}

export const fetchTradingFeeAprAsync = () => async (dispatch) => {
  const tradingFees = await fetchTradingFeeApr()      
  dispatch(setTradingFeeAprData(tradingFees))
}

export const fetchVaultsUserDataAsync = (account) => async (dispatch) => {
  const userFarmAllowances = await fetchVaultUserAllowances(account)
  const userFarmTokenBalances = await fetchVaultUserTokenBalances(account)
  const userStakedBalances = await fetchVaultUserStakedBalances(account)
  const userFarmEarnings = await fetchVaultUserEarnings(account)

  const arrayOfUserDataObjects = userFarmAllowances.map((farmAllowance, index) => {
    return {
      index,
      allowance: userFarmAllowances[index],
      tokenBalance: userFarmTokenBalances[index],
      stakedBalance: userStakedBalances[index].stakedBalance,
      earnings: userFarmEarnings[index],
    }
  })

  dispatch(setVaultUserData({ arrayOfUserDataObjects }))
}

export const fetchFeesOnRewardAsync = () => async (dispatch) => {
  const feesOnReward = await fetchVaultFeesData()      
  dispatch(setFeesOnRewardData(feesOnReward))
}

export default vaultsSlice.reducer