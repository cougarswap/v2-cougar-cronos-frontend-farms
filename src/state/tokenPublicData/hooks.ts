import { useSelector } from "react-redux"
import { State } from "state/types"

export const useTokenPerBlock = () => {
    return useSelector((state: State) => state.tokenPublicData.tokenPerBlock)
}

export const useTokenTotalSupply = () => {
  return useSelector((state: State) => state.tokenPublicData.totalSupply)
}

export const useTransferTaxRate = (): number => {
    const transferTaxRate = useSelector((state: State) => state.tokenPublicData.transferTaxRate)
    return transferTaxRate
  }
  
export const useMaxTransferAmountRate = (): number => {
    const maxTransferAmountRate = useSelector((state: State) => state.tokenPublicData.maxTransferAmountRate)
    return maxTransferAmountRate
  }

export const useTokenPublicData = () => {
  return useSelector((state: State) => state.tokenPublicData)
}
  