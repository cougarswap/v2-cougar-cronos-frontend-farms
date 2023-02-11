import addresses from 'config/constants/contracts'
import { PresaleOption } from 'state/types'

const chainId = process.env.REACT_APP_CHAIN_ID

export const getCakeAddress = () => {
  return addresses.cake[chainId]
}

export const getAutoCakeAddress = () => {
  return addresses.autoCake[chainId]
}
export const getVaultAddress = () => {

  return addresses.vault[chainId]
}


export const getTimelockControllerRewardsDistributorAddress = () => {
  return addresses.timelockControllerRewardsDistributor[chainId]
}

export const getMasterChefAddress = () => {
  return addresses.masterChef[chainId]
}

export const getReferralAddress = () => {
  return addresses.referral[chainId]
}

export const getTokenAddress = () => {
  return addresses.cake[chainId]
}

export const getUsdcAddress = () => {
  return addresses.usdc[chainId]
}

export const getOldCgsAddress = () => {
  return addresses.oldCgs[chainId]
}

export const getMulticallAddress = () => {
  return addresses.mulltiCall[chainId]
}
export const getWbnbAddress = () => {
  return addresses.wmatic[chainId]
}
export const getLotteryAddress = () => {
  return addresses.lottery[chainId]
}
export const getLotteryTicketAddress = () => {
  return addresses.lotteryNFT[chainId]
}
export const getPresaleAddress = (option: PresaleOption) => {
  if (option === PresaleOption.OPTION_1)
    return addresses.presale1[chainId]
  if (option === PresaleOption.OPTION_2)
    return addresses.presale2[chainId]
    if (option === PresaleOption.OPTION_3)
    return addresses.presale3[chainId]
  return addresses.presale4[chainId]
}

export const getPresaleMigrateAddress = () => {
  return addresses.presaleMigrate[chainId]
}