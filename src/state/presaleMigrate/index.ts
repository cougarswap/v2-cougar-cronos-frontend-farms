/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import { getPresaleMigrateAddress } from 'utils/addressHelpers'
import { PresaleOption, PresaleMigrateState } from '../types'
import fetchPublicPresaleMigrateData from './fetchPresaleMigrate'
import { fetchUserPresaleMigrateAllowances, fetchUserTokensUnclaimed, fetchUserPresaleMigrateBalance, fetchUserLastClaimed, fetchUserInWhiteList } from './fetchUserPresaleMigrate'


const initialState: PresaleMigrateState = {   
    options: [
      {
        option: PresaleOption.OPTION_1,
        userData: { 
          cakeUnclaimed: null,
          userAllowance: null,          
          cakeLastClaimed: null,
          eligibleToBuy: false
        },    
        publicData: {
          startingTimeStamp: '1653055200',
          closingTimeStamp: '1652624243',
          claimTimeStamp: '1653917054',
          firstHarvestTimestamp: '', 
          totalCakeSold: '',
          totalCakeLeft: '',
          usdcPerCake: 1,
          isSaleActive: false,
          isClaimActive: false,
          timePerPercent: 600,
          purchaseLimit: 0,
          totalOnSale: 0,
          isWhiteListActive: false,
          title: 'Presale Migrate Information',
          BuyTokenPerCGS: 0
        }
      },     
    ],
    userTokenData: {
      usdcBalance: null,
      cakeBalance: null,
    }
}


export const PresaleMigrateSlice = createSlice({
  name: 'PresaleMigrate',
  initialState,
  reducers: {        
    setUserCakeUnclaimedData: (state, action) => {
      const option = state.options.find(_ => _.option === action.payload.option)
      const optionIdx = state.options.findIndex(_ => _.option === action.payload.option)
      option.userData = {
        ...option.userData,
        cakeUnclaimed: action.payload.cakeUnclaimed,
      }
      state.options[optionIdx] = option
    },    
    setUserPresaleAllowance: (state, action) => {
      const option = state.options.find(_ => _.option === action.payload.option)
      const optionIdx = state.options.findIndex(_ => _.option === action.payload.option)
      option.userData = {
        ...option.userData,
        userAllowance: action.payload.userAllowance,
      }  
      state.options[optionIdx] = option    
    },
    setUserBusdBalance: (state, action) => {      
      state.userTokenData.usdcBalance = action.payload.usdcBalance
    },
    setUserCakeBalance: (state, action) => {  
        
      console.log("aaaaaaaaaaaaaa ok121");   
      state.userTokenData.cakeBalance = action.payload.cakeBalance
    },    
    setUserEligileToBuy: (state, action) => {
      const option = state.options.find(_ => _.option === action.payload.option)
      const optionIdx = state.options.findIndex(_ => _.option === action.payload.option)
      option.userData = {
        ...option.userData,
        eligibleToBuy: action.payload.eligibleToBuy,
      }  
       
      state.options[optionIdx] = option   
    },
    setUserCakeLastClaimed: (state, action) => {      
      const option = state.options.find(_ => _.option === action.payload.option)
      const optionIdx = state.options.findIndex(_ => _.option === action.payload.option)
      option.userData = {
        ...option.userData,
        cakeLastClaimed: action.payload.cakeLastClaimed,
      }  
      state.options[optionIdx] = option    
    },
    setPresaleMigratePublicData: (state, action) => {
      const option = state.options.find(_ => _.option === action.payload.option)
      const optionIdx = state.options.findIndex(_ => _.option === action.payload.option)      
      option.publicData = {...option.publicData, ...action.payload.publicData }
      state.options[optionIdx] = option  
    }
  }
})

// Actions
export const { 
  setUserPresaleAllowance, 
  setUserCakeUnclaimedData, 
  setUserBusdBalance, 
  setUserCakeBalance, 
  setUserCakeLastClaimed,
  setUserEligileToBuy,
  setPresaleMigratePublicData
} = PresaleMigrateSlice.actions

// Thunks
export const fetchUserPresaleMigrateAllowanceDataAsync = (account, option) => async (dispatch) => {
  const data = await fetchUserPresaleMigrateAllowances(account)

  dispatch(setUserPresaleAllowance({option, userAllowance: data}))
}

export const fetchUserMigrateBalanceDataAsync = (account) => async (dispatch) => {
  const data = await fetchUserPresaleMigrateBalance(account)
  dispatch(setUserBusdBalance({usdcBalance: data[0]}))
  dispatch(setUserCakeBalance({cakeBalance: data[1]}))
}

export const fetchUserTokensMigrateUnclaimedDataAsync = (account, option) => async (dispatch) => {
  const data = await fetchUserTokensUnclaimed(account, option)
  dispatch(setUserCakeUnclaimedData({option, cakeUnclaimed: data}))
}

export const fetchUserMigrateLastClaimedDataAsync = (account, option) => async (dispatch) => {
  const data = await fetchUserLastClaimed(account, option)

  dispatch(setUserCakeLastClaimed({option, cakeLastClaimed: data}))
}

export const fetchUserInWhiteListAsync = (account, option, isWhiteListActive) => async(dispatch) => {
  let eligibleToBuy = true

  if (isWhiteListActive) {
    const data = await fetchUserInWhiteList(account, option)
    eligibleToBuy = data === 'true'
  }

  dispatch(setUserEligileToBuy({option, eligibleToBuy}))
}

export const fetchPresaleMigratePublicDataAsync = (option: PresaleOption) => async(dispatch) => {
  const presaleMigrateAddress = getPresaleMigrateAddress()
  const presaleMigratePublicData = await fetchPublicPresaleMigrateData(presaleMigrateAddress);
  
  dispatch(setPresaleMigratePublicData({option, publicData: presaleMigratePublicData}))    
}

export default PresaleMigrateSlice.reducer
