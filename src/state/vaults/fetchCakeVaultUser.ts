import BigNumber from 'bignumber.js'
import { getAutoCakeContract, getCakeContract } from 'utils/contractHelpers'
import { autoVaultConfig } from 'config/constants/vaults'

const cakeVaultContract = getAutoCakeContract()
const cakeTokenContract = getCakeContract()

const fetchVaultUser = async (account: string) => {
  try {
    const userContractResponse = await cakeVaultContract.methods.userInfo(account).call()

    const cakeTokenReponse= await cakeTokenContract.methods.allowance(account, autoVaultConfig.strategyContract).call()

    return {
      isLoading: false,
      userShares: new BigNumber(userContractResponse.shares.toString()).toJSON(),
      lastDepositedTime: userContractResponse.lastDepositedTime.toString(),
      lastUserActionTime: userContractResponse.lastUserActionTime.toString(),
      cakeAtLastUserAction: new BigNumber(userContractResponse.cakeAtLastUserAction.toString()).toJSON(),
      allowance: new BigNumber(cakeTokenReponse.toString()).toJSON()
    }
  } catch (error) {
    return {
      isLoading: true,
      userShares: null,
      lastDepositedTime: null,
      lastUserActionTime: null,
      cakeAtLastUserAction: null,
      allowance: null
    }
  }
}

export default fetchVaultUser
