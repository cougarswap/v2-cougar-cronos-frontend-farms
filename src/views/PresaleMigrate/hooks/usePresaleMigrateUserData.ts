import { useSelector } from "react-redux"
import { State } from "state/types"

export const usePresaleUserData = (option) => {
    return useSelector((state: State) => state.presaleMigrate.options.find(_ => _.option === option).userData)
}

export const usePresalePublicData = (option) => {
    return useSelector((state: State) => state.presaleMigrate.options.find(_ => _.option === option).publicData)
}

export const usePresaleUserTokenData = () => {
    return useSelector((state: State) => state.presaleMigrate.userTokenData)
}

