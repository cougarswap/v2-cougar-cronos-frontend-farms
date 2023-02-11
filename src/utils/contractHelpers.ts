import { AbiItem } from 'web3-utils'
import presaleType2Abi from 'config/abi/presaleType2.json'
import presaleMigrateAbi from 'config/abi/presaleMigrate.json'
import vault from 'config/abi/vault.json'
import usdcAbi from 'config/abi/usdc.json'
import oldToken from 'config/abi/oldToken.json'
import cakeABI from 'config/abi/cake.json'
import autoCakeAbi from 'config/abi/autoCake.json'
import erc20abi from 'config/abi/erc20.json'
import masterChef from 'config/abi/masterchef.json'
import sousChef from 'config/abi/sousChef.json'
import sousChefBnb from 'config/abi/sousChefBnb.json'
import referral from 'config/abi/referral.json'
import lottery from 'config/abi/lottery.json'
import lotteryTicket from 'config/abi/lotteryNft.json'
import rabbitmintingfarm from 'config/abi/rabbitmintingfarm.json'
import pancakeRabbits from 'config/abi/pancakeRabbits.json'
import web3NoAccount from 'utils/web3'
import { PresaleOption } from 'state/types'
import Web3 from 'web3'
import { PoolCategory } from 'config/constants/types'
import partnerPoolsConfig from 'config/constants/partnerPools'
import { poolsConfig } from 'config/constants'
import { getAutoCakeAddress, getCakeAddress, getLotteryAddress, getLotteryTicketAddress, getMasterChefAddress, getOldCgsAddress, getPresaleAddress, getPresaleMigrateAddress, getReferralAddress, getUsdcAddress, getVaultAddress } from './addressHelpers'
import { getPartnerMasterchefAbi } from './abiHelper'

const getContract = (abi: any, address: string, web3?: Web3) => {
    const _web3 = web3 ?? web3NoAccount
    return new _web3.eth.Contract(abi as unknown as AbiItem, address)
}


export const getPresaleContract = (option: PresaleOption, web3?: Web3) => {    
    const abi = (presaleType2Abi as unknown) as AbiItem
    return getContract(abi, getPresaleAddress(option), web3)
}

export const getPresaleMirgateContract = (option: PresaleOption, web3?: Web3) => {    
    const abi = (presaleMigrateAbi as unknown) as AbiItem
    return getContract(abi, getPresaleMigrateAddress(), web3)
}

export const getAutoCakeContract = (web3?: Web3) => {    
    const abi = (autoCakeAbi as unknown) as AbiItem
    return getContract(abi, getAutoCakeAddress(), web3)
}

export const getVaultContract = (web3?: Web3) => {
    return getContract(vault, getVaultAddress(), web3)
}

export const getBep20Contract = (address: string, web3?: Web3) => {
    return getContract(erc20abi, address, web3)
}
export const getMasterchefContract = (web3?: Web3) => {
    return getContract(masterChef, getMasterChefAddress(), web3)
}

export const getCakeContract = (web3?: Web3) => {
    return getContract(cakeABI, getCakeAddress(), web3)
}

export const getReferralContract = (web3?: Web3) => {
    return getContract(referral, getReferralAddress(), web3)
}

export const getLotteryContract = (web3?: Web3) => {
    return getContract(lottery, getLotteryAddress(), web3)
}

export const getLotteryTicketContract = (web3?: Web3) => {
    return getContract(lotteryTicket, getLotteryTicketAddress(), web3)
}

export const getUsdcContract = (web3?: Web3) => {
    return getContract(usdcAbi, getUsdcAddress(), web3)
}

export const getOldCgsContract = (web3?: Web3) => {
    return getContract(oldToken, getOldCgsAddress(), web3)
}

export const getRabbitMintingFarmContract = (address: string, web3?: Web3) => {
    return getContract(rabbitmintingfarm, address, web3)
}

export const getPancakeRabbitsContract = (address: string, web3?: Web3) => {
    return getContract(pancakeRabbits, address, web3)
}

export const getERC20Contract = (address: string, web3?: Web3) => {
    return getContract(erc20abi, address, web3)
}

export const getSouschefContract = (id: number, web3?: Web3) => {
    const config = poolsConfig.find((pool) => pool.sousId === id)
    const abi = config.poolCategory === PoolCategory.BINANCE ? sousChefBnb : sousChef
    return getContract(abi, config.contractAddress, web3)
  }

export const getPartnerContract = (partnerId: number, web3?: Web3) => {
    const partnerPool = partnerPoolsConfig.find((pool) => pool.partnerId === partnerId)
    const partnerMasterchefAbi = getPartnerMasterchefAbi(partnerPool.earningToken.symbol)

    return getContract(partnerMasterchefAbi, partnerPool.masterchefAddress, web3)
}

