import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPresalePublicDataAsync } from "state/presale";
import { State } from "state/types";

export const useFetchPresalePublicData = (option) => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchPresalePublicDataAsync(option))
    }, [dispatch, option])
}

export const usePresalePublicData = (option) => {
    return useSelector((state: State) => state.presale.options.find(_ => _.option === option).publicData)
}

export const usePresaleUserData = (option) => {
    return useSelector((state: State) => state.presale.options.find(_ => _.option === option).userData)
}

export const useTotalCakeSold = (option) => {
    return useSelector((state: State) => state.presale.options.find(_ => _.option === option).publicData.totalCakeSold)
}

export const usePresaleStartTime = (option) => {
    return useSelector((state: State) => state.presale.options.find(_ => _.option === option).publicData.startingTimeStamp)
}

export const usePresaleCloseTime = (option) => {
    return useSelector((state: State) => state.presale.options.find(_ => _.option === option).publicData.closingTimeStamp)
}

export const useClaimStartTime = (option) => {
    return useSelector((state: State) => state.presale.options.find(_ => _.option === option).publicData.firstHarvestTimestamp)
}