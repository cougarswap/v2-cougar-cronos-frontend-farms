import poolsConfig from 'config/constants/pools'
import sousChefABI from 'config/abi/sousChef.json'
import cakeABI from 'config/abi/cake.json'
import wbnbABI from 'config/abi/weth.json'
import { QuoteToken } from 'config/constants/types'
import multicall from 'utils/multicall'
import { getWbnbAddress } from 'utils/addressHelpers'
import BigNumber from 'bignumber.js'
import { getBalanceAmount } from 'utils/formatBalance'

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID

export const fetchPoolsBlockLimits = async () => {
  const poolsWithEnd = poolsConfig.filter((p) => p.sousId !== 0)
  const callsStartBlock = poolsWithEnd.map((poolConfig) => {
    return {
      address: poolConfig.contractAddress,
      name: 'startBlock', 
    }
  })
  const callsEndBlock = poolsWithEnd.map((poolConfig) => {
    return {
      address: poolConfig.contractAddress,
      name: 'bonusEndBlock',
    }
  })
  const callsRewardPerBlock = poolsWithEnd.map((poolConfig) => {
    return {
      address: poolConfig.contractAddress,
      name: 'rewardPerBlock',
    }
  })

  const callsWithdrawalInterval = poolsWithEnd.map((poolConfig) => {
    return {
      address: poolConfig.contractAddress,
      name: 'withdrawalInterval',
    }
  })

  const starts = await multicall(sousChefABI, callsStartBlock)
  const ends = await multicall(sousChefABI, callsEndBlock)
  const rewardPerBlocks = await multicall(sousChefABI, callsRewardPerBlock)
  const withdrawalIntervals = await multicall(sousChefABI, callsWithdrawalInterval)

  return poolsWithEnd.map((cakePoolConfig, index) => {
    const startBlock = starts[index]
    const endBlock = ends[index]
    const rewardPerBlock = rewardPerBlocks[index]
    const withdrawalInterval = withdrawalIntervals[index]
    
    return {
      sousId: cakePoolConfig.sousId,
      startBlock: new BigNumber(startBlock).toJSON(),
      endBlock: new BigNumber(endBlock).toJSON(),
      tokenPerBlock: getBalanceAmount(new BigNumber(rewardPerBlock), cakePoolConfig.tokenDecimals).toJSON(),
      withdrawalInterval: new BigNumber(withdrawalInterval).toJSON()
    }
  })
}

export const fetchPoolsTotalStatking = async () => {
  const nonBnbPools = poolsConfig.filter((p) => p.stakingTokenName !== QuoteToken.CRO)
  const bnbPool = poolsConfig.filter((p) => p.stakingTokenName === QuoteToken.CRO)

  const callsNonBnbPools = nonBnbPools.map((poolConfig) => {
    return {
      address: poolConfig.stakingTokenAddress,
      name: 'balanceOf',
      params: [poolConfig.contractAddress],
    }
  })

  const callsBnbPools = bnbPool.map((poolConfig) => {
    return {
      address: getWbnbAddress(),
      name: 'balanceOf',
      params: [poolConfig.contractAddress],
    }
  })

  const nonBnbPoolsTotalStaked = await multicall(cakeABI, callsNonBnbPools)
  const bnbPoolsTotalStaked = await multicall(wbnbABI, callsBnbPools)

  return [
    ...nonBnbPools.map((p, index) => ({
      sousId: p.sousId,
      totalStaked: new BigNumber(nonBnbPoolsTotalStaked[index]).toJSON(),
    })),
    ...bnbPool.map((p, index) => ({
      sousId: p.sousId,
      totalStaked: new BigNumber(bnbPoolsTotalStaked[index]).toJSON(),
    })),
  ]
}
