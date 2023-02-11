import { getPresaleMigrateAddress } from 'utils/addressHelpers'
import { getCakeContract, getPresaleMirgateContract, getOldCgsContract } from 'utils/contractHelpers';

const oldCgsContract = getOldCgsContract();
const cakeContract = getCakeContract()

export const fetchUserPresaleMigrateAllowances = async (address) => {    
    const presaleAddress = getPresaleMigrateAddress()
    const presaleAllowances = await oldCgsContract.methods.allowance(address, presaleAddress).call()
    return presaleAllowances.toString()
}

export const fetchUserPresaleMigrateBalance = async (address) => {
    const usdcBalance = await oldCgsContract.methods.balanceOf(address).call()
    const cakeBalance = await cakeContract.methods.balanceOf(address).call()
    return [usdcBalance.toString(), cakeBalance.toString()]
}

export const fetchUserTokensUnclaimed = async (address, option) => {
    const presaleContract = getPresaleMirgateContract(option)
    const cakeUnclaimed = await presaleContract.methods.cougarUnclaimed(address).call()
    return cakeUnclaimed.toString()
}

export const fetchUserLastClaimed = async (address, option) => {
    const presaleContract = getPresaleMirgateContract(option)
    const cakeLastClaimed = await presaleContract.methods.lastCougarClaimed(address).call()
    return cakeLastClaimed.toString()
}

export const fetchUserInWhiteList = async (address, option) => {
    const presaleContract = getPresaleMirgateContract(option)
    const isWhiteList = await presaleContract.methods.isWhiteList(address).call()
    return isWhiteList.toString()
}

