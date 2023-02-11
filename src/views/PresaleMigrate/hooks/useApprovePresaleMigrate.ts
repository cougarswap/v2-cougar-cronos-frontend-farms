import { useCallback } from "react"
import { ethers } from 'ethers'
import { getPresaleMigrateAddress } from "utils/addressHelpers"
import { useWeb3React } from "@web3-react/core"
import useToast from "hooks/useToast"

const useApprovePresaleMigrate = (busdContract, option) => {
  const { account } = useWeb3React()
  const { toastError, toastSuccess } = useToast()

    const handleApprove = useCallback(async () => {
      try {
        const tx = await busdContract.methods
          .approve(getPresaleMigrateAddress(), ethers.constants.MaxUint256)
          .send({ from: account })
          .on('transactionHash', (txh) => {
            return txh
          })
          toastSuccess("Success", 'Got approval!');
        return tx
      } catch (e) {
        console.log('error', e)
        toastError("An error occurred.", `Did not get approval, please try again`);
        return false
      }
    }, [busdContract, account, toastSuccess, toastError])
  
    return { onApprove: handleApprove }
}

export default useApprovePresaleMigrate

