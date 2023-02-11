import { useWeb3React } from "@web3-react/core"
import BigNumber from "bignumber.js"
import { usePresaleContract } from "hooks/useContract"
import useToast from "hooks/useToast"
import { useCallback } from "react"
import { useDispatch } from "react-redux"
import { fetchUserBalanceDataAsync, fetchUserTokensUnclaimedDataAsync } from "state/actions"
import { fetchPresalePublicDataAsync } from "state/presale"
import { PresaleOption } from "state/types"

const buy = async (presaleContract, amount, account) => {
    const tx =  await presaleContract.methods
        .buy(new BigNumber(amount).times(new BigNumber(10).pow(6)).toString(), account)
        .send({ from: account })
        .on('transactionHash', (txh) => {
            return txh
        })
    return tx
}

const useBuyPresale = (option: PresaleOption) => {
    const { account } = useWeb3React()
    const dispatch = useDispatch()    
    const presaleContract = usePresaleContract(option)
    const { toastError, toastSuccess } = useToast()

    const handleBuy = useCallback(
        async (amount: string) => {
            try {
                const txHash = await buy(presaleContract, amount, account)
                dispatch(fetchPresalePublicDataAsync(option))
                dispatch(fetchUserTokensUnclaimedDataAsync(account, option))
                dispatch(fetchUserBalanceDataAsync(account))
                toastSuccess("Success", 'Transaction confirmed');
            }
            catch (e)
            {
                console.log(e)
                toastError("An error occurred.", "Unsuccessfully buy, please try again");
            }
            
        },
        [account, dispatch, presaleContract, option, toastSuccess, toastError],
    )

    return { onBuy: handleBuy }
}

export default useBuyPresale