/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import { getPresaleAddress } from 'utils/addressHelpers'
import { PresaleOption, PresaleState } from '../types'
import fetchPublicPresaleData from './fetchPresaleType2'
import { fetchUserPresaleAllowances, fetchUserTokensUnclaimed, fetchUserPresaleBalance, fetchUserLastClaimed, fetchUserInWhiteList } from './fetchUserPresale'


const initialState: PresaleState = { 
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
          startingTimeStamp: '1646488800',
          closingTimeStamp: '1646517600',
          claimTimeStamp: '1646838000',
          firstHarvestTimestamp: '', 
          totalCakeSold: '',
          totalCakeLeft: '',
          usdcPerCake: 0.01,
          isSaleActive: false,
          isClaimActive: false,
          timePerPercent: 600,
          purchaseLimit: 0,
          totalOnSale: 15000000,
          isWhiteListActive: false,
          title: 'PRESALE INFORMATION',
          BuyTokenPerCGS: 0
        }
      },     
    ],
    userTokenData: {
      usdcBalance: null,
      cakeBalance: null,
    }
}


export const PresaleSlice = createSlice({
  name: 'Presale',
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
    setPresalePublicData: (state, action) => {
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
  setPresalePublicData
} = PresaleSlice.actions

// Thunks
export const fetchUserPresaleAllowanceDataAsync = (account, option) => async (dispatch) => {
  const data = await fetchUserPresaleAllowances(account, option)

  dispatch(setUserPresaleAllowance({option, userAllowance: data}))
}

export const fetchUserBalanceDataAsync = (account) => async (dispatch) => {
  const data = await fetchUserPresaleBalance(account)
  dispatch(setUserBusdBalance({usdcBalance: data[0]}))
  dispatch(setUserCakeBalance({cakeBalance: data[1]}))
}

export const fetchUserTokensUnclaimedDataAsync = (account, option) => async (dispatch) => {
  const data = await fetchUserTokensUnclaimed(account, option)
  dispatch(setUserCakeUnclaimedData({option, cakeUnclaimed: data}))
}

export const fetchUserLastClaimedDataAsync = (account, option) => async (dispatch) => {
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

export const fetchPresalePublicDataAsync = (option: PresaleOption) => async(dispatch) => {
  const presaleAddress = getPresaleAddress(option)
  const presalePublicData = await fetchPublicPresaleData(presaleAddress);
  
  dispatch(setPresalePublicData({option, publicData: presalePublicData}))    
}

export default PresaleSlice.reducer
