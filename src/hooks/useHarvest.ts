import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import { fetchFarmUserDataAsync, fetchPartnerPoolsUserDataAsync, updateUserBalance, updateUserPendingReward } from 'state/actions'
import { soushHarvest, soushHarvestBnb, harvest, partnerHarvest, vaultHarvest } from 'utils/callHelpers'
import partnerPoolsConfig from 'config/constants/partnerPools'
import { fetchVaultsUserDataAsync } from 'state/vaults'
import { useMasterchef, usePartnerMasterchef, useSousChef, useVault } from './useContract'
import useToast from './useToast'

export const useHarvest = (farmPid: number) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()
  const { toastError, toastSuccess } = useToast()

  const handleHarvest = useCallback(async () => {
    try {
      const txHash = await harvest(masterChefContract, farmPid, account)
      dispatch(fetchFarmUserDataAsync(account))
      toastSuccess("Success", 'Harvesting transaction confirmed');
      return txHash
    }
    catch (e) {
      console.log(e)
      toastError("An error occurred.", "Harvest unsuccessful, please try again");
      return false
    }
    
  }, [account, dispatch, farmPid, masterChefContract, toastSuccess, toastError])

  return { onReward: handleHarvest }
}

export const usePartnerHarvest = (partnerId: number) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  
  const partnerPool = partnerPoolsConfig.find(_ => _.partnerId === partnerId)
  const masterChefContract = usePartnerMasterchef(partnerId)

  const { toastError, toastSuccess } = useToast()

  const handleHarvest = useCallback(async () => {
    try {
      const txHash = await partnerHarvest(masterChefContract, partnerPool.poolId, account, partnerPool.referrer)
      dispatch(fetchPartnerPoolsUserDataAsync(account))
      toastSuccess("Success", 'Harvesting transaction confirmed');
      return txHash
    }
    catch (e) {
      console.log(e)
      toastError("An error occurred.", "Harvest unsuccessful, please try again");
      return false
    }
    
  }, [account, dispatch, partnerPool.poolId, partnerPool.referrer, masterChefContract, toastSuccess, toastError])

  return { onReward: handleHarvest }
}

export const useAllHarvest = (farmPids: number[]) => {
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()

  const handleHarvest = useCallback(async () => {
    const harvestPromises = farmPids.reduce((accum, pid) => {
      return [...accum, harvest(masterChefContract, pid, account)]
    }, [])

    return Promise.all(harvestPromises)
  }, [account, farmPids, masterChefContract])

  return { onReward: handleHarvest }
}

export const useSousHarvest = (sousId, isUsingBnb = false) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const sousChefContract = useSousChef(sousId)
  const masterChefContract = useMasterchef()
  const { toastError, toastSuccess } = useToast()

  const handleHarvest = useCallback(async () => {
    try {
      if (sousId === 0) {
        await harvest(masterChefContract, 0, account)
      } else if (isUsingBnb) {
        await soushHarvestBnb(sousChefContract, account)
      } else {
        await soushHarvest(sousChefContract, account)
      }
      dispatch(updateUserPendingReward(sousId, account))
      dispatch(updateUserBalance(sousId, account))
      toastSuccess("Success", 'Harvesting transaction confirmed');
    }
    catch (e) {
      console.log(e)
      toastError("An error occurred.", "Harvest unsuccessful, please try again");
    }
    
  }, [account, dispatch, isUsingBnb, masterChefContract, sousChefContract, sousId, toastSuccess, toastError])

  return { onReward: handleHarvest }
}

export const useVaultHarvest = (farmPid: number) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const vaultContract = useVault()
  const { toastError, toastSuccess } = useToast()

  const handleHarvest = useCallback(async () => {
    try {
      const txHash = await vaultHarvest(vaultContract, farmPid, account)
      dispatch(fetchVaultsUserDataAsync(account))
      toastSuccess("Success", 'Harvesting transaction confirmed');
      return txHash
    }
    catch (e) {
      console.log(e)
      toastError("An error occurred.", "Harvest unsuccessful, please try again");
      return false
    }
    
  }, [account, dispatch, farmPid, vaultContract, toastSuccess, toastError])

  return { onReward: handleHarvest }
}

