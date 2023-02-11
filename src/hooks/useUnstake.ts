import { useCallback, useMemo } from 'react'
import { AbiItem } from 'web3-utils'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import {
  fetchFarmUserDataAsync,
  updateUserStakedBalance,
  updateUserBalance,
  updateUserPendingReward,
  fetchPartnerPoolsUserDataAsync,
} from 'state/actions'
import { unstake, sousUnstake, sousEmegencyUnstake, partnerUnstake, autoCakeUnstakeAll, autoCakeUnstake, vaultUnstake } from 'utils/callHelpers'
import partnerPoolsConfig from 'config/constants/partnerPools'
import { BIG_WITHDRAW_THRESHOLD, BIG_ZERO } from 'utils/bigNumber'
import { fetchCakeVaultPublicData, fetchCakeVaultUserData, fetchVaultsUserDataAsync } from 'state/vaults'
import { useCakeVault } from 'state/hooks'
import { convertCakeToShares } from 'state/vaults/helpers'
import { useAutoCake, useMasterchef, usePartnerMasterchef, useSousChef, useVault } from './useContract'
import useToast from './useToast'

const useUnstake = (pid: number) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()
  const { toastError, toastSuccess } = useToast()

  const handleUnstake = useCallback(
    async (amount: string) => {
      try {
        const txHash = await unstake(masterChefContract, pid, amount, account)
        dispatch(fetchFarmUserDataAsync(account))
        toastSuccess("Success","Unstaking transaction confirmed")
      }
      catch (e) {
        console.log(e)
        toastError("An error occurred.", `Transaction unsuccessful, please try again`);
      }      
    },
    [account, dispatch, masterChefContract, pid, toastSuccess, toastError],
  )

  return { onUnstake: handleUnstake }
}

export const usePartnerUnstake = (partnerId: number) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  
  const partnerPool = partnerPoolsConfig.find(_ => _.partnerId === partnerId)
  const masterChefContract = usePartnerMasterchef(partnerId)
  
  const { toastError, toastSuccess } = useToast()

  const handleUnstake = useCallback(
    async (amount: string) => {
      try {
        const txHash = await partnerUnstake(masterChefContract, partnerPool.poolId, amount, account)
        dispatch(fetchPartnerPoolsUserDataAsync(account))
        toastSuccess("Success","Unstaking transaction confirmed")
      }
      catch (e) {
        console.log(e)
        toastError("An error occurred.", `Transaction unsuccessful, please try again`);
      }      
    },
    [account, dispatch, masterChefContract, partnerPool.poolId, toastSuccess, toastError],
  )

  return { onUnstake: handleUnstake }
}

const SYRUPIDS = []

export const useSousUnstake = (sousId) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()
  const sousChefContract = useSousChef(sousId)
  const isOldSyrup = SYRUPIDS.includes(sousId)
  const { toastError, toastSuccess } = useToast()

  const handleUnstake = useCallback(
    async (amount: string) => {
      try {
        if (sousId === 0) {
          const txHash = await unstake(masterChefContract, 0, amount, account)
        } else if (isOldSyrup) {
          const txHash = await sousEmegencyUnstake(sousChefContract, amount, account)
        } else {
          const txHash = await sousUnstake(sousChefContract, amount, account)
        }
        dispatch(updateUserStakedBalance(sousId, account))
        dispatch(updateUserBalance(sousId, account))
        dispatch(updateUserPendingReward(sousId, account))
        toastSuccess("Success","Unstaking transaction confirmed")
      }   
      catch (e){
        console.log(e)
        toastError("An error occurred.", `Transaction unsuccessful, please try again`);
      }
    },
    [account, dispatch, isOldSyrup, masterChefContract, sousChefContract, sousId, toastSuccess, toastError],
  )

  return { onUnstake: handleUnstake }
}


export const useAutoCakeUnstake = () => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()

  const autoCakeContract = useAutoCake()
  const { pricePerFullShare, userData : { userShares } } = useCakeVault()
  
  const userSharesAsBigNumber = useMemo(() => {
    return userShares ? new BigNumber(userShares) : BIG_ZERO
  }, [userShares])  

  const sharePriceAsBigNumber = useMemo(() => {
    return pricePerFullShare ? new BigNumber(pricePerFullShare) : BIG_ZERO
  }, [pricePerFullShare])  

  const { toastError, toastSuccess } = useToast()
  
  const handleUnstake = useCallback(
    async (amount: string) => {
      try {
        const shareStakeToWithdraw = convertCakeToShares(new BigNumber(amount), sharePriceAsBigNumber)
        const sharesRemaining = userSharesAsBigNumber.minus(shareStakeToWithdraw.sharesAsBigNumber)        
        const isWithdrawingAll = sharesRemaining.lte(BIG_WITHDRAW_THRESHOLD)
        
        if (isWithdrawingAll) {
          await autoCakeUnstakeAll(autoCakeContract, account) 
        }
        else {
          await autoCakeUnstake(autoCakeContract, amount, account)
        }
        
        dispatch(fetchCakeVaultUserData({ account }))
        dispatch(fetchCakeVaultPublicData())
        toastSuccess("Success","Unstaking transaction confirmed")
      }
      catch (e){
        console.log(e)
        toastError("An error occurred.", `Transaction unsuccessful, please try again`);
      }      
    },
    [account, dispatch, autoCakeContract, sharePriceAsBigNumber, userSharesAsBigNumber, toastSuccess, toastError],
  )

  return { onUnstake: handleUnstake }
}


export const useVaultUnstake = (pid: number) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const vaultContract = useVault()
  const { toastError, toastSuccess } = useToast()

  const handleUnstake = useCallback(
    async (amount: string) => {
      try {
        const txHash = await vaultUnstake(vaultContract, pid, amount, account)
        dispatch(fetchVaultsUserDataAsync(account))
        toastSuccess("Success","Unstaking transaction confirmed")
      }
      catch (e) {
        console.log(e)
        toastError("An error occurred.", `Transaction unsuccessful, please try again`);
      }      
    },
    [account, dispatch, vaultContract, pid, toastSuccess, toastError],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstake
