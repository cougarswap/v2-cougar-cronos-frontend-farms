import { useWeb3React } from "@web3-react/core"
import { usePresaleContract } from "hooks/useContract"
import useToast from "hooks/useToast"
import { useCallback } from "react"
import { useDispatch } from "react-redux"
import { fetchUserBalanceDataAsync, fetchUserLastClaimedDataAsync, fetchUserTokensUnclaimedDataAsync } from "state/actions"
import { PresaleOption } from "state/types"

const claim = async (presaleContract, account) => {
  const tx =  await presaleContract.methods
    .claim()
    .send({ from: account })
    .on('transactionHash', (txh) => {
        return txh
    })
  
  return tx
}


const useClaimPresale = (option: PresaleOption) => {
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const presaleContract = usePresaleContract(option)
  const { toastError, toastSuccess } = useToast()

  const handleClaim = useCallback(
      async () => {
        try {
          const txHash = await claim(presaleContract, account)
          dispatch(fetchUserTokensUnclaimedDataAsync(account, option))
          dispatch(fetchUserLastClaimedDataAsync(account, option))
          dispatch(fetchUserBalanceDataAsync(account))
          toastSuccess("Success", 'Claim transaction confirmed');          
        }
        catch (e) {
          console.log(e)
          toastError("An error occurred.", "Claim unsuccessful, please try again");
        }
      },
      [account, dispatch, presaleContract, option, toastError, toastSuccess],
  )

  return { onClaim: handleClaim }
}

export default useClaimPresale