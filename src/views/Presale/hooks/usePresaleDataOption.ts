import useRefresh from "hooks/useRefresh"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { fetchPresalePublicDataAsync, fetchUserBalanceDataAsync, fetchUserLastClaimedDataAsync, fetchUserPresaleAllowanceDataAsync, fetchUserTokensUnclaimedDataAsync } from "state/presale"

export const usePresaleDataOption = (option, account) => {
    const dispatch = useDispatch()
    const { slowRefresh } = useRefresh()

    useEffect(() => {
        dispatch(fetchPresalePublicDataAsync(option))        

        if (account) {
            dispatch(fetchUserPresaleAllowanceDataAsync(account, option))
            dispatch(fetchUserTokensUnclaimedDataAsync(account, option))            
            dispatch(fetchUserLastClaimedDataAsync(account, option))
        }        
    }, [account, dispatch, slowRefresh, option])
}

export const usePresaleUserBalance = (account, dispatch, freshType) => {
    useEffect(() => {
        if (account) {
            dispatch(fetchUserBalanceDataAsync(account))
        }
    }, [account, dispatch, freshType])
}
