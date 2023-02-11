import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import { fetchFarmUserDataAsync, updateUserStakedBalance, updateUserBalance, fetchPartnerPoolsUserDataAsync } from 'state/actions'
import { stake, sousStake, sousStakeBnb, partnerStake, autoCakeStake, vaultStake } from 'utils/callHelpers'
import partnerPoolsConfig from 'config/constants/partnerPools'
import { fetchCakeVaultPublicData, fetchCakeVaultUserData, fetchVaultsUserDataAsync } from 'state/vaults'
import { useAutoCake, useMasterchef, usePartnerMasterchef, useSousChef, useVault } from './useContract'
import useToast from './useToast'

const useStake = (pid: number) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()

  const masterChefContract = useMasterchef()
  const { toastError, toastSuccess } = useToast()
  
  const handleStake = useCallback(
    async (amount: string) => {
      try {
        const txHash = await stake(masterChefContract, pid, amount, account)
        dispatch(fetchFarmUserDataAsync(account))
        toastSuccess("Success","Staking transaction confirmed")
      }
      catch (e){
        console.log(e)
        toastError("An error occurred.", `Transaction unsuccessful, please try again`);
      }      
    },
    [account, dispatch, masterChefContract, pid, toastSuccess, toastError],
  )

  return { onStake: handleStake }
}

export const usePartnerStake = (partnerId: number) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  
  const partnerPool = partnerPoolsConfig.find(_ => _.partnerId === partnerId)
  const masterChefContract = usePartnerMasterchef(partnerId)
  
  const { toastError, toastSuccess } = useToast()
  
  const handleStake = useCallback(
    async (amount: string) => {
      try {
        const txHash = await partnerStake(masterChefContract, partnerPool.poolId, amount, account, partnerPool.referrer)
        dispatch(fetchPartnerPoolsUserDataAsync(account))
        toastSuccess("Success","Staking transaction confirmed")
      }
      catch (e){
        console.log(e)
        toastError("An error occurred.", `Transaction unsuccessful, please try again`);
      }      
    },
    [account, dispatch, masterChefContract, partnerPool.poolId, partnerPool.referrer, toastSuccess, toastError],
  )

  return { onStake: handleStake }
}

export const useSousStake = (sousId, isUsingBnb = false) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()
  const sousChefContract = useSousChef(sousId)
  const { toastError, toastSuccess } = useToast()

  const handleStake = useCallback(
    async (amount: string) => {
      try {
        if (sousId === 0) {
          await stake(masterChefContract, 0, amount, account)
        } else if (isUsingBnb) {
          await sousStakeBnb(sousChefContract, amount, account)
        } else {
          await sousStake(sousChefContract, amount, account)
        }
        dispatch(updateUserStakedBalance(sousId, account))
        dispatch(updateUserBalance(sousId, account))
        toastSuccess("Success", 'Staking transaction confirmed');
      }
      catch(e) {
        console.log(e)
        toastError("An error occurred.", `Transaction unsuccessful, please try again`);
      }      
    },
    [account, dispatch, isUsingBnb, masterChefContract, sousChefContract, sousId, toastSuccess, toastError],
  )

  return { onStake: handleStake }
}

export const useAutoCakeStake = () => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()

  const autoCakeContract = useAutoCake()
  const { toastError, toastSuccess } = useToast()
  
  const handleStake = useCallback(
    async (amount: string) => {
      try {
        const txHash = await autoCakeStake(autoCakeContract, amount, account)
        
        dispatch(fetchCakeVaultUserData({account}))
        toastSuccess("Success","Staking transaction confirmed")
      }
      catch (e){
        console.log(e)
        toastError("An error occurred.", `Transaction unsuccessful, please try again`);
      }      
    },
    [account, dispatch, autoCakeContract, toastSuccess, toastError],
  )

  return { onStake: handleStake }
}


export const useVaultStake = (pid: number) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()

  const vaultContract = useVault()
  const { toastError, toastSuccess } = useToast()
  
  const handleStake = useCallback(
    async (amount: string) => {
      try {
        const txHash = await vaultStake(vaultContract, pid, amount, account)        
        dispatch(fetchVaultsUserDataAsync(account))

        if (pid === -1) {
          dispatch(fetchCakeVaultUserData({ account }))
          dispatch(fetchCakeVaultPublicData())
        }

        toastSuccess("Success","Staking transaction confirmed")
      }
      catch (e){
        console.log(e)
        toastError("An error occurred.", `Transaction unsuccessful, please try again`);
      }      
    },
    [account, dispatch, vaultContract, pid, toastSuccess, toastError],
  )

  return { onStake: handleStake }
}

export default useStake
