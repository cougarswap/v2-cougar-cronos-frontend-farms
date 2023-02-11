import useRefresh from "hooks/useRefresh"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { fetchPresaleMigratePublicDataAsync, fetchUserMigrateBalanceDataAsync, fetchUserMigrateLastClaimedDataAsync, fetchUserPresaleMigrateAllowanceDataAsync, fetchUserTokensMigrateUnclaimedDataAsync } from "state/presaleMigrate"

export const usePresaleMigrateDataOption = (option, account) => {
    const dispatch = useDispatch()
    const { slowRefresh } = useRefresh()

    useEffect(() => {
        dispatch(fetchPresaleMigratePublicDataAsync(option))        

        if (account) {
            dispatch(fetchUserPresaleMigrateAllowanceDataAsync(account, option))
            dispatch(fetchUserTokensMigrateUnclaimedDataAsync(account, option))            
            dispatch(fetchUserMigrateLastClaimedDataAsync(account, option))
        }        
    }, [account, dispatch, slowRefresh, option])
}

export const usePresaleUserBalance = (account, dispatch, freshType) => {
    useEffect(() => {
        if (account) {
            dispatch(fetchUserMigrateBalanceDataAsync(account))
        }
    }, [account, dispatch, freshType])
}
