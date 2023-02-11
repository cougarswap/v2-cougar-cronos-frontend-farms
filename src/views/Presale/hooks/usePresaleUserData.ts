import { useSelector } from "react-redux"
import { State } from "state/types"

export const usePresaleUserData = (option) => {
    return useSelector((state: State) => state.presale.options.find(_ => _.option === option).userData)
}

export const usePresalePublicData = (option) => {
    return useSelector((state: State) => state.presale.options.find(_ => _.option === option).publicData)
}

export const usePresaleUserTokenData = () => {
    return useSelector((state: State) => state.presale.userTokenData)
}

