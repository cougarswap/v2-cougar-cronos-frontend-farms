import { createSlice } from "@reduxjs/toolkit"
import BigNumber from "bignumber.js"
import { ReferralsState } from "state/types"
import {fetchReferralsUserCount, fetchReferralUserCommission}  from "./fetchReferralsUser"

const initialState : ReferralsState = {
    referralsCount: 0,
    referralCommission: 0
}

export const ReferralsSlice = createSlice({
    name: 'Referrals',
    initialState, 
    reducers: {
        setReferralsCountUserData: (state, action) => {
            const {referralsCount} = action.payload
            return {...state, referralsCount}
        },
        setReferralCommissionUserData: (state, action) => {
            const {referralCommission} = action.payload
            return {...state, referralCommission}
        },
    }
})

// Actions
export const { setReferralsCountUserData, setReferralCommissionUserData} = ReferralsSlice.actions;

// Thunks
export const fetchReferralsCountUserDataAsync = (account) => async(dispatch) => {
    const referralsCount = await fetchReferralsUserCount(account)    
    dispatch(setReferralsCountUserData({ referralsCount }))
}

// Thunks
export const fetchReferralCommissionUserDataAsync = (account) => async(dispatch) => {
    const referralCommission = await fetchReferralUserCommission(account)       
    dispatch(setReferralCommissionUserData({ referralCommission }))
}

export default ReferralsSlice.reducer;