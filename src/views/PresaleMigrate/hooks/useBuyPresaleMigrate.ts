import { useWeb3React } from "@web3-react/core"
import BigNumber from "bignumber.js"
import { usePresaleMigrateContract } from "hooks/useContract"
import useToast from "hooks/useToast"
import { useCallback } from "react"
import { useDispatch } from "react-redux"
import { fetchUserPresaleMigrateAllowanceDataAsync, fetchUserTokensMigrateUnclaimedDataAsync } from "state/actions"
import { fetchPresaleMigratePublicDataAsync, fetchUserMigrateBalanceDataAsync } from "state/presaleMigrate"
import { PresaleOption } from "state/types"

const buy = async (presaleMigrateContract, amount, account) => {
    const tx =  await presaleMigrateContract.methods
        .buy(new BigNumber(amount).times(new BigNumber(10).pow(6)).toString(), account)
        .send({ from: account })
        .on('transactionHash', (txh) => {
            return txh
        })
    return tx
}

const useBuyPresaleMigrate = (option: PresaleOption) => {
    const { account } = useWeb3React()
    const dispatch = useDispatch()    
    const presaleMigrateContract = usePresaleMigrateContract(option)
    const { toastError, toastSuccess } = useToast()

    const handleBuy = useCallback(
        async (amount: string) => {
            try {
                const txHash = await buy(presaleMigrateContract, amount, account)
                dispatch(fetchPresaleMigratePublicDataAsync(option))
                dispatch(fetchUserTokensMigrateUnclaimedDataAsync(account, option))
                dispatch(fetchUserPresaleMigrateAllowanceDataAsync(account, option))
                dispatch(fetchUserMigrateBalanceDataAsync(account))
                toastSuccess("Success", 'Transaction confirmed');
            }
            catch (e)
            {
                console.log(e)
                toastError("An error occurred.", "Harvest unsuccessful, please try again");
            }
            
        },
        [account, dispatch, presaleMigrateContract, option, toastSuccess, toastError],
    )

    return { onBuy: handleBuy }
}

export default useBuyPresaleMigrate