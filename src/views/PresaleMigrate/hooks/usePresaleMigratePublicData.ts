import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPresaleMigratePublicDataAsync } from "state/presaleMigrate";
import { State } from "state/types";

export const useFetchPresaleMigratePublicData = (option) => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchPresaleMigratePublicDataAsync(option))
    }, [dispatch, option])
}

export const usePresaleMigratePublicData = (option) => {
    return useSelector((state: State) => state.presaleMigrate.options.find(_ => _.option === option).publicData)
}

export const usePresaleMigrateUserData = (option) => {
    return useSelector((state: State) => state.presaleMigrate.options.find(_ => _.option === option).userData)
}

export const useTotalCakeSold = (option) => {
    return useSelector((state: State) => state.presaleMigrate.options.find(_ => _.option === option).publicData.totalCakeSold)
}

export const usePresaleMigrateStartTime = (option) => {
    return useSelector((state: State) => state.presaleMigrate.options.find(_ => _.option === option).publicData.startingTimeStamp)
}

export const usePresaleMigrateCloseTime = (option) => {
    return useSelector((state: State) => state.presaleMigrate.options.find(_ => _.option === option).publicData.closingTimeStamp)
}

export const useClaimStartTime = (option) => {
    return useSelector((state: State) => state.presaleMigrate.options.find(_ => _.option === option).publicData.firstHarvestTimestamp)
}