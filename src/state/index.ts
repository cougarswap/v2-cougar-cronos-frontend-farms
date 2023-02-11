import { configureStore } from '@reduxjs/toolkit'
import farmsReducer from './farms'
import poolsReducer from './pools'
import vaultsReducer from './vaults'
import partnerPoolsReducer from './partnerPools'
import referralsReducer from './referrals'
import tokenPublicDataReducer from './tokenPublicData'
import presaleReducer from './presale'
import blockReducer from './block'
import pricesReducer from './prices'

export default configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    farms: farmsReducer,
    pools: poolsReducer,
    vaults: vaultsReducer,
    partnerPools: partnerPoolsReducer,
    referrals: referralsReducer,
    tokenPublicData: tokenPublicDataReducer,
    presale: presaleReducer,
    block: blockReducer,
    prices: pricesReducer
  },
})
