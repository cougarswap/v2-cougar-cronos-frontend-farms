import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import vaultAbi from 'config/abi/vault.json'
import multicall from 'utils/multicall'
import vaultsConfig from 'config/constants/vaults'
import { getVaultAddress } from 'utils/addressHelpers'
import { getAutoCakeContract } from 'utils/contractHelpers'
import { BIG_ZERO } from 'utils/bigNumber'


export const fetchVaultUserAllowances = async (account: string) => {
  const vaultAddress = getVaultAddress()

  const calls = vaultsConfig.map((farm) => {
    const lpContractAddress = farm.stakingToken.token.address
    return { address: lpContractAddress, name: 'allowance', params: [account, farm.isAutoCgs ? farm.strategyContract : vaultAddress] }
  })

  const rawLpAllowances = await multicall(erc20ABI, calls)
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })

  return parsedLpAllowances
}

export const fetchVaultUserTokenBalances = async (account: string) => {
  const calls = vaultsConfig.map((farm) => {
    const lpContractAddress = farm.stakingToken.token.address
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

export const fetchVaultUserStakedBalances = async (account: string) => {
  const vaultAddress = getVaultAddress()

  const vaultConfig = vaultsConfig.filter(_ => !_.isAutoCgs)

  const calls = vaultConfig.map((farm) => {
    return {
      address: vaultAddress,
      name: 'stakedWantTokens',
      params: [farm.pid, account],
    }
  })

  const rawStakedBalances = await multicall(vaultAbi, calls)  
  
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {    
    return {
      stakedBalance: new BigNumber(stakedBalance).toJSON(),      
    }
  })   

  return parsedStakedBalances
}

export const fetchVaultUserEarnings = async (account: string) => {
  const vaultAddress = getVaultAddress()

  const vaultConfig = vaultsConfig.filter(_ => !_.isAutoCgs)

  const calls = vaultConfig.map((farm) => {
    return {
      address: vaultAddress,
      name: 'pendingCGSV',
      params: [farm.pid, account],
    }
  })

  const rawEarnings = await multicall(vaultAbi, calls)
  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings).toJSON()
  })

  return parsedEarnings
}
