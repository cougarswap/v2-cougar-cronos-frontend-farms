import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import partnerCommonFnChefAbi from 'config/abi/partners/partnerCommonFnChef.json'
import multicall from 'utils/multicall'
import partnerPoolsConfig from 'config/constants/partnerPools'
import { getPartnerContract } from 'utils/contractHelpers'

export const fetchPartnerPoolUserAllowances = async (account: string) => {

  const calls = partnerPoolsConfig.map((pool) => {
    const lpContractAddress = pool.stakingToken.token.address
    return { address: lpContractAddress, name: 'allowance', params: [account, pool.masterchefAddress] }
  })

  const rawLpAllowances = await multicall(erc20ABI, calls)
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })
  return parsedLpAllowances
}

export const fetchPartnerPoolUserTokenBalances = async (account: string) => {
  const calls = partnerPoolsConfig.map((pool) => {
    const lpContractAddress = pool.stakingToken.token.address
    return {
      address: lpContractAddress,
      name: 'balanceOf',
      params: [account],
    }
  })

  const rawTokenBalances = await multicall(erc20ABI, calls)
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON()
  })
  return parsedTokenBalances
}

export const fetchPartnerPoolUserStakedBalances = async (account: string) => {
  const calls = partnerPoolsConfig.map((pool) => {
    return {
      address: pool.masterchefAddress,
      name: 'userInfo',
      params: [pool.poolId, account],
    }
  })

  const rawStakedBalances = await multicall(partnerCommonFnChefAbi, calls)  
  
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {    
    return new BigNumber(stakedBalance[0]._hex).toJSON()
  })  
  return parsedStakedBalances
}

export const fetchPartnerPoolUserEarnings = async (account: string) => {
  const calls = partnerPoolsConfig.map(async (pool) => {
    const masterCheftContract = getPartnerContract(pool.partnerId)
    return masterCheftContract.methods[pool.pendingFunction].apply(null, [pool.poolId, account]).call()    
  })

  const rawEarnings = await Promise.all(calls)
  const parsedEarnings = rawEarnings.map((earnings) => {
    if (earnings.amounts) {
      return new BigNumber(earnings.amounts).toJSON()
    }
    return new BigNumber(earnings).toJSON()
  })
  return parsedEarnings
}
