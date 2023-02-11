import BigNumber from "bignumber.js"
import { Farm } from "state/types"

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID

export const getTokenPricesFromFarm = (farms: Farm[]) => {
    return farms.reduce((prices, farm) => {
      const quoteTokenAddress = farm.quoteTokenAdresses[CHAIN_ID].toLowerCase()
      const tokenAddress = farm.tokenAddresses[CHAIN_ID].toLowerCase()
      const lpAddress = farm.lpAddresses[CHAIN_ID].toLowerCase()

      /* eslint-disable no-param-reassign */
      if (!prices[quoteTokenAddress]) {
        prices[quoteTokenAddress] = new BigNumber(farm.quoteTokenPriceBusd).toNumber()
      }
      if (!prices[tokenAddress]) {
        prices[tokenAddress] = new BigNumber(farm.tokenPriceBusd).toNumber()
      }

      if (!farm.isTokenOnly && !prices[lpAddress]) {
        prices[lpAddress] = new BigNumber(farm.lpPriceBusd).toNumber()
      }
      /* eslint-enable no-param-reassign */
      return prices
    }, {})
}

export const getPrice = (prices, tokenAddress) => {
  let price = 0

  if (prices[tokenAddress.toLowerCase()]) {
    price = prices[tokenAddress.toLowerCase()]
  }    

  return price
}

export const getTradingFeeApr = (aprs, tokenAddress) => {
  let apr = 0

  if (aprs[tokenAddress.toLowerCase()]) {
    apr = aprs[tokenAddress.toLowerCase()]
  }    

  return apr * 100
}