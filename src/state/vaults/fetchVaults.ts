import { VaultStatus } from 'config/constants/types'
import vaultsConfig from 'config/constants/vaults'
import vaultAbi from 'config/abi/vault.json'
import vaultStrategy from 'config/abi/vaultStrategy.json'
import multicall from 'utils/multicall'
import { getVaultAddress } from 'utils/addressHelpers'
import BigNumber from 'bignumber.js'
import { BIG_ONE, BIG_TEN_THOUSAND, BIG_ZERO } from 'utils/bigNumber'
import { DEAD_ADDRESS } from 'config'

const fetchVaults = async () => {
    const activeVaults = vaultsConfig.filter(_ => _.status === VaultStatus.ACTIVE && !_.isAutoCgs)

    const data = await Promise.all(
        activeVaults.map(async (vaultConfig) => {
            const calls = [
                {
                    address: vaultConfig.strategyContract,
                    name: 'wantLockedTotal',
                },
                {
                    address: vaultConfig.strategyContract,
                    name: 'farmContractAddress',
                },
                {
                    address: vaultConfig.strategyContract,
                    name: 'pid'
                },
                {
                    address: vaultConfig.strategyContract,
                    name: 'buyBackRate'
                },
                {
                    address: vaultConfig.strategyContract,
                    name: 'controllerFee'
                },
                {
                    address: vaultConfig.strategyContract,
                    name: 'controllerFeeMax'
                },
                {
                    address: vaultConfig.strategyContract,
                    name: 'entranceFeeFactor'
                },
                {
                    address: vaultConfig.strategyContract,
                    name: 'entranceFeeFactorMax'
                },
                {
                    address: vaultConfig.strategyContract,
                    name: 'withdrawFeeFactor'
                },
                {
                    address: vaultConfig.strategyContract,
                    name: 'withdrawFeeFactorMax'
                }
            ]

            const  [
                wantLockedTotal,
                farmContractAddress,
                farmPid,
                buyBackRate,
                controllerFee,
                controllerFeeMax,
                entranceFeeFactor,
                entranceFeeFactorMax,
                withdrawFeeFactor,
                withdrawFeeFactorMax
            ] = await multicall(vaultStrategy, calls)              
         
            const controller = new BigNumber(controllerFee).div(controllerFeeMax)
            const buyBackFee = new BigNumber(buyBackRate).div(BIG_TEN_THOUSAND)
            const performanceFee = controller.plus(buyBackFee)
            const depositFee = BIG_ONE.minus(new BigNumber(entranceFeeFactor).div(entranceFeeFactorMax))
            const withdrawFee = BIG_ONE.minus(new BigNumber(withdrawFeeFactor).div(withdrawFeeFactorMax))

            const [info, totalAllocPoint] = await multicall(vaultAbi, [
                {
                  address: getVaultAddress(),
                  name: 'poolInfo',
                  params: [vaultConfig.pid],
                },
                {
                  address: getVaultAddress(),
                  name: 'totalAllocPoint',
                },               
            ])
        
            const allocPoint = new BigNumber(info.allocPoint._hex)
            const poolWeight = totalAllocPoint ? allocPoint.div(new BigNumber(totalAllocPoint)) : BIG_ZERO  

            return {
                ...vaultConfig,
                farmContractInfo: {
                    ...vaultConfig.farmContractInfo,
                    farmPid: new BigNumber(farmPid[0]._hex).toNumber(),
                    farmContractAddress: farmContractAddress[0],                    
                },
                isManualCgs: farmContractAddress[0].toLowerCase() === DEAD_ADDRESS.toLowerCase(),
                totalStaked: new BigNumber(wantLockedTotal).toJSON(),
                poolWeight: poolWeight.toNumber(),                
                multiplier: `${allocPoint.div(100).toString()}X`,
                performanceFee: performanceFee.toNumber(),
                depositFee: depositFee.toNumber(),
                withdrawFee: withdrawFee.toNumber(),
            }
        })        
    )

    return data
}

export default fetchVaults