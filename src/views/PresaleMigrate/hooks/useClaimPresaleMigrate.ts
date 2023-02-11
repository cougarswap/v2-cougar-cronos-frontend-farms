import { useWeb3React } from "@web3-react/core"
import { usePresaleMigrateContract } from "hooks/useContract"
import useToast from "hooks/useToast"
import { useCallback } from "react"
import { useDispatch } from "react-redux"
import { fetchUserMigrateBalanceDataAsync, fetchUserLastClaimedDataAsync, fetchUserTokensUnclaimedDataAsync } from "state/actions"
import { PresaleOption } from "state/types"

const claim = async (presaleMigrateContract, account) => {
  const tx =  await presaleMigrateContract.methods
    .claim()
    .send({ from: account })
    .on('transactionHash', (txh) => {
        return txh
    })
  
  return tx
}


const useClaimPresaleMigrate = (option: PresaleOption) => {
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const presaleMigrateContract = usePresaleMigrateContract(option)
  const { toastError, toastSuccess } = useToast()

  const handleClaim = useCallback(
      async () => {
        try {
          const txHash = await claim(presaleMigrateContract, account)
          dispatch(fetchUserTokensUnclaimedDataAsync(account, option))
          dispatch(fetchUserLastClaimedDataAsync(account, option))
          dispatch(fetchUserMigrateBalanceDataAsync(account))
          toastSuccess("Success", 'Claim transaction confirmed');          
        }
        catch (e) {
          console.log(e)
          toastError("An error occurred.", "Claim unsuccessful, please try again");
        }
      },
      [account, dispatch, presaleMigrateContract, option, toastError, toastSuccess],
  )

  return { onClaim: handleClaim }
}

export default useClaimPresaleMigrate