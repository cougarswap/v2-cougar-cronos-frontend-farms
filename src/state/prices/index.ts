import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PriceState } from "state/types";
import { fetchPlatformUsdPrice, fetchTokenUsdPrice, fetchCgsMaticPrice } from "./fetchPrice";

const initialState: PriceState = {
    isLoading: false,
    lastUpdated: null,
    platformPrice: 0,
    tokenPrice: 0,
    data: [],
};

// Thunks
export const fetchPlatformPriceAsync = createAsyncThunk<any>('prices/fetchPlatformPrice', async () => {
  const _platPrice = await fetchPlatformUsdPrice();
  const wftmPrice = _platPrice.find(p => p.symbol === 'WMATIC').price
  
  return wftmPrice
})

export const fetchTokenPriceAsync = createAsyncThunk<any>('prices/fetchTokenPrice', async () => {
  const _platPrice = await fetchTokenUsdPrice();
  const wftmPrice = _platPrice.find(p => p.symbol === 'CGS').price
  
  return wftmPrice
})


export const fetchOtherTokensPricesAsync = createAsyncThunk<any>('prices/fetchOtherTokensPrices', async () => {
  const _platPrice = await fetchPlatformUsdPrice();
  const wftmPrice = _platPrice.find(p => p.symbol === 'WMATIC').price

  const promises = [
    await fetchCgsMaticPrice(wftmPrice)  
  ]

  const dataPrices = await Promise.all(promises)

  const updatePrices = dataPrices.reduce((prices, data) => {
    if (prices.findIndex(p => p.address.toLowerCase() === data[0].address.toLowerCase()) === -1) {
      prices.push(data[0])
    }

    if (prices.findIndex(p => p.address.toLowerCase() === data[1].address.toLowerCase()) === -1) {
      prices.push(data[1])
    }

    return [...prices]    
  }, _platPrice)

  return _platPrice;
});

export const pricesSlice = createSlice({
    name: 'prices',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(fetchPlatformPriceAsync.pending, (state) => {
        state.isLoading = true;
      });
      builder.addCase(fetchPlatformPriceAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lastUpdated = action.payload.updateAt;
        state.platformPrice = action.payload
      });
      builder.addCase(fetchTokenPriceAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lastUpdated = action.payload.updateAt;
        state.tokenPrice = action.payload
      });
      builder.addCase(fetchOtherTokensPricesAsync.fulfilled, (state, action) => {      
        state.isLoading = false;
        state.data = action.payload;
      });
    },
  });
  
  export default pricesSlice.reducer;
