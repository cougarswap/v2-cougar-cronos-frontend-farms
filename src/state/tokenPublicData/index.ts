import { createSlice } from "@reduxjs/toolkit";
import { TokenPublicDataState } from "state/types";
import fetchTokenPublicData, { fetchMasterChefPublicData } from "./fetchTokenPublicData";

const initialState: TokenPublicDataState = {
    transferTaxRate: 0,
    maxTransferAmountRate: 0,
    tokenPerBlock: 0, 
    startBlock: 0,
    startFarmingTimeStamp: '1633446000',
    lockupBlocks: 0,
    unlockBlocks: 0,
    harvestFee: 0,
    canHarvest: false,
    totalSupply: ''
}

export const tokenPublicDataSlice = createSlice({
    name: 'TokenPublicData',
    initialState,
    reducers: {
        setTokenPublicData: (state, action) => {            
            const publicData = action.payload
            return {...state, ...publicData }
        },
        setMasterCheftPublicData: (state, action) => {
            const publicData = action.payload
            return {...state, ...publicData }
        },
        setMasterChefCanHarvest: (state, action) => {
            const canHarvest = action.payload
            return {...state, canHarvest}
        }
    }
})

// Actions
export const { setTokenPublicData, setMasterCheftPublicData, setMasterChefCanHarvest } = tokenPublicDataSlice.actions


// Thunk 
export const fetchTokenPublicDataAsync = () => async (dispatch) => {
    const publicData = await fetchTokenPublicData()
  
    dispatch(setTokenPublicData(publicData))
}

export const fetchMasterChefPublicDataAsync = () => async (dispatch) => {
    const publicData = await fetchMasterChefPublicData()
    
    dispatch(setMasterCheftPublicData(publicData))
}

export default tokenPublicDataSlice.reducer