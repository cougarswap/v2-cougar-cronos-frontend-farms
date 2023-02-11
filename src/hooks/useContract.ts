import { useMemo } from 'react'
import useWeb3 from 'hooks/useWeb3'
import { getCakeAddress } from 'utils/addressHelpers'
import { PresaleOption } from 'state/types'
import { getAutoCakeContract, getERC20Contract, getLotteryContract, getLotteryTicketContract, getMasterchefContract, getOldCgsContract, getPancakeRabbitsContract, getPartnerContract, getPresaleContract, getPresaleMirgateContract, getRabbitMintingFarmContract, getReferralContract, getSouschefContract, getUsdcContract, getVaultContract } from 'utils/contractHelpers'

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useERC20 = (address: string) => {
  const web3 = useWeb3()
  return useMemo(() => getERC20Contract(address, web3), [address, web3])

}

export const useCake = () => {
  return useERC20(getCakeAddress())
}


export const useAutoCake = () => {
  const web3 = useWeb3()
  return useMemo(() => getAutoCakeContract(web3), [web3])
}

export const useVault = () => {  
  const web3 = useWeb3()
  return useMemo(() => getVaultContract(web3), [web3])
}

export const useLottery = () => {
  const web3 = useWeb3()
  return useMemo(() => getLotteryContract(web3), [web3])
}

export const useLotteryTicket = () => {
  const web3 = useWeb3()
  return useMemo(() => getLotteryTicketContract(web3), [web3])
}

export const usePresaleContract = (option: PresaleOption) => {
  const web3 = useWeb3()
  return useMemo(() => getPresaleContract(option, web3), [option, web3])
}

export const usePresaleMigrateContract = (option: PresaleOption) => {
  const web3 = useWeb3()
  return useMemo(() => getPresaleMirgateContract(option, web3), [option, web3])
}

export const useUsdcContract = () => {  
  const web3 = useWeb3()
  return useMemo(() => getUsdcContract(web3), [web3])
}

export const useOldCgsContract = () => {  
  const web3 = useWeb3()
  return useMemo(() => getOldCgsContract(web3), [web3])
}

export const useMasterchef = () => {  
  const web3 = useWeb3()
  return useMemo(() => getMasterchefContract(web3), [web3])
}

export const usePartnerMasterchef = (partnerId: number) => {  
  const web3 = useWeb3()
  return useMemo(() => getPartnerContract(partnerId, web3), [partnerId, web3])
}

export const useReferral = () => {
  const web3 = useWeb3()
  return useMemo(() => getReferralContract(web3), [web3])
}

export const useSousChef = (id) => {
  const web3 = useWeb3() 
  return useMemo(() => getSouschefContract(id, web3), [id, web3])
}

export const useRabbitMintingFarm = (address: string) => {
  const web3 = useWeb3()
  return useMemo(() => getRabbitMintingFarmContract(address, web3), [address, web3])
}

export const usePancakeRabbits = (address: string) => {
  const web3 = useWeb3()
  return useMemo(() => getPancakeRabbitsContract(address, web3), [address, web3])
}

