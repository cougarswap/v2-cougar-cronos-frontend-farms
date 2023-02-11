import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'web3-eth-contract'
import { ethers } from 'ethers'
import { useDispatch } from 'react-redux'
import { updateUserAllowance, fetchFarmUserDataAsync, fetchPartnerPoolsUserDataAsync } from 'state/actions'
import { approve, autoCakeApprove, partnerApprove, vaultApprove } from 'utils/callHelpers'
import { getAutoCakeAddress } from 'utils/addressHelpers'
import { fetchCakeVaultUserData, fetchVaultsUserDataAsync } from 'state/vaults'
import { useMasterchef, useCake, useSousChef, useLottery } from './useContract'
import useToast from './useToast'

// Approve a Farm
export const useApprove = (lpContract: Contract) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()
  const { toastError, toastSuccess } = useToast()
  
  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, masterChefContract, account)
      dispatch(fetchFarmUserDataAsync(account))
      toastSuccess("Success", 'Got approval!');
      return tx
    } catch (e) {
      console.log(e)
      toastError("An error occurred.", `Did not get approval, please try again`);
      return false
    }
  }, [account, dispatch, lpContract, masterChefContract, toastSuccess, toastError])

  return { onApprove: handleApprove }
}

// Approve a Partner Pool
export const usePartnerApprove = (lpContract: Contract, masterChefContractAddress: string) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const { toastError, toastSuccess } = useToast()
  
  const handleApprove = useCallback(async () => {
    try {
      const tx = await partnerApprove(lpContract, masterChefContractAddress, account)
      dispatch(fetchPartnerPoolsUserDataAsync(account))
      toastSuccess("Success", 'Got approval!');
      return tx
    } catch (e) {
      console.log(e)
      toastError("An error occurred.", `Did not get approval, please try again`);
      return false
    }
  }, [account, dispatch, lpContract, masterChefContractAddress, toastSuccess, toastError])

  return { onApprove: handleApprove }
}

// Approve a Pool
export const useSousApprove = (lpContract: Contract, sousId) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const sousChefContract = useSousChef(sousId)
  const { toastError, toastSuccess } = useToast()

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, sousChefContract, account)
      dispatch(updateUserAllowance(sousId, account))
      toastSuccess("Success", 'Got approval!');
      return tx
    } catch (e) {
      console.log(e)
      toastError("An error occurred.", `Did not get approval, please try again`);
      return false
    }
  }, [account, dispatch, lpContract, sousChefContract, sousId, toastSuccess, toastError])

  return { onApprove: handleApprove }
}

// Approve the lottery
export const useLotteryApprove = () => {
  const { account } = useWeb3React()
  const cakeContract = useCake()
  const lotteryContract = useLottery()

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(cakeContract, lotteryContract, account)
      return tx
    } catch (e) {
      return false
    }
  }, [account, cakeContract, lotteryContract])

  return { onApprove: handleApprove }
}

// Approve an IFO
export const useIfoApprove = (tokenContract: Contract, spenderAddress: string) => {
  const { account } = useWeb3React()
  const onApprove = useCallback(async () => {
    try {
      const tx = await tokenContract.methods
        .approve(spenderAddress, ethers.constants.MaxUint256)
        .send({ from: account })
      return tx
    } catch {
      return false
    }
  }, [account, spenderAddress, tokenContract])

  return onApprove
}

export const useAutoCakeApprove = (lpContract: Contract) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  
  const { toastError, toastSuccess } = useToast()
  
  const autoCakeAddress = getAutoCakeAddress()

  const handleApprove = useCallback(async () => {
    try {
      const tx = await autoCakeApprove(lpContract, autoCakeAddress, account)
      dispatch(fetchCakeVaultUserData({ account }))
      toastSuccess("Success", 'Got approval!');
      return tx
    } catch (e) {
      console.log(e)
      toastError("An error occurred.", `Did not get approval, please try again`);
      return false
    }
  }, [account, dispatch, lpContract, autoCakeAddress, toastSuccess, toastError])

  return { onApprove: handleApprove }
}

export const useVaultApprove = (lpContract: Contract, spenderAddress: string) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  
  const { toastError, toastSuccess } = useToast()
  
  const handleApprove = useCallback(async () => {
    try {
      const tx = await vaultApprove(lpContract, spenderAddress, account)
      dispatch(fetchVaultsUserDataAsync(account))
      dispatch(fetchCakeVaultUserData({ account }))
      toastSuccess("Success", 'Got approval!');
      return tx
    } catch (e) {
      console.log(e)
      toastError("An error occurred.", `Did not get approval, please try again`);
      return false
    }
  }, [account, dispatch, lpContract, spenderAddress, toastSuccess, toastError])

  return { onApprove: handleApprove }
}