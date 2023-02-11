import { getPresaleAddress } from 'utils/addressHelpers'
import { getCakeContract, getPresaleContract, getUsdcContract, getOldCgsContract } from 'utils/contractHelpers';

const usdcContract = getUsdcContract();
const cakeContract = getCakeContract()
const oldCgsContract = getOldCgsContract();

export const fetchUserPresaleAllowances = async (address, option) => {    
    const presaleAddress = getPresaleAddress(option)
    const presaleAllowances = await usdcContract.methods.allowance(address, presaleAddress).call()
    return presaleAllowances.toString()
}

export const fetchUserPresaleBalance = async (address) => {
    const usdcBalance = await oldCgsContract.methods.balanceOf(address).call()
    const cakeBalance = await cakeContract.methods.balanceOf(address).call()
    return [usdcBalance.toString(), cakeBalance.toString()]
}

export const fetchUserTokensUnclaimed = async (address, option) => {
    const presaleContract = getPresaleContract(option)
    const cakeUnclaimed = await presaleContract.methods.cougarUnclaimed(address).call()
    return cakeUnclaimed.toString()
}

export const fetchUserLastClaimed = async (address, option) => {
    const presaleContract = getPresaleContract(option)
    const cakeLastClaimed = await presaleContract.methods.lastCougarClaimed(address).call()
    return cakeLastClaimed.toString()
}

export const fetchUserInWhiteList = async (address, option) => {
    const presaleContract = getPresaleContract(option)
    const isWhiteList = await presaleContract.methods.isWhiteList(address).call()
    return isWhiteList.toString()
}

