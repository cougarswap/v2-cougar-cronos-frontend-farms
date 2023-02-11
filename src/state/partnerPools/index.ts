/* eslint-disable no-param-reassign */
import { PartnerPool, PartnerPoolsState } from "state/types";
import partnerPoolsConfig from 'config/constants/partnerPools'
import { createSlice } from "@reduxjs/toolkit";
import fetchPartnerPools from "./fetchPartnerPool";
import { fetchPartnerPoolUserAllowances, fetchPartnerPoolUserEarnings, fetchPartnerPoolUserStakedBalances, fetchPartnerPoolUserTokenBalances } from "./fetchPartnerPoolUser";

const initialState: PartnerPoolsState = { data: [...partnerPoolsConfig]}

export const partnerPoolsSlice = createSlice({
    name: 'partnerPools',
    initialState,
    reducers: {
        setPartnerPoolsPublicData: (state, action) => {
            const livePartnerPoolsData: PartnerPool[] = action.payload
            state.data = state.data.map((pool) => {
                const partnerPoolData = livePartnerPoolsData.find((f) => f.partnerId === pool.partnerId)
                return { ...pool, ...partnerPoolData }
            })
        },
        setPartnerPoolsUserData: (state, action) => {
            const { userData } = action.payload
            userData.forEach((userDataEl, index) => {
              state.data[index] = { ...state.data[index], userData: userDataEl }
            })
          },
    }
})


// Actions
export const { setPartnerPoolsPublicData, setPartnerPoolsUserData } = partnerPoolsSlice.actions


export const fetchPartnerPoolsPublicDataAsync = () => async (dispatch) => {
    const partnerPools = await fetchPartnerPools()
    dispatch(setPartnerPoolsPublicData(partnerPools))
  }

  export const fetchPartnerPoolsUserDataAsync = (account) => async (dispatch) => {
    const allowances = await fetchPartnerPoolUserAllowances(account)
    const stakingTokenBalances = await fetchPartnerPoolUserTokenBalances(account)
    const stakedBalances = await fetchPartnerPoolUserStakedBalances(account)
    const pendingRewards = await fetchPartnerPoolUserEarnings(account)
  
    const userData = partnerPoolsConfig.map((pool, index) => ({
        allowance: allowances[index],
        stakingTokenBalance: stakingTokenBalances[index],
        stakedBalance: stakedBalances[index],
        pendingReward: pendingRewards[index],
    }))
  
    dispatch(setPartnerPoolsUserData({userData}))
  }
 
export default partnerPoolsSlice.reducer
