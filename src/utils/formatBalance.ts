import BigNumber from 'bignumber.js'
import { BIG_TEN } from './bigNumber'

export const getDecimalAmount = (amount: BigNumber, decimals = 18) => {
  return new BigNumber(amount).times(BIG_TEN.pow(decimals))
}

export const getBalanceAmount = (amount: BigNumber, decimals = 18) => {
  return new BigNumber(amount).dividedBy(BIG_TEN.pow(decimals))
}

export const getBalanceNumber = (balance: BigNumber, decimals = 18) => {
  const displayBalance = getBalanceAmount(balance, decimals)
  return displayBalance.toNumber()
}

export const getFullDisplayBalance = (balance: BigNumber, decimals = 18, displayDecimals?: number) => {
  return getBalanceAmount(balance, decimals).toFixed(displayDecimals)
}

export const getInterestDisplayValue = (value?: number) => {
  if (value) {
    if (value > 999999999) {
      const threshold = 999999999
      return `>${threshold.toLocaleString('en-US', { maximumFractionDigits: 0 })}%`
    }
      
    return `${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}%`
  }

  return '-'
}