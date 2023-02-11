import { Vault } from "state/types";
import erc20 from 'config/abi/erc20.json'
import multicall from "utils/multicall";
import BigNumber from "bignumber.js";
import { BIG_TEN_THOUSAND, BIG_ZERO } from "utils/bigNumber";
import { getPartnerMasterchefAbi } from "utils/abiHelper";
import { getBalanceAmount, getBalanceNumber } from "utils/formatBalance";

const fetchVaultStrategies = async(vaults: Vault[]) => {
    const data = await Promise.all(
        vaults.map(async (vault) => {
            if (vault.isAutoCgs || vault.isManualCgs) {
                return vault
            }

            const calls = [
                {
                    address: vault.farmContractInfo?.farmContractAddress,
                    name: 'poolInfo',
                    params: [vault.farmContractInfo?.farmPid]
                },     
                {
                    address: vault.farmContractInfo?.farmContractAddress,
                    name: 'totalAllocPoint',
                },
                {
                    address: vault.farmContractInfo?.farmContractAddress,
                    name: vault.farmContractInfo?.tokenPerBlockFunction,
                },   
            ]
    
            const partnerMasterchef = getPartnerMasterchefAbi(vault.farmContractInfo.mainToken.symbol)
    
            const [info, totalAllocPointStr, tokenPerBlockStr] = await multicall(partnerMasterchef, calls)
    
            const totalAllocPoint = new BigNumber(totalAllocPointStr)
            const tokenPerBlock = new BigNumber(tokenPerBlockStr)

            const allocPoint = new BigNumber(info.allocPoint._hex)
            const depositFeeBP = info.depositFeeBP ? new BigNumber(info.depositFeeBP).div(BIG_TEN_THOUSAND) : BIG_ZERO            
            const poolWeight = totalAllocPoint ? allocPoint.div(totalAllocPoint) : BIG_ZERO  
            const poolTokenPerBlock = getBalanceAmount(tokenPerBlock, vault.farmContractInfo.mainToken.decimals).times(poolWeight)
    
            const [totalPoolStaked] = await multicall(erc20, [
                {
                    address: vault.stakingToken.token.address,
                    name: 'balanceOf',
                    params: [vault.farmContractInfo?.farmContractAddress],
                },
            ])

            const farmContractInfo = {
                ...vault.farmContractInfo, 
                tokenPerBlock: tokenPerBlock.toJSON(), 
                allocPoint: allocPoint.toJSON(),    
                depositFeeBP: depositFeeBP.toNumber(),             
                totalAllocPoint: totalAllocPoint.toJSON(), 
                poolTokenPerBlock: poolTokenPerBlock.toNumber(),
                totalPoolStaked: getBalanceNumber(totalPoolStaked, vault.stakingToken.token.decimals)
            }
    
            return {
                ...vault, farmContractInfo
            }
        })
    )
    return data
}

export default fetchVaultStrategies